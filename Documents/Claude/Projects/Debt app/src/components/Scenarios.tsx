import { useMemo } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AppState, Consolidation, Debt } from "../types";
import {
  cumulativeSeries,
  simulateAvalanche,
  simulateConsolidation,
  simulateCurrentPath,
  totalBalance,
  totalMonthlyMinimums,
} from "../lib/calculations";
import {
  fmtCompactCurrency,
  fmtCurrency,
  fmtMonths,
  fmtPercent,
} from "../lib/format";
import { Button } from "./ui/Button";
import { Card, CardHeader } from "./ui/Card";
import { InfoCallout } from "./ui/InfoCallout";
import { Input } from "./ui/Input";
import { Stat } from "./ui/Stat";

type Props = {
  debts: Debt[];
  extraPayment: number;
  consolidation: Consolidation;
  chosenScenario: AppState["chosenScenario"];
  onExtraChange: (n: number) => void;
  onConsolidationChange: (c: Consolidation) => void;
  onChooseScenario: (k: AppState["chosenScenario"]) => void;
  onGoPlan: () => void;
};

export function Scenarios({
  debts,
  extraPayment,
  consolidation,
  chosenScenario,
  onExtraChange,
  onConsolidationChange,
  onChooseScenario,
  onGoPlan,
}: Props) {
  const current = useMemo(() => simulateCurrentPath(debts), [debts]);
  const avalanche = useMemo(
    () => simulateAvalanche(debts, extraPayment),
    [debts, extraPayment],
  );

  const loanAmount =
    consolidation.loanAmount > 0
      ? consolidation.loanAmount
      : totalBalance(debts);
  const consolidationResult = useMemo(
    () =>
      simulateConsolidation(
        loanAmount,
        consolidation.loanApr,
        consolidation.loanTermMonths,
      ),
    [loanAmount, consolidation.loanApr, consolidation.loanTermMonths],
  );

  const avalancheSaved = current.totalInterest - avalanche.totalInterest;
  const consolidationSaved =
    current.totalInterest - consolidationResult.totalInterest;
  const currentTotalMonthly = totalMonthlyMinimums(debts);
  const consolidationMonthlyDelta =
    consolidationResult.monthlyPayment - currentTotalMonthly;

  const comparisonData = useMemo(() => {
    const curSeries = cumulativeSeries(current.schedule);
    const avaSeries = cumulativeSeries(avalanche.schedule);
    const maxMonth = Math.max(
      curSeries.length,
      avaSeries.length,
      consolidationResult.months,
    );
    const data: Array<{
      month: number;
      current: number | null;
      avalanche: number | null;
      consolidation: number | null;
    }> = [];
    for (let m = 0; m <= maxMonth; m++) {
      const cur =
        m === 0
          ? totalBalance(debts)
          : (curSeries[m - 1]?.balance ?? null);
      const ava =
        m === 0
          ? totalBalance(debts)
          : (avaSeries[m - 1]?.balance ?? null);
      // Consolidation balance: declines from loanAmount to 0 linearly-ish
      const con =
        m === 0
          ? loanAmount
          : m <= consolidationResult.months
            ? amortizationBalance(
                loanAmount,
                consolidation.loanApr,
                consolidationResult.months,
                m,
              )
            : 0;
      data.push({
        month: m,
        current: cur,
        avalanche: ava,
        consolidation: con,
      });
    }
    return data;
  }, [current.schedule, avalanche.schedule, consolidationResult, debts, loanAmount, consolidation.loanApr]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">
            Compare payoff scenarios
          </h2>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-muted">
            Three realistic paths, using the same debts but different
            strategies. Pick the one that fits your budget — you can model
            your action plan around any of them.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ScenarioCard
          title="A · Current path"
          subtitle="Keep paying the minimums on each debt."
          highlight={false}
          chosen={chosenScenario === "current"}
          onChoose={() => onChooseScenario("current")}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Stat
              label="Payoff time"
              value={
                current.stalled ? (
                  <span className="text-negative">Never</span>
                ) : (
                  fmtMonths(current.months)
                )
              }
              sublabel={
                current.stalled
                  ? "At least one debt won't pay off at minimums."
                  : undefined
              }
            />
            <Stat
              label="Total interest"
              value={fmtCurrency(current.totalInterest)}
              tone="negative"
              sublabel={
                current.stalled ? "(excluding stalled debts)" : undefined
              }
            />
          </div>
          <div className="mt-4 border-t border-line pt-4 text-sm text-ink-soft">
            <p>
              Monthly payment:{" "}
              <b className="tnum text-ink">
                {fmtCurrency(current.firstMonthPayment)}
              </b>
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              This is the baseline. Every other scenario compares back to
              this.
            </p>
          </div>
        </ScenarioCard>

        <ScenarioCard
          title="B · Avalanche"
          subtitle="Minimums on all debts + extra on the highest APR."
          highlight={true}
          chosen={chosenScenario === "avalanche"}
          onChoose={() => onChooseScenario("avalanche")}
        >
          <Input
            label="Extra monthly payment"
            type="number"
            inputMode="decimal"
            prefix="$"
            value={extraPayment || ""}
            placeholder="100"
            onChange={(e) => onExtraChange(Number(e.target.value) || 0)}
            hint="Anything you can add on top of your current minimums."
          />
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Stat
              label="Payoff time"
              value={fmtMonths(avalanche.months)}
              sublabel={
                current.months
                  ? `${Math.max(0, current.months - avalanche.months)} mo faster`
                  : undefined
              }
              tone="positive"
            />
            <Stat
              label="Total interest"
              value={fmtCurrency(avalanche.totalInterest)}
              sublabel={
                avalancheSaved > 0
                  ? `Save ${fmtCurrency(avalancheSaved)}`
                  : "Add an extra payment →"
              }
              tone={avalancheSaved > 0 ? "positive" : "default"}
            />
          </div>
          <div className="mt-4 border-t border-line pt-4 text-sm text-ink-soft">
            <p>
              Monthly payment:{" "}
              <b className="tnum text-ink">
                {fmtCurrency(avalanche.firstMonthPayment)}
              </b>
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              Pay every minimum, then apply your extra to the debt with the
              highest APR. When one is gone, its payment rolls to the next.
            </p>
          </div>
        </ScenarioCard>

        <ScenarioCard
          title="C · Consolidation loan"
          subtitle="Replace it all with one fixed-rate loan."
          highlight={false}
          chosen={chosenScenario === "consolidation"}
          onChoose={() => onChooseScenario("consolidation")}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              label="Loan APR"
              type="number"
              inputMode="decimal"
              suffix="%"
              value={consolidation.loanApr || ""}
              onChange={(e) =>
                onConsolidationChange({
                  ...consolidation,
                  loanApr: Number(e.target.value) || 0,
                })
              }
            />
            <Input
              label="Term"
              type="number"
              inputMode="numeric"
              suffix="mo"
              value={consolidation.loanTermMonths || ""}
              onChange={(e) =>
                onConsolidationChange({
                  ...consolidation,
                  loanTermMonths: Math.max(
                    1,
                    Math.round(Number(e.target.value) || 0),
                  ),
                })
              }
            />
          </div>
          <div className="mt-3">
            <Input
              label="Loan amount"
              type="number"
              inputMode="decimal"
              prefix="$"
              value={consolidation.loanAmount || ""}
              placeholder={String(Math.round(totalBalance(debts)))}
              onChange={(e) =>
                onConsolidationChange({
                  ...consolidation,
                  loanAmount: Number(e.target.value) || 0,
                })
              }
              hint={
                consolidation.loanAmount
                  ? undefined
                  : `Defaults to your total balance (${fmtCurrency(totalBalance(debts))})`
              }
            />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Stat
              label="New monthly payment"
              value={fmtCurrency(consolidationResult.monthlyPayment, {
                cents: true,
              })}
              sublabel={
                consolidationMonthlyDelta < 0
                  ? `${fmtCurrency(-consolidationMonthlyDelta)} less / mo`
                  : consolidationMonthlyDelta > 0
                    ? `${fmtCurrency(consolidationMonthlyDelta)} more / mo`
                    : "same as current"
              }
              tone={consolidationMonthlyDelta < 0 ? "positive" : "default"}
            />
            <Stat
              label="Total interest"
              value={fmtCurrency(consolidationResult.totalInterest)}
              tone={consolidationSaved > 0 ? "positive" : "negative"}
              sublabel={
                consolidationSaved > 0
                  ? `Save ${fmtCurrency(consolidationSaved)}`
                  : `${fmtCurrency(-consolidationSaved)} more than current`
              }
            />
          </div>
          <div className="mt-4 border-t border-line pt-4 text-sm text-ink-soft">
            <p>
              Payoff time:{" "}
              <b className="tnum text-ink">
                {fmtMonths(consolidationResult.months)}
              </b>
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              Only wins if the loan APR is lower than your weighted average.
              Consolidation is a tool, not a cure — it depends on terms you're
              actually offered.
            </p>
          </div>
        </ScenarioCard>
      </div>

      <Card>
        <CardHeader
          title="Balance remaining over time"
          subtitle="How fast your total debt shrinks under each scenario."
        />
        <div className="h-72 w-full">
          <ResponsiveContainer>
            <LineChart
              data={comparisonData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="month"
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                label={{
                  value: "Months",
                  position: "insideBottom",
                  offset: -2,
                  style: { fontSize: 11, fill: "#64748b" },
                }}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => fmtCompactCurrency(v)}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                  fontSize: 12,
                }}
                formatter={(v: number, name: string) => [
                  fmtCurrency(v),
                  nameLabel(name),
                ]}
                labelFormatter={(m) => `Month ${m}`}
              />
              <Legend
                iconType="plainline"
                wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                formatter={(v) => nameLabel(v)}
              />
              <Line
                type="monotone"
                dataKey="current"
                stroke="#ea580c"
                strokeWidth={2}
                dot={false}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="avalanche"
                stroke="#10b981"
                strokeWidth={2.75}
                dot={false}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="consolidation"
                stroke="#0f172a"
                strokeWidth={2}
                strokeDasharray="5 3"
                dot={false}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {avalancheSaved > 0 && (
          <InfoCallout
            tone="positive"
            title={`Avalanche saves ${fmtCurrency(avalancheSaved)}`}
          >
            Adding <b>{fmtCurrency(extraPayment)}/mo</b> to your highest-APR
            debt pays everything off{" "}
            <b>
              {Math.max(0, current.months - avalanche.months)} months faster
            </b>{" "}
            and cuts total interest paid by{" "}
            {fmtPercent(
              current.totalInterest > 0
                ? (avalancheSaved / current.totalInterest) * 100
                : 0,
              0,
            )}
            .
          </InfoCallout>
        )}
        {consolidation.loanApr < weightedAprOf(debts) &&
          consolidationSaved > 0 && (
            <InfoCallout
              tone="positive"
              title={`Consolidation saves ${fmtCurrency(consolidationSaved)}`}
            >
              At {fmtPercent(consolidation.loanApr)} over{" "}
              {consolidation.loanTermMonths} months, a consolidation loan is
              cheaper than staying on minimums — and simplifies you down to one
              payment.
            </InfoCallout>
          )}
        {consolidation.loanApr >= weightedAprOf(debts) && debts.length > 0 && (
          <InfoCallout tone="caution" title="This loan isn't beating your current rate">
            The loan APR you entered ({fmtPercent(consolidation.loanApr)}) is
            higher than your weighted-average APR (
            {fmtPercent(weightedAprOf(debts))}). Consolidation only wins when
            the new rate is meaningfully lower.
          </InfoCallout>
        )}
      </div>

      <div className="flex items-center justify-end">
        <Button size="lg" onClick={onGoPlan}>
          Build my action plan →
        </Button>
      </div>
    </div>
  );
}

