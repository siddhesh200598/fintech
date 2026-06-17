"use client";

import { useEffect, useState } from "react";
import { X, Sparkles } from "lucide-react";
import { Transaction, TxType } from "@/lib/types";
import { CATEGORIES } from "@/lib/categories";
import { todayISO } from "@/lib/format";

type Draft = Omit<Transaction, "id">;

const empty: Draft = {
  type: "expense",
  amount: 0,
  category: "Other",
  merchant: "",
  date: todayISO(),
  description: "",
};

export default function TransactionForm({
  initial,
  fromAI,
  onSave,
  onClose,
}: {
  initial: Partial<Draft> | null;
  fromAI: boolean;
  onSave: (draft: Draft) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<Draft>({ ...empty, ...initial });

  useEffect(() => {
    setDraft({ ...empty, ...initial });
  }, [initial]);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function handleSubmit() {
    if (!draft.amount || draft.amount <= 0) return;
    onSave({ ...draft, amount: Math.abs(Number(draft.amount)) });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-2xl bg-surface p-5 shadow-xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-ink">
            {fromAI ? "Review transaction" : "Transaction"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1 text-muted hover:bg-canvas hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>

        {fromAI && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-aiSoft px-3 py-2 text-xs text-ai">
            <Sparkles size={14} />
            Pre-filled by AI — check the details before saving.
          </div>
        )}

        {/* Type toggle */}
        <div className="mb-3 grid grid-cols-2 gap-2">
          {(["expense", "income"] as TxType[]).map((t) => (
            <button
              key={t}
              onClick={() => set("type", t)}
              className={`rounded-xl border py-2 text-sm font-medium capitalize transition ${
                draft.type === t
                  ? t === "income"
                    ? "border-brand bg-brandSoft text-brand"
                    : "border-expense bg-expense/10 text-expense"
                  : "border-line text-muted hover:bg-canvas"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <Field label="Amount (₹)">
            <input
              type="number"
              min={0}
              value={draft.amount || ""}
              onChange={(e) => set("amount", Number(e.target.value))}
              className="tnum w-full rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-ink/40 focus:ring-2 focus:ring-ink/10"
              placeholder="0"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <select
                value={draft.category}
                onChange={(e) => set("category", e.target.value)}
                className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-ink/40 focus:ring-2 focus:ring-ink/10"
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Date">
              <input
                type="date"
                value={draft.date}
                onChange={(e) => set("date", e.target.value)}
                className="w-full rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-ink/40 focus:ring-2 focus:ring-ink/10"
              />
            </Field>
          </div>

          <Field label="Merchant">
            <input
              value={draft.merchant}
              onChange={(e) => set("merchant", e.target.value)}
              className="w-full rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-ink/40 focus:ring-2 focus:ring-ink/10"
              placeholder="e.g. DMart"
            />
          </Field>

          <Field label="Description">
            <input
              value={draft.description}
              onChange={(e) => set("description", e.target.value)}
              className="w-full rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-ink/40 focus:ring-2 focus:ring-ink/10"
              placeholder="e.g. Weekly groceries"
            />
          </Field>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-line py-2.5 text-sm font-medium text-muted transition hover:bg-canvas"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!draft.amount || draft.amount <= 0}
            className="flex-1 rounded-xl bg-ink py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}
