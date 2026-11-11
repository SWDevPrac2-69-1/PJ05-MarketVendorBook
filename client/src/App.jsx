import { Link, NavLink, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useAuth } from "./shared/auth/AuthContext.jsx";
import RequireRole from "./shared/auth/RequireRole.jsx";
import { AuthPage } from "./features/auth/AuthRoutes.jsx";
import { AdminSpots, SpotDetail, SpotList } from "./features/spots/SpotRoutes.jsx";
import BookingRoutes from "./features/bookings/BookingRoutes.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";

export default function App() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try { await signOut(); } catch { /* Local session is cleared even if the API is unavailable. */ }
    navigate("/spots");
  }

  return <div className="app-shell">
    <a className="skip-link" href="#main-content">ข้ามไปเนื้อหาหลัก</a>
    <div className="topline"><span>BANGKOK NIGHT MARKET</span><span>A LITTLE SPACE. A LOT OF POSSIBILITY.</span><ThemeToggle /></div>
    <header className="site-header">
      <Link className="brand" to="/spots" aria-label="Night Market หน้าแรก"><span className="brand-symbol" aria-hidden="true">✳</span><span>night<span className="brand-accent">Market.</span><small>SMALL SHOPS. BIG ENERGY.</small></span></Link>
      <nav aria-label="เมนูหลัก" className="main-nav">
        <NavLink to="/spots" className={({ isActive }) => isActive ? "active" : ""}>สำรวจพื้นที่</NavLink>
        {user && <NavLink to="/bookings" className={({ isActive }) => isActive ? "active" : ""}>{user.role === "admin" ? "การจองทั้งหมด" : "การจองของฉัน"}</NavLink>}
        {user?.role === "admin" && <NavLink to="/admin/spots" className={({ isActive }) => isActive ? "active" : ""}>จัดการพื้นที่</NavLink>}
      </nav>
      <div className="header-actions">{user ? <><span className="user-pill"><span className="online-dot" />{user.name} <small>/{user.role}</small></span><button type="button" className="button button-outline button-small" onClick={handleLogout}>ออกจากระบบ</button></> : <><Link className="header-login" to="/login">เข้าสู่ระบบ</Link><Link className="button button-primary button-small" to="/register">เริ่มจองพื้นที่ <span aria-hidden="true">↗</span></Link></>}</div>
    </header>
    <main id="main-content"><Routes>
      <Route path="/" element={<Navigate to="/spots" replace />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route path="/spots" element={<SpotList />} />
      <Route path="/spots/:id" element={<SpotDetail />} />
      <Route path="/admin/spots/*" element={<RequireRole roles={["admin"]}><AdminSpots /></RequireRole>} />
      <Route path="/bookings/*" element={<RequireRole><BookingRoutes /></RequireRole>} />
      <Route path="*" element={<div className="container not-found"><span className="eyebrow">404 / LOST IN THE CITY</span><h1>หาหน้านี้ไม่เจอ</h1><p>กลับไปเลือกพื้นที่ขายที่เหมาะกับคุณกัน</p><Link className="button button-primary" to="/spots">สำรวจพื้นที่</Link></div>} />
    </Routes></main>
    <footer className="site-footer"><div className="container footer-inner"><div className="footer-brand">night<span>Market</span><small>พื้นที่เล็ก ๆ จุดเริ่มต้นของเรื่องราวใหญ่ ๆ</small></div><div className="footer-note"><span>BANGKOK / YOUR SPACE, AFTER DARK.</span><p>ตลาดกลางคืนสำหรับผู้ขายทุกคน · © {new Date().getFullYear()}</p></div><span className="footer-monogram" aria-hidden="true">nm</span></div></footer>
  </div>;
}
