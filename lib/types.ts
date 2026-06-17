export type TxType = "income" | "expense";

export interface Transaction {
  id: string;
  type: TxType;
  amount: number;
  category: string;
  merchant: string;
  date: string; // YYYY-MM-DD
  description: string;
}

// Shape returned by the AI parse endpoint (no id yet — user reviews first)
export type ParsedTransaction = Omit<Transaction, "id">;
