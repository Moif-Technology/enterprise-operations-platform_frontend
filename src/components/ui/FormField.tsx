
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

type FieldType = "input" | "select" | "textarea";

interface FormFieldProps {
  label: string;
  name: string;
  type?: FieldType;
  required?: boolean;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  placeholder?: string;
  children?: ReactNode;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  selectProps?: SelectHTMLAttributes<HTMLSelectElement>;
  textareaProps?: TextareaHTMLAttributes<HTMLTextAreaElement>;
}

export default function FormField({
  label,
  name,
  type = "input",
  required = false,
  error,
  helperText,
  disabled = false,
  placeholder,
  children,
  inputProps,
  selectProps,
  textareaProps,
}: FormFieldProps) {
  const fieldId = `field-${name}`;
  const hasError = Boolean(error);

  const commonProps = {
    id: fieldId,
    name,
    disabled,
    "aria-invalid": hasError,
    "aria-describedby": hasError
      ? `${fieldId}-error`
      : helperText
        ? `${fieldId}-helper`
        : undefined,
  };

  return (
    <div className={`form-field${hasError ? " has-error" : ""}`}>
      <label htmlFor={fieldId}>
        {label}
        {required && <span className="required-mark"> *</span>}
      </label>

      {type === "select" ? (
        <select
          {...commonProps}
          {...selectProps}
        >
          {children}
        </select>
      ) : type === "textarea" ? (
        <textarea
          {...commonProps}
          {...textareaProps}
          placeholder={placeholder}
        />
      ) : (
        <input
          {...commonProps}
          {...inputProps}
          placeholder={placeholder}
        />
      )}

      {error ? (
        <p id={`${fieldId}-error`} className="form-error" role="alert">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${fieldId}-helper`} className="form-helper">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

