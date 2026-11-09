import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../shared/api/client.js";
import { useAuth } from "../../shared/auth/AuthContext.jsx";
import { formatBaht } from "../../shared/format.js";
import { EmptyState, ErrorNotice, Loading, PageHeading, SuccessNotice } from "../../shared/ui.jsx";

function SpotCard({ spot, index }) {
  return <article className="spot-card"><div className={`spot-art art-${index % 4}`} aria-hidden="true"><span className="art-glow" /><span className="art-zone">{spot.zone}</span><strong>{spot.spotNumber}</strong><span className="art-line" /></div><div className="spot-card-body"><div className="spot-card-top"><span className="zone-tag"><span className="online-dot" />{spot.zone}</span><span className="card-index">#{String(index + 1).padStart(2, "0")}</span></div><h3>พื้นที่ {spot.spotNumber}</h3><p>{spot.locationDescription}</p><div className="spot-meta"><span>◫ &nbsp;{spot.spotSize}</span><span>โซน {spot.zone}</span></div><div className="spot-card-footer"><div><small>ค่าเช่าต่อวัน</small><strong>{formatBaht(spot.rentalFee)}</strong></div><Link className="round-link" to={`/spots/${spot._id}`} aria-label={`ดูรายละเอียดพื้นที่ ${spot.spotNumber}`}>↗</Link></div></div></article>;
}

