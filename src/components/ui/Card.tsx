import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  padded?: boolean;
};

export function Card({ children, className = "", padded = true }: Props) {
  return (
    <div
      className={`rounded-xl border-2 border-black bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all duration-200 ${padded ? "p-6 md:p-7" : ""} ${className}`}
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
    <div className="mb-5 flex flex-col gap-2 border-b-2 border-black pb-5 md:flex-row md:items-start md:justify-between">
      <div>
        <h3 className="text-lg font-extrabold tracking-tight text-black">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-1 text-sm font-medium leading-relaxed text-ink-muted">
            {subtitle}
          </p>
        )}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}
