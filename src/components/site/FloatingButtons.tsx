import { Phone, MessageCircle } from "lucide-react";
import { PHONE_TEL, WHATSAPP_URL } from "@/lib/store-info";

export function FloatingButtons() {
  return (
    <div className="fixed bottom-5 right-4 z-50 flex flex-col gap-3 sm:bottom-6 sm:right-6">
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="Order on WhatsApp"
        className="group grid h-14 w-14 place-items-center rounded-full text-white shadow-[var(--shadow-glow)] transition-transform duration-300 hover:scale-110"
        style={{ backgroundColor: "var(--color-whatsapp)" }}
      >
        <MessageCircle className="h-6 w-6 transition-transform group-hover:rotate-12" strokeWidth={2.2} />
      </a>
      <a
        href={PHONE_TEL}
        aria-label="Call the store"
        className="grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-glow)] transition-transform duration-300 hover:scale-110"
      >
        <Phone className="h-6 w-6" strokeWidth={2.2} />
      </a>
    </div>
  );
}
