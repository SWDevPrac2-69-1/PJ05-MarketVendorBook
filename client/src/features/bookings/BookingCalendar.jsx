import { useEffect, useId, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { formatThaiDate, todayUTC, utcDate } from "../../shared/format.js";

const monthFormat = new Intl.DateTimeFormat("th-TH", { month: "long", year: "numeric", timeZone: "UTC" });
const weekdayFormat = new Intl.DateTimeFormat("th-TH", { weekday: "long", timeZone: "UTC" });
const weekdays = ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."];

function isDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && utcDate(date.toISOString()) === value;
}

export default function BookingCalendar({ bookings, admin, renderBooking }) {
  const [params, setParams] = useSearchParams();
  const id = useId();
  const grid = useRef(null);
  const focusDay = useRef(false);
  const today = todayUTC();
  const selected = isDate(params.get("date")) ? params.get("date") : today;
  const first = new Date(`${selected.slice(0, 7)}-01T00:00:00Z`);
  const end = new Date(first);
  end.setUTCMonth(end.getUTCMonth() + 1);
  end.setUTCDate(0);
  const days = end.getUTCDate();
  const offset = (first.getUTCDay() + 6) % 7;
  const cellCount = Math.ceil((offset + days) / 7) * 7;
  const byDate = new Map();
  for (const booking of bookings) {
    const date = utcDate(booking.bookingDate);
    if (!byDate.has(date)) byDate.set(date, []);
    byDate.get(date).push(booking);
  }
  const dayBookings = byDate.get(selected) || [];
  const monthCount = bookings.filter((booking) => utcDate(booking.bookingDate).startsWith(selected.slice(0, 7))).length;

  function selectDate(date, focus = false) {
    focusDay.current = focus;
    setParams((current) => { const next = new URLSearchParams(current); next.set("date", date); return next; });
  }

  function moveMonth(direction) {
    const next = new Date(first);
    next.setUTCMonth(next.getUTCMonth() + direction);
    if (next.getUTCFullYear() >= 1 && next.getUTCFullYear() <= 9999) selectDate(utcDate(next.toISOString()));
  }

  function arrowKey(event, date) {
    const shifts = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (!(event.key in shifts)) return;
    event.preventDefault();
    const next = new Date(`${date}T00:00:00Z`);
    next.setUTCDate(next.getUTCDate() + shifts[event.key]);
    if (next.getUTCFullYear() >= 1 && next.getUTCFullYear() <= 9999) selectDate(utcDate(next.toISOString()), true);
  }

  useEffect(() => {
    if (focusDay.current) {
      grid.current?.querySelector(`[data-date="${selected}"]`)?.focus();
      focusDay.current = false;
    }
  }, [selected]);

  return <div className="booking-calendar-layout">
    <section className="booking-calendar" aria-labelledby={`${id}-month`}>
      <div className="calendar-toolbar">
        <div><span className="eyebrow">BOOKING CALENDAR</span><h2 id={`${id}-month`} aria-live="polite">{monthFormat.format(first)}</h2><p>{monthCount} การจองในเดือนนี้</p></div>
        <div className="calendar-navigation">
          <button type="button" className="calendar-today" onClick={() => selectDate(today)}>วันนี้</button>
          <button type="button" aria-label="เดือนก่อนหน้า" onClick={() => moveMonth(-1)}>‹</button>
          <button type="button" aria-label="เดือนถัดไป" onClick={() => moveMonth(1)}>›</button>
        </div>
      </div>
      <div className="calendar-weekdays" aria-hidden="true">{weekdays.map((day) => <span key={day}>{day}</span>)}</div>
      <div className="calendar-grid" ref={grid} role="group" aria-label={`วันที่ในเดือน${monthFormat.format(first)}`}>
        {Array.from({ length: cellCount }, (_, index) => {
          const day = index - offset + 1;
          if (day < 1 || day > days) return <span className="calendar-blank" key={`blank-${index}`} aria-hidden="true" />;
          const date = `${selected.slice(0, 7)}-${String(day).padStart(2, "0")}`;
          const entries = byDate.get(date) || [];
          const fullDate = new Date(`${date}T00:00:00Z`);
          return <button type="button" key={date} data-date={date} className={`calendar-day${entries.length ? " has-bookings" : ""}`} aria-pressed={date === selected} aria-current={date === today ? "date" : undefined} aria-label={`${weekdayFormat.format(fullDate)} ${formatThaiDate(date)}, ${entries.length ? `${entries.length} การจอง` : "ไม่มีการจอง"}`} onClick={() => selectDate(date)} onKeyDown={(event) => arrowKey(event, date)}>
            <span className="calendar-day-number">{day}</span>
            {entries.length > 0 && <><span className="calendar-count">{entries.length}</span><span className="calendar-spot-label">{entries[0].spot?.spotNumber || "การจอง"}{entries.length > 1 ? ` +${entries.length - 1}` : ""}</span></>}
          </button>;
        })}
      </div>
      <div className="calendar-legend"><span><i aria-hidden="true" />วันที่มีรายการจอง</span><small>กดวันที่เพื่อดูรายละเอียด</small></div>
    </section>
    <section className="calendar-day-bookings" aria-labelledby={`${id}-selected`}>
      <span className="eyebrow">{admin ? "ALL BOOKINGS" : "MY BOOKINGS"}</span>
      <h2 id={`${id}-selected`}>{formatThaiDate(selected)}</h2>
      <p className="calendar-selection-summary" role="status">{dayBookings.length ? `${dayBookings.length} รายการในวันนี้` : "ไม่มีรายการจองในวันที่เลือก"}</p>
      {dayBookings.length ? <div className="booking-list">{dayBookings.map(renderBooking)}</div> : <div className="calendar-empty"><span aria-hidden="true">✳</span><p>{admin ? "เลือกวันที่อื่นเพื่อดูรายการจอง" : "การจองในวันที่เลือกจะแสดงตรงนี้"}</p>{!admin && selected >= today && <Link className="button button-outline" to={`/bookings/new?date=${selected}`}>จองพื้นที่วันที่เลือก</Link>}</div>}
    </section>
  </div>;
}
