export default function FazaaFooter() {
  return (
    <footer className="mt-6 text-center text-xs text-neutral-400 leading-tight">
      <div className="text-neutral-500">© 2026 FAZAA</div>
      <div className="text-neutral-500">All Rights Reserved</div>

      <div dir="ltr" className="mt-1 text-neutral-400">
        <span className="inline-flex items-center gap-2">
          <span>For contact</span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-[#d6b56a]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5A2.25 2.25 0 0 1 19.5 19.5H4.5A2.25 2.25 0 0 1 2.25 17.25V6.75m19.5 0-7.5 5.25a2.25 2.25 0 0 1-2.5 0l-7.5-5.25"
            />
          </svg>

          <span>:</span>

          <a
            href="mailto:contact.fazaa@gmail.com"
            className="text-[#f3e0b0] hover:underline font-medium tracking-wide"
          >
            contact.fazaa@gmail.com
          </a>
        </span>
      </div>
    </footer>
  );
}