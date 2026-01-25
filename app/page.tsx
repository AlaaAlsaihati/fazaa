"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black text-white flex items-center justify-center p-6"
    >
      <div className="w-full max-w-6xl">
        {/* Hero Card */}
        <div className="relative rounded-[28px] border border-amber-300/30 bg-white/5 backdrop-blur-xl p-10 shadow-[0_0_60px_rgba(212,175,55,0.08)]">
          {/* Title */}
          <h1 className="text-center text-5xl sm:text-6xl font-extrabold tracking-[0.45em]">
            FAZAA
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-center text-2xl sm:text-3xl font-semibold tracking-wide text-amber-300/90">
            إطلالة تليق بك
          </p>

          {/* Divider */}
          <div className="mx-auto mt-6 h-px w-28 bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />

          {/* Description */}
          <p className="mt-6 text-center text-neutral-300 max-w-3xl mx-auto leading-loose">
            تجربة ذكية تساعدك على اختيار الإطلالة الأنسب لك حسب المناسبة، لون بشرتك،
            ومقاساتك — مع ترشيحات فخمة ومقاس محسوب بدقة.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => router.push("/occasion")}
              className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-amber-300 to-yellow-400 text-black shadow-lg hover:scale-[1.03] transition"
            >
              ابدئي التجربة ✨
            </button>

            <button
              onClick={() => router.push("/occasion")}
              className="px-8 py-3 rounded-xl font-semibold border border-amber-300/50 text-amber-300 hover:bg-amber-300/10 transition"
            >
              اختيار المناسبة
            </button>
          </div>

          {/* Feature Cards */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Feature title="اختيار ذكي" desc="تحليل المناسبة، لون البشرة والمقاسات" />
            <Feature title="مقاس مقترح" desc="نحسب لك المقاس الأنسب لكل قطعة" />
            <Feature title="متاجر مختارة" desc="روابط مباشرة لمنتجات فخمة" />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-10 text-center text-sm text-neutral-400">
          <div className="text-xs text-neutral-500 mb-1">© 2026</div>

          <div className="text-amber-300 font-semibold tracking-wide">
            Alaa Abdullah
          </div>

          <div className="text-xs mt-1 text-neutral-500">All Rights Reserved</div>

          {/* Contact */}
          <div className="mt-4 text-xs text-neutral-400">
            <span className="inline-flex items-center gap-2 justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-[#d6b56a]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5A2.25 2.25 0 002.25 6.75m19.5 0l-7.5 5.25a2.25 2.25 0 01-2.5 0l-7.5-5.25"
                />
              </svg>

              <span>For contact:</span>
              <a
                href="mailto:contact.fazaa@gmail.com"
                className="text-[#f3e0b0] hover:underline"
              >
                contact.fazaa@gmail.com
              </a>
            </span>
          </div>
        </footer>
      </div>
    </main>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-sm">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="mt-2 text-sm text-neutral-300">{desc}</p>
    </div>
  );
}