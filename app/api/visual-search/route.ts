import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS, SHOPS } from "@/lib/data";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const CATALOG = PRODUCTS.map(p => {
  const shop = SHOPS[p.shop];
  return `ID:${p.id} | "${p.name}" | ${shop.name} | $${p.price} | ${p.cat}`;
}).join("\n");

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mimeType = "image/jpeg" } = await req.json();
    if (!imageBase64) return NextResponse.json({ error: "No image provided" }, { status: 400 });

    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: `data:${mimeType};base64,${imageBase64}` },
              },
              {
                type: "text",
                text: `You are a visual product matching assistant for an online marketplace.

PRODUCT CATALOG:
${CATALOG}

Look at this image carefully. Identify what type of product, style, material, color, and use-case is shown.
Then find the 3–5 best matching products from the catalog above.

Respond with:
1. A one-sentence description of what you see in the image.
2. MATCH lines for the best matching products, like:
MATCH:p1
MATCH:p8

Only use product IDs from the catalog. Do not invent products.`,
              },
            ],
          },
        ],
        temperature: 0.3,
        max_tokens: 300,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: 500 });
    }

    const data = await res.json();
    const raw: string = data.choices?.[0]?.message?.content ?? "";

    const matchIds = [...raw.matchAll(/MATCH:(p\d+)/g)].map(m => m[1]);
    const description = raw.replace(/MATCH:p\d+\n?/g, "").trim();

    return NextResponse.json({ description, productIds: matchIds });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
