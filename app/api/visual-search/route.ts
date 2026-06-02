import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS, SHOPS } from "@/lib/data";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const CATALOG = PRODUCTS.map(p => {
  const shop = SHOPS[p.shop];
  return `ID:${p.id} | "${p.name}" | ${shop.name} | $${p.price} | ${p.cat}`;
}).join("\n");

const SYSTEM = `You are Celeste's visual search assistant — sharp, warm, and honest.
A user has uploaded an image and you need to match it to products in our catalog.

PRODUCT CATALOG:
${CATALOG}

YOUR RESPONSE FORMAT:
Always start with DESCRIPTION: (one conversational sentence about what you see).
Then RESPONSE: (your natural reply to the user — see rules below).
Then optionally MATCH:pXX lines for any matching products.

RULES:
1. If the image clearly shows a shoppable product that matches something in the catalog → describe it, add MATCH lines, say something helpful like "Found a great match!" in RESPONSE.

2. If the image shows something related to our categories but not an exact match → be honest and suggest the closest alternatives. E.g. "I don't carry that exact lamp style, but here are some similar ones you might love."

3. If the image is completely unrelated to shopping (a person, landscape, food, meme, screenshot, etc.) → be witty and redirect. Examples:
   - For a selfie: "Love the look, but I'm better at finding things for your home than your feed! What are you shopping for today?"
   - For food: "That looks delicious — but my specialty is home & lifestyle products, not recipes! Try uploading a product photo."
   - For a landscape: "Beautiful scenery! If you're decorating a space inspired by this vibe, I can help. Upload a product photo instead."
   - For a meme/screenshot: "Ha! Nice. I work best with actual product photos though — try a clear shot of something you'd like to buy."

4. If the image is blurry or unclear → ask nicely for a better photo: "This one's a bit hard to make out — could you try a clearer or closer shot?"

5. Never make up product IDs. Only use IDs from the catalog.
6. Keep RESPONSE under 2 sentences — punchy and helpful.`;

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
    const descMatch  = raw.match(/DESCRIPTION:\s*(.+?)(?:\n|RESPONSE:|MATCH:|$)/s);
    const respMatch  = raw.match(/RESPONSE:\s*(.+?)(?:\n\n|MATCH:|$)/s);
    const matchIds   = [...raw.matchAll(/MATCH:(p\d+)/g)].map(m => m[1]);

    const description = descMatch?.[1]?.trim() ?? "";
    const response    = respMatch?.[1]?.trim() ?? raw.replace(/MATCH:p\d+\n?/g, "").replace(/DESCRIPTION:.+?\n/s, "").replace(/RESPONSE:/g, "").trim();

    return NextResponse.json({ description, response, productIds: matchIds });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
