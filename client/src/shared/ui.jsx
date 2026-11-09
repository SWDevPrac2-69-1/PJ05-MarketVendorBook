import { Link } from "react-router-dom";
import { errorMessage } from "./format.js";

export function PageHeading({ eyebrow, title, description, action }) {
  return <div className="page-heading"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{description && <p>{description}</p>}</div>{action && <div className="page-action">{action}</div>}</div>;
}

export function Loading({ label = "กำลังโหลดข้อมูล..." }) {
  return <div className="state-panel" role="status"><span className="loader" />{label}</div>;
}

export function ErrorNotice({ error, onRetry }) {
  if (!error) return null;
  return <div className="notice notice-error" role="alert"><span>{errorMessage(error)}</span>{onRetry && <button type="button" className="text-button" onClick={onRetry}>ลองอีกครั้ง</button>}</div>;
}

export function SuccessNotice({ children }) {
  return children ? <div className="notice notice-success" role="status">{children}</div> : null;
}

export function EmptyState({ title, description, actionLabel, actionTo }) {
  return <div className="state-panel empty-state"><span className="empty-icon" aria-hidden="true">✦</span><h2>{title}</h2><p>{description}</p>{actionTo && <Link className="button button-primary" to={actionTo}>{actionLabel}</Link>}</div>;
}
