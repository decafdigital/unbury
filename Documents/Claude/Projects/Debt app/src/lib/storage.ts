import type { AppState } from "../types";

const KEY = "debt-optimizer.v1";

export const defaultState: AppState = {
  debts: [],
  extraPayment: 0,
  consolidation: {
    loanAmount: 0,
    loanApr: 9.99,
    loanTermMonths: 48,
  },
  chosenScenario: "avalanche",
};

export function loadState(): AppState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      ...defaultState,
      ...parsed,
      consolidation: {
        ...defaultState.consolidation,
        ...(parsed.consolidation ?? {}),
      },
      debts: Array.isArray(parsed.debts) ? parsed.debts : [],
    };
  } catch {
    return defaultState;
  }
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // localStorage can fail in private mode / quota issues; silently ignore
  }
}

export function clearState(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
