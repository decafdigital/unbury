import type { ReactNode } from "react";

type View = "home" | "debts" | "dashboard" | "scenarios" | "plan";

type Props = {
  view: View;
  onChange: (v: View) => void;
  debtsEntered: boolean;
  children: ReactNode;
};

const navItems: Array<{ id: View; label: string; needsDebts: boolean }> = [
  { id: "home", label: "Overview", needsDebts: false },
  { id: "debts", label: "Your Debts", needsDebts: false },
  { id: "dashboard", label: "Dashboard", needsDebts: true },
  { id: "scenarios", label: "Scenarios", needsDebts: true },
  { id: "plan", label: "Action Plan", needsDebts: true },
];

export function Layout({ view, onChange, debtsEntered, children }: Props) {
  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-20 border-b border-line bg-white shadow-nav">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <button
            onClick={() => onChange("home")}
            className="flex items-center gap-2.5 rounded-md transition-opacity duration-150 hover:opacity-80 focus-ring"
            aria-label="Unbury home"
          >
            <Logo />
            <span className="text-lg font-bold tracking-tight text-ink">
              Unbury
            </span>
          </button>
          <nav className="hidden md:block">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => {
                const disabled = item.needsDebts && !debtsEntered;
                const active = view === item.id;
                return (
                  <li key={item.id}>
                    <button
                      disabled={disabled}
                      onClick={() => onChange(item.id)}
                      className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors duration-150 focus-ring disabled:cursor-not-allowed disabled:text-slate-300 ${
                        active
                          ? "bg-brand-50 text-brand-700"
                          : "text-ink-soft hover:bg-paper hover:text-ink"
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
        <div className="border-t border-line md:hidden">
          <nav className="mx-auto max-w-6xl overflow-x-auto px-3">
            <ul className="flex min-w-max items-center gap-1 py-2">
              {navItems.map((item) => {
                const disabled = item.needsDebts && !debtsEntered;
                const active = view === item.id;
                return (
                  <li key={item.id}>
                    <button
                      disabled={disabled}
                      onClick={() => onChange(item.id)}
                      className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors duration-150 focus-ring disabled:cursor-not-allowed disabled:text-slate-300 ${
                        active
                          ? "bg-brand-50 text-brand-700"
                          : "text-ink-soft hover:bg-paper hover:text-ink"
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-14">
        {children}
      </main>
      <footer className="border-t border-line bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 text-xs leading-relaxed text-ink-muted md:px-6">
          <p>
            <span className="font-semibold text-ink-soft">Unbury</span> is a
            planning tool, not financial advice. All calculations run locally
            in your browser — nothing is sent to a server. Your numbers are
            stored in this device's localStorage.
          </p>
        </div>
      </footer>
    </div>
  );
}

function Logo() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#0f172a" />
      <path
        d="M7 22 L13 14 L17 18 L25 8"
        stroke="#10b981"
        strokeWidth="2.75"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="25" cy="8" r="2.25" fill="#10b981" />
    </svg>
  );
}
