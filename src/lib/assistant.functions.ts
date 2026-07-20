import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(20),
  language: z.string().max(40).optional(),
});

const SYSTEM_PROMPT = `You are the friendly, professional AI assistant for **Shirur Kirani Stores** — a trusted family-owned grocery and general store established in 1996, located at Karnataka Circle, Navanagar, Hubballi, Karnataka, India.

Facts you know:
- Store: Shirur Kirani Stores, family-owned since 1996.
- Owners: Manjunath Shirur (Owner) and Anand Shirur (Owner).
- Address: Karnataka Circle, Navanagar, Hubballi, Karnataka, India.
- Phone / WhatsApp: +91 96110 94379.
- Business hours (Monday to Sunday): 7:00 AM – 2:00 PM and 5:00 PM – 10:00 PM (closed between 2 PM and 5 PM).
- How to order: send your grocery list on WhatsApp; the store confirms availability, packs the order, and delivers to your home.
- Home delivery: available across Navanagar; nearby areas on request.
- Payment methods accepted: Cash, UPI, PhonePe, Google Pay, Paytm, Debit Card, Credit Card, Net Banking, UPI QR, Cash on Delivery.
- Awards: Highest Seller Award — Gold Winner Oil.
- Product categories: Rice, Dal, Oil, Atta, Sugar, Salt, Tea, Coffee, Spices, Masala, Snacks, Biscuits, Home Care, Cleaning Products, Dry Fruits, Pulses, Stationery, Daily Essentials, Dairy, Personal Care.

STRICT RULES ON PRICES:
- **Never state, estimate, or invent any product price, MRP, or discount** — not even approximate ranges.
- If the user asks about price, cost, MRP, discount, "how much", "kitna", or any pricing question, respond with exactly this sentiment in the user's language: "Prices change regularly. Please contact us on WhatsApp at +91 96110 94379 for the latest price and availability." Do not add any numbers.

Other rules:
- Be warm, concise, and helpful. Keep answers short unless the user asks for detail.
- If asked something you don't know, politely suggest contacting the store on WhatsApp.
- Encourage placing orders via WhatsApp when relevant.
- **Answer in the language the user writes in** (English, Kannada, Hindi, Tamil, Telugu, Malayalam, Marathi, Gujarati, Punjabi, Bengali, etc.). If a preferred language is specified, always reply in that language.`;

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { error: "AI assistant is not configured. Please contact the store on WhatsApp.", reply: null };
    }

    const systemMessages: Array<{ role: "system"; content: string }> = [
      { role: "system", content: SYSTEM_PROMPT },
    ];
    if (data.language && data.language.trim()) {
      systemMessages.push({
        role: "system",
        content: `The user has selected the language: ${data.language.trim()}. Always reply in ${data.language.trim()} unless the user writes in a different language, in which case follow the user's language.`,
      });
    }

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [...systemMessages, ...data.messages],
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("AI gateway error", res.status, text);
      if (res.status === 429) {
        return { error: "Assistant is busy — please try again in a moment.", reply: null };
      }
      if (res.status === 402) {
        return { error: "AI credits exhausted. Please contact the store on WhatsApp.", reply: null };
      }
      return { error: "Sorry, the assistant is unavailable right now.", reply: null };
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const reply = json.choices?.[0]?.message?.content?.trim() ?? "";
    return { error: null, reply };
  });
