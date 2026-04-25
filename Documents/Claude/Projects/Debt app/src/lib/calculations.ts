import type {
  ConsolidationResult,
  Debt,
  PayoffResult,
  ScheduleEntry,
} from "../types";

const MAX_MONTHS = 600; // 50-year ceiling to guarantee simulation termination
const EPSILON = 0.005; // half a cent — safer than exact zero checks with floats

/** Monthly interest a debt accrues at its current balance. */
export function monthlyInterest(debt: Debt): number {
  return (debt.balance * debt.apr) / 1200;
}

export function totalBalance(debts: Debt[]): number {
  return debts.reduce((s, d) => s + d.balance, 0);
}

export function totalMonthlyInterest(debts: Debt[]): number {
  return debts.reduce((s, d) => s + monthlyInterest(d), 0);
}

export function totalMonthlyMinimums(debts: Debt[]): number {
  return debts.reduce((s, d) => s + d.minPayment, 0);
}

export function weightedApr(debts: Debt[]): number {
  const total = totalBalance(debts);
  if (total <= 0) return 0;
  return debts.reduce((s, d) => s + (d.balance / total) * d.apr, 0);
}

/**
 * Scenario A — Current Path.
 *
 * Each debt is paid independently at its minimum until it clears. If a debt's
 * minimum payment does not exceed its monthly interest, the debt is flagged as
 * stalled (never pays off) and excluded from the total.
 */
export function simulateCurrentPath(debts: Debt[]): PayoffResult {
  const schedule: ScheduleEntry[] = [];
  const stalledDebtIds: string[] = [];
  let totalInterest = 0;
  let totalPaid = 0;
  let maxMonth = 0;

  for (const debt of debts) {
    if (debt.balance <= EPSILON) continue;
    const monthlyRate = debt.apr / 1200;
    const firstInterest = debt.balance * monthlyRate;

    // If the min can't outpace the first month's interest, it never amortizes.
    if (debt.minPayment <= firstInterest + EPSILON) {
      stalledDebtIds.push(debt.id);
      continue;
    }

    let balance = debt.balance;
    let month = 0;
    while (balance > EPSILON && month < MAX_MONTHS) {
      month++;
      const interest = balance * monthlyRate;
      const payment = Math.min(debt.minPayment, balance + interest);
      const principal = payment - interest;
      const ending = Math.max(0, balance + interest - payment);

      schedule.push({
        month,
        debtId: debt.id,
        startingBalance: balance,
        interest,
        payment,
        principal,
        endingBalance: ending,
      });

      totalInterest += interest;
      totalPaid += payment;
      balance = ending;
    }

    if (month > maxMonth) maxMonth = month;
  }

  // Order debts by payoff month
  const lastMonth: Record<string, number> = {};
  for (const e of schedule) {
    lastMonth[e.debtId] = Math.max(lastMonth[e.debtId] ?? 0, e.month);
  }
  const payoffOrder = Object.keys(lastMonth).sort(
    (a, b) => lastMonth[a] - lastMonth[b],
  );

  const firstMonthPayment = debts
    .filter((d) => d.balance > EPSILON && !stalledDebtIds.includes(d.id))
    .reduce((s, d) => s + d.minPayment, 0);

  return {
    months: maxMonth,
    totalInterest,
    totalPaid,
    schedule,
    firstMonthPayment,
    payoffOrder,
    stalled: stalledDebtIds.length > 0,
    stalledDebtIds,
  };
}

/**
 * Scenario B — Avalanche.
 *
 * Every month, the user's total budget is (sum of minimums) + extra. Minimums
 * go to each active debt first, and any leftover budget (including freed-up
 * minimums from paid-off debts) is directed to the highest-APR remaining debt.
 */
