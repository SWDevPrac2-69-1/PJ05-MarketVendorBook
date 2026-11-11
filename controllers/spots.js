const Spot = require("../models/Spot");

const spotNumberConflict = (res) => res.status(409).json({
  success: false,
  error: "รหัสล็อกนี้มีอยู่แล้ว กรุณาใช้รหัสอื่น",
});

const spotNumberExists = (spotNumber, excludeId) => Spot.exists({
  spotNumber,
  ...(excludeId ? { _id: { $ne: excludeId } } : {}),
}).collation({ locale: "en", strength: 2 });

const parseSpotInput = ({ spotNumber, zone, spotSize, locationDescription, rentalFee }) => {
  const fields = { spotNumber, zone, spotSize, locationDescription };
  for (const [key, value] of Object.entries(fields)) {
    if (typeof value !== "string" || !value.trim()) {
      return { error: `${key} must be a nonempty string` };
    }
    fields[key] = value.trim();
  }
  fields.spotNumber = fields.spotNumber.toUpperCase();
  if (typeof rentalFee !== "number" || !Number.isFinite(rentalFee) || rentalFee < 0) {
    return { error: "Rental fee must be a nonnegative number" };
  }
  return { ...fields, rentalFee };
};

exports.getSpots = async (req, res, next) => {
  try {
    const spots = await Spot.find({ isActive: true }).sort({ zone: 1, spotNumber: 1 });
    res.status(200).json({ success: true, count: spots.length, data: spots });
  } catch (error) {
    next(error);
  }
};

exports.getSpot = async (req, res, next) => {
  try {
    const spot = await Spot.findOne({ _id: req.params.id, isActive: true });
    if (!spot) return res.status(404).json({ success: false, error: "Vendor spot not found" });
    res.status(200).json({ success: true, data: spot });
  } catch (error) {
    next(error);
  }
};

exports.createSpot = async (req, res, next) => {
  try {
    const parsed = parseSpotInput(req.body);
    if (parsed.error) return res.status(400).json({ success: false, error: parsed.error });
    if (await spotNumberExists(parsed.spotNumber)) return spotNumberConflict(res);
    const spot = await Spot.create(parsed);
    res.status(201).json({ success: true, data: spot });
  } catch (error) {
    if (error.code === 11000) return spotNumberConflict(res);
    next(error);
  }
};

exports.updateSpot = async (req, res, next) => {
  try {
    const spot = await Spot.findOne({ _id: req.params.id, isActive: true });
    if (!spot) return res.status(404).json({ success: false, error: "Vendor spot not found" });
    const fields = {};
    for (const field of ["spotNumber", "zone", "spotSize", "locationDescription", "rentalFee"]) {
      fields[field] = req.body[field] === undefined ? spot[field] : req.body[field];
    }
    const parsed = parseSpotInput(fields);
    if (parsed.error) return res.status(400).json({ success: false, error: parsed.error });
    if (await spotNumberExists(parsed.spotNumber, spot._id)) return spotNumberConflict(res);
    const updated = await Spot.findOneAndUpdate(
      { _id: spot.id, isActive: true }, parsed, { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ success: false, error: "Vendor spot not found" });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    if (error.code === 11000) return spotNumberConflict(res);
    next(error);
  }
};

exports.deleteSpot = async (req, res, next) => {
  try {
    const spot = await Spot.findOneAndUpdate(
      { _id: req.params.id, isActive: true }, { isActive: false }, { new: true }
    );
    if (!spot) return res.status(404).json({ success: false, error: "Vendor spot not found" });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

exports.deleteZone = async (req, res, next) => {
  try {
    const zone = req.params.zone.trim();
    const replacementZone = typeof req.body?.replacementZone === "string" ? req.body.replacementZone.trim() : "";
    if (!zone || !replacementZone || replacementZone === zone) {
      return res.status(400).json({ success: false, error: "กรุณาเลือกหมวดหมู่อื่นสำหรับย้ายพื้นที่ก่อนลบ" });
    }
    if (!await Spot.exists({ zone })) {
      return res.status(404).json({ success: false, error: "ไม่พบหมวดหมู่นี้ กรุณาโหลดรายการใหม่" });
    }
    // Categories come from spot.zone; moving every spot removes the category
    // while preserving spot IDs and all existing booking references.
    const result = await Spot.updateMany({ zone }, { $set: { zone: replacementZone } }, { runValidators: true });
    res.status(200).json({ success: true, data: { deletedZone: zone, replacementZone, updatedSpots: result.modifiedCount } });
  } catch (error) {
    next(error);
  }
};
