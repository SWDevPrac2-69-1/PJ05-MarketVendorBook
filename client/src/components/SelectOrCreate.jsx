import { useId, useState } from "react";

export default function SelectOrCreate({ label, name, value, options, onChange, onDelete, createLabel, customLabel, placeholder, disabled }) {
  const id = useId();
  const [mode, setMode] = useState("select");
  const choices = [...new Set([...options, value].filter(Boolean))];

  function select(event) {
    const selected = event.target.value;
    setMode(selected === "create" ? "create" : "select");
    onChange(selected === "create" ? "" : selected.slice("option:".length));
  }

  return (
    <div className="choice-field">
      <div className="choice-field-label">
        <label htmlFor={id}>{mode === "create" ? customLabel : label}</label>
        <div className="choice-field-actions">
          {mode !== "select"
            ? <button type="button" className="text-button" aria-label={`เลือก${label}จากรายการ`} onClick={() => setMode("select")} disabled={disabled}>เลือกจากรายการ</button>
            : value && <button type="button" className="text-button" aria-label={`แก้ไข${label}`} onClick={() => setMode("edit")} disabled={disabled}>แก้ไข</button>}
          {value && onDelete && <button type="button" className="text-button danger" aria-label={`ลบหมวดหมู่${value}`} onClick={() => onDelete(value)} disabled={disabled}>ลบ</button>}
        </div>
      </div>
      {mode === "select" ? (
        <select id={id} name={name} value={value ? `option:${value}` : ""} onChange={select} required disabled={disabled}>
          <option value="">เลือก{label}</option>
          {choices.map((option) => <option key={option} value={`option:${option}`}>{option}</option>)}
          <option value="create">+ {createLabel}</option>
        </select>
      ) : (
        <input id={id} name={name} value={value} onChange={(event) => onChange(event.target.value)} required disabled={disabled} placeholder={placeholder} autoFocus />
      )}
    </div>
  );
}
