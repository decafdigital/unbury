type Tab<T extends string> = {
  id: T;
  label: string;
  disabled?: boolean;
};

type Props<T extends string> = {
  tabs: Tab<T>[];
  value: T;
  onChange: (id: T) => void;
  className?: string;
};

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  className = "",
}: Props<T>) {
  return (
    <div
      role="tablist"
      className={`flex flex-wrap gap-1 rounded-xl border border-line bg-white p-1 shadow-card ${className}`}
    >
      {tabs.map((tab) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active}
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors duration-150 focus-ring disabled:cursor-not-allowed disabled:opacity-40 ${
              active
                ? "bg-brand-600 text-white shadow-button"
                : "text-ink-soft hover:bg-paper hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
