"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import FazaaDrawer from "@/app/components/fazaaDrawer";
import { useLanguage } from "@/app/components/LanguageProvider";

/** ثلاث نقاط مع Safe Area */
function ThreeDotsButton({
  onClick,
  ariaLabel,
}: {
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        top: "calc(env(safe-area-inset-top, 0px) + 1.5rem)",
        right: "calc(env(safe-area-inset-right, 0px) + 1.5rem)",
      }}
      className={[
        "fixed z-30",
        "h-12 w-12 rounded-2xl",
        "border border-[#d6b56a]/45 bg-black/35 backdrop-blur",
        "shadow-[0_10px_30px_rgba(0,0,0,0.45)]",
        "flex items-center justify-center",
        "active:scale-95 transition",
      ].join(" ")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-[#d6b56a]"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <circle cx="5" cy="12" r="1.4" />
        <circle cx="12" cy="12" r="1.4" />
        <circle cx="19" cy="12" r="1.4" />
      </svg>
    </button>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const {
    isArabic,
    direction,
  } = useLanguage();

  return (
    <motion.main
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        ease: "easeOut",
      }}
      dir={direction}
      className="relative min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black text-white flex items-center justify-center p-6 overflow-hidden"
    >
      {/* زر الثلاث نقاط */}
      <ThreeDotsButton
        onClick={() => setMenuOpen(true)}
        ariaLabel={
          isArabic ? "القائمة" : "Menu"
        }
      />

      {/* Drawer */}
      <FazaaDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <div className="relative w-full max-w-6xl">
        {/* Hero Card */}
        <motion.div
          initial={{
            opacity: 0,
            y: 14,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.9,
            delay: 0.08,
            ease: "easeOut",
          }}
          className="relative rounded-[28px] border border-amber-300/30 bg-white/5 backdrop-blur-xl p-10 shadow-[0_0_60px_rgba(212,175,55,0.08)]"
        >
          {/* Title */}
          <motion.h1
            initial={{
              opacity: 0,
              letterSpacing: "0.9em",
            }}
            animate={{
              opacity: 1,
              letterSpacing: "0.45em",
            }}
            transition={{
              duration: 1.2,
              delay: 0.05,
              ease: "easeOut",
            }}
            className="text-center text-5xl sm:text-6xl font-extrabold tracking-[0.45em]"
          >
            FAZAA
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.9,
              delay: 0.18,
              ease: "easeOut",
            }}
            className="mt-4 text-center text-2xl sm:text-3xl font-semibold tracking-wide text-amber-300/90"
          >
            {isArabic
              ? "إطلالة تليق بك"
              : "A Look Made for You"}
          </motion.p>

          {/* Divider */}
          <motion.div
            initial={{
              opacity: 0,
              scaleX: 0.6,
            }}
            animate={{
              opacity: 1,
              scaleX: 1,
            }}
            transition={{
              duration: 0.9,
              delay: 0.22,
              ease: "easeOut",
            }}
            className="mx-auto mt-6 h-px w-28 bg-gradient-to-r from-transparent via-amber-300/50 to-transparent origin-center"
          />

          {/* Description */}
          <motion.p
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.9,
              delay: 0.28,
              ease: "easeOut",
            }}
            className="mt-6 text-center text-neutral-300 max-w-3xl mx-auto leading-loose"
          >
            {isArabic
              ? "توصيات مخصصة حسب المناسبة، لون بشرتك ومقاساتك، لتصلي إلى القطع الأقرب لك مع مقاس مقترح لكل قطعة."
              : "Personalized recommendations based on your occasion, skin tone, and measurements, helping you discover pieces that suit you with a suggested size for each item."}
          </motion.p>

          {/* CTA */}
          <div className="mt-10 flex items-center justify-center">
            <motion.button
              whileHover={{
                scale: 1.04,
              }}
              whileTap={{
                scale: 0.97,
              }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 18,
              }}
              onClick={() =>
                router.push("/occasion")
              }
              className="px-10 py-3 rounded-xl font-semibold border border-amber-300/50 text-amber-300 hover:bg-amber-300/10 transition"
            >
              {isArabic
                ? "ابدئي التجربة ✨"
                : "Start the Experience ✨"}
            </motion.button>
          </div>

          {/* Features */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {
                opacity: 0,
              },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.08,
                  delayChildren: 0.35,
                },
              },
            }}
            className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-5"
          >
            <Feature
              title={
                isArabic
                  ? "توصيات مخصصة"
                  : "Personalized Recommendations"
              }
              desc={
                isArabic
                  ? "حسب المناسبة، لون البشرة والمقاسات"
                  : "Based on your occasion, skin tone, and measurements"
              }
            />

            <Feature
              title={
                isArabic
                  ? "مقاس مقترح"
                  : "Suggested Size"
              }
              desc={
                isArabic
                  ? "اقتراح المقاس المناسب لكل قطعة"
                  : "A suggested size for every recommended piece"
              }
            />

            <Feature
              title={
                isArabic
                  ? "متاجر مختارة"
                  : "Selected Stores"
              }
              desc={
                isArabic
                  ? "روابط مباشرة للقطع المقترحة"
                  : "Direct links to recommended products"
              }
            />
          </motion.div>
        </motion.div>

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-neutral-400 leading-tight space-y-0">
          <div className="text-neutral-500">
            © 2026
          </div>

          {/* يظهر في الصفحة الرئيسية فقط */}
          <div className="text-amber-300 text-[12px] font-medium">
            Alaa Abdullah
          </div>

          <div className="text-neutral-500">
            {isArabic
              ? "جميع الحقوق محفوظة"
              : "All Rights Reserved"}
          </div>

          {/* Support, Terms & Privacy */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-neutral-400">
            <a
              href="/support"
              className="hover:text-[#d6b56a] transition no-underline"
            >
              {isArabic
                ? "الدعم"
                : "Support"}
            </a>

            <span className="opacity-60">
              •
            </span>

            <a
              href="/terms-and-conditions"
              className="hover:text-[#d6b56a] transition no-underline"
            >
              {isArabic
                ? "الشروط والأحكام"
                : "Terms & Conditions"}
            </a>

            <span className="opacity-60">
              •
            </span>

            <a
              href="/privacy-policy"
              className="hover:text-[#d6b56a] transition no-underline"
            >
              {isArabic
                ? "سياسة الخصوصية"
                : "Privacy Policy"}
            </a>
          </div>
        </footer>
      </div>
    </motion.main>
  );
}

function Feature({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: {
          opacity: 0,
          y: 12,
        },
        show: {
          opacity: 1,
          y: 0,
        },
      }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
      className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-sm"
    >
      <h3 className="font-semibold text-lg">
        {title}
      </h3>

      <p className="mt-2 text-sm text-neutral-300">
        {desc}
      </p>
    </motion.div>
  );
}