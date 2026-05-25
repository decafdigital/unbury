# Unbury

**Find your fastest path to debt-free.**

A clear-eyed debt payoff calculator. See exactly what your debt is costing you each month, compare three realistic payoff paths side by side, and get a month-by-month plan you can follow.

Everything runs in the browser. No accounts, no cloud, no telemetry. Your numbers live in `localStorage` on your device.

## Features

- **Debt input** — add/edit/remove any number of debts (name, balance, APR, minimum payment)
- **Dashboard** — total debt, per-debt monthly interest, APR ranking, and a "where your money goes" pie chart that shows how much of your minimum payment is pure interest
- **Three scenarios, side by side**
  - **A. Current path** — what happens if you keep paying minimums
  - **B. Avalanche** — minimums + an extra amount, directed at the highest-APR debt first (with payments rolling forward as debts clear)
  - **C. Consolidation loan** — one fixed-rate loan, compared against the current path
- **Action plan** — chosen-scenario payoff order, per-debt monthly allocation, and a full month-by-month schedule
- **Stalling detection** — flags debts where the minimum payment doesn't exceed monthly interest (these never pay off at the minimum)

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default `http://localhost:5173`).

## Scripts

```bash
npm run dev        # start the dev server with hot reload
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build locally
npm run typecheck  # tsc --noEmit
```

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Recharts (pie + line charts)

No backend. All financial math is in `src/lib/calculations.ts` — amortization, avalanche with rolling payments, and the standard fixed-rate loan formula. Pure functions, straightforward to test or extend.

## Project structure

```
src/
  App.tsx                  global state + view routing + localStorage sync
  main.tsx                 React entry
  index.css                Tailwind + a few base styles
  types.ts                 Debt, AppState, PayoffResult, etc.
  lib/
    calculations.ts        simulateCurrentPath, simulateAvalanche,
                           simulateConsolidation, cumulativeSeries, etc.
    format.ts              currency / percent / months formatters
    storage.ts             localStorage load/save/clear
  components/
    Layout.tsx             header nav + footer shell
    LandingPage.tsx        explainer + CTA
    DebtForm.tsx           add/edit/remove debts
    Dashboard.tsx          totals, interest breakdown, pie chart, APR ranking
    Scenarios.tsx          A/B/C side-by-side + balance-over-time chart
    ActionPlan.tsx         payoff order + month-by-month schedule
    ui/                    Button, Card, Input, Stat, Tabs, InfoCallout
```

## A note on the math

- **Monthly interest:** `balance * APR / 1200` (standard compounding approximation — banks typically use the same for credit cards)
- **Avalanche:** each month, the budget is `(sum of all minimums) + extra`. Minimums go first, remainder goes to the highest-APR debt that still has a balance. When a debt clears, its minimum joins the pool — that's the "snowball-the-avalanche" effect
- **Consolidation:** standard amortization — `M = P·r·(1+r)^n / ((1+r)^n − 1)`, where `r = APR/12`

Simulations are capped at 600 months (50 years) to guarantee termination.

## Not financial advice

This is a planning tool. Your real statements, promotional rates, fees, and lender terms can differ from the model. Verify any decision against your actual account terms before acting on it.
