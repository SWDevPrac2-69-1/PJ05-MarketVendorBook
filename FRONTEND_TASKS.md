# แผนงาน Frontend สำหรับสมาชิก 2 คน

โครง React + Vite อยู่ใน `client/` และ backend API อยู่ใน repository นี้ แผนนี้แบ่งงานตาม **ลำดับการส่งต่อ**: สมาชิก 1 ทำความสามารถหลักให้ใช้งานได้ครบ แล้วสมาชิก 2 รับช่วงเพิ่มคุณภาพและรายละเอียดของ frontend โดยไม่เปลี่ยนขอบเขตของโจทย์

**ข้อตกลงล่าสุดเรื่องบัญชีและร้าน:** public registration สร้างได้เฉพาะ `member` ส่วน `admin` ถือว่าสร้างไว้ล่วงหน้าผ่าน Back Office ชื่อร้าน (`storeName`) ระบุตอนจองแต่ละล็อค ไม่ได้เก็บในบัญชี ข้อนี้ใช้แทนข้อความเดิมใน project brief ที่อนุญาตเลือก role ตอนสมัคร

## ความหมายของ Basic และ Additional

- **Basic requirements:** ความสามารถและเงื่อนไขทั้งหมดใน `2026-PJ05-Init.md` ได้แก่ auth, สิทธิ์ `admin`/`member`, ดูและจัดการ spot, ดูและจัดการ booking, วันที่ไม่ย้อนหลัง, spot ไม่ซ้ำในวันเดียวกัน และสมาชิกไม่เกิน 3 spots ต่อวัน งานนี้ต้องใช้งานได้จริงผ่าน API
- **Additional requirements:** รายละเอียดประสบการณ์ใช้งานและกรณีขอบที่อธิบายใน `2026-PJ05.md` เช่น การแสดงข้อมูล booking ที่ populate, การจัดการ spot ที่ถูกปิดใช้งาน, สถานะ loading/empty/error, ข้อความ conflict, responsive และ accessibility รวมทั้งการตรวจ flow กับฐานข้อมูลจริง ไม่มีการเพิ่ม payment, approval หรือกฎประเภทสินค้าตามโซน เพราะโจทย์ไม่ได้กำหนด
- กฎการจองและการตรวจสิทธิ์เป็นเงื่อนไขหลักของระบบ **ต้องอยู่ใน Basic**; frontend ช่วยตรวจข้อมูลและแสดงข้อผิดพลาด แต่ backend เป็นผู้ตัดสินขั้นสุดท้าย

## ตกลงกันก่อนเริ่ม

1. **หน้าและเส้นทาง:** ใช้ `/login`, `/register`, `/spots`, `/spots/:id`, `/admin/spots/*`, `/bookings`, `/bookings/new`, `/bookings/:id` ถ้าต้องเพิ่มหรือเปลี่ยน route ให้แจ้งกันก่อน
2. **API และ auth:** ใช้ `api(path, options)` จาก `client/src/shared/api/client.js` ซึ่งคืน `data` และโยน `ApiError` ที่มี `status`; ใช้ `useAuth()` สำหรับ `user`, `loading`, `signIn`, `signOut` Protected API ต้องส่ง Bearer token
3. **รูปแบบข้อมูล:** ใช้ `_id` ของ spot/booking; request การจองใช้ `{ spot, bookingDate, storeName, productType }` โดย `bookingDate` เป็น `YYYY-MM-DD` ใน UTC และ response เป็น ISO timestamp ให้แสดงส่วนวันที่ของ UTC โดยไม่เลื่อนวันตาม timezone เครื่อง
4. **จุดส่งต่องาน:** สมาชิก 1 ส่ง branch/PR ที่ basic flow ผ่าน พร้อมสรุป route, component และรายการที่ยังต้องปรับด้าน UI/กรณีขอบ; สมาชิก 2 เริ่มแก้ feature files หลังรวม PR นั้น หรือทำ mockup/CSS ในไฟล์ใหม่ระหว่างรอ
5. **รูปแบบ UI:** ตกลงภาษา, wireframe คร่าว ๆ, สีและการใช้ component ร่วมกันก่อนเริ่มตกแต่ง เพื่อไม่ต้องแก้ markup ซ้ำมาก

## สมาชิก 1 — Basic requirements ทั้งระบบ

**เจ้าของงานจนถึงจุดส่งต่อ:** `client/src/App.jsx`, `client/src/features/**`, `client/src/shared/**`, `client/src/main.jsx`, `client/src/styles.css` และการตั้งค่าใน `client/`