export function simulateAvalanche(debts: Debt[], extra: number): PayoffResult {
  const active = debts
    .filter((d) => d.balance > EPSILON)
    .map((d) => ({ ...d }));
  const budget = totalMonthlyMinimums(active) + Math.max(0, extra);

  const schedule: ScheduleEntry[] = [];
  const payoffOrder: string[] = [];
  let month = 0;

  while (active.some((d) => d.balance > EPSILON) && month < MAX_MONTHS) {
    month++;

    // 1. accrue interest
    const interestByDebt: Record<string, number> = {};
    for (const d of active) {
      if (d.balance <= EPSILON) continue;
      interestByDebt[d.id] = (d.balance * d.apr) / 1200;
    }

    // 2. allocate minimums, clamped to payoff amount
    const paymentByDebt: Record<string, number> = {};
    let remaining = budget;
    for (const d of active) {
      if (d.balance <= EPSILON) continue;
      const interest = interestByDebt[d.id];
      const maxPay = d.balance + interest;
      const pay = Math.min(d.minPayment, maxPay, remaining);
      paymentByDebt[d.id] = pay;
      remaining -= pay;
    }

    // 3. direct remaining to highest-APR debt(s) until exhausted
    const byApr = active
      .filter((d) => d.balance > EPSILON)
      .sort((a, b) => b.apr - a.apr);
    for (const d of byApr) {
      if (remaining <= EPSILON) break;
      const interest = interestByDebt[d.id];
      const maxPay = d.balance + interest;
      const currentPay = paymentByDebt[d.id] ?? 0;
      const room = maxPay - currentPay;
      if (room <= EPSILON) continue;
      const apply = Math.min(remaining, room);
      paymentByDebt[d.id] = currentPay + apply;
      remaining -= apply;
    }

    // 4. record schedule + update balances
    for (const d of active) {
      if (d.balance <= EPSILON) continue;
      const interest = interestByDebt[d.id] ?? 0;
      const payment = paymentByDebt[d.id] ?? 0;
      const principal = payment - interest;
      const starting = d.balance;
      const ending = Math.max(0, d.balance + interest - payment);

      schedule.push({
        month,
        debtId: d.id,
        startingBalance: starting,
        interest,
        payment,
        principal,
        endingBalance: ending,
      });

      d.balance = ending;
      if (ending <= EPSILON && !payoffOrder.includes(d.id)) {
        payoffOrder.push(d.id);
      }
    }
  }

  const totalInterest = schedule.reduce((s, e) => s + e.interest, 0);
  const totalPaid = schedule.reduce((s, e) => s + e.payment, 0);

  // First-month payment = what actually got spent in month 1
  const firstMonthPayment = schedule
    .filter((e) => e.month === 1)
    .reduce((s, e) => s + e.payment, 0);

  return {
    months: month,
    totalInterest,
    totalPaid,
    schedule,
    firstMonthPayment,
    payoffOrder,
    stalled: month >= MAX_MONTHS && active.some((d) => d.balance > EPSILON),
    stalledDebtIds: active
      .filter((d) => d.balance > EPSILON)
      .map((d) => d.id),
  };
}

/** Standard amortization formula: monthly payment for a fixed-rate loan. */
export function loanMonthlyPayment(
  principal: number,
  apr: number,
  months: number,
): number {
  if (principal <= 0 || months <= 0) return 0;
  const r = apr / 1200;
  if (r === 0) return principal / months;
  return (
    (principal * (r * Math.pow(1 + r, months))) /
    (Math.pow(1 + r, months) - 1)
  );
}

/** Scenario C — Consolidation loan summary */
export function simulateConsolidation(
  principal: number,
  apr: number,
  months: number,
): ConsolidationResult {
  const monthlyPayment = loanMonthlyPayment(principal, apr, months);
  const totalPaid = monthlyPayment * months;
  const totalInterest = totalPaid - principal;
  return {
    monthlyPayment,
    months,
    totalInterest: Math.max(0, totalInterest),
    totalPaid,
    apr,
    loanAmount: principal,
  };
}

/**
 * Cumulative balance and interest over time, derived from a schedule.
 * Returned as an array with one entry per month (starting at month 1).
 */
export function cumulativeSeries(schedule: ScheduleEntry[]): Array<{
  month: number;
  balance: number;
  cumulativeInterest: number;
  cumulativePrincipal: number;
}> {
  if (schedule.length === 0) return [];
  const lastMonth = schedule.reduce((m, e) => Math.max(m, e.month), 0);
  const endingByMonth: number[] = new Array(lastMonth + 1).fill(0);
  const interestByMonth: number[] = new Array(lastMonth + 1).fill(0);
  const principalByMonth: number[] = new Array(lastMonth + 1).fill(0);

  // Balance at month m = sum of endingBalance for each debt's most recent
  // entry in months <= m. Easier: group by debt, then for every month carry
  // the last known ending balance forward.
  const byDebt = new Map<string, ScheduleEntry[]>();
  for (const e of schedule) {
    const arr = byDebt.get(e.debtId) ?? [];
    arr.push(e);
    byDebt.set(e.debtId, arr);
  }

  for (let m = 1; m <= lastMonth; m++) {
    let bal = 0;
    for (const entries of byDebt.values()) {
      // find latest entry with month <= m
      let last: ScheduleEntry | null = null;
      for (const e of entries) {
        if (e.month <= m) last = e;
        else break;
      }
      if (last) bal += last.endingBalance;
    }
    endingByMonth[m] = bal;
  }

  for (const e of schedule) {
    interestByMonth[e.month] += e.interest;
    principalByMonth[e.month] += e.principal;
  }

  const out = [];
  let ci = 0;
  let cp = 0;
  for (let m = 1; m <= lastMonth; m++) {
    ci += interestByMonth[m];
    cp += principalByMonth[m];
    out.push({
      month: m,
      balance: endingByMonth[m],
      cumulativeInterest: ci,
      cumulativePrincipal: cp,
    });
  }
  return out;
}

/**
 * Given a schedule, build a map of month -> (debtId -> payment). Useful for
 * rendering the month-by-month payment plan.
 */
export function scheduleByMonth(
  schedule: ScheduleEntry[],
): Map<number, ScheduleEntry[]> {
  const m = new Map<number, ScheduleEntry[]>();
  for (const e of schedule) {
    const arr = m.get(e.month) ?? [];
    arr.push(e);
    m.set(e.month, arr);
  }
  return m;
}

/** Short, stable-enough ID generator for new debts. */
export function makeId(): string {
  return `d_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;
}
