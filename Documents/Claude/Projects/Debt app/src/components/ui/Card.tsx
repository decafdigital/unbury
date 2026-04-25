import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  padded?: boolean;
};

export function Card({ children, className = "", padded = true }: Props) {
  return (
    <div
      className={`rounded-xl border border-line bg-white shadow-card transition-shadow duration-200 ${padded ? "p-6 md:p-7" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-2 border-b border-line pb-5 md:flex-row md:items-start md:justify-between">
      <div>
        <h3 className="text-base font-bold text-ink">{title}</h3>
        {subtitle && (
          <p className="mt-1 text-sm leading-relaxed text-ink-muted">
            {subtitle}
          </p>
        )}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}
