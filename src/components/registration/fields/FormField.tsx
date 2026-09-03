"use client";
import React from "react";

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}

export default function FormField({ label, required, error, hint, children, htmlFor, className = "" }: FormFieldProps) {
  return (
    <div className={`reg-field ${className}`}>
      <label htmlFor={htmlFor} className="reg-label">
        {label}
        {required && <span className="reg-required" aria-hidden="true"> *</span>}
      </label>
      {hint && <p className="reg-hint">{hint}</p>}
      {children}
      {error && <p className="reg-error" role="alert">{error}</p>}
    </div>
  );
}
