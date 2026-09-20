export default function SupportPage() {
  const whatsappUrl =
    "https://wa.me/966541721920?text=" +
    encodeURIComponent("مرحبًا، أحتاج مساعدة بخصوص فزعة.");

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-black text-white flex items-center justify-center px-6"
    >
      <div className="w-full max-w-xl text-center">
        <h1 className="mb-4 text-3xl font-semibold text-[#d6b56a]">
          دعم فزعة
        </h1>

        <p className="mb-8 leading-8 text-white/75">
          إذا كان لديك استفسار أو واجهتك مشكلة أثناء استخدام فزعة،
          يمكنك التواصل معنا وسنسعد بمساعدتك.
        </p>

        <div className="flex flex-col gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-2xl bg-[#d6b56a] px-5 py-3 text-black transition active:scale-[0.98]"
          >
            <span className="font-semibold">
              تواصل عبر واتساب :
            </span>

            <span
  dir="ltr"
  className="select-text text-sm font-semibold text-black"
>
  +966541721920
</span>
          </a>

          <a
            href="mailto:support@fazaa-app.com"
            className="flex items-center justify-center gap-2 rounded-2xl border border-[#d6b56a]/60 px-5 py-3 text-[#d6b56a] transition active:scale-[0.98]"
          >
            <span className="font-semibold">
              تواصل عبر البريد :
            </span>

            <span
              dir="ltr"
              className="select-text text-sm font-medium text-white/70"
            >
              support@fazaa-app.com
            </span>
          </a>
        </div>

        <p
          dir="ltr"
          className="mt-8 text-sm font-medium text-white/55"
        >
          Fazaa - Your Guide
        </p>
      </div>
    </main>
  );
}