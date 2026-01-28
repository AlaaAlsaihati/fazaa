import SiteFooter from "@/app/components/FazaaFooter";

export default function TermsPage() {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black px-6 py-10"
    >
      <div className="mx-auto max-w-3xl">
        <header className="text-center">
          <p className="text-sm text-neutral-400">FAZAA</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white">
            الشروط والأحكام
          </h1>
        </header>

        <section className="mt-8 relative overflow-hidden rounded-3xl border border-[#d6b56a]/25 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(214,181,106,0.10),0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur">
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-[#d6b56a]/18" />

          <div className="space-y-6 text-sm leading-relaxed text-neutral-200/90">
            <div>
              <h2 className="text-white font-semibold">5) التواصل</h2>
              <p className="mt-2 text-neutral-300">
                لأي استفسار:{" "}
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