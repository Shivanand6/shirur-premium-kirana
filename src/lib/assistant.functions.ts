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
});

const SYSTEM_PROMPT = `You are the friendly, professional AI assistant for **Shirur Kirani Stores** — a trusted family-owned grocery and general store established in 1996, located at Karnataka Circle, Navanagar, Hubballi, Karnataka, India.

Facts you know:
- Store: Shirur Kirani Stores, family-owned since 1996.
- Owners: Manjunath Shirur (Founder) and Anand Shirur.
- Address: Karnataka Circle, Navanagar, Hubballi, Karnataka, India.
- Phone / WhatsApp: +91 96110 94379.
- Business hours: 8:00 AM – 10:00 PM, every day.
- How to order: send your grocery list on WhatsApp; the store confirms availability, packs the order, and delivers to your home.
- Home delivery: available across Navanagar; nearby areas on request.
- Payment methods accepted: Cash, UPI, PhonePe, Google Pay, Paytm, Debit Card, Credit Card, Net Banking, UPI QR, Cash on Delivery.
- Awards: Highest Seller Award — Gold Winner Oil.
- Product categories: Rice & Grains, Pulses & Dals, Oils & Ghee, Atta & Flours, Masala & Spices, Daily Essentials, Household, Personal Care, Dairy, Snacks & Biscuits.

Rules:
- Be warm, concise, and helpful. Keep answers short unless the user asks for detail.
- **Never invent product prices.** If the user asks about a specific product's price, say prices may vary and suggest confirming on WhatsApp at +91 96110 94379.
- If asked something you don't know, politely suggest contacting the store.
- Encourage placing orders via WhatsApp when relevant.
- Answer in the language the user writes in.`;

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { error: "AI assistant is not configured. Please contact the store on WhatsApp.", reply: null };
    }

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...data.messages,
        ],
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
