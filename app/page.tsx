"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function HomePage() {
  const router = useRouter();

  return (
    <motion.main
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black text-white flex items-center justify-center p-6"
    >
      <div className="w-full max-w-6xl">
        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.08, ease: "easeOut" }}
          className="relative rounded-[28px] border border-amber-300/30 bg-white/5 backdrop-blur-xl p-10 shadow-[0_0_60px_rgba(212,175,55,0.08)]"
        >
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, letterSpacing: "0.9em" }}
            animate={{ opacity: 1, letterSpacing: "0.45em" }}
            transition={{ duration: 1.2, delay: 0.05, ease: "easeOut" }}
            className="text-center text-5xl sm:text-6xl font-extrabold tracking-[0.45em]"
          >
            FAZAA
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.18, ease: "easeOut" }}
            className="mt-4 text-center text-2xl sm:text-3xl font-semibold tracking-wide text-amber-300/90"
          >
            إطلالة تليق بك
          </motion.p>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0.6 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.22, ease: "easeOut" }}
            className="mx-auto mt-6 h-px w-28 bg-gradient-to-r from-transparent via-amber-300/50 to-transparent origin-center"
          />

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.28, ease: "easeOut" }}
            className="mt-6 text-center text-neutral-300 max-w-3xl mx-auto leading-loose"
          >
            تجربة ذكية تساعدك على اختيار الإطلالة الأنسب لك حسب المناسبة، لون بشرتك،
            ومقاساتك — مع ترشيحات فخمة ومقاس محسوب بدقة.
          </motion.p>

          {/* CTA */}
          <div className="mt-10 flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 320, damping: 18 }}
              onClick={() => router.push("/occasion")}
              className="px-10 py-3 rounded-xl font-semibold border border-amber-300/50 text-amber-300 hover:bg-amber-300/10 transition"
            >
              ابدئي التجربة ✨
            </motion.button>
          </div>

          {/* Features */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.08, delayChildren: 0.35 },
              },
            }}
            className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-5"
          >
            <Feature title="اختيار ذكي" desc="تحليل المناسبة، لون البشرة والمقاسات" />
            <Feature title="مقاس مقترح" desc="نحسب لك المقاس الأنسب لكل قطعة" />
            <Feature title="متاجر مختارة" desc="روابط مباشرة لمنتجات فخمة" />
          </motion.div>
        </motion.div>

        {/* Footer */}
        <footer className="mt-10 text-center text-xs text-neutral-400 leading-tight space-y-1">
          <div className="text-neutral-500">© 2026</div>
          <div className="text-amber-300 font-semibold">Alaa Abdullah</div>
          <div className="text-neutral-500">All Rights Reserved</div>

          {/* Contact */}
          <div dir="ltr" className="mt-2">
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
                  d="M21.75 6.75v10.5A2.25 2.25 0 0 1 19.5 19.5H4.5A2.25 2.25 0 0 1 2.25 17.25V6.75M21.75 6.75A2.25 2.25 0 0 0 19.5 4.5H4.5A2.25 2.25 0 0 0 2.25 6.75m19.5 0-7.5 5.25a2.25 2.25 0 0 1-2.5 0l-7.5-5.25"
                />
              </svg>

              <span>:</span>

              <a
                href="mailto:contact@fazaa-app.com"
                className="text-[#f3e0b0] text-sm font-semibold tracking-[0.12em] hover:text-[#d6b56a] transition no-underline"
              >
                contact@fazaa-app.com
              </a>
            </span>
          </div>

          {/* Privacy & Terms */}
          <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-neutral-400">
            <a href="/privacy-policy" className="hover:text-[#d6b56a] transition">
              Privacy Policy
            </a>
            <span className="opacity-40">|</span>
            <a href="/terms-and-conditions" className="hover:text-[#d6b56a] transition">
              Terms & Conditions
            </a>
          </div>
        </footer>
      </div>
    </motion.main>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-sm"
    >
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="mt-2 text-sm text-neutral-300">{desc}</p>
    </motion.div>
  );
}