import type { LucideIcon } from "lucide-react";
import { Merge, Mountain, TrendingDown, Turtle } from "lucide-react";
import { Button } from "./ui/Button";

type Props = {
  hasDebts: boolean;
  onStart: () => void;
  onGoDashboard: () => void;
};

export function LandingPage({ hasDebts, onStart, onGoDashboard }: Props) {
  return (
    <div className="flex flex-col gap-16 md:gap-24">
      {/* HERO — full-bleed yellow, fills most of the viewport on desktop so the
          bold yellow panel reads as the whole opening frame, not a banner. */}
      <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mt-8 flex w-screen items-center overflow-hidden border-b-2 border-black bg-brand-500 py-14 md:-mt-14 md:min-h-[calc(100vh-72px)] md:py-20">
        <div className="relative mx-auto w-full max-w-6xl px-8 md:px-6">
          <div className="grid items-center gap-10 md:grid-cols-5 md:gap-12">
            <div className="md:col-span-3">
              <p className="mb-5 inline-flex items-center gap-2 rounded-md border-2 border-black bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-black">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-black" />
                A clear-eyed debt planner
              </p>
              <h1 className="text-4xl font-black leading-[0.95] tracking-tight text-black sm:text-5xl md:text-7xl">
                Find your fastest path out of credit card debt.
              </h1>
              <p className="mt-6 max-w-2xl text-lg font-semibold leading-relaxed text-black md:text-xl">
                Unbury shows the monthly interest draining from each of your
                credit cards, compares three realistic payoff strategies
                side-by-side, and builds a month-by-month schedule you can
                follow.
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
                    Get started — add your first credit card
                  </Button>
                )}
              </div>
              <p className="mt-5 text-sm font-semibold text-black/70">
                Free · works offline · nothing leaves your device
              </p>
            </div>

            <aside className="md:col-span-2">
              <div className="rounded-2xl border-2 border-black bg-white p-7 shadow-[6px_6px_0_0_rgba(0,0,0,1)] md:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-black bg-brand-500 text-black">
                    <TrendingDown
                      className="h-5 w-5"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-xl font-extrabold tracking-tight text-black">
                    Your debts today
                  </h3>
                </div>
                <p className="mt-3 text-sm font-semibold leading-relaxed text-ink-muted">
                  Example: 3 credit cards at 18–24% APR.
                </p>

                <dl className="mt-7 divide-y-2 divide-black/10">
                  <div className="flex items-baseline justify-between gap-4 py-4">
                    <dt className="text-base font-semibold text-black">
                      Total balance
                    </dt>
                    <dd className="tnum text-xl font-black text-black">
                      $22,700
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 py-4">
                    <dt className="text-base font-semibold text-black">
                      Monthly interest
                    </dt>
                    <dd className="tnum text-xl font-black text-negative">
                      $247
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 py-4">
                    <dt className="text-base font-semibold text-black">
                      Yearly interest
                    </dt>
                    <dd className="tnum text-xl font-black text-black">
                      $2,964
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 flex w-full items-start gap-3 rounded-lg border-2 border-black bg-negativeSoft px-4 py-3.5">
                  <svg
                    className="mt-0.5 h-5 w-5 shrink-0 text-negative"
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
                  <p className="min-w-0 flex-1 text-sm font-bold leading-snug text-black md:text-base">
                    That's <span className="tnum">$2,964/year</span> just
                    standing still.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — full-bleed light gray for rhythm between yellow + white */}
      <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mt-16 w-screen overflow-hidden border-b-2 border-black bg-paperSoft py-20 md:-mt-24 md:py-28">
        <div className="relative mx-auto max-w-6xl px-8 md:px-6">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-md border-2 border-black bg-brand-500 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-black">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-black" />
              How it works
            </p>
            <h2 className="text-3xl font-black tracking-tight text-black md:text-5xl">
              Three steps. No spreadsheet required.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:mt-12 md:grid-cols-3 md:gap-6">
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
        </div>
      </section>

      {/* THREE PATHS — full-bleed white panel; no bottom border so it blends
          straight into the black footer below. */}
      <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mt-16 mb-[-2rem] w-screen overflow-hidden bg-white py-20 md:-mt-24 md:mb-[-3.5rem] md:py-28">
        <div className="relative mx-auto max-w-6xl px-8 md:px-6">
          <div className="text-center">
            <p className="mb-4 inline-flex items-center gap-2 rounded-md border-2 border-black bg-brand-500 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-black">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-black" />
              The strategies
            </p>
            <h2 className="text-4xl font-black tracking-tight text-black md:text-6xl">
              Three paths to debt-free
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg font-semibold leading-relaxed text-ink-soft">
              Compare strategies side by side.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:mt-14 md:grid-cols-3 md:gap-7">
            <ScenarioExplainer
              icon={Turtle}
              title="Current path"
              body="Keep paying the minimums on each debt, one at a time, until each clears. The status quo — simple, but the slowest and most expensive. Unbury uses this as the baseline every other plan is measured against."
              variant="white"
            />
            <ScenarioExplainer
              icon={Mountain}
              title="Avalanche method"
              body="Pay minimums on everything, then throw every extra dollar at your highest-APR debt. When it's gone, roll that entire payment into the next-highest. Mathematically the cheapest path — you starve the most expensive interest first."
              variant="black"
            />
            <ScenarioExplainer
              icon={Merge}
              title="Consolidation loan"
              body="Replace several high-APR balances with one fixed-rate loan. Lower blended rate, one predictable payment. Only a win if the new APR is meaningfully lower than your weighted average — Unbury shows you exactly whether it is."
              variant="yellow"
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
    <div className="rounded-2xl border-2 border-black bg-white p-7 shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-transform duration-200 hover:-translate-y-0.5 md:p-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-black bg-brand-500 text-lg font-black text-black">
        {step}
      </div>
      <h3 className="mt-6 text-xl font-black tracking-tight text-black">
        {title}
      </h3>
      <p className="mt-3 text-base font-medium leading-relaxed text-ink-soft">
        {body}
      </p>
    </div>
  );
}

type ScenarioVariant = "white" | "black" | "yellow";

function ScenarioExplainer({
  icon: Icon,
  title,
  body,
  variant,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  variant: ScenarioVariant;
}) {
  const wrapClasses = {
    white: "bg-white text-black",
    black: "bg-black text-brand-500",
    yellow: "bg-brand-500 text-black",
  }[variant];
  const titleColor = {
    white: "text-black",
    black: "text-brand-500",
    yellow: "text-black",
  }[variant];
  const bodyColor = {
    white: "text-ink-soft",
    black: "text-brand-500/85",
    yellow: "text-black/80",
  }[variant];
  const badgeClasses = {
    white: "bg-brand-500 text-black border-2 border-black",
    black: "bg-brand-500 text-black border-2 border-brand-500",
    yellow: "bg-black text-brand-500 border-2 border-black",
  }[variant];

  return (
    <div
      className={`flex flex-col rounded-2xl border-2 border-black p-7 shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-transform duration-200 hover:-translate-y-0.5 md:p-8 ${wrapClasses}`}
    >
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-full ${badgeClasses}`}
      >
        <Icon className="h-7 w-7" strokeWidth={2.5} aria-hidden="true" />
      </div>
      <h3
        className={`mt-6 text-2xl font-black tracking-tight ${titleColor}`}
      >
        {title}
      </h3>
      <p className={`mt-3 text-base font-medium leading-relaxed ${bodyColor}`}>
        {body}
      </p>
    </div>
  );
}
