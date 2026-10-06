import type { InputHTMLAttributes } from "react";

interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export default function SearchInput({
  label,
  placeholder = "Search...",
  className = "",
  ...props
}: SearchInputProps) {
  return (
    <div
  className={`search-input${label ? " search-input-with-label" : ""}${
    className ? ` ${className}` : ""
  }`}
>
      {label && <label htmlFor={props.id}>{label}</label>}

      <div className="search-input-wrapper">
        <span className="search-input-icon" aria-hidden="true">
          🔍
        </span>

        <input
          {...props}
          type="search"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}