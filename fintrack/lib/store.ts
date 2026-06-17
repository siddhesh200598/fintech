import { Transaction } from "./types";

// Single source of persistence. Swap the body of these four functions for a
// real database (e.g. Postgres / Upstash) and nothing else in the app changes.
const KEY = "fintrack.transactions.v1";

export function loadTransactions(): Transaction[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null) return seed(); // first run → demo data
    return JSON.parse(raw) as Transaction[];
  } catch {
    return [];
  }
}

export function saveTransactions(txs: Transaction[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(txs));
}

function seed(): Transaction[] {
  const d = (offsetDays: number) => {
    const x = new Date();
    x.setDate(x.getDate() - offsetDays);
    return x.toISOString().slice(0, 10);
  };
  return [
    { id: crypto.randomUUID(), type: "income", amount: 95000, category: "Salary", merchant: "Acme Corp", date: d(20), description: "Monthly salary" },
    { id: crypto.randomUUID(), type: "expense", amount: 18500, category: "Bills", merchant: "HDFC Home Loan", date: d(18), description: "EMI" },
    { id: crypto.randomUUID(), type: "expense", amount: 4200, category: "Groceries", merchant: "DMart", date: d(12), description: "Weekly groceries" },
    { id: crypto.randomUUID(), type: "expense", amount: 1299, category: "Entertainment", merchant: "Netflix + Spotify", date: d(10), description: "Subscriptions" },
    { id: crypto.randomUUID(), type: "expense", amount: 2650, category: "Food", merchant: "Zomato", date: d(7), description: "Dinner orders" },
    { id: crypto.randomUUID(), type: "expense", amount: 3100, category: "Transport", merchant: "Uber", date: d(5), description: "Commute" },
    { id: crypto.randomUUID(), type: "expense", amount: 7499, category: "Shopping", merchant: "Amazon", date: d(3), description: "Headphones" },
    { id: crypto.randomUUID(), type: "income", amount: 12000, category: "Investment", merchant: "Dividend payout", date: d(2), description: "Equity dividend" },
  ];
}
