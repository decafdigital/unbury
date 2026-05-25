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
    "bg-black text-brand-500 border-2 border-black hover:bg-brand-500 hover:text-black active:bg-brand-600 disabled:opacity-50",
  secondary:
    "bg-brand-500 text-black border-2 border-black hover:bg-black hover:text-brand-500 active:bg-brand-600 disabled:opacity-50",
  ghost:
    "bg-transparent text-black border-2 border-transparent hover:border-black hover:bg-brand-500 active:bg-brand-600 disabled:opacity-50",
  danger:
    "bg-white text-negative border-2 border-negative hover:bg-negative hover:text-white active:bg-negative/90 disabled:opacity-50",
};

const sizeClasses: Record<Size, string> = {
  sm: "py-2 px-4 text-sm rounded-lg",
  md: "py-3 px-6 text-sm rounded-xl",
  lg: "py-4 px-8 text-base rounded-xl",
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
      className={`inline-flex items-center justify-center gap-2 font-bold tracking-tight transition-all duration-150 ease-out-quart focus-ring disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
