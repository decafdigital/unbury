export type Debt = {
  id: string;
  name: string;
  /** Current principal balance in dollars */
  balance: number;
  /** Annual percentage rate as a percentage, e.g. 24.99 = 24.99% */
  apr: number;
  /** Required monthly minimum payment in dollars */
  minPayment: number;
};

export type Consolidation = {
  /** Loan principal, default to total debt if user doesn't override */
  loanAmount: number;
  /** Annual percentage rate, e.g. 9.99 */
  loanApr: number;
  /** Term in months (e.g. 36, 48, 60) */
  loanTermMonths: number;
};

export type AppState = {
  debts: Debt[];
  /** Extra monthly amount available beyond current minimums, for avalanche */
  extraPayment: number;
  consolidation: Consolidation;
  /** Which scenario the user has chosen for their action plan */
  chosenScenario: ScenarioKey;
};

export type ScenarioKey = "current" | "avalanche" | "consolidation";

/** One row of an amortization schedule — one month, one debt. */
export type ScheduleEntry = {
  month: number; // 1-indexed
  debtId: string;
  startingBalance: number;
  interest: number;
  payment: number;
  principal: number;
  endingBalance: number;
};

/** Aggregate result for a scenario (current or avalanche). */
export type PayoffResult = {
  months: number;
  totalInterest: number;
  totalPaid: number;
  schedule: ScheduleEntry[];
  /** Total monthly payment at month 1 (minimums + extra, if any) */
  firstMonthPayment: number;
  /** Order in which debts are retired (by debtId), earliest first */
  payoffOrder: string[];
  /** True if any debt would never pay off at the given payment level */
  stalled: boolean;
  /** Debts that are stalling (min payment <= monthly interest) */
  stalledDebtIds: string[];
};

export type ConsolidationResult = {
  monthlyPayment: number;
  months: number;
  totalInterest: number;
  totalPaid: number;
  apr: number;
  loanAmount: number;
};
