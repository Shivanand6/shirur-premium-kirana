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

// Default is always English; user's saved choice is restored after hydration.
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>("en");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
      if (stored && SUPPORTED_LANGUAGES.some((l) => l.code === stored)) {
        setLangState(stored);
      }
    } catch { /* ignore */ }
  }, []);

  const setLang = (code: LanguageCode) => {
    setLangState(code);
    try { window.localStorage.setItem(STORAGE_KEY, code); } catch { /* ignore */ }
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
