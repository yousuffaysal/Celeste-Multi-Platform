import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS, SHOPS } from "@/lib/data";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const CATALOG = PRODUCTS.map(p => {
  const shop = SHOPS[p.shop];
  return `ID:${p.id} | "${p.name}" | ${shop.name} | $${p.price}${p.old ? ` (was $${p.old})` : ""} | ${p.cat} | Rating: ${p.rating} (${p.reviews} reviews)${p.tag ? ` | [${p.tag.toUpperCase()}]` : ""}`;
}).join("\n");

const SYSTEM = `You are Celeste, an AI shopping assistant for a multivendor marketplace. You help users find and curate the perfect set of products.

PRODUCT CATALOG:
${CATALOG}

INSTRUCTIONS:
- Understand the user's need, mood, budget, and intent naturally.
- Recommend 2-5 specific products from the catalog above that best fit.
- Always reference products by their exact ID (e.g. p1, p12).
- When recommending products, list each on its own line prefixed with PICK: like this:
  PICK:p1
  PICK:p12
- Keep your tone warm, concise, and helpful — like a knowledgeable friend.
- Mention the total cost and how it fits the budget if given.
- Never make up products outside the catalog.
- If the user's request is unclear, ask one short clarifying question.
- Keep responses under 120 words (not counting PICK lines).`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json() as { messages: { role: string; content: string }[] };

    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 512,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: 500 });
    }

    const data = await res.json();
    const raw: string = data.choices?.[0]?.message?.content ?? "";

    // Extract PICK:pXX lines and clean them from the visible text
    const pickLines = [...raw.matchAll(/PICK:(p\d+)/g)].map(m => m[1]);
    const text = raw.replace(/PICK:p\d+\n?/g, "").trim();

    return NextResponse.json({ text, productIds: pickLines });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
