import "./globals.css";
import type { Viewport } from "next";
import LanguageProvider from "@/app/components/LanguageProvider";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
    >
      <body className="bg-black text-white min-h-[100dvh]">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}