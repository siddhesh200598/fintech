"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Wallet2 } from "lucide-react";
import { Transaction, ParsedTransaction } from "@/lib/types";
import { loadTransactions, saveTransactions } from "@/lib/store";
import SmartAdd from "@/components/SmartAdd";
import SummaryCards from "@/components/SummaryCards";
import SpendingChart from "@/components/SpendingChart";
import TransactionTable from "@/components/TransactionTable";
import TransactionForm from "@/components/TransactionForm";

type Filter = "all" | "income" | "expense";

export default function Page() {
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [prefill, setPrefill] = useState<Partial<ParsedTransaction> | null>(
    null
  );

  // Load once on mount (localStorage is client-only)
  useEffect(() => {
    setTxs(loadTransactions());
    setLoaded(true);
  }, []);

  // Persist on every change after the initial load
  useEffect(() => {
    if (loaded) saveTransactions(txs);
  }, [txs, loaded]);

  // ---- CRUD ----
  function handleSave(draft: Omit<Transaction, "id">) {
    if (editing) {
      setTxs((prev) =>
        prev.map((t) => (t.id === editing.id ? { ...draft, id: t.id } : t))
      );
    } else {
      setTxs((prev) => [{ ...draft, id: crypto.randomUUID() }, ...prev]);
    }
    closeModal();
  }

  function handleDelete(id: string) {
    setTxs((prev) => prev.filter((t) => t.id !== id));
  }

  function openAdd() {
    setEditing(null);
    setPrefill(null);
    setModalOpen(true);
  }

  function openEdit(tx: Transaction) {
    setEditing(tx);
    setPrefill(null);
    setModalOpen(true);
  }

  function handleAIParsed(tx: ParsedTransaction) {
    setEditing(null);
    setPrefill(tx);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
    setPrefill(null);
  }

  // ---- Derived data ----
  const totals = useMemo(() => {
    let income = 0;
    let expenses = 0;
    for (const t of txs) {
      if (t.type === "income") income += t.amount;
      else expenses += t.amount;
    }
    const balance = income - expenses;
    const savingsRate = income > 0 ? (balance / income) * 100 : 0;
    return { income, expenses, balance, savingsRate };
  }, [txs]);

  const chartData = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of txs) {
      if (t.type !== "expense") continue;
      map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
    }
    return Array.from(map, ([name, value]) => ({ name, value }));
  }, [txs]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return txs
      .filter((t) => (filter === "all" ? true : t.type === filter))
      .filter((t) =>
        q
          ? [t.description, t.merchant, t.category]
              .join(" ")
              .toLowerCase()
              .includes(q)
          : true
      )
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [txs, search, filter]);

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white">
              <Wallet2 size={18} />
            </span>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-ink">
                FinTrack
              </h1>
              <p className="text-xs text-muted">AI expense dashboard</p>
            </div>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 rounded-xl bg-ink px-3.5 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            <Plus size={16} /> Add
          </button>
        </header>

        {/* Signature AI feature */}
        <div className="mb-5">
          <SmartAdd onParsed={handleAIParsed} />
        </div>

        {/* Summary */}
        <div className="mb-5">
          <SummaryCards
            balance={totals.balance}
            income={totals.income}
            expenses={totals.expenses}
            savingsRate={totals.savingsRate}
          />
        </div>

        {/* Chart */}
        <div className="mb-5">
          <SpendingChart data={chartData} />
        </div>

        {/* Transactions */}
        <section>
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-semibold text-ink">Transactions</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search…"
                  className="w-40 rounded-xl border border-line bg-surface py-2 pl-9 pr-3 text-sm outline-none focus:border-ink/40 focus:ring-2 focus:ring-ink/10 sm:w-52"
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as Filter)}
                className="rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-ink/40"
              >
                <option value="all">All</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>

          {loaded && (
            <TransactionTable
              transactions={visible}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          )}
        </section>

        <footer className="mt-8 text-center text-xs text-muted">
          FinTrack · Next.js + Groq AI · demo data stored locally in your browser
        </footer>
      </div>

      {modalOpen && (
        <TransactionForm
          initial={editing ?? prefill}
          fromAI={!!prefill}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
    </main>
  );
}
