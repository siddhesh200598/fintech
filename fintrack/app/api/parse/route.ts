import { NextResponse } from "next/server";
import { CATEGORIES } from "@/lib/categories";

// Runs on the server. Turns "Paid 1200 for groceries at DMart yesterday"
// into a structured transaction the user can review before saving.
export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || text.trim().length < 3) {
      return NextResponse.json(
        { error: "Please describe a transaction." },
        { status: 400 }
      );
    }

    const today = new Date().toISOString().slice(0, 10);

    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          temperature: 0.2,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content:
                `You extract ONE financial transaction from the user's text. Today is ${today}. ` +
                `Respond ONLY with JSON in this exact shape: ` +
                `{"type":"income"|"expense","amount":number,"category":string,"merchant":string,"date":"YYYY-MM-DD","description":string}. ` +
                `Rules: category must be exactly one of [${CATEGORIES.join(", ")}]. ` +
                `amount is a positive number (no currency symbols). ` +
                `Resolve relative dates like "today", "yesterday", "last Friday" using today's date. ` +
                `If no date is given, use today. If merchant is unknown, use "". ` +
                `description is a short human-readable label. ` +
                `Default type to "expense" unless it clearly is income (salary, refund, dividend, received).`,
            },
            { role: "user", content: text },
          ],
        }),
      }
    );

    if (!groqRes.ok) {
      return NextResponse.json(
        { error: "AI parsing failed. Try again or add manually." },
        { status: 500 }
      );
    }

    const data = await groqRes.json();
    const parsed = JSON.parse(data.choices[0].message.content);

    // Light normalisation so the UI always gets a clean object
    parsed.type = parsed.type === "income" ? "income" : "expense";
    parsed.amount = Math.abs(Number(parsed.amount) || 0);
    if (!CATEGORIES.includes(parsed.category)) parsed.category = "Other";
    parsed.merchant = parsed.merchant ?? "";
    parsed.date = parsed.date || today;
    parsed.description = parsed.description ?? "";

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