export function SpotList() {
  const { user } = useAuth();
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [zone, setZone] = useState("all");
  const load = useCallback(async () => { setLoading(true); setError(null); try { setSpots(await api("/api/v1/spots")); } catch (caught) { setError(caught); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);
  const zones = useMemo(() => [...new Set(spots.map((spot) => spot.zone))], [spots]);
  const visible = spots.filter((spot) => (zone === "all" || spot.zone === zone) && `${spot.spotNumber} ${spot.zone} ${spot.locationDescription}`.toLowerCase().includes(query.toLowerCase()));

  return <><div className="hero"><div className="hero-grid container"><div className="hero-copy"><span className="eyebrow"><span className="neon-star">✦</span> BANGKOK NIGHT MARKET / VENDOR SPOTS</span><h1>คืนนี้เมืองไม่หลับ<br /><em>ร้านคุณก็เช่นกัน</em></h1><p>ค้นหามุมที่ใช่ในตลาดกลางคืน เลือกพื้นที่ในโซนที่ชอบ แล้วเริ่มต้นเรื่องราวร้านของคุณใต้แสงสีกรุงเทพฯ</p><div className="hero-actions"><a className="button button-primary" href="#explore">สำรวจพื้นที่ <span aria-hidden="true">↗</span></a>{!user && <Link className="button button-glass" to="/register">สมัครเป็นผู้ค้า</Link>}</div><div className="hero-stats"><div><strong>{loading ? "—" : String(spots.length).padStart(2, "0")}</strong><span>พื้นที่พร้อมเปิดร้าน</span></div><div><strong>{loading ? "—" : String(zones.length).padStart(2, "0")}</strong><span>โซนทั่วตลาด</span></div><div><strong>03</strong><span>พื้นที่สูงสุดต่อวัน</span></div></div></div><div className="hero-visual" aria-hidden="true"><div className="hero-halo" /><div className="hero-city"><span className="city-sign">BANGKOK<br /><b>NIGHT MARKET</b></span><div className="city-buildings" /></div><div className="floating-ticket"><span>OPEN TONIGHT</span><strong>YOUR NEXT<br />BIG THING</strong><small>เลือกพื้นที่ • เลือกวัน • เปิดร้าน</small></div><div className="hero-coordinates">13°45′N<br />100°30′E</div></div></div><div className="hero-bottom container"><span>✳ &nbsp; THE CITY IS YOUR MARKETPLACE</span><span>SCROLL TO EXPLORE &nbsp; ↓</span></div></div>
    <section id="explore" className="container content-section"><PageHeading eyebrow="FIND YOUR CORNER / 01" title="เลือกมุมที่เป็นคุณ" description="แต่ละพื้นที่มีเสน่ห์ต่างกัน มาหาพื้นที่ที่เข้ากับร้านของคุณ" action={user?.role === "admin" && <Link className="button button-outline" to="/admin/spots">จัดการพื้นที่ ↗</Link>} /><div className="filter-bar"><div className="search-field"><span aria-hidden="true">⌕</span><input aria-label="ค้นหาพื้นที่" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ค้นหาหมายเลขพื้นที่ โซน หรือตำแหน่ง..." /></div><select aria-label="เลือกโซน" value={zone} onChange={(event) => setZone(event.target.value)}><option value="all">ทุกโซน</option>{zones.map((item) => <option key={item} value={item}>{item}</option>)}</select><span className="result-count">{visible.length} พื้นที่</span></div>
      {loading ? <Loading /> : error ? <ErrorNotice error={error} onRetry={load} /> : visible.length ? <div className="spot-grid">{visible.map((spot, index) => <SpotCard key={spot._id} spot={spot} index={index} />)}</div> : <EmptyState title={spots.length ? "ไม่พบพื้นที่ที่ค้นหา" : "ยังไม่มีพื้นที่เปิดให้จอง"} description={spots.length ? "ลองเปลี่ยนคำค้นหรือเลือกโซนอื่น" : "แวะกลับมาใหม่เร็ว ๆ นี้ หรือให้ผู้ดูแลเพิ่มพื้นที่ก่อน"} />}
    </section><div className="container info-strip"><span>✦</span><div><strong>จองง่ายในไม่กี่ขั้นตอน</strong><p>เลือกพื้นที่ → เลือกวัน → แจ้งประเภทสินค้า → พร้อมขาย!</p></div><span className="info-strip-end">BKK / AFTER DARK</span></div></>;
}

export function SpotDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [spot, setSpot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const load = useCallback(async () => { setLoading(true); setError(null); try { setSpot(await api(`/api/v1/spots/${id}`)); } catch (caught) { setError(caught); } finally { setLoading(false); } }, [id]);
  useEffect(() => { load(); }, [load]);
  return <div className="container content-section"><Link className="back-link" to="/spots">← กลับไปดูพื้นที่ทั้งหมด</Link>{loading ? <Loading /> : error ? <ErrorNotice error={error} onRetry={load} /> : spot && <div className="detail-layout"><div className="detail-art"><span className="eyebrow">VENDOR SPOT / {spot.zone}</span><strong>{spot.spotNumber}</strong><div className="detail-art-orb" /><span className="detail-art-caption">A SPACE FOR YOUR STORY • BANGKOK NIGHT MARKET</span></div><div className="detail-info"><span className="zone-tag"><span className="online-dot" />พื้นที่เปิดใช้งาน</span><h1>พื้นที่ {spot.spotNumber}</h1><p className="lead">{spot.locationDescription}</p><div className="detail-facts"><div><span>โซน</span><strong>{spot.zone}</strong></div><div><span>ขนาดพื้นที่</span><strong>{spot.spotSize}</strong></div><div><span>ค่าเช่าต่อวัน</span><strong className="price-accent">{formatBaht(spot.rentalFee)}</strong></div></div><div className="detail-note">✦ &nbsp; ระบบตรวจสอบพื้นที่ว่างตามวันที่ที่เลือกเมื่อส่งคำขอจอง</div>{user?.role === "member" ? <Link className="button button-primary button-wide" to={`/bookings/new?spot=${spot._id}`}>จองพื้นที่นี้ <span aria-hidden="true">↗</span></Link> : !user ? <Link className="button button-primary button-wide" to="/login" state={{ from: { pathname: `/bookings/new?spot=${spot._id}` } }}>เข้าสู่ระบบเพื่อจอง <span aria-hidden="true">↗</span></Link> : <Link className="button button-outline button-wide" to="/admin/spots">จัดการพื้นที่</Link>}</div></div>}</div>;
}

const blankSpot = { spotNumber: "", zone: "", spotSize: "", locationDescription: "", rentalFee: "" };
function SpotForm({ initial, onSave, onCancel, busy }) {
  const [form, setForm] = useState(initial ? { ...initial, rentalFee: String(initial.rentalFee) } : blankSpot);
  function update(event) { setForm((current) => ({ ...current, [event.target.name]: event.target.value })); }
  function submit(event) { event.preventDefault(); onSave({ spotNumber: form.spotNumber.trim(), zone: form.zone.trim(), spotSize: form.spotSize.trim(), locationDescription: form.locationDescription.trim(), rentalFee: Number(form.rentalFee) }); }
  return <form onSubmit={submit} className="form-stack"><div className="form-row"><label>หมายเลขพื้นที่<input name="spotNumber" value={form.spotNumber} onChange={update} required placeholder="เช่น A01" /></label><label>โซน<input name="zone" value={form.zone} onChange={update} required placeholder="เช่น โซนอาหาร" /></label></div><label>ขนาดพื้นที่<input name="spotSize" value={form.spotSize} onChange={update} required placeholder="เช่น 2 x 2 m" /></label><label>คำอธิบายตำแหน่ง<textarea name="locationDescription" value={form.locationDescription} onChange={update} required rows="3" placeholder="เช่น ใกล้ทางเข้าหลัก" /></label><label>ค่าเช่าต่อวัน (บาท)<input name="rentalFee" type="number" min="0" step="0.01" value={form.rentalFee} onChange={update} required placeholder="300" /></label><div className="form-actions"><button type="submit" className="button button-primary" disabled={busy}>{busy ? "กำลังบันทึก..." : initial ? "บันทึกการแก้ไข" : "เพิ่มพื้นที่"}</button>{initial && <button type="button" className="button button-outline" onClick={onCancel}>ยกเลิก</button>}</div></form>;
}

export function AdminSpots() {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [success, setSuccess] = useState("");
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const [formVersion, setFormVersion] = useState(0);
  const load = useCallback(async () => { setLoading(true); setError(null); try { setSpots(await api("/api/v1/spots")); } catch (caught) { setError(caught); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);
  async function save(body) { setBusy(true); setFormError(null); setSuccess(""); try { if (editing) await api(`/api/v1/spots/${editing._id}`, { method: "PUT", body }); else await api("/api/v1/spots", { method: "POST", body }); setSuccess(editing ? "แก้ไขพื้นที่เรียบร้อยแล้ว" : "เพิ่มพื้นที่ใหม่เรียบร้อยแล้ว"); setEditing(null); setFormVersion((value) => value + 1); await load(); } catch (caught) { setFormError(caught); } finally { setBusy(false); } }
  async function remove(spot) { if (!window.confirm(`ปิดใช้งานพื้นที่ ${spot.spotNumber}? การจองเดิมจะยังอยู่ในระบบ`)) return; setError(null); setSuccess(""); try { await api(`/api/v1/spots/${spot._id}`, { method: "DELETE" }); setSuccess(`ปิดใช้งานพื้นที่ ${spot.spotNumber} แล้ว`); if (editing?._id === spot._id) setEditing(null); await load(); } catch (caught) { setError(caught); } }
  return <div className="container content-section"><PageHeading eyebrow="ADMIN / VENDOR SPOTS" title="จัดการพื้นที่ขาย" description="เพิ่ม แก้ไข และปิดใช้งานพื้นที่ในตลาดกลางคืน" action={<span className="admin-badge">✦ ADMIN CONTROL</span>} /><div className="admin-layout"><div className="panel admin-list"><div className="panel-heading"><h2>พื้นที่ที่เปิดใช้งาน</h2><span className="count-pill">{spots.length} พื้นที่</span></div><SuccessNotice>{success}</SuccessNotice>{loading ? <Loading /> : error ? <ErrorNotice error={error} onRetry={load} /> : spots.length ? <div className="admin-spot-list">{spots.map((spot) => <article key={spot._id} className="admin-spot-row"><div className="mini-art">{spot.spotNumber}</div><div className="admin-spot-info"><strong>พื้นที่ {spot.spotNumber}</strong><span>{spot.zone} · {spot.spotSize}</span><small>{formatBaht(spot.rentalFee)} / วัน</small></div><div className="row-actions"><button type="button" className="text-button" onClick={() => { setEditing(spot); setFormError(null); }}>แก้ไข</button><button type="button" className="text-button danger" onClick={() => remove(spot)}>ปิดใช้งาน</button></div></article>)}</div> : <EmptyState title="ยังไม่มีพื้นที่" description="เพิ่มพื้นที่แรกจากฟอร์มด้านข้างได้เลย" />}</div><div className="panel admin-form"><div className="panel-heading"><div><span className="eyebrow">{editing ? "EDIT SPOT" : "NEW SPOT"}</span><h2>{editing ? `แก้ไขพื้นที่ ${editing.spotNumber}` : "เพิ่มพื้นที่ใหม่"}</h2></div><span className="form-spark">✳</span></div><ErrorNotice error={formError} /><SpotForm key={`${editing?._id || "new"}-${formVersion}`} initial={editing} onSave={save} onCancel={() => setEditing(null)} busy={busy} /></div></div></div>;
}