type ScenarioCardProps = {
  title: string;
  subtitle: string;
  highlight: boolean;
  chosen: boolean;
  onChoose: () => void;
  children: React.ReactNode;
};

function ScenarioCard({
  title,
  subtitle,
  highlight,
  chosen,
  onChoose,
  children,
}: ScenarioCardProps) {
  return (
    <div
      className={`flex flex-col rounded-xl border bg-white shadow-card transition-all duration-200 ${
        chosen
          ? "border-brand-600 ring-2 ring-brand-500/25"
          : highlight
            ? "border-brand-200"
            : "border-line"
      }`}
    >
      <div className="flex items-start justify-between gap-3 border-b border-line p-5 md:p-6">
        <div className="min-w-0">
          <h3 className="text-base font-bold text-ink">{title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-muted">
            {subtitle}
          </p>
        </div>
        <button
          onClick={onChoose}
          className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors duration-150 focus-ring ${
            chosen
              ? "bg-brand-600 text-white shadow-button"
              : "border border-line text-ink-soft hover:bg-paper hover:text-ink"
          }`}
          aria-pressed={chosen}
        >
          {chosen ? "Chosen" : "Choose"}
        </button>
      </div>
      <div className="flex-1 p-5 md:p-6">{children}</div>
    </div>
  );
}

function nameLabel(k: string): string {
  switch (k) {
    case "current":
      return "Current minimums";
    case "avalanche":
      return "Avalanche";
    case "consolidation":
      return "Consolidation";
    default:
      return k;
  }
}

function amortizationBalance(
  principal: number,
  apr: number,
  termMonths: number,
  month: number,
): number {
  if (principal <= 0 || termMonths <= 0) return 0;
  const r = apr / 1200;
  if (r === 0) {
    return Math.max(0, principal - (principal / termMonths) * month);
  }
  const pow = Math.pow(1 + r, termMonths);
  const pmt = (principal * (r * pow)) / (pow - 1);
  const balance =
    principal * Math.pow(1 + r, month) -
    pmt * ((Math.pow(1 + r, month) - 1) / r);
  return Math.max(0, balance);
}

function weightedAprOf(debts: Debt[]): number {
  const total = debts.reduce((s, d) => s + d.balance, 0);
  if (total <= 0) return 0;
  return debts.reduce((s, d) => s + (d.balance / total) * d.apr, 0);
}
