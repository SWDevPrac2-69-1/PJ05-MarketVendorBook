export function formatBaht(value) {
  return new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB", minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value ?? 0);
}

export function formatSpotSize(value) {
  const size = String(value ?? "").trim();
  const dimensions = size.match(/^(\d+(?:\.\d+)?)\s*[x×*]\s*(\d+(?:\.\d+)?)\s*(?:m|เมตร)?$/i);
  return dimensions ? `${Number(dimensions[1])} × ${Number(dimensions[2])} เมตร` : size;
}

export function utcDate(value) {
  return typeof value === "string" ? value.slice(0, 10) : "";
}

export function todayUTC() {
  return new Date().toISOString().slice(0, 10);
}

export function formatThaiDate(value) {
  const date = utcDate(value);
  if (!date) return "—";
  return new Intl.DateTimeFormat("th-TH", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

export function errorMessage(error) {
  const message = error?.message || "เกิดข้อผิดพลาด กรุณาลองอีกครั้ง";
  if (error?.status === 429) return "มีคำขอมากเกินไป กรุณารอสักครู่แล้วลองใหม่";
  if (error?.status === 401) return "เซสชันหมดอายุหรือยังไม่ได้เข้าสู่ระบบ กรุณาเข้าสู่ระบบอีกครั้ง";
  if (/duplicate key/i.test(message)) return "ข้อมูลนี้มีอยู่ในระบบแล้ว";
  if (error?.status >= 500) return "ระบบยังไม่พร้อมใช้งาน กรุณาตรวจว่า backend และฐานข้อมูลเชื่อมต่ออยู่ แล้วลองอีกครั้ง";
  if (/already booked|already has a booking/i.test(message)) return "พื้นที่นี้ถูกจองในวันที่เลือกแล้ว กรุณาเลือกพื้นที่หรือวันอื่น";
  if (/at most 3 spots/i.test(message)) return "คุณจองครบ 3 พื้นที่ในวันนี้แล้ว กรุณาเลือกวันอื่น";
  if (/cannot be in the past/i.test(message)) return "กรุณาเลือกวันนี้หรือวันในอนาคต";
  if (/invalid booking date|valid bookingDate/i.test(message)) return "วันที่จองไม่ถูกต้อง กรุณาเลือกวันที่จริงในรูปแบบ YYYY-MM-DD";
  if (/not found or inactive/i.test(message)) return "ไม่พบพื้นที่นี้ หรือพื้นที่ถูกปิดใช้งานแล้ว";
  if (/invalid credentials/i.test(message)) return "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
  if (/failed to fetch|networkerror/i.test(message)) return "เชื่อมต่อ backend ไม่ได้ กรุณาตรวจว่าเซิร์ฟเวอร์กำลังทำงาน";
  return message;
}
