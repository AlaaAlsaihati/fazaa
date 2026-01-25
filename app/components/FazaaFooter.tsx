export default function FazaaFooter() {
  return (
    <footer className="mt-10 text-center text-xs text-neutral-400">
      {/* خط ذهبي ناعم */}
      <div className="mx-auto mb-2 h-px w-32 bg-gradient-to-r from-transparent via-[#d6b56a]/40 to-transparent" />

      {/* الحقوق */}
      <div className="text-neutral-500">
        © 2026 FAZAA — All Rights Reserved
      </div>

      {/* الإيميل */}
      <div
        className="mt-1 inline-flex items-center gap-2 justify-center"
        dir="ltr"
      >
        <span className="text-neutral-300">For contact</span>

        {/* أيقونة الإيميل */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-[#d6b56a]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.75 6.75v10.5A2.25 2.25 0 0 1 19.5 19.5H4.5A2.25 2.25 0 0 1 2.25 17.25V6.75
               M21.75 6.75A2.25 2.25 0 0 0 19.5 4.5H4.5A2.25 2.25 0 0 0 2.25 6.75
               m19.5 0-7.5 5.25a2.25 2.25 0 0 1-2.5 0l-7.5-5.25"
          />
        </svg>

        <span className="text-neutral-500">:</span>

        <a
          href="mailto:contact.fazaa@gmail.com"
          className="text-[#f3e0b0] hover:text-[#d6b56a] transition no-underline hover:no-underline font-semibold tracking-[0.12em]"
          style={{ fontFamily: "Playfair Display, ui-serif, Georgia, serif" }}
        >
          contact.fazaa@gmail.com
        </a>
      </div>
    </footer>
  );
}