import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { api } from "../../shared/api/client.js";
import { useAuth } from "../../shared/auth/AuthContext.jsx";
import { ErrorNotice } from "../../shared/ui.jsx";

export function AuthPage({ mode }) {
  const register = mode === "register";
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: "", email: "", tel: "", password: "" });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/spots" replace />;

  function update(event) { setForm((current) => ({ ...current, [event.target.name]: event.target.value })); }

  async function submit(event) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const body = register ? { name: form.name.trim(), email: form.email.trim(), tel: form.tel.trim(), password: form.password } : { email: form.email.trim(), password: form.password };
      const data = await api(`/api/v1/auth/${register ? "register" : "login"}`, { method: "POST", body });
      signIn(data);
      navigate(location.state?.from?.pathname || "/spots", { replace: true });
    } catch (caught) { setError(caught); }
    finally { setSubmitting(false); }
  }

  return <div className="container auth-layout"><div className="auth-story"><span className="eyebrow">THE CITY IS YOURS TONIGHT</span><h1>เปิดร้านในค่ำคืน<br /><em>ที่ไม่เหมือนใคร</em></h1><p>แสงไฟ ผู้คน และโอกาสใหม่ ๆ รออยู่ในทุกมุมตลาด จองพื้นที่ของคุณแล้วมาเป็นส่วนหนึ่งของกรุงเทพฯ ยามค่ำคืน</p><div className="story-line"><span>01</span> เลือกพื้นที่ <span>→</span> <span>02</span> เลือกวัน <span>→</span> <span>03</span> เปิดร้าน</div><div className="auth-orb" aria-hidden="true"><span>BKK</span><strong>AFTER<br />DARK</strong></div></div>
    <div className="auth-card"><span className="eyebrow">{register ? "JOIN THE MARKET" : "WELCOME BACK"}</span><h2>{register ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}</h2><p>{register ? "สร้างบัญชีเพื่อเริ่มจองพื้นที่ขายของคุณ" : "กลับมาจัดการพื้นที่และการจองของคุณ"}</p><ErrorNotice error={error} /><form onSubmit={submit} className="form-stack">
      {register && <><label>ชื่อผู้ใช้งาน<input name="name" value={form.name} onChange={update} required autoComplete="name" placeholder="ชื่อของคุณ" /></label><label>เบอร์โทรศัพท์<input name="tel" type="tel" value={form.tel} onChange={update} required autoComplete="tel" placeholder="08x-xxx-xxxx" /></label></>}
      <label>อีเมล<input name="email" type="email" value={form.email} onChange={update} required autoComplete="email" placeholder="you@example.com" /></label>
      <label>รหัสผ่าน<input name="password" type="password" minLength={register ? 6 : undefined} value={form.password} onChange={update} required autoComplete={register ? "new-password" : "current-password"} placeholder={register ? "อย่างน้อย 6 ตัวอักษร" : "••••••••"} /></label>
      <button className="button button-primary button-wide" type="submit" disabled={submitting}>{submitting ? "กำลังดำเนินการ..." : register ? "สร้างบัญชี" : "เข้าสู่ระบบ"}<span aria-hidden="true">↗</span></button>
    </form><div className="auth-switch">{register ? "มีบัญชีอยู่แล้ว?" : "ยังไม่มีบัญชี?"} <Link to={register ? "/login" : "/register"}>{register ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}</Link></div></div>
  </div>;
}
