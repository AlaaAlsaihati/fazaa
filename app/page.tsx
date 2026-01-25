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

          {/* CTA Button (واحد فقط) */}
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

          {/* Feature Cards */}
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
            <Feature
              title="اختيار ذكي"
              desc="تحليل المناسبة، لون البشرة والمقاسات"
            />
            <Feature title="مقاس مقترح" desc="نحسب لك المقاس الأنسب لكل قطعة" />
            <Feature title="متاجر مختارة" desc="روابط مباشرة لمنتجات فخمة" />
          </motion.div>
        </motion.div>

        {/* Footer */}
        <footer className="mt-10 text-center text-sm text-neutral-400">
          <div className="text-xs text-neutral-500 mb-1">© 2026</div>

          <div className="text-amber-300 font-semibold tracking-wide">
            Alaa Abdullah
          </div>

          <div className="text-xs mt-1 text-neutral-500">All Rights Reserved</div>

          {/* For contact (LTR + تحت الحقوق ع طول) */}
          <div
            dir="ltr"
            className="mt-0 text-xs text-neutral-400"
          >
            <span className="inline-flex items-center gap-2">
              <span>For contact</span>
              <span aria-hidden>✉️</span>
              <span>:</span>
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