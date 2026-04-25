import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white shadow-button hover:bg-brand-700 active:bg-brand-800 disabled:bg-brand-600/40 disabled:shadow-none",
  secondary:
    "bg-white text-ink border border-line hover:bg-paper hover:border-slate-300 active:bg-slate-100 disabled:opacity-50",
  ghost:
    "bg-transparent text-ink-soft hover:bg-paper hover:text-ink active:bg-slate-100 disabled:opacity-50",
  danger:
    "bg-white text-negative border border-negative/30 hover:bg-negativeSoft hover:border-negative/50 active:bg-orange-100 disabled:opacity-50",
};

const sizeClasses: Record<Size, string> = {
  sm: "py-2 px-4 text-sm rounded-lg",
  md: "py-3 px-6 text-sm rounded-lg",
  lg: "py-3.5 px-7 text-base rounded-xl",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: Props) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 ease-out-quart focus-ring disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
