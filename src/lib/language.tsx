import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

type LangCtx = {
  lang: LanguageCode;
  setLang: (c: LanguageCode) => void;
  languageName: string;
};

const LanguageContext = createContext<LangCtx>({
  lang: "en",
  setLang: () => {},
  languageName: "English",
});

const STORAGE_KEY = "skr_lang";

// Set the Google Translate cookie so its widget picks up the target language
// on this page and on future navigations. Setting on the current host and the
// parent domain covers preview + published domains.
function setGoogTransCookie(target: LanguageCode) {
  if (typeof document === "undefined") return;
  const value = target === "en" ? "" : `/en/${target}`;
  const parts = window.location.hostname.split(".");
  const rootDomain =
    parts.length > 1 ? "." + parts.slice(-2).join(".") : window.location.hostname;
  // Expire = clear when English (widget default)
  const expires =
    target === "en"
      ? "expires=Thu, 01 Jan 1970 00:00:00 GMT"
      : "expires=" + new Date(Date.now() + 30 * 864e5).toUTCString();
  document.cookie = `googtrans=${value}; path=/; ${expires}`;
  document.cookie = `googtrans=${value}; domain=${rootDomain}; path=/; ${expires}`;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>("en");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
      if (stored && SUPPORTED_LANGUAGES.some((l) => l.code === stored)) {
        setLangState(stored);
        if (stored !== "en") setGoogTransCookie(stored);
      }
    } catch {
      /* ignore */
    }

    // Inject the Google Translate widget once; it reads the googtrans cookie.
    if (typeof window !== "undefined" && !document.getElementById("google-translate-script")) {
      const host = document.createElement("div");
      host.id = "google_translate_element";
      host.style.display = "none";
      document.body.appendChild(host);

      (window as unknown as { googleTranslateElementInit?: () => void }).googleTranslateElementInit =
        () => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const g = (window as any).google;
          if (g?.translate?.TranslateElement) {
            new g.translate.TranslateElement(
              {
                pageLanguage: "en",
                includedLanguages: "en,kn,hi,ta,te,ml,mr,gu,pa,bn",
                autoDisplay: false,
              },
              "google_translate_element",
            );
          }
        };

      const s = document.createElement("script");
      s.id = "google-translate-script";
      s.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      s.async = true;
      document.body.appendChild(s);
    }
  }, []);

  const setLang = (code: LanguageCode) => {
    setLangState(code);
    try {
      window.localStorage.setItem(STORAGE_KEY, code);
    } catch {
      /* ignore */
    }
    setGoogTransCookie(code);
    // Reload so the Google Translate widget re-translates the page with the new cookie.
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  const languageName =
    SUPPORTED_LANGUAGES.find((l) => l.code === lang)?.label ?? "English";

  return (
    <LanguageContext.Provider value={{ lang, setLang, languageName }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
