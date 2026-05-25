import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { Debt } from "../types";
import {
  monthlyInterest,
  totalBalance,
  totalMonthlyInterest,
  totalMonthlyMinimums,
  weightedApr,
} from "../lib/calculations";
import { fmtCurrency, fmtPercent } from "../lib/format";
import { Button } from "./ui/Button";
import { Card, CardHeader } from "./ui/Card";
import { InfoCallout } from "./ui/InfoCallout";
import { Stat } from "./ui/Stat";

type Props = {
  debts: Debt[];
  onGoScenarios: () => void;
  onGoDebts: () => void;
};

export function Dashboard({ debts, onGoScenarios, onGoDebts }: Props) {
  if (debts.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <InfoCallout title="No debts yet">
          Add at least one debt to see your dashboard.
        </InfoCallout>
        <Button onClick={onGoDebts}>Add debts →</Button>
      </div>
    );
  }

  const balance = totalBalance(debts);
  const interest = totalMonthlyInterest(debts);
  const minimums = totalMonthlyMinimums(debts);
  const apr = weightedApr(debts);
  const principalAtMin = Math.max(0, minimums - interest);
  const annualInterest = interest * 12;

  const interestShare = minimums > 0 ? interest / minimums : 0;

  const pieData = [
    { name: "Interest", value: Math.max(0, interest) },
    { name: "Principal", value: Math.max(0, principalAtMin) },
  ];
  const pieColors = ["#dc2626", "#10b981"];

  const ranked = [...debts].sort((a, b) => b.apr - a.apr);
  const maxInterest = Math.max(...ranked.map(monthlyInterest), 1);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">
            Dashboard
          </h2>
          <p className="mt-2 text-base leading-relaxed text-ink-muted">
            A snapshot of what you owe, what it costs to hold, and which
            balances are costing the most.
          </p>
        </div>
        <Button onClick={onGoScenarios}>Compare payoff scenarios →</Button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <Stat
            label="Total debt"
            value={fmtCurrency(balance)}
            sublabel={`across ${debts.length} ${debts.length === 1 ? "balance" : "balances"}`}
          />
        </Card>
        <Card>
          <Stat
            label="Interest / mo"
            value={fmtCurrency(interest, { cents: true })}
            sublabel={`${fmtCurrency(annualInterest)} / year`}
            tone="negative"
          />
        </Card>
        <Card>
          <Stat
            label="Minimum payment"
            value={fmtCurrency(minimums)}
            sublabel="all debts combined"
          />
        </Card>
        <Card>
          <Stat
            label="Weighted APR"
            value={fmtPercent(apr, 2)}
            sublabel="balance-weighted average"
          />
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Where your money goes"
            subtitle="Every minimum payment you make splits into interest (gone forever) and principal (what actually pays down debt)."
          />
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center lg:flex-col lg:items-stretch xl:flex-row xl:items-center">
            <div className="h-44 w-44 shrink-0 sm:h-48 sm:w-48 xl:h-44 xl:w-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    innerRadius="55%"
                    outerRadius="85%"
                    startAngle={90}
                    endAngle={-270}
                    stroke="#fff"
                    strokeWidth={2}
                  >
                    {pieData.map((_, idx) => (
                      <Cell key={idx} fill={pieColors[idx]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number) =>
                      fmtCurrency(v, { cents: true })
                    }
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #e2e8f0",
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <LegendRow
                color={pieColors[0]}
                label="Interest"
                value={fmtCurrency(interest, { cents: true })}
                pct={interestShare}
              />
              <LegendRow
                color={pieColors[1]}
                label="Principal"
                value={fmtCurrency(principalAtMin, { cents: true })}
                pct={minimums > 0 ? principalAtMin / minimums : 0}
              />
              <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                Of your <b>{fmtCurrency(minimums)}</b> monthly payment,
                <b className="text-negative">
                  {" "}
                  {fmtCurrency(interest, { cents: true })}
                </b>{" "}
                never touches what you owe — it's pure interest.
              </p>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader
            title="Debts ranked by APR"
            subtitle="Highest-APR balances are costing the most per dollar. That's where extra payments earn the biggest return."
          />
          <ul className="flex flex-col gap-3">
            {ranked.map((d) => {
              const mInt = monthlyInterest(d);
              const widthPct = (mInt / maxInterest) * 100;
              return (
                <li key={d.id}>
                  <div className="flex items-center justify-between text-sm">
                    <div className="min-w-0 flex-1 truncate font-medium text-ink">
                      {d.name}
                    </div>
                    <div className="ml-3 flex items-center gap-4 text-right">
                      <span className="tnum text-xs text-ink-muted">
                        {fmtCurrency(d.balance)}
                      </span>
                      <span className="tnum w-14 text-xs font-bold text-black">
                        {d.apr.toFixed(2)}%
                      </span>
                      <span className="tnum w-20 text-right text-sm font-semibold text-negative">
                        {fmtCurrency(mInt, { cents: true })}
                      </span>
                    </div>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-negative"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      {interestShare >= 0.5 && (
        <InfoCallout tone="alert" title="Most of your payment is interest">
          Over {(interestShare * 100).toFixed(0)}% of every minimum payment is
          going to interest right now. Even a small extra payment pushed at
          your highest-APR debt can meaningfully shorten your payoff — run the
          avalanche scenario to see by how much.
        </InfoCallout>
      )}

      {debts.some((d) => d.minPayment <= monthlyInterest(d) + 0.005) && (
        <InfoCallout tone="alert" title="A debt is stalling">
          One or more balances have a minimum payment that doesn't exceed
          their monthly interest. At the current minimum, those debts will
          never pay off — the balance grows or stays flat. Raising the
          payment, even slightly, unsticks them.
        </InfoCallout>
      )}
    </div>
  );
}

function LegendRow({
  color,
  label,
  value,
  pct,
}: {
  color: string;
  label: string;
  value: string;
  pct: number;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <span
          className="inline-block h-3 w-3 rounded-sm"
          style={{ background: color }}
        />
        <span className="text-sm font-medium text-ink">{label}</span>
      </div>
      <div className="flex items-baseline gap-2 text-right">
        <span className="tnum text-sm font-semibold text-ink">{value}</span>
        <span className="tnum text-xs text-ink-muted">
          {(pct * 100).toFixed(0)}%
        </span>
      </div>
    </div>
  );
}
