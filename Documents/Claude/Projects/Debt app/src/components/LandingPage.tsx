import type { LucideIcon } from "lucide-react";
import { Merge, Mountain, TrendingDown, Turtle } from "lucide-react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

type Props = {
  hasDebts: boolean;
  onStart: () => void;
  onGoDashboard: () => void;
};

export function LandingPage({ hasDebts, onStart, onGoDashboard }: Props) {
  return (
    <div className="flex flex-col gap-16 md:gap-20">
      <section className="grid items-center gap-10 md:grid-cols-5 md:gap-12">
        <div className="md:col-span-3">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-500" />
            A clear-eyed debt planner
          </p>
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-ink md:text-6xl">
            Find your fastest path to debt-free.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft md:text-xl">
            Unbury shows the monthly interest draining from each of your
            balances, compares three realistic payoff plans side by side, and
            builds a month-by-month schedule you can follow.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {hasDebts ? (
              <>
                <Button size="lg" onClick={onGoDashboard}>
                  Open dashboard
                </Button>
                <Button size="lg" variant="secondary" onClick={onStart}>
                  Edit debts
                </Button>
              </>
            ) : (
              <Button size="lg" onClick={onStart}>
                Get started — add your first debt
              </Button>
            )}
          </div>
          <p className="mt-5 text-sm text-ink-muted">
            Free · works offline · nothing leaves your device
          </p>
        </div>

        <aside className="md:col-span-2">
          <div className="rounded-2xl border border-line bg-white p-7 shadow-lift md:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <TrendingDown
                  className="h-5 w-5"
                  strokeWidth={2.25}
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-ink">
                Your debts today
              </h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              Example: 3 credit cards carrying a combined balance.
            </p>

            <dl className="mt-7 divide-y divide-[#e5e7eb]">
              <div className="flex items-baseline justify-between gap-4 py-4">
                <dt className="text-base text-ink-soft">Total balance</dt>
                <dd className="tnum text-xl font-bold text-ink">$22,700</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-4">
                <dt className="text-base text-ink-soft">Monthly interest</dt>
                <dd className="tnum text-xl font-bold text-[#ea580c]">$247</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-4">
                <dt className="text-base text-ink-soft">Yearly interest</dt>
                <dd className="tnum text-xl font-bold text-ink">$2,964</dd>
              </div>
            </dl>

            <div className="mt-6 flex w-full items-center gap-3 rounded-lg border-2 border-[#c2410c] bg-white px-4 py-3.5">
              <svg
                className="h-6 w-6 shrink-0 text-[#ea580c]"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.485 2.495c.664-1.327 2.366-1.327 3.03 0l6.28 12.56c.612 1.223-.283 2.695-1.515 2.695H3.72c-1.232 0-2.127-1.472-1.515-2.694L8.485 2.495ZM10 6a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V7a1 1 0 0 1 1-1Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                />
              </svg>
              <p className="whitespace-nowrap text-base text-ink">
                That's <b className="tnum font-bold">$2,964/year</b> just
                standing still.
              </p>
            </div>
          </div>
        </aside>
      </section>

      <section>
        <h2 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">
          How it works
        </h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3 md:gap-6">
          <FeatureCard
            step="1"
            title="Add your debts"
            body="Name, balance, APR, and minimum payment for each card or loan. Data lives in your browser — no login, no cloud."
          />
          <FeatureCard
            step="2"
            title="See where money goes"
            body="Per-debt interest breakdown, APR ranking, and a clear view of how much of every minimum payment is just renting money."
          />
          <FeatureCard
            step="3"
            title="Compare three paths"
            body="Current minimums vs. an avalanche plan with extra payments vs. a consolidation loan — side by side."
          />
        </div>
      </section>

      <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden bg-ink py-20 md:py-28">
        {/* Radial teal glow from top-center */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 80% 55% at 50% 0%, rgba(16, 185, 129, 0.18), transparent 65%)",
          }}
        />
        {/* Soft blurred accent shapes */}
        <div
          className="pointer-events-none absolute -left-24 top-1/3 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-brand-400/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-6xl px-4 md:px-6">
          <div className="text-center">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-300">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-400" />
              The strategies
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
              Three paths to debt-free
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-slate-300">
              Compare strategies side by side.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:mt-14 md:grid-cols-3 md:gap-6">
            <ScenarioExplainer
              icon={Turtle}
              title="Current path"
              body="Keep paying the minimums on each debt, one at a time, until each clears. The status quo — simple, but the slowest and most expensive. Unbury uses this as the baseline every other plan is measured against."
              bgClass="bg-slate-800 border border-white/10 shadow-xl shadow-black/40 hover:border-white/20"
              badgeClass="bg-brand-600"
            />
            <ScenarioExplainer
              icon={Mountain}
              title="Avalanche method"
              body="Pay minimums on everything, then throw every extra dollar at your highest-APR debt. When it's gone, roll that entire payment into the next-highest. Mathematically the cheapest path — you starve the most expensive interest first."
              bgClass="bg-slate-800 border border-white/10 shadow-xl shadow-black/40 hover:border-white/20"
              badgeClass="bg-brand-600"
            />
            <ScenarioExplainer
              icon={Merge}
              title="Consolidation loan"
              body="Replace several high-APR balances with one fixed-rate loan. Lower blended rate, one predictable payment. Only a win if the new APR is meaningfully lower than your weighted average — Unbury shows you exactly whether it is."
              bgClass="bg-slate-800 border border-white/10 shadow-xl shadow-black/40 hover:border-white/20"
              badgeClass="bg-brand-600"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  step,
  title,
  body,
}: {
  step: string;
  title: string;
  body: string;
}) {
  return (
    <Card>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-base font-bold text-white shadow-button">
        {step}
      </div>
      <h3 className="mt-5 text-lg font-bold tracking-tight text-ink">
        {title}
      </h3>
      <p className="mt-2.5 text-base leading-relaxed text-ink-soft">{body}</p>
    </Card>
  );
}

function ScenarioExplainer({
  icon: Icon,
  title,
  body,
  bgClass,
  badgeClass,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  /** Tailwind background utility for the card (arbitrary value class is fine) */
  bgClass: string;
  /** Tailwind bg utility for the icon badge — tuned for contrast on bgClass */
  badgeClass: string;
}) {
  return (
    <div
      className={`flex flex-col rounded-2xl p-7 transition-all duration-200 hover:-translate-y-0.5 md:p-8 ${bgClass}`}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full text-white shadow-button ${badgeClass}`}
      >
        <Icon className="h-6 w-6" strokeWidth={2.25} aria-hidden="true" />
      </div>
      <h3 className="mt-6 text-xl font-bold tracking-tight text-white">
        {title}
      </h3>
      <p className="mt-3 text-base leading-relaxed text-slate-300">{body}</p>
    </div>
  );
}
