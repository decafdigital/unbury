import { useMemo, useState } from "react";
import type { Consolidation, Debt, ScenarioKey } from "../types";
import {
  loanMonthlyPayment,
  scheduleByMonth,
  simulateAvalanche,
  simulateCurrentPath,
  totalBalance,
} from "../lib/calculations";
import { fmtCurrency, fmtMonths } from "../lib/format";
import { Button } from "./ui/Button";
import { Card, CardHeader } from "./ui/Card";
import { InfoCallout } from "./ui/InfoCallout";
import { Tabs } from "./ui/Tabs";

type Props = {
  debts: Debt[];
  extraPayment: number;
  consolidation: Consolidation;
  chosenScenario: ScenarioKey;
  onGoScenarios: () => void;
};

export function ActionPlan({
  debts,
  extraPayment,
  consolidation,
  chosenScenario,
  onGoScenarios,
}: Props) {
  const current = useMemo(() => simulateCurrentPath(debts), [debts]);
  const avalanche = useMemo(
    () => simulateAvalanche(debts, extraPayment),
    [debts, extraPayment],
  );

  const [scheduleLimit, setScheduleLimit] = useState<12 | 24 | 0>(12);

  if (debts.length === 0) {
    return (
      <InfoCallout title="No debts to plan yet">
        Add some debts first and pick a scenario before building a plan.
      </InfoCallout>
    );
  }

  if (chosenScenario === "consolidation") {
    return (
      <ConsolidationPlan
        debts={debts}
        consolidation={consolidation}
        onGoScenarios={onGoScenarios}
      />
    );
  }

  const result = chosenScenario === "avalanche" ? avalanche : current;
  const debtById = new Map(debts.map((d) => [d.id, d]));
  const byMonth = scheduleByMonth(result.schedule);

  // Order: by payoff month ascending. For avalanche, the highest-APR still
  // wins the extra, so order usually tracks APR; for current, it tracks
  // min/balance ratios. Either way the simulator tells us.
  const order = [...result.payoffOrder];
  const stalledNames = result.stalledDebtIds
    .map((id) => debtById.get(id)?.name)
    .filter(Boolean) as string[];

  const totalMonths = result.months;
  const monthsShown =
    scheduleLimit === 0 ? totalMonths : Math.min(scheduleLimit, totalMonths);
  const shownMonths = Array.from({ length: monthsShown }, (_, i) => i + 1);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">
            Your action plan
          </h2>
          <p className="mt-2 text-base leading-relaxed text-ink-muted">
            {chosenScenario === "avalanche"
              ? `Avalanche with ${fmtCurrency(extraPayment)}/mo extra. Pay the amount shown on each debt each month — the extra goes to whichever debt is highest-APR and still active.`
              : "Keep paying each debt's minimum until it clears, in the order below."}
          </p>
        </div>
        <Button variant="secondary" onClick={onGoScenarios}>
          Change scenario
        </Button>
      </div>

      {result.stalled && (
        <InfoCallout tone="caution" title="Heads up — stalled debts">
          These balances won't pay off at the minimum payment entered:{" "}
          <b>{stalledNames.join(", ")}</b>. Consider moving to the avalanche
          scenario or increasing the minimum on those debts.
        </InfoCallout>
      )}

      <Card>
        <CardHeader
          title="Payoff order"
          subtitle={`Total time: ${fmtMonths(result.months)} · Total interest: ${fmtCurrency(result.totalInterest)}`}
        />
        <ol className="flex flex-col gap-3">
          {order.map((id, idx) => {
            const d = debtById.get(id);
            if (!d) return null;
            const lastEntry = result.schedule
              .filter((e) => e.debtId === id)
              .reduce<number>((m, e) => Math.max(m, e.month), 0);
            return (
              <li
                key={id}
                className="flex flex-wrap items-center gap-4 rounded-lg border border-line bg-paper p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                  {idx + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">{d.name}</p>
                  <p className="text-xs text-ink-muted">
                    {fmtCurrency(d.balance)} @ {d.apr.toFixed(2)}% APR
                  </p>
                </div>
                <div className="tnum text-right">
                  <p className="text-sm font-semibold text-ink">
                    Paid off in month {lastEntry}
                  </p>
                  <p className="text-xs text-ink-muted">
                    {fmtMonths(lastEntry)}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </Card>

      <Card>
        <CardHeader
          title="Month-by-month schedule"
          subtitle={`How much goes to each debt, month by month.`}
          right={
            <Tabs
              value={String(scheduleLimit) as "12" | "24" | "0"}
              tabs={[
                { id: "12", label: "First 12" },
                { id: "24", label: "First 24" },
                { id: "0", label: "All" },
              ]}
              onChange={(v) => setScheduleLimit(Number(v) as 12 | 24 | 0)}
            />
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-paper text-left text-xs uppercase tracking-wide text-ink-muted">
                <th className="px-4 py-2 font-medium">Month</th>
                {debts.map((d) => (
                  <th
                    key={d.id}
                    className="px-4 py-2 text-right font-medium"
                    title={`${d.apr.toFixed(2)}% APR`}
                  >
                    {d.name}
                  </th>
                ))}
                <th className="px-4 py-2 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {shownMonths.map((m) => {
                const entries = byMonth.get(m) ?? [];
                const payByDebt = new Map<string, number>(
                  entries.map((e) => [e.debtId, e.payment]),
                );
                const total = entries.reduce((s, e) => s + e.payment, 0);
                return (
                  <tr key={m} className="border-t border-line">
                    <td className="px-4 py-2 font-medium text-ink">{m}</td>
                    {debts.map((d) => {
                      const p = payByDebt.get(d.id);
                      const end = entries.find(
                        (e) => e.debtId === d.id,
                      )?.endingBalance;
                      const cleared = end !== undefined && end < 0.005;
                      return (
                        <td
                          key={d.id}
                          className={`tnum px-4 py-2 text-right ${
                            p === undefined ? "text-slate-300" : "text-ink"
                          }`}
                        >
                          {p === undefined ? (
                            "—"
                          ) : (
                            <span>
                              {fmtCurrency(p, { cents: true })}
                              {cleared && (
                                <span className="ml-1 text-xs text-positive">
                                  ✓
                                </span>
                              )}
                            </span>
                          )}
                        </td>
                      );
                    })}
                    <td className="tnum px-4 py-2 text-right font-semibold text-ink">
                      {fmtCurrency(total, { cents: true })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {scheduleLimit !== 0 && totalMonths > monthsShown && (
          <p className="mt-3 text-xs text-ink-muted">
            Showing first {monthsShown} of {totalMonths} months. Switch to
            "All" to see the full schedule.
          </p>
        )}
      </Card>
    </div>
  );
}

function ConsolidationPlan({
  debts,
  consolidation,
  onGoScenarios,
}: {
  debts: Debt[];
  consolidation: Consolidation;
  onGoScenarios: () => void;
}) {
  const principal =
    consolidation.loanAmount > 0
      ? consolidation.loanAmount
      : totalBalance(debts);
  const pmt = loanMonthlyPayment(
    principal,
    consolidation.loanApr,
    consolidation.loanTermMonths,
  );

  // Build an amortization schedule for the consolidation loan
  const r = consolidation.loanApr / 1200;
  const months = consolidation.loanTermMonths;
  let balance = principal;
  const rows: Array<{
    month: number;
    interest: number;
    principal: number;
    payment: number;
    balance: number;
  }> = [];
  for (let m = 1; m <= months; m++) {
    const interest = balance * r;
    const principalPart = Math.min(pmt - interest, balance);
    const payment = interest + principalPart;
    balance = Math.max(0, balance - principalPart);
    rows.push({
      month: m,
      interest,
      principal: principalPart,
      payment,
      balance,
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">
            Consolidation plan
          </h2>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-muted">
            One loan, one fixed payment, gone at the end of the term. Use the
            loan to pay off every balance on day one — then focus only on the
            loan payment.
          </p>
        </div>
        <Button variant="secondary" onClick={onGoScenarios}>
          Change scenario
        </Button>
      </div>

      <Card>
        <CardHeader title="Step 1 — Pay off each balance with loan proceeds" />
        <ol className="flex flex-col gap-3">
          {debts.map((d, idx) => (
            <li
              key={d.id}
              className="flex flex-wrap items-center gap-4 rounded-lg border border-line bg-paper p-4"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                {idx + 1}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">{d.name}</p>
                <p className="text-xs text-ink-muted">
                  Close this balance with loan funds.
                </p>
              </div>
              <div className="tnum text-right text-sm font-semibold text-ink">
                {fmtCurrency(d.balance)}
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs text-ink-muted">
          Tip: use proceeds to zero every balance, then close or hide the
          cards so the freed-up credit doesn't turn into new debt.
        </p>
      </Card>

      <Card>
        <CardHeader
          title="Step 2 — Pay the loan"
          subtitle={`${fmtCurrency(pmt, { cents: true })} per month, every month, for ${months} months.`}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-paper text-left text-xs uppercase tracking-wide text-ink-muted">
                <th className="px-4 py-2 font-medium">Month</th>
                <th className="px-4 py-2 text-right font-medium">Interest</th>
                <th className="px-4 py-2 text-right font-medium">Principal</th>
                <th className="px-4 py-2 text-right font-medium">Payment</th>
                <th className="px-4 py-2 text-right font-medium">
                  Remaining balance
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 24).map((row) => (
                <tr key={row.month} className="border-t border-line">
                  <td className="px-4 py-2 font-medium text-ink">
                    {row.month}
                  </td>
                  <td className="tnum px-4 py-2 text-right text-negative">
                    {fmtCurrency(row.interest, { cents: true })}
                  </td>
                  <td className="tnum px-4 py-2 text-right">
                    {fmtCurrency(row.principal, { cents: true })}
                  </td>
                  <td className="tnum px-4 py-2 text-right font-medium">
                    {fmtCurrency(row.payment, { cents: true })}
                  </td>
                  <td className="tnum px-4 py-2 text-right text-ink-soft">
                    {fmtCurrency(row.balance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length > 24 && (
          <p className="mt-3 text-xs text-ink-muted">
            Showing first 24 of {months} months.
          </p>
        )}
      </Card>
    </div>
  );
}
