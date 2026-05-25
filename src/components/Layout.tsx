import type { ReactNode } from "react";

type View = "home" | "debts" | "dashboard" | "scenarios" | "plan" | "about";

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
  { id: "about", label: "About", needsDebts: false },
];

export function Layout({ view, onChange, debtsEntered, children }: Props) {
  // On the home view the hero is full-bleed yellow — extend that yellow up
  // behind the nav so the page reads as one continuous bold panel from the
  // top of the browser through the hero.
  const onHome = view === "home";
  const headerBg = onHome ? "bg-brand-500" : "bg-white";
  const headerBorder = onHome ? "" : "border-b-2 border-black";
  const activePill = onHome
    ? "bg-black text-brand-500"
    : "bg-brand-500 text-black";
  const inactivePill = onHome
    ? "text-black hover:bg-black/10"
    : "text-black hover:bg-brand-100";
  const mobileNavDivider = onHome
    ? "border-t-2 border-black/20"
    : "border-t border-black/10";
  // Interior pages sit on a light gray so the white cards (with chunky black
  // borders and offset shadows) visually pop. Home keeps its bold yellow
  // hero rhythm.
  const pageBg = onHome ? "bg-paper" : "bg-paperSoft";

  return (
    <div className={`min-h-screen ${pageBg}`}>
      <header className={`sticky top-0 z-20 ${headerBorder} ${headerBg}`}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4 md:px-6">
          <button
            onClick={() => onChange("home")}
            className="flex items-center gap-2.5 rounded-md transition-opacity duration-150 hover:opacity-80 focus-ring"
            aria-label="Unbury home"
          >
            <Logo />
            <span className="text-lg font-extrabold tracking-tight text-black">
              Unbury
            </span>
          </button>
          <nav className="hidden md:block">
            <ul className="flex items-center gap-2 lg:gap-3">
              {navItems.map((item) => {
                const disabled = item.needsDebts && !debtsEntered;
                const active = view === item.id;
                return (
                  <li key={item.id}>
                    <button
                      disabled={disabled}
                      onClick={() => onChange(item.id)}
                      className={`relative rounded-md px-4 py-2 text-sm font-bold transition-colors duration-150 focus-ring disabled:cursor-not-allowed disabled:text-black/30 ${
                        active ? activePill : inactivePill
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
        <div className={`${mobileNavDivider} md:hidden`}>
          <nav className="mx-auto max-w-6xl overflow-x-auto px-3">
            <ul className="flex min-w-max items-center gap-2 py-2">
              {navItems.map((item) => {
                const disabled = item.needsDebts && !debtsEntered;
                const active = view === item.id;
                return (
                  <li key={item.id}>
                    <button
                      disabled={disabled}
                      onClick={() => onChange(item.id)}
                      className={`whitespace-nowrap rounded-md px-3.5 py-1.5 text-sm font-bold transition-colors duration-150 focus-ring disabled:cursor-not-allowed disabled:text-black/30 ${
                        active ? activePill : inactivePill
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
      <main className="mx-auto max-w-6xl px-8 py-8 md:px-6 md:py-14">
        {children}
      </main>
      <footer className="border-t-2 border-black bg-black">
        <div className="mx-auto max-w-6xl px-8 py-7 text-xs font-semibold leading-relaxed text-brand-500 md:px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-center">
            <span>
              Contact:{" "}
              <a
                href="mailto:hello@unbury.io"
                className="underline underline-offset-4 transition-colors duration-150 hover:text-white focus-ring"
              >
                hello@unbury.io
              </a>
            </span>
            <span aria-hidden="true" className="text-brand-500/40">
              |
            </span>
            <span>Privacy: All data stays in your browser</span>
            <span aria-hidden="true" className="text-brand-500/40">
              |
            </span>
            <span>Not financial advice</span>
            <span aria-hidden="true" className="text-brand-500/40">
              |
            </span>
            <span>&copy; 2026 Unbury</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Logo() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
      <rect width="32" height="32" rx="7" fill="#000000" />
      <path
        d="M7 22 L13 14 L17 18 L25 8"
        stroke="#ffed00"
        strokeWidth="2.75"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="25" cy="8" r="2.25" fill="#ffed00" />
    </svg>
  );
}
