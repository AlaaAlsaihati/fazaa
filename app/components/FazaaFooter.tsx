export default function FazaaFooter() {
  return (
    <footer className="mt-8 text-center text-xs text-neutral-400 leading-tight space-y-0">
      {/* خط ذهبي خفيف */}
      <div className="mx-auto mb-2 h-px w-32 bg-gradient-to-r from-transparent via-[#d6b56a]/40 to-transparent" />

      {/* الحقوق */}
      <div className="text-neutral-500">©️ 2026</div>
      <div className="text-neutral-500">All Rights Reserved</div>

      {/* Contact */}
      <div dir="ltr" className="text-[11px] text-neutral-400">
        <span className="inline-flex items-center gap-2">
          <span>For contact</span>
          <span className="opacity-60">:</span>
          <a
            href="mailto:contact@fazaa-app.com"
            className="text-[#f3e0b0] text-[11px] font-medium tracking-[0.10em] hover:text-[#d6b56a] transition no-underline"
          >
            contact@fazaa-app.com
          </a>
        </span>
      </div>

      {/* Privacy & Terms */}
<div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400">
  <a
    href="/privacy-policy"
    className="hover:text-[#d6b56a] transition no-underline"
  >
    Privacy Policy
  </a>

  <span className="opacity-60">•</span>

  <a
    href="/terms-and-conditions"
    className="hover:text-[#d6b56a] transition no-underline"
  >
    Terms & Conditions
  </a>
</div>
    </footer>
  );
}