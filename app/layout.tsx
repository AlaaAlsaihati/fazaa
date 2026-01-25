"use client";

import "./globals.css";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <html lang="ar" dir="rtl">
      <body className="bg-black text-white min-h-screen flex flex-col">
        {/* محتوى الصفحة */}
        <div className="flex-1">{children}</div>

        {/* App Footer (لكل الصفحات ما عدا الرئيسية) */}
        {!isHome && (
          <footer className="mt-10 border-t border-white/10 bg-black/40 backdrop-blur-sm">
            <div className="mx-auto max-w-6xl px-6 py-6 text-center text-xs text-neutral-400">
              
              {/* Divider */}
              <div className="mx-auto mb-4 h-px w-32 bg-gradient-to-r from-transparent via-[#d6b56a]/40 to-transparent" />

              {/* Brand */}
              <div className="text-sm font-semibold tracking-[0.35em] text-[#f3e0b0]">
                FAZAA
              </div>

              {/* Rights */}
              <div className="mt-2 text-neutral-500">
                © 2026 FAZAA — All Rights Reserved
              </div>

              {/* Contact */}
              <div
                className="mt-2 inline-flex items-center gap-2 text-neutral-400"
                dir="ltr"
              >
                <span className="text-neutral-300">For contact</span>

                {/* Mail icon (SVG رسم مو إيموجي) */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-[#d6b56a]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5A2.25 2.25 0 0 1 19.5 19.5H4.5A2.25 2.25 0 0 1 2.25 17.25V6.75M21.75 6.75A2.25 2.25 0 0 0 19.5 4.5H4.5A2.25 2.25 0 0 0 2.25 6.75m19.5 0-7.5 5.25a2.25 2.25 0 0 1-2.5 0l-7.5-5.25"
                  />
                </svg>

                <span className="text-neutral-500">:</span>

                {/* Email – ستايل فاخر */}
                <a
                  href="mailto:contact.fazaa@gmail.com"
                  className="
                    font-medium
                    tracking-[0.14em]
                    text-[#f3e0b0]
                    transition-colors
                    hover:text-[#d6b56a]
                  "
                >
                  contact.fazaa@gmail.com
                </a>
              </div>
            </div>
          </footer>
        )}
      </body>
    </html>
  );
}