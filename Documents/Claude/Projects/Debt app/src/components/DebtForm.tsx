import { useState } from "react";
import type { Debt } from "../types";
import { makeId, monthlyInterest } from "../lib/calculations";
import { fmtCurrency } from "../lib/format";
import { Button } from "./ui/Button";
import { Card, CardHeader } from "./ui/Card";
import { Input } from "./ui/Input";
import { InfoCallout } from "./ui/InfoCallout";

type DraftDebt = {
  name: string;
  balance: string;
  apr: string;
  minPayment: string;
};

const emptyDraft: DraftDebt = {
  name: "",
  balance: "",
  apr: "",
  minPayment: "",
};

type Props = {
  debts: Debt[];
  onAdd: (d: Debt) => void;
  onUpdate: (d: Debt) => void;
  onRemove: (id: string) => void;
  onContinue: () => void;
};

export function DebtForm({
  debts,
  onAdd,
  onUpdate,
  onRemove,
  onContinue,
}: Props) {
  const [draft, setDraft] = useState<DraftDebt>(emptyDraft);
  const [errors, setErrors] = useState<Partial<Record<keyof DraftDebt, string>>>(
    {},
  );

  const handleAdd = () => {
    const nextErrors: typeof errors = {};
    if (!draft.name.trim()) nextErrors.name = "Give this debt a name";
    const balance = Number(draft.balance);
    if (!draft.balance || !Number.isFinite(balance) || balance <= 0)
      nextErrors.balance = "Must be greater than 0";
    const apr = Number(draft.apr);
    if (!draft.apr || !Number.isFinite(apr) || apr < 0 || apr > 100)
      nextErrors.apr = "Enter a rate between 0 and 100";
    const minPayment = Number(draft.minPayment);
    if (
      !draft.minPayment ||
      !Number.isFinite(minPayment) ||
      minPayment <= 0
    )
      nextErrors.minPayment = "Must be greater than 0";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onAdd({
      id: makeId(),
      name: draft.name.trim(),
      balance,
      apr,
      minPayment,
    });
    setDraft(emptyDraft);
  };

  const totalBalance = debts.reduce((s, d) => s + d.balance, 0);
  const totalMin = debts.reduce((s, d) => s + d.minPayment, 0);
  const totalInterest = debts.reduce((s, d) => s + monthlyInterest(d), 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">
          Your debts
        </h2>
        <p className="mt-2 text-base leading-relaxed text-ink-muted">
          Add your credit cards, personal loans, and other high-interest
          unsecured debt. You can edit or remove any of them later.
        </p>
      </div>

      <Card>
        <CardHeader
          title="Add a debt"
          subtitle="Find these numbers on your most recent statement."
        />
        <div className="grid gap-3 md:grid-cols-4">
          <Input
            label="Name"
            placeholder="Chase Sapphire, Discover, Amex…"
            value={draft.name}
            onChange={(e) =>
              setDraft((d) => ({ ...d, name: e.target.value }))
            }
            error={errors.name}
          />
          <Input
            label="Balance"
            type="number"
            inputMode="decimal"
            placeholder="4500"
            prefix="$"
            value={draft.balance}
            onChange={(e) =>
              setDraft((d) => ({ ...d, balance: e.target.value }))
            }
            error={errors.balance}
          />
          <Input
            label="APR"
            type="number"
            inputMode="decimal"
            placeholder="22.99"
            suffix="%"
            value={draft.apr}
            onChange={(e) =>
              setDraft((d) => ({ ...d, apr: e.target.value }))
            }
            error={errors.apr}
          />
          <Input
            label="Min. payment"
            type="number"
            inputMode="decimal"
            placeholder="125"
            prefix="$"
            value={draft.minPayment}
            onChange={(e) =>
              setDraft((d) => ({ ...d, minPayment: e.target.value }))
            }
            error={errors.minPayment}
          />
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          <Button variant="secondary" onClick={() => setDraft(emptyDraft)}>
            Clear
          </Button>
          <Button onClick={handleAdd}>Add debt</Button>
        </div>
      </Card>

      {debts.length === 0 ? (
        <InfoCallout title="Nothing added yet">
          Your debts will appear here once you add one. Everything is saved
          locally on this device.
        </InfoCallout>
      ) : (
        <Card padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-paper">
                <tr className="text-left text-xs uppercase tracking-wide text-ink-muted">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 text-right font-medium">Balance</th>
                  <th className="px-5 py-3 text-right font-medium">APR</th>
                  <th className="px-5 py-3 text-right font-medium">
                    Min. payment
                  </th>
                  <th className="px-5 py-3 text-right font-medium">
                    Interest / mo
                  </th>
                  <th className="px-5 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {debts.map((d) => (
                  <DebtRow
                    key={d.id}
                    debt={d}
                    onUpdate={onUpdate}
                    onRemove={() => onRemove(d.id)}
                  />
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-paper text-sm">
                  <td className="px-5 py-3 font-medium text-ink">Total</td>
                  <td className="tnum px-5 py-3 text-right font-semibold text-ink">
                    {fmtCurrency(totalBalance)}
                  </td>
                  <td className="px-5 py-3"></td>
                  <td className="tnum px-5 py-3 text-right font-semibold text-ink">
                    {fmtCurrency(totalMin)}
                  </td>
                  <td className="tnum px-5 py-3 text-right font-semibold text-negative">
                    {fmtCurrency(totalInterest, { cents: true })}
                  </td>
                  <td className="px-5 py-3"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      )}

      {debts.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink-muted">
            {debts.length} {debts.length === 1 ? "debt" : "debts"} added.
            Ready to see the numbers?
          </p>
          <Button size="lg" onClick={onContinue}>
            Open dashboard →
          </Button>
        </div>
      )}
    </div>
  );
}

function DebtRow({
  debt,
  onUpdate,
  onRemove,
}: {
  debt: Debt;
  onUpdate: (d: Debt) => void;
  onRemove: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    name: debt.name,
    balance: String(debt.balance),
    apr: String(debt.apr),
    minPayment: String(debt.minPayment),
  });

  const save = () => {
    const balance = Number(draft.balance);
    const apr = Number(draft.apr);
    const minPayment = Number(draft.minPayment);
    if (
      !draft.name.trim() ||
      !Number.isFinite(balance) ||
      balance <= 0 ||
      !Number.isFinite(apr) ||
      apr < 0 ||
      !Number.isFinite(minPayment) ||
      minPayment <= 0
    )
      return;
    onUpdate({
      ...debt,
      name: draft.name.trim(),
      balance,
      apr,
      minPayment,
    });
    setEditing(false);
  };

  if (editing) {
    return (
      <tr className="border-t border-line bg-brand-50/40 align-top">
        <td className="px-5 py-3">
          <Input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
        </td>
        <td className="px-5 py-3">
          <Input
            type="number"
            prefix="$"
            value={draft.balance}
            onChange={(e) => setDraft({ ...draft, balance: e.target.value })}
          />
        </td>
        <td className="px-5 py-3">
          <Input
            type="number"
            suffix="%"
            value={draft.apr}
            onChange={(e) => setDraft({ ...draft, apr: e.target.value })}
          />
        </td>
        <td className="px-5 py-3">
          <Input
            type="number"
            prefix="$"
            value={draft.minPayment}
            onChange={(e) =>
              setDraft({ ...draft, minPayment: e.target.value })
            }
          />
        </td>
        <td className="px-5 py-3"></td>
        <td className="px-5 py-3">
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={save}>
              Save
            </Button>
          </div>
        </td>
      </tr>
    );
  }

  const interest = monthlyInterest(debt);
  const stalled = debt.minPayment <= interest + 0.005;
  const minNeeded = Math.floor(interest) + 1;
  const tooltipText = `Your minimum payment (${fmtCurrency(debt.minPayment)}) doesn't cover the monthly interest (${fmtCurrency(interest, { cents: true })}). At this rate, this debt will never be paid off. Pay at least ${fmtCurrency(minNeeded)}/month to start making progress.`;

  return (
    <>
      <tr
        className={`border-t border-line ${stalled ? "" : "hover:bg-paper"}`}
      >
        <td className="px-5 py-3 font-medium text-ink">
          {debt.name}
          {stalled && (
            <span
              title={tooltipText}
              className="ml-2 inline-flex cursor-help items-center gap-1 rounded-full border border-negative/30 bg-negativeSoft px-2 py-0.5 text-xs font-semibold text-negative"
            >
              <svg
                className="h-3 w-3 shrink-0"
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
              Trapped in debt
              <svg
                className="h-3 w-3 shrink-0 opacity-70"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm1-11a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm-1 3a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V11a1 1 0 0 1 1-1Z"
                />
              </svg>
            </span>
          )}
        </td>
        <td className="tnum px-5 py-3 text-right">
          {fmtCurrency(debt.balance)}
        </td>
        <td className="tnum px-5 py-3 text-right">{debt.apr.toFixed(2)}%</td>
        <td className="tnum px-5 py-3 text-right">
          {fmtCurrency(debt.minPayment)}
        </td>
        <td className="tnum px-5 py-3 text-right text-negative">
          {fmtCurrency(interest, { cents: true })}
        </td>
        <td className="px-5 py-3">
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>
              Edit
            </Button>
            <Button size="sm" variant="danger" onClick={onRemove}>
              Remove
            </Button>
          </div>
        </td>
      </tr>
      {stalled && (
        <tr className="border-t border-negative/20 bg-negativeSoft/50">
          <td colSpan={6} className="px-5 py-3">
            <div className="flex items-start gap-2.5 text-sm leading-relaxed text-negative">
              <svg
                className="mt-0.5 h-4 w-4 shrink-0"
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
              <p>
                Your minimum (
                <b className="tnum font-semibold">
                  {fmtCurrency(debt.minPayment)}
                </b>
                ) doesn't cover this debt's monthly interest (
                <b className="tnum font-semibold">
                  {fmtCurrency(interest, { cents: true })}
                </b>
                ). At this rate it will never pay off. Pay at least{" "}
                <b className="tnum font-bold">
                  {fmtCurrency(minNeeded)}/month
                </b>{" "}
                to start reducing this balance.
              </p>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
