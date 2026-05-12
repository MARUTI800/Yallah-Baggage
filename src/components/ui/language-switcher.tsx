"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/navigation";
import { locales } from "@/i18n/request";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function onSelectChange(nextLocale: string) {
    router.replace(pathname, { locale: nextLocale });
  }

  const languageNames: Record<string, string> = {
    en: "English",
    ar: "العربية",
    fr: "Français",
    zh: "中文",
    es: "Español",
    nl: "Nederlands",
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0A2E6D]/5 hover:bg-[#0A2E6D]/10 border border-[#E5E5E5] transition-all text-[#0A2E6D] font-medium text-sm">
        <Globe className="w-4 h-4" />
        <span>{languageNames[locale]}</span>
      </button>
      <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-2xl border border-[#E5E5E5] overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        {locales.map((cur) => (
          <button
            key={cur}
            onClick={() => onSelectChange(cur)}
            className={`w-full px-4 py-2 text-left text-sm font-medium hover:bg-[#F6F2EA] transition-colors ${
              locale === cur ? "text-[#1E5BD7] bg-[#F6F2EA]" : "text-[#8B7280]"
            }`}
          >
            {languageNames[cur]}
          </button>
        ))}
      </div>
    </div>
  );
}
