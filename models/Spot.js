const mongoose = require("mongoose");

const SpotSchema = new mongoose.Schema(
  {
    spotNumber: { type: String, required: [true, "Please add a spot number"], trim: true, uppercase: true },
    zone: { type: String, required: [true, "Please add a zone"], trim: true },
    spotSize: { type: String, required: [true, "Please add a spot size"], trim: true },
    locationDescription: { type: String, required: [true, "Please add a location description"], trim: true },
    rentalFee: { type: Number, required: [true, "Please add a rental fee"], min: [0, "Rental fee cannot be negative"] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

SpotSchema.index({ spotNumber: 1 }, {
  unique: true,
  name: "unique_spot_number",
  collation: { locale: "en", strength: 2 },
});

module.exports = mongoose.model("Spot", SpotSchema);
