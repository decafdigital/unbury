import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
  prefix?: string;
  suffix?: string;
};

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, hint, error, prefix, suffix, className = "", id, ...rest },
  ref,
) {
  const inputId = id ?? `in_${Math.random().toString(36).slice(2, 8)}`;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-semibold text-ink-soft"
        >
          {label}
        </label>
      )}
      <div
        className={`flex h-11 items-center rounded-lg border bg-white transition-all duration-150 focus-within:ring-2 focus-within:ring-brand-500 focus-within:ring-offset-1 focus-within:ring-offset-paper ${
          error
            ? "border-negative"
            : "border-line hover:border-slate-300"
        }`}
      >
        {prefix && (
          <span className="select-none pl-3 pr-1 text-sm text-ink-muted">
            {prefix}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`tnum h-full w-full bg-transparent px-3 text-sm text-ink placeholder:text-slate-400 focus:outline-none ${
            prefix ? "pl-1" : ""
          } ${suffix ? "pr-1" : ""} ${className}`}
          {...rest}
        />
        {suffix && (
          <span className="select-none pr-3 pl-1 text-sm text-ink-muted">
            {suffix}
          </span>
        )}
      </div>
      {hint && !error && (
        <span className="text-xs text-ink-muted">{hint}</span>
      )}
      {error && <span className="text-xs font-medium text-negative">{error}</span>}
    </div>
  );
});
