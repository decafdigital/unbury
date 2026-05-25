import type { ReactNode } from "react";

type Props = {
  title?: string;
  children: ReactNode;
  tone?: "info" | "caution" | "positive" | "alert";
};

const tones = {
  info: {
    wrap: "border-brand-100 bg-brand-50/80",
    title: "text-brand-800",
    body: "text-brand-900/80",
    icon: (
      <svg viewBox="0 0 20 20" className="h-5 w-5 text-brand-600" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm1-11a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm-1 3a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V11a1 1 0 0 1 1-1Z" />
      </svg>
    ),
  },
  caution: {
    wrap: "border-amber-200 bg-cautionSoft",
    title: "text-caution",
    body: "text-caution/90",
    icon: (
      <svg viewBox="0 0 20 20" className="h-5 w-5 text-caution" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M8.485 2.495c.664-1.327 2.366-1.327 3.03 0l6.28 12.56c.612 1.223-.283 2.695-1.515 2.695H3.72c-1.232 0-2.127-1.472-1.515-2.694L8.485 2.495ZM10 6a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V7a1 1 0 0 1 1-1Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
      </svg>
    ),
  },
  positive: {
    wrap: "border-emerald-200 bg-positiveSoft",
    title: "text-positive",
    body: "text-positive/90",
    icon: (
      <svg viewBox="0 0 20 20" className="h-5 w-5 text-positive" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-3.97-2.78a.75.75 0 1 0-1.06-1.06L9 10.12 7.03 8.16a.75.75 0 0 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.06 0l4.5-4.5Z" />
      </svg>
    ),
  },
  alert: {
    wrap: "border-2 border-negative bg-negativeSoft",
    title: "text-negative",
    body: "text-negative/90",
    icon: (
      <svg viewBox="0 0 20 20" className="h-5 w-5 text-negative" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M8.485 2.495c.664-1.327 2.366-1.327 3.03 0l6.28 12.56c.612 1.223-.283 2.695-1.515 2.695H3.72c-1.232 0-2.127-1.472-1.515-2.694L8.485 2.495ZM10 6a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V7a1 1 0 0 1 1-1Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
      </svg>
    ),
  },
} as const;

export function InfoCallout({ title, children, tone = "info" }: Props) {
  const t = tones[tone];
  return (
    <div className={`flex gap-3 rounded-xl border ${t.wrap} p-4 md:p-5`}>
      <div className="mt-0.5 shrink-0">{t.icon}</div>
      <div className="text-sm leading-relaxed">
        {title && (
          <p className={`mb-1 font-bold ${t.title}`}>{title}</p>
        )}
        <div className={t.body}>{children}</div>
      </div>
    </div>
  );
}
