export default function FazaaFooter() {
  const email = "contact@fazaa-app.com";

  return (
    <footer className="mt-10 text-center text-xs text-neutral-400">
      {/* خط ذهبي ناعم */}
      <div className="mx-auto mb-2 h-px w-32 bg-gradient-to-r from-transparent via-[#d6b56a]/40 to-transparent" />

      {/* الحقوق */}
      <div className="text-neutral-500">
        ©️ 2026 FAZAA — All Rights Reserved
      </div>

      {/* الإيميل */}
      <div className="mt-2" dir="ltr">
        <span className="inline-flex items-center gap-2 justify-center">
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
            href={`mailto:${email}`}
            className="text-[#f3e0b0] hover:text-[#d6b56a] transition font-semibold"
            style={{
              fontFamily: "Playfair Display, ui-serif, Georgia, serif",
              letterSpacing: "0.14em",
              fontSize: "0.95rem",
            }}
          >
            {email}
          </a>
        </span>
      </div>
    </footer>
  );
}