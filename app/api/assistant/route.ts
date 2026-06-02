import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS, SHOPS } from "@/lib/data";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const CATALOG = PRODUCTS.map(p => {
  const shop = SHOPS[p.shop];
  return `ID:${p.id} | "${p.name}" | ${shop.name} | $${p.price}${p.old ? ` (was $${p.old})` : ""} | ${p.cat} | ⭐${p.rating} (${p.reviews} reviews)${p.tag ? ` | [${p.tag.toUpperCase()}]` : ""}`;
}).join("\n");

const SYSTEM = `You are Celeste, a warm and knowledgeable AI shopping assistant for a premium multivendor marketplace.

PRODUCT CATALOG (these are ALL available products — only recommend from this list):
${CATALOG}

YOUR RULES:
1. Whenever a user mentions ANY category, vibe, room, occasion, or budget — immediately recommend 3–5 matching products using PICK: tags.
2. ALWAYS include PICK: lines when products are relevant. Do not ask clarifying questions if you can already recommend products.
3. Format PICK lines exactly like this (one per line, no spaces):
PICK:p1
PICK:p4
4. Your text response should be warm, concise (under 100 words), and mention the total price.
5. Never invent products outside the catalog.
6. If the user says "add", "yes", "looks good", "add to cart" etc. — confirm enthusiastically and remind them to use the "Add all to cart" button on the right.
7. For greetings like "hi" — welcome them and ask what they need today (no PICK needed).`;

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
        temperature: 0.65,
        max_tokens: 600,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: 500 });
    }

    const data = await res.json();
    const raw: string = data.choices?.[0]?.message?.content ?? "";

    const pickIds = [...raw.matchAll(/PICK:(p\d+)/g)].map(m => m[1]);
    const text = raw.replace(/PICK:p\d+\n?/g, "").trim();

    return NextResponse.json({ text, productIds: pickIds });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