- [ ] Register เฉพาะ `member` ด้วย `name`, `email`, `tel`, `password`; `admin` ถูกสร้างไว้ล่วงหน้าผ่าน Back Office; login ด้วย email/password; เก็บ token จาก `data.token`, ตรวจ session ด้วย `/auth/me`, logout และเมนูตาม role
- [ ] หน้า public สำหรับรายการและรายละเอียด spot; หน้า admin สำหรับเพิ่ม แก้ไข และปิดใช้งาน spot ด้วยฟิลด์ที่ API กำหนด
- [ ] หน้า member สำหรับสร้าง booking และดู/แก้ไข/ลบของตน; หน้า admin สำหรับดู/แก้ไข/ลบ booking ของทุกคน โดย admin สร้าง booking ไม่ได้
- [ ] ฟอร์ม booking ส่ง spot `_id`, วันที่ `YYYY-MM-DD`, `storeName` และ `productType`; รองรับการเปลี่ยน spot/วัน/ชื่อร้าน และส่งเฉพาะฟิลด์ที่แก้ไขเมื่อเหมาะสม
- [ ] ป้องกัน action ตาม role, ตรวจ input ขั้นพื้นฐาน และแสดงข้อความเมื่อ API ปฏิเสธข้อมูลหรือการจอง (`400`, `401`, `403`, `404`, `409`) รวมถึงกรณี spot ถูกจองแล้วและเพดาน 3 spots ต่อวัน
- [ ] ทำให้ flow หลักใช้งานได้กับ test MongoDB: admin สร้าง spot → member จอง → member แก้/ลบ → admin ดู/แก้/ลบ

**เกณฑ์ส่งต่อ:** ไม่มีหน้า placeholder ใน flow หลัก, `npm run build` ผ่าน, อธิบายจุดที่ยังต้องเติม UI/กรณีขอบใน PR ได้ และ basic flow ข้างต้นทดสอบได้จริง

## สมาชิก 2 — Additional requirements และคุณภาพการใช้งาน

**เจ้าของงานหลังรับช่วง:** ปรับหน้าใน `client/src/features/**`, เพิ่ม reusable components ใน `client/src/components/**` และปรับ `client/src/styles.css` หลัง PR ของสมาชิก 1 รวมแล้ว ถ้าจะแก้ `shared/api`, `shared/auth` หรือ route ต้องตกลงกันก่อน

- [ ] ปรับ layout และ form ให้ใช้รูปแบบเดียวกันทุกหน้า รองรับมือถือ/จอใหญ่ และใช้ label, focus, keyboard interaction ที่เหมาะสม
- [ ] เพิ่มสถานะ loading, empty, success/error และ confirmation ก่อนลบ; แสดงข้อความ `409` ที่เข้าใจได้ รวมถึง `429` เมื่อถูกจำกัด request
- [ ] แสดงรายละเอียด booking จาก `spot`/`user` ที่ populate; แสดงวันที่ UTC ให้ถูกต้อง และทำให้การเลือก/ย้าย spot หรือวันชัดเจน
- [ ] จัดการกรณีขอบตาม API: spot ที่ปิดใช้งานไม่ปรากฏในรายการ public แต่ booking เดิมยังดู/ลบได้; การแก้ booking เก่าต้องเลือกวันนี้หรืออนาคตและ spot ที่เปิดใช้งาน
- [ ] ตรวจ flow ทั้งสอง role กับ MongoDB จริง รวมถึงวันที่ย้อนหลัง, วันไม่จริง, spot/date ซ้ำ, เพดาน 3 spots ต่อสมาชิกต่อวัน, การย้าย booking, การลบแล้วจองใหม่ และ refresh/login/logout
- [ ] เก็บ bug ที่พบ; หากเป็น logic/API contract ให้แจ้งสมาชิก 1 และตกลงเจ้าของการแก้ก่อนลงมือ

**เกณฑ์เสร็จ:** ทุกหน้ามีสถานะใช้งานที่ครบ, แสดงข้อมูลและวันที่ถูกต้อง, ใช้บนมือถือได้ และกรณีหลัก/กรณีขอบที่ระบุทดสอบผ่าน

## การทำงานโดยไม่ชนกัน

1. สมาชิก 1 ทำ basic ใน branch ของตน ส่วนสมาชิก 2 ออกแบบ wireframe และสร้าง style/component ใหม่ใน branch แยกได้ แต่ยังไม่แก้ feature files ที่สมาชิก 1 กำลังทำ
2. รวม PR ของสมาชิก 1 ก่อน แล้วสมาชิก 2 update branch จาก `main` จึงเริ่มปรับ feature files; ใช้ PR แยกสำหรับ additional
3. ถ้าต้องแก้ไฟล์เดียวกันในเวลาเดียวกัน ให้ระบุคนรับผิดชอบไฟล์นั้นหนึ่งคนและส่งรายละเอียดที่ต้องแก้ให้กันก่อน

## สภาพแวดล้อมสำหรับทดสอบ

- Backend ใช้ `http://localhost:5001`, frontend ใช้ `http://localhost:3000`; Vite proxy `/api` ไป backend
- คัดลอก `config/config.example.env` เป็น `config/config.env` แล้วตั้ง `MONGO_URI` สำหรับ test database; ไฟล์จริงถูก ignore โดย Git
- เตรียมบัญชี `admin` ที่สร้างไว้ล่วงหน้าและสมัครบัญชี `member` ผ่านหน้าเว็บ, spot อย่างน้อย 4 จุด, วันที่วันนี้และอนาคตหลายวัน
- ตรวจ frontend ด้วย `npm run build` ใน `client/`; `npm test` ที่ root ตรวจ syntax backend เท่านั้น
