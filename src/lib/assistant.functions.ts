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

// Simple offline Q&A engine — no API key required.
// Matches the latest user message against keyword rules and returns a scripted answer.
// If nothing matches, it politely asks the user to contact the store on WhatsApp.

type Rule = { keywords: string[]; answer: string };

const WHATSAPP = "+91 96110 94379";

const FALLBACK =
  `I'm not sure about that one. Please contact Shirur Kirani Stores directly on WhatsApp at ${WHATSAPP} — the family will be happy to help you.`;

const RULES: Rule[] = [
  // Greetings
  {
    keywords: ["hi", "hello", "hey", "namaste", "namaskara", "vanakkam", "salaam"],
    answer:
      "Namaste! Welcome to Shirur Kirani Stores. I can help with questions about our owners, timings, location, products, delivery, payments and how to order. What would you like to know?",
  },
  {
    keywords: ["thank", "thanks", "dhanyavaad", "shukriya"],
    answer: "You're most welcome! Anything else you'd like to know about Shirur Kirani Stores?",
  },

  // Owners / about
  {
    keywords: ["owner", "owners", "who runs", "who owns", "family", "manjunath", "anand", "shirur"],
    answer:
      "Shirur Kirani Stores is a family-owned business run by Manjunath Shirur and Anand Shirur. It has been serving Navanagar since 1996.",
  },
  {
    keywords: ["about", "history", "since", "established", "founded", "how old", "years"],
    answer:
      "Shirur Kirani Stores is a trusted neighborhood grocery and general store, family-owned and established in 1996 at Karnataka Circle, Navanagar, Hubballi. Nearly three decades of serving the community with quality daily essentials.",
  },

  // Timings / hours
  {
    keywords: ["time", "timing", "timings", "hour", "hours", "open", "close", "closing", "opening", "when", "shift"],
    answer:
      "We are open every day (Monday to Sunday):\n• Morning: 7:00 AM – 2:00 PM\n• Evening: 5:00 PM – 10:00 PM\n(We're closed between 2 PM and 5 PM.)",
  },
  {
    keywords: ["sunday", "holiday", "off day", "weekend"],
    answer:
      "We're open all 7 days including Sundays — 7:00 AM to 2:00 PM and 5:00 PM to 10:00 PM.",
  },

  // Location / address
  {
    keywords: ["where", "address", "location", "located", "place", "shop", "store address", "directions", "map"],
    answer:
      "You'll find us at Karnataka Circle, Navanagar, Hubballi, Karnataka, India. Search 'Shirur Kirani Stores' on Google Maps for directions.",
  },
  {
    keywords: ["city", "hubli", "hubballi", "navanagar", "karnataka"],
    answer: "The store is in Navanagar, Hubballi, Karnataka — right at Karnataka Circle.",
  },

  // Contact
  {
    keywords: ["phone", "call", "number", "mobile", "contact"],
    answer: `You can reach us on ${WHATSAPP} — call or WhatsApp, both work.`,
  },
  {
    keywords: ["whatsapp", "wa", "message"],
    answer:
      `WhatsApp us on ${WHATSAPP}. Send your grocery list, we'll confirm availability and deliver to your home.`,
  },
  {
    keywords: ["email", "mail"],
    answer:
      `We primarily use WhatsApp and phone for orders — ${WHATSAPP}. It's the fastest way to reach the family.`,
  },

  // Delivery
  {
    keywords: ["delivery", "deliver", "home delivery", "doorstep", "bring", "drop"],
    answer:
      "Yes! We offer free home delivery across Navanagar, and to nearby areas on request. Just send your list on WhatsApp and we'll pack and deliver.",
  },
  {
    keywords: ["delivery time", "how long", "how fast", "when will", "same day"],
    answer:
      "Most Navanagar deliveries happen the same day within business hours. Order early for morning delivery, or in the afternoon for evening delivery.",
  },
  {
    keywords: ["delivery charge", "delivery fee", "shipping"],
    answer:
      "Home delivery is free within Navanagar. For areas farther out, please confirm on WhatsApp.",
  },
  {
    keywords: ["minimum order", "min order"],
    answer:
      "There's no strict minimum — but for delivery to farther areas, please confirm with the store on WhatsApp.",
  },

  // Ordering
  {
    keywords: ["how to order", "order", "buy", "purchase", "place order"],
    answer:
      `Ordering is simple:\n1. Send your grocery list on WhatsApp to ${WHATSAPP}\n2. We confirm availability and total\n3. You approve — we pack it fresh\n4. We deliver to your home\n5. Pay by cash or UPI on delivery`,
  },
  {
    keywords: ["online", "website order", "app"],
    answer:
      `We take orders on WhatsApp — it's quick and personal. Just message your list to ${WHATSAPP}.`,
  },

  // Payment
  {
    keywords: ["payment", "pay", "upi", "phonepe", "google pay", "gpay", "paytm", "cash", "card", "credit", "debit", "netbanking", "cod"],
    answer:
      "We accept Cash, UPI, PhonePe, Google Pay, Paytm, Debit Card, Credit Card, Net Banking, UPI QR, and Cash on Delivery.",
  },

  // Products
  {
    keywords: ["product", "products", "what do you sell", "items", "stock", "have", "sell"],
    answer:
      "We stock daily essentials — Rice, Dal, Oil, Atta, Sugar, Salt, Tea, Coffee, Spices, Masala, Snacks, Biscuits, Home Care, Cleaning Products, Dry Fruits, Pulses, Stationery, Dairy and Personal Care.",
  },
  { keywords: ["rice"], answer: "Yes, we stock a range of rice varieties. Message the store on WhatsApp to confirm which type you'd like." },
  { keywords: ["dal", "pulse", "pulses"], answer: "Yes, all common dals and pulses are available. Send your list on WhatsApp." },
  { keywords: ["oil", "cooking oil"], answer: "We stock cooking oils — sunflower, groundnut, coconut and more. Confirm the brand you need on WhatsApp." },
  { keywords: ["atta", "flour", "wheat"], answer: "Yes, atta and flour are available. WhatsApp us to confirm brand and pack size." },
  { keywords: ["sugar", "salt"], answer: "Yes, sugar and salt are always in stock." },
  { keywords: ["tea", "coffee"], answer: "Both tea and coffee are available in popular brands." },
  { keywords: ["spice", "masala"], answer: "We carry a full range of spices and masalas." },
  { keywords: ["snack", "biscuit", "chocolate"], answer: "Yes — snacks, biscuits and everyday treats are in stock." },
  { keywords: ["soap", "detergent", "cleaning", "home care"], answer: "Home care and cleaning products are all available." },
  { keywords: ["milk", "dairy", "curd", "ghee"], answer: "We stock dairy essentials. WhatsApp us for daily availability." },
  { keywords: ["dry fruit", "cashew", "almond", "raisin"], answer: "Dry fruits are available. Confirm the quantity on WhatsApp." },

  // Price (strict rule — never quote prices)
  {
    keywords: ["price", "cost", "rate", "mrp", "discount", "offer", "how much", "kitna", "kitni", "bhav"],
    answer:
      `Prices change regularly. Please contact us on WhatsApp at ${WHATSAPP} for the latest price and availability.`,
  },

  // Awards
  {
    keywords: ["award", "recognition", "prize", "achievement"],
    answer:
      "We're proud to have received the Highest Seller Award — Gold Winner Oil, a recognition of the community's trust in us.",
  },

  // Language
  {
    keywords: ["language", "kannada", "hindi", "english", "tamil", "telugu", "marathi"],
    answer:
      "You can switch the website language using the globe icon in the top navigation. We support English, Kannada, Hindi, Tamil, Telugu, Malayalam, Marathi, Gujarati, Punjabi and Bengali.",
  },

  // Website / features
  {
    keywords: ["website", "site", "online catalog", "catalogue"],
    answer:
      "This website has our full product categories, gallery, awards, location and how-to-order guide. For live availability and pricing, WhatsApp is best.",
  },
  {
    keywords: ["return", "refund", "exchange"],
    answer:
      `If something isn't right with your order, WhatsApp us on ${WHATSAPP} and we'll make it right — that's the family promise.`,
  },
];

function matchAnswer(text: string): string {
  const q = text.toLowerCase();
  let best: { rule: Rule; score: number } | null = null;
  for (const rule of RULES) {
    let score = 0;
    for (const kw of rule.keywords) {
      if (q.includes(kw)) score += kw.length; // longer keyword matches beat shorter ones
    }
    if (score > 0 && (!best || score > best.score)) best = { rule, score };
  }
  return best ? best.rule.answer : FALLBACK;
}

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const lastUser = [...data.messages].reverse().find((m) => m.role === "user");
    if (!lastUser) {
      return { error: null, reply: "Please type your question and I'll do my best to help." };
    }
    const reply = matchAnswer(lastUser.content);
    return { error: null, reply };
  });
