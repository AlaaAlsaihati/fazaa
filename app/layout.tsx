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
      <body className="bg-black text-white">

        {children}

        {/* App Footer (لكل الصفحات ما عدا الرئيسية) */}
        {!isHome && (
          <footer className="mt-16 text-center text-xs text-neutral-400">
            <div className="mx-auto mb-6 h-px w-32 bg-gradient-to-r from-transparent via-[#d6b56a]/40 to-transparent" />

            <div className="text-sm font-semibold tracking-[0.25em] text-[#f3e0b0]">
              FAZAA
            </div>

            <div className="mt-2 text-neutral-500">
              © 2026 FAZAA — All Rights Reserved
            </div>

            <div className="mt-2 text-neutral-400">
              For contact ✉️ :{" "}
              <a
                href="mailto:contact.fazaa@gmail.com"
                className="text-[#d6b56a] hover:underline"
              >
                contact.fazaa@gmail.com
              </a>
            </div>
          </footer>
        )}

      </body>
    </html>
  );
}
