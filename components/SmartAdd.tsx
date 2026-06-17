"use client";

import { useState } from "react";
import { Sparkles, CornerDownLeft } from "lucide-react";
import { ParsedTransaction } from "@/lib/types";

export default function SmartAdd({
  onParsed,
}: {
  onParsed: (tx: ParsedTransaction) => void;
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleParse() {
    if (text.trim().length < 3) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not read that. Try adding manually.");
      } else {
        onParsed(data as ParsedTransaction);
        setText("");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-ai/30 bg-aiSoft p-4 shadow-card">
      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-ai">
        <Sparkles size={16} />
        Smart Add
        <span className="font-normal text-muted">
          — describe it in plain words, AI fills the form
        </span>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleParse()}
          placeholder="e.g. Paid 1200 for groceries at DMart yesterday"
          className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink outline-none placeholder:text-muted/70 focus:border-ai focus:ring-2 focus:ring-ai/20"
        />
        <button
          onClick={handleParse}
          disabled={loading || text.trim().length < 3}
          className="flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-ai px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Reading…" : "Add with AI"}
          {!loading && <CornerDownLeft size={15} />}
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-expense">{error}</p>}
    </div>
  );
}
