import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS, SHOPS } from "@/lib/data";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const CATALOG = PRODUCTS.map(p => {
  const shop = SHOPS[p.shop];
  return `ID:${p.id} | "${p.name}" | ${shop.name} | $${p.price} | ${p.cat}`;
}).join("\n");

const SYSTEM = `You are Celeste's visual search assistant — sharp, warm, and confident.
A user has uploaded an image. Your job is to match it to products in our catalog.

PRODUCT CATALOG:
${CATALOG}

YOUR RESPONSE FORMAT (always follow this exactly):
DESCRIPTION: <one sentence describing what you see in the image>
RESPONSE: <your natural reply — see rules below>
MATCH:pXX
MATCH:pYY
(add as many MATCH lines as relevant)

MATCHING RULES — be GENEROUS, not strict:
1. ALWAYS output MATCH lines if the image shows ANY product that is the same category, style, material or use-case as something in the catalog — even if it's not pixel-perfect identical.
   - Desk organizer photo → MATCH the desk organizer in catalog
   - Floor lamp photo → MATCH the floor lamp(s) in catalog
   - Mug/cup photo → MATCH the stoneware mug in catalog
   - Headphones photo → MATCH the headphones in catalog
   Never say "I don't see an exact match" if something in the catalog is clearly the same TYPE of product. That is a match.

2. RESPONSE tone for good matches: Be enthusiastic. "Found it! Here's what we have that matches." or "That looks just like our [product name] — great eye!"

3. If the image is related to our categories but no catalog item matches closely → suggest the nearest alternatives warmly: "We don't have that exact piece, but these are the closest in our catalog:"

4. If the image is completely unrelated to shopping (a person's face, landscape, food, meme, random screenshot) → be witty and redirect. No MATCH lines needed:
   - Selfie: "Love the look, but I'm better at finding things for your space than your feed! What are you shopping for?"
   - Food: "Delicious — but my specialty is home & lifestyle, not recipes. Try a product photo!"
   - Landscape: "Beautiful! If you're decorating inspired by this vibe, upload a product photo and I'll find the match."
   - Meme/screenshot: "Ha! Nice. I work best with actual product photos — try a clear shot of something you'd like to buy."

5. Blurry/unclear image → "This one's a bit hard to make out — could you try a clearer or closer shot?"

6. Only use product IDs from the catalog. Never invent IDs.
7. Keep RESPONSE under 2 sentences.`;

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
            role: "system",
            content: SYSTEM,
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: `data:${mimeType};base64,${imageBase64}` },
              },
              {
                type: "text",
                text: "Please analyse this image and respond following your instructions.",
              },
            ],
          },
        ],
        temperature: 0.55,
        max_tokens: 400,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: 500 });
    }

    const data = await res.json();
    const raw: string = data.choices?.[0]?.message?.content ?? "";

    // Parse structured response
    const descMatch = raw.match(/DESCRIPTION:\s*(.+?)(?:\n|RESPONSE:|MATCH:|$)/s);
    const respMatch = raw.match(/RESPONSE:\s*(.+?)(?:\n\n|MATCH:|$)/s);
    let matchIds    = [...raw.matchAll(/MATCH:(p\d+)/g)].map(m => m[1]);

    const description = descMatch?.[1]?.trim() ?? "";
    const response    = respMatch?.[1]?.trim() ?? raw.replace(/MATCH:p\d+\n?/g, "").replace(/DESCRIPTION:.+?\n/s, "").replace(/RESPONSE:/g, "").trim();

    // Fallback: if AI mentioned no MATCH lines but referenced a product name in text,
    // scan catalog for name matches and add them automatically
    if (matchIds.length === 0) {
      const fullText = raw.toLowerCase();
      const { PRODUCTS: P } = await import("@/lib/data");
      const implied = P.filter(p =>
        p.name.toLowerCase().split(" ").filter(w => w.length > 4)
          .some(w => fullText.includes(w))
      ).slice(0, 3).map(p => p.id);
      matchIds = implied;
    }

    return NextResponse.json({ description, response, productIds: matchIds });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
