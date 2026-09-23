"use client";

import { useLanguage } from "@/app/components/LanguageProvider";

export default function FazaaFooter() {
  const {
    isArabic,
    direction,
  } = useLanguage();

  return (
    <footer
      dir={direction}
      className="mt-8 text-center text-xs text-neutral-400 leading-tight space-y-0"
    >
      {/* الخط الذهبي */}
      <div className="mx-auto mb-2 h-px w-32 bg-gradient-to-r from-transparent via-[#d6b56a]/40 to-transparent" />

      {/* الحقوق */}
      <div className="text-neutral-500">
        © 2026
      </div>

      <div className="text-neutral-500">
        {isArabic
          ? "جميع الحقوق محفوظة"
          : "All Rights Reserved"}
      </div>

      {/* Support, Terms & Privacy */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-neutral-400">
        <a
          href="/support"
          className="hover:text-[#d6b56a] transition no-underline"
        >
          {isArabic ? "الدعم" : "Support"}
        </a>

        <span className="opacity-60">
          •
        </span>

        <a
          href="/terms-and-conditions"
          className="hover:text-[#d6b56a] transition no-underline"
        >
          {isArabic
            ? "الشروط والأحكام"
            : "Terms & Conditions"}
        </a>

        <span className="opacity-60">
          •
        </span>

        <a
          href="/privacy-policy"
          className="hover:text-[#d6b56a] transition no-underline"
        >
          {isArabic
            ? "سياسة الخصوصية"
            : "Privacy Policy"}
        </a>
      </div>
    </footer>
  );
}