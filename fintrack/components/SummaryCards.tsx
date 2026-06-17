"use client";

import { ArrowDownLeft, ArrowUpRight, Wallet, PiggyBank } from "lucide-react";
import { formatINR } from "@/lib/format";

export default function SummaryCards({
  balance,
  income,
  expenses,
  savingsRate,
}: {
  balance: number;
  income: number;
  expenses: number;
  savingsRate: number;
}) {
  const cards = [
    {
      label: "Net Balance",
      value: formatINR(balance),
      icon: Wallet,
      accent: "text-ink",
      ring: "bg-ink/5 text-ink",
    },
    {
      label: "Income",
      value: formatINR(income),
      icon: ArrowDownLeft,
      accent: "text-brand",
      ring: "bg-brandSoft text-brand",
    },
    {
      label: "Expenses",
      value: formatINR(expenses),
      icon: ArrowUpRight,
      accent: "text-expense",
      ring: "bg-expense/10 text-expense",
    },
    {
      label: "Savings Rate",
      value: `${savingsRate.toFixed(0)}%`,
      icon: PiggyBank,
      accent: savingsRate >= 0 ? "text-brand" : "text-expense",
      ring: "bg-ai/10 text-ai",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-2xl border border-line bg-surface p-4 shadow-card"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">
              {c.label}
            </span>
            <span className={`rounded-lg p-1.5 ${c.ring}`}>
              <c.icon size={15} />
            </span>
          </div>
          <p className={`tnum mt-3 text-2xl font-semibold ${c.accent}`}>
            {c.value}
          </p>
        </div>
      ))}
    </div>
  );
}
