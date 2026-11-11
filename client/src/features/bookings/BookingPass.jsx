import { useId, useRef, useState } from "react";
import { formatBaht, formatSpotSize, formatThaiDate, todayUTC, utcDate } from "../../shared/format.js";

export default function BookingPass({ booking }) {
  const id = useId();
  const pass = useRef(null);
  const [printing, setPrinting] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  const spot = booking.spot;
  const status = !spot ? "ไม่พบข้อมูลพื้นที่" : spot.isActive === false ? "พื้นที่ปิดใช้งาน" : utcDate(booking.bookingDate) < todayUTC() ? "การจองที่ผ่านมา" : "ยืนยันการจอง";

  async function download() {
    setDownloading(true);
    setError("");
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas"), import("jspdf")]);
      await document.fonts.ready;
      const element = pass.current;
      if (!element) return;
      const canvas = await html2canvas(element, {
        scale: 3,
        backgroundColor: "#ffffff",
        windowWidth: 1280,
        logging: false,
        onclone: async (document) => {
          document.getElementById(element.id).setAttribute("data-export", "pdf");
          await document.fonts.ready;
        },
      });
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
      const margin = 16;
      const width = Math.min(145, (pdf.internal.pageSize.getHeight() - margin * 2) * canvas.width / canvas.height);
      const height = canvas.height * width / canvas.width;
      pdf.setProperties({ title: `Night Market Booking ${booking._id}`, creator: "Night Market" });
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), "F");
      pdf.addImage(canvas, "PNG", (pdf.internal.pageSize.getWidth() - width) / 2, margin, width, height);
      await pdf.save(`night-market-${utcDate(booking.bookingDate)}-${booking._id}.pdf`, { returnPromise: true });
    } catch {
      setError("ดาวน์โหลด PDF ไม่สำเร็จ กรุณาลองอีกครั้ง หรือใช้ปุ่มพิมพ์");
    } finally {
      setDownloading(false);
    }
  }

  async function print() {
    setPrinting(true);
    setError("");
    try {
      await document.fonts.ready;
      window.print();
    } catch {
      setError("เปิดหน้าต่างพิมพ์ไม่สำเร็จ กรุณาลองอีกครั้ง");
    } finally {
      setPrinting(false);
    }
  }

  return <aside className="booking-pass-area" aria-label="บัตรสรุปการจอง">
    <article className="booking-pass" ref={pass} id={`${id}-pass`} aria-labelledby={`${id}-title`}>
      <header className="booking-pass-header"><span>NIGHT MARKET</span><span aria-hidden="true">✳</span></header>
      <div className="booking-pass-feature"><h2 id={`${id}-title`}>บัตรสรุปการจอง</h2><small>ล็อก</small><strong>{spot?.spotNumber || "—"}</strong><p>{spot?.zone || "ไม่พบข้อมูลพื้นที่"}</p><span className="booking-pass-status">{status}</span></div>
      <div className="booking-pass-body">
        <dl>
          <div><dt>วันขาย</dt><dd>{formatThaiDate(booking.bookingDate)}</dd></div>
          <div><dt>ชื่อร้าน</dt><dd>{booking.storeName || "—"}</dd></div>
          <div><dt>ผู้จอง</dt><dd>{booking.user?.name || "—"}</dd></div>
          <div><dt>ประเภทสินค้า</dt><dd>{booking.productType || "—"}</dd></div>
          <div><dt>ขนาดพื้นที่</dt><dd>{formatSpotSize(spot?.spotSize) || "—"}</dd></div>
          <div><dt>ตำแหน่ง</dt><dd>{spot?.locationDescription || "—"}</dd></div>
          <div className="booking-pass-fee"><dt>ค่าเช่าปัจจุบัน / วัน</dt><dd>{spot ? formatBaht(spot.rentalFee) : "—"}</dd></div>
        </dl>
        <div className="booking-pass-reference"><div className="booking-pass-barcode" aria-hidden="true" /><span>เลขอ้างอิงการจอง</span><strong>{booking._id}</strong></div>
      </div>
    </article>
    <div className="booking-pass-print"><button type="button" className="button button-primary" onClick={download} disabled={printing || downloading}>{downloading ? "กำลังสร้าง PDF..." : "ดาวน์โหลด PDF"}</button><button type="button" className="button button-outline" onClick={print} disabled={printing || downloading}>{printing ? "กำลังเปิดหน้าต่างพิมพ์..." : "พิมพ์"}</button><p>ดาวน์โหลดเป็นไฟล์สีได้ทันที หรือเลือกพิมพ์ลงกระดาษ</p>{error && <p className="notice notice-error" role="alert">{error}</p>}</div>
  </aside>;
}
