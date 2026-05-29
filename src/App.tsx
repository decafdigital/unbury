import { useCallback, useEffect, useMemo, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { About } from "./components/About";
import { ActionPlan } from "./components/ActionPlan";
import { Dashboard } from "./components/Dashboard";
import { DebtForm } from "./components/DebtForm";
import { LandingPage } from "./components/LandingPage";
import { Layout } from "./components/Layout";
import { Scenarios } from "./components/Scenarios";
import { Button } from "./components/ui/Button";
import { clearState, defaultState, loadState, saveState } from "./lib/storage";
import type { AppState, Consolidation, Debt, ScenarioKey } from "./types";

type View = "home" | "debts" | "dashboard" | "scenarios" | "plan" | "about";

export default function App() {
  const [state, setState] = useState<AppState>(() => {
    // Defer loadState to useEffect to stay SSR-safe; default at first render.
    return defaultState;
  });
  const [hydrated, setHydrated] = useState(false);
  const [view, setView] = useState<View>("home");
  const [toast, setToast] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  // Persist on change (after hydration to avoid wiping stored state with defaults)
  useEffect(() => {
    if (!hydrated) return;
    saveState(state);
  }, [state, hydrated]);

  const debtsEntered = state.debts.length > 0;

  const handleAddDebt = useCallback((d: Debt) => {
    setState((s) => ({ ...s, debts: [...s.debts, d] }));
  }, []);

  const handleUpdateDebt = useCallback((d: Debt) => {
    setState((s) => ({
      ...s,
      debts: s.debts.map((x) => (x.id === d.id ? d : x)),
    }));
  }, []);

  const handleRemoveDebt = useCallback((id: string) => {
    setState((s) => ({ ...s, debts: s.debts.filter((d) => d.id !== id) }));
  }, []);

  const handleExtraChange = useCallback((n: number) => {
    setState((s) => ({ ...s, extraPayment: Math.max(0, n) }));
  }, []);

  const handleConsolidationChange = useCallback((c: Consolidation) => {
    setState((s) => ({ ...s, consolidation: c }));
  }, []);

  const handleChooseScenario = useCallback((k: ScenarioKey) => {
    setState((s) => ({ ...s, chosenScenario: k }));
  }, []);

  const handleReset = useCallback(() => {
    if (
      typeof window !== "undefined" &&
      !window.confirm(
        "Remove all of your saved debts and scenario settings? This cannot be undone.",
      )
    )
      return;
    clearState();
    setState(defaultState);
    // Land on the debts page so the "Add a debt" form is the immediate next
    // action, scroll to top so the form is in view, and flash a confirmation.
    setView("debts");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
    setToast("All data cleared");
  }, []);

  // Auto-dismiss the toast after a few seconds.
  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2500);
    return () => window.clearTimeout(id);
  }, [toast]);

  // Guard: if user navigates to a dependent view without debts, bounce home
  useEffect(() => {
    if (!debtsEntered && (view === "dashboard" || view === "scenarios" || view === "plan")) {
      setView("debts");
    }
  }, [debtsEntered, view]);

  const content = useMemo(() => {
    switch (view) {
      case "home":
        return (
          <LandingPage
            hasDebts={debtsEntered}
            onStart={() => setView("debts")}
            onGoDashboard={() => setView("dashboard")}
          />
        );
      case "debts":
        return (
          <DebtForm
            debts={state.debts}
            onAdd={handleAddDebt}
            onUpdate={handleUpdateDebt}
            onRemove={handleRemoveDebt}
            onContinue={() => setView("dashboard")}
          />
        );
      case "dashboard":
        return (
          <Dashboard
            debts={state.debts}
            onGoScenarios={() => setView("scenarios")}
            onGoDebts={() => setView("debts")}
          />
        );
      case "scenarios":
        return (
          <Scenarios
            debts={state.debts}
            extraPayment={state.extraPayment}
            consolidation={state.consolidation}
            chosenScenario={state.chosenScenario}
            onExtraChange={handleExtraChange}
            onConsolidationChange={handleConsolidationChange}
            onChooseScenario={handleChooseScenario}
            onGoPlan={() => setView("plan")}
          />
        );
      case "plan":
        return (
          <ActionPlan
            debts={state.debts}
            extraPayment={state.extraPayment}
            consolidation={state.consolidation}
            chosenScenario={state.chosenScenario}
            onGoScenarios={() => setView("scenarios")}
          />
        );
      case "about":
        return <About />;
    }
  }, [
    view,
    state,
    debtsEntered,
    handleAddDebt,
    handleUpdateDebt,
    handleRemoveDebt,
    handleExtraChange,
    handleConsolidationChange,
    handleChooseScenario,
  ]);

  return (
    <Layout view={view} onChange={setView} debtsEntered={debtsEntered}>
      {content}
      {debtsEntered && view !== "home" && view !== "about" && (
        <div className="mt-10 flex justify-end border-t border-line pt-6">
          <Button variant="ghost" size="sm" onClick={handleReset}>
            Reset all data
          </Button>
        </div>
      )}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed inset-x-0 bottom-8 z-50 flex justify-center px-4"
        >
          <div className="pointer-events-auto inline-flex items-center gap-2 rounded-xl border-2 border-black bg-brand-500 px-4 py-2.5 text-sm font-extrabold text-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            <svg
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-3.97-2.78a.75.75 0 1 0-1.06-1.06L9 10.12 7.03 8.16a.75.75 0 0 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.06 0l4.5-4.5Z"
              />
            </svg>
            {toast}
          </div>
        </div>
      )}
      <Analytics />
    </Layout>
  );
}
