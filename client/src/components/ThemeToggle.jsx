import { useEffect, useState } from "react";

const STORAGE_KEY = "night-market-theme";

function ThemeIcon({ dark }) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {dark ? <path d="M20.5 13A8.5 8.5 0 0 1 11 3.5 8.5 8.5 0 1 0 20.5 13Z" /> : <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></>}
    </svg>
  );
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() =>
    document.documentElement.dataset.theme === "dark" ? "dark" : "light",
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      "content", theme === "dark" ? "#0b1325" : "#f3f7ff",
    );
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // The switch still works when browser storage is unavailable.
    }
  }, [theme]);

  useEffect(() => {
    function syncTheme(event) {
      if (event.storageArea === localStorage && (event.key === STORAGE_KEY || event.key === null)) {
        setTheme(event.newValue === "dark" ? "dark" : "light");
      }
    }
    window.addEventListener("storage", syncTheme);
    return () => window.removeEventListener("storage", syncTheme);
  }, []);

  return (
    <div className="theme-toggle" role="group" aria-label="เลือกธีม">
      {[{ value: "light", label: "สว่าง" }, { value: "dark", label: "มืด" }].map(({ value, label }) => (
        <button key={value} type="button" className="theme-option" aria-label={`ธีม${label}`} aria-pressed={theme === value} onClick={() => setTheme(value)}>
          <ThemeIcon dark={value === "dark"} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
