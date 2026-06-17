# FinTrack — AI Expense Dashboard

A full-stack fintech dashboard built with Next.js: track income and expenses,
see a live spending breakdown, and add transactions in plain English with AI.

- **Frontend** — React dashboard: summary cards, a spending chart, and a
  searchable/filterable transactions table.
- **CRUD** — add, edit, and delete transactions (manual form or AI).
- **AI (Smart Add)** — type "Paid 1200 for groceries at DMart yesterday" and a
  server-side AI route parses it into a structured transaction you review
  before saving.
- **Backend** — a Next.js route handler (`/api/parse`) that calls the AI; the
  API key stays on the server.

## Run locally (≈5 minutes)

1. `npm install`
2. Get a free Groq API key at https://console.groq.com (no credit card).
3. Create `.env.local` in the project root:
   ```
   GROQ_API_KEY=your_key_here
   ```
4. `npm run dev` → open http://localhost:3000

## Deploy to Vercel (≈3 minutes)

1. Push to a GitHub repo.
2. vercel.com → New Project → import the repo.
3. Add the env var `GROQ_API_KEY`.
4. Deploy → live URL.

## Tech

Next.js (App Router, TypeScript) · Tailwind CSS · Recharts · lucide-react ·
Groq AI (Llama 3.3, JSON mode).

## Project structure

```
app/
  api/parse/route.ts     # Backend + AI (server-side)
  page.tsx               # Dashboard: state, CRUD, derived totals, filters
  layout.tsx
  globals.css
components/
  SmartAdd.tsx           # AI natural-language entry
  SummaryCards.tsx       # Balance / income / expenses / savings rate
  SpendingChart.tsx      # Donut chart by category
  TransactionTable.tsx   # List + edit/delete
  TransactionForm.tsx    # Add / edit / review-AI modal
lib/
  types.ts               # Transaction types
  categories.ts          # Category list + colors
  format.ts              # INR + date formatting
  store.ts               # Data layer (localStorage) — single swap point
```

## Notes for reviewers

- **State & CRUD** live in `app/page.tsx`; child components are presentational
  and receive data + handlers via props.
- **Persistence** uses `localStorage` for a zero-setup demo. The data layer is
  isolated in `lib/store.ts`, so swapping to a real database (Postgres, Upstash)
  only touches that one file.
- **AI reliability** — the parse route uses JSON mode and normalises the result
  (clamps amount, validates category, defaults the date) so the UI always gets
  a clean object.
- **Security** — the Groq key is read server-side in the route handler and is
  never sent to the browser.
