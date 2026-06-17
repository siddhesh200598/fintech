"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Transaction } from "@/lib/types";
import { formatINR, formatDate } from "@/lib/format";
import { categoryColor } from "@/lib/categories";

export default function TransactionTable({
  transactions,
  onEdit,
  onDelete,
}: {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-surface p-10 text-center">
        <p className="text-sm font-medium text-ink">No transactions here</p>
        <p className="mt-1 text-sm text-muted">
          Use Smart Add above, or add one manually to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Description</th>
            <th className="hidden px-4 py-3 font-medium sm:table-cell">
              Category
            </th>
            <th className="hidden px-4 py-3 font-medium md:table-cell">
              Merchant
            </th>
            <th className="px-4 py-3 text-right font-medium">Amount</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr
              key={t.id}
              className="border-b border-line/70 last:border-0 hover:bg-canvas/60"
            >
              <td className="tnum whitespace-nowrap px-4 py-3 text-muted">
                {formatDate(t.date)}
              </td>
              <td className="px-4 py-3 font-medium text-ink">
                {t.description || "—"}
              </td>
              <td className="hidden px-4 py-3 sm:table-cell">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: `${categoryColor(t.category)}1A`,
                    color: categoryColor(t.category),
                  }}
                >
                  {t.category}
                </span>
              </td>
              <td className="hidden px-4 py-3 text-muted md:table-cell">
                {t.merchant || "—"}
              </td>
              <td
                className={`tnum whitespace-nowrap px-4 py-3 text-right font-semibold ${
                  t.type === "income" ? "text-brand" : "text-expense"
                }`}
              >
                {t.type === "income" ? "+" : "−"}
                {formatINR(t.amount)}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => onEdit(t)}
                    aria-label="Edit transaction"
                    className="rounded-lg p-1.5 text-muted transition hover:bg-canvas hover:text-ink"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => onDelete(t.id)}
                    aria-label="Delete transaction"
                    className="rounded-lg p-1.5 text-muted transition hover:bg-expense/10 hover:text-expense"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
