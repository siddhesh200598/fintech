"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatINR } from "@/lib/format";
import { categoryColor } from "@/lib/categories";

type Slice = { name: string; value: number };

export default function SpendingChart({ data }: { data: Slice[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const sorted = [...data].sort((a, b) => b.value - a.value);

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-card">
      <h2 className="text-sm font-semibold text-ink">Spending by category</h2>

      {total === 0 ? (
        <p className="py-12 text-center text-sm text-muted">
          No expenses yet. Add one to see the breakdown.
        </p>
      ) : (
        <div className="mt-2 flex flex-col items-center gap-4 sm:flex-row">
          <div className="relative h-48 w-48 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sorted}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={90}
                  paddingAngle={2}
                  stroke="none"
                >
                  {sorted.map((d) => (
                    <Cell key={d.name} fill={categoryColor(d.name)} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: number) => formatINR(v)}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #E4E8EA",
                    fontSize: 13,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs text-muted">Total</span>
              <span className="tnum text-base font-semibold text-ink">
                {formatINR(total)}
              </span>
            </div>
          </div>

          <ul className="w-full space-y-2">
            {sorted.slice(0, 6).map((d) => (
              <li key={d.name} className="flex items-center gap-2 text-sm">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: categoryColor(d.name) }}
                />
                <span className="text-ink">{d.name}</span>
                <span className="tnum ml-auto text-muted">
                  {formatINR(d.value)}
                </span>
                <span className="tnum w-10 text-right text-xs text-muted">
                  {((d.value / total) * 100).toFixed(0)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
