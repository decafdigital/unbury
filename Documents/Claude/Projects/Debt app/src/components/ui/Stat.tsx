import type { ReactNode } from "react";

type Props = {
  label: string;
  value: ReactNode;
  sublabel?: ReactNode;
  tone?: "default" | "positive" | "negative" | "caution";
  size?: "md" | "lg";
};

const toneClasses: Record<NonNullable<Props["tone"]>, string> = {
  default: "text-ink",
  positive: "text-positive",
  negative: "text-negative",
  caution: "text-caution",
};

export function Stat({
  label,
  value,
  sublabel,
  tone = "default",
  size = "md",
}: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
        {label}
      </span>
      <span
        className={`tnum font-bold ${toneClasses[tone]} ${
          size === "lg" ? "text-3xl md:text-4xl" : "text-2xl md:text-[1.625rem]"
        }`}
      >
        {value}
      </span>
      {sublabel && (
        <span className="text-sm leading-relaxed text-ink-muted">
          {sublabel}
        </span>
      )}
    </div>
  );
}
