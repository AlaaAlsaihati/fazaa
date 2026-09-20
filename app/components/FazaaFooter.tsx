export default function FazaaFooter() {
  return (
    <footer className="mt-8 text-center text-xs text-neutral-400 leading-tight space-y-0">
      {/* خط ذهبي خفيف */}
      <div className="mx-auto mb-2 h-px w-32 bg-gradient-to-r from-transparent via-[#d6b56a]/40 to-transparent" />

      {/* الحقوق */}
      <div className="text-neutral-500">©️ 2026</div>
      <div className="text-neutral-500">All Rights Reserved</div>

      {/* Support, Terms & Privacy */}
      <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400">
        <a
          href="/support"
          className="hover:text-[#d6b56a] transition no-underline"
        >
          Support
        </a>

        <span className="opacity-60">•</span>

        <a
          href="/terms-and-conditions"
          className="hover:text-[#d6b56a] transition no-underline"
        >
          Terms & Conditions
        </a>

        <span className="opacity-60">•</span>

        <a
          href="/privacy-policy"
          className="hover:text-[#d6b56a] transition no-underline"
        >
          Privacy Policy
        </a>
      </div>
    </footer>
  );
}