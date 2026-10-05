import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { X, Search, Check, CircleHelp } from "lucide-react";
import { Link } from "react-router-dom";
import { initials } from "./store";
export function Brand() {
  return (
    <Link className="brand" to="/">
      <img src="/igris-logo.png" alt="IGRIS logo" />
      <div>
        IGRIS<span>WORKFORCE</span>
      </div>
    </Link>
  );
}
export function Avatar({
  name,
  color = "lavender",
  small = false,
}: {
  name: string;
  color?: string;
  small?: boolean;
}) {
  return (
    <span className={`avatar ${color} ${small ? "small" : ""}`}>
      {initials(name)}
    </span>
  );
}
export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: string;
}) {
  return <span className={"badge " + tone}>{children}</span>;
}
export function Progress({
  value,
  label = false,
}: {
  value: number;
  label?: boolean;
}) {
  return (
    <div className="progress-group">
      {label && (
        <div className="progress-caption">
          <span>{value}% complete</span>
        </div>
      )}
      <div
        className="progress"
        role="progressbar"
        aria-label="Completion"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <i style={{ width: value + "%" }} />
      </div>
    </div>
  );
}
export function PageHeading({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children && <div className="heading-actions">{children}</div>}
    </div>
  );
}
export function Modal({
  title,
  open,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (open && !ref.current?.open) ref.current?.showModal();
    if (!open && ref.current?.open) ref.current.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={"modal " + (wide ? "wide" : "")}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-head">
        <h2>{title}</h2>
        <button
          type="button"
          aria-label="Close dialog"
          className="icon-btn"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      <div className="modal-body">{children}</div>
    </dialog>
  );
}
export function SearchField({
  value,
  onChange,
  placeholder = "Search…",
}: {
  value: string;
  onChange: (s: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="search-field">
      <Search size={17} />
      <input
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button aria-label="Clear search" onClick={() => onChange("")}>
          <X size={14} />
        </button>
      )}
    </label>
  );
}
export function Empty({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="empty">
      <CircleHelp size={28} />
      <h3>{title}</h3>
      <p>{description}</p>
      {children}
    </div>
  );
}
export function CheckRow({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
}) {
  return (
    <label className={"check-row " + (checked ? "checked" : "")}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="check-box">{checked && <Check size={13} />}</span>
      <span>{children}</span>
    </label>
  );
}
