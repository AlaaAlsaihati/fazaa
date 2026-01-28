import SiteFooter from "@/app/components/FazaaFooter";

export default function PrivacyPage() {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black px-6 py-10"
    >
      <div className="mx-auto max-w-3xl">
        <header className="text-center">
          <p className="text-sm text-neutral-400">FAZAA</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white">
            سياسة الخصوصية
          </h1>
          <p className="mt-3 text-sm text-neutral-400">
            نحن نحترم خصوصيتك ونستخدم بياناتك فقط لتحسين تجربة الاقتراحات داخل فزعة.
          </p>
        </header>

        <section className="mt-8 relative overflow-hidden rounded-3xl border border-[#d6b56a]/25 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(214,181,106,0.10),0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur">
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-[#d6b56a]/18" />
          <div className="pointer-events-none absolute -top-24 left-1/2 h-40 w-[520px] -translate-x-1/2 rounded-full bg-[#d6b56a]/10 blur-3xl" />

          <div className="space-y-6 text-sm leading-relaxed text-neutral-200/90">
            <div>
              <h2 className="text-white font-semibold">6) التواصل</h2>
              <p className="mt-2 text-neutral-300">
                لأي استفسار حول الخصوصية:{" "}
                <a
                  href="mailto:contact@fazaa-app.com"
                  className="text-[#f3e0b0] hover:text-[#d6b56a] transition no-underline hover:no-underline"
                >
                  contact@fazaa-app.com
                </a>
              </p>
            </div>
          </div>
        </section>

        <SiteFooter />
      </div>
    </main>
  );
}