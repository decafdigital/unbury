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
          Add every credit card, personal loan, or line of credit you're
          carrying a balance on. You can edit or remove any of them later.
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
            placeholder="Chase Sapphire"
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

  return (
    <tr className="border-t border-line hover:bg-paper">
      <td className="px-5 py-3 font-medium text-ink">
        {debt.name}
        {stalled && (
          <span
            title="Minimum payment doesn't exceed monthly interest — this debt won't pay off at the minimum."
            className="ml-2 inline-flex items-center rounded-full bg-cautionSoft px-2 py-0.5 text-xs font-medium text-caution"
          >
            Stalling
          </span>
        )}
      </td>
      <td className="tnum px-5 py-3 text-right">{fmtCurrency(debt.balance)}</td>
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
  );
}
