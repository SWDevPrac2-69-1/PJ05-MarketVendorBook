import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ErrorNotice } from "../shared/ui.jsx";
import SelectOrCreate from "./SelectOrCreate.jsx";

export default function DeleteZoneDialog({ zone, zones, onConfirm, onClose }) {
  const dialog = useRef(null);
  const id = useId();
  const [replacement, setReplacement] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const element = dialog.current;
    element.showModal();
    return () => element.close();
  }, []);

  async function submit(event) {
    event.preventDefault();
    event.stopPropagation();
    const target = replacement.trim();
    if (!target || target === zone) {
      setError(new Error("กรุณาระบุหมวดหมู่อื่นสำหรับย้ายพื้นที่"));
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await onConfirm(zone, target);
    } catch (caught) {
      setError(caught);
    } finally {
      setBusy(false);
    }
  }

  return createPortal(
    <dialog className="zone-delete-dialog" ref={dialog} aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`} onCancel={(event) => { event.preventDefault(); if (!busy) onClose(); }}>
      <form className="form-stack" onSubmit={submit}>
        <h2 id={`${id}-title`}>ลบหมวดหมู่ “{zone}”</h2>
        <p id={`${id}-description`}>เลือกหมวดหมู่ใหม่ให้พื้นที่ทั้งหมดใน “{zone}” ก่อนลบ พื้นที่และการจองเดิมจะยังอยู่ครบ</p>
        <SelectOrCreate label="ย้ายพื้นที่ไปหมวดหมู่" name="replacementZone" value={replacement} options={zones.filter((item) => item !== zone)} onChange={setReplacement} createLabel="ระบุหมวดหมู่ใหม่" customLabel="ชื่อหมวดหมู่ใหม่" placeholder="เช่น เสื้อผ้า" disabled={busy} />
        <ErrorNotice error={error} />
        <div className="form-actions">
          <button type="submit" className="button button-danger" disabled={busy}>{busy ? "กำลังลบ..." : "ยืนยันลบหมวดหมู่"}</button>
          <button type="button" className="button button-outline" onClick={onClose} disabled={busy}>ยกเลิก</button>
        </div>
      </form>
    </dialog>,
    document.body,
  );
}
