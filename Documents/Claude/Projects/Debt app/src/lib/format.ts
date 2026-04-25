export function fmtCurrency(n: number, opts?: { cents?: boolean }): string {
  if (!Number.isFinite(n)) return "—";
  const cents = opts?.cents ?? false;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  }).format(n);
}

export function fmtPercent(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return "—";
  return `${n.toFixed(digits)}%`;
}

export function fmtMonths(months: number): string {
  if (!Number.isFinite(months) || months <= 0) return "—";
  if (months === Infinity) return "Never";
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (years === 0) return `${months} mo`;
  if (rem === 0) return `${years} yr`;
  return `${years} yr ${rem} mo`;
}

/** Used for chart axes and compact summaries */
export function fmtCompactCurrency(n: number): string {
  if (!Number.isFinite(n)) return "—";
  if (Math.abs(n) >= 1000) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(n);
  }
  return fmtCurrency(n);
}
