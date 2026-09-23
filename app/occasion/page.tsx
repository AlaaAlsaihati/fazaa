"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";
import type {
  Occasion,
  WeddingStyle,
} from "@/app/data/products";
import SiteFooter from "@/app/components/FazaaFooter";
import FazaaDrawer from "@/app/components/fazaaDrawer";
import { useLanguage } from "@/app/components/LanguageProvider";

type OccasionCard = {
  key: Occasion;

  titleAr: string;
  titleEn: string;

  subtitleAr?: string;
  subtitleEn?: string;

  icon: ReactNode;

  disabled?: boolean;

  comingSoonAr?: string;
  comingSoonEn?: string;
};

function IconPng({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      className="
        w-[270px] h-[270px]
        object-contain select-none
        drop-shadow-[0_0_12px_rgba(214,181,106,0.55)]
        brightness-105 saturate-105
        pointer-events-none
      "
    />
  );
}

const CARDS_TOP6: OccasionCard[] = [
  {
    key: "wedding",

    titleAr: "زواج",
    titleEn: "Wedding",

    subtitleAr: "إطلالة ملكية",
    subtitleEn: "A regal look",

    icon: (
      <IconPng
        src="/icons/wedding.png"
        alt="Wedding"
      />
    ),
  },

  {
    key: "engagement",

    titleAr: "خطوبة",
    titleEn: "Engagement",

    subtitleAr: "ستايل ناعم ومرتب",
    subtitleEn: "Soft and polished",

    icon: (
      <IconPng
        src="/icons/engagement.png"
        alt="Engagement"
      />
    ),
  },

  {
    key: "work",

    titleAr: "عمل",
    titleEn: "Work",

    subtitleAr: "رسمي وأنيق",
    subtitleEn: "Professional and elegant",

    icon: (
      <IconPng
        src="/icons/work.png"
        alt="Work"
      />
    ),
  },

  {
    key: "abaya",

    titleAr: "عبايات",
    titleEn: "Abayas",

    subtitleAr: "فخامة يومية",
    subtitleEn: "Everyday elegance",

    icon: (
      <IconPng
        src="/icons/abaya-v2.png"
        alt="Abayas"
      />
    ),
  },

  {
    key: "ramadan",

    titleAr: "غبقة / رمضان",
    titleEn: "Ramadan / Ghabga",

    subtitleAr: "لمسة راقية",
    subtitleEn: "A refined touch",

    icon: (
      <IconPng
        src="/icons/ramadan.png"
        alt="Ramadan"
      />
    ),
  },

  {
    key: "beach",

    titleAr: "بحر",
    titleEn: "Beach",

    subtitleAr: "",
    subtitleEn: "",

    icon: (
      <IconPng
        src="/icons/beach.png"
        alt="Beach"
      />
    ),

    disabled: true,

    comingSoonAr:
      "قريبًا — نجهزها بذوق فزعة",

    comingSoonEn:
      "Coming soon — curated the Fazaa way",
  },
];

const CHALET_CARD: OccasionCard = {
  key: "chalets",

  titleAr: "شاليهات",
  titleEn: "Chalets",

  subtitleAr: "",
  subtitleEn: "",

  icon: (
    <IconPng
      src="/icons/chalets.png"
      alt="Chalets"
    />
  ),

  disabled: true,

  comingSoonAr:
    "قريبًا — نجهزها بذوق فزعة",

  comingSoonEn:
    "Coming soon — curated the Fazaa way",
};

/* =========================
   Three dots
========================= */

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
        right:
          "calc(env(safe-area-inset-right, 0px) + 1.5rem)",
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
        <circle
          cx="5"
          cy="12"
          r="1.4"
        />

        <circle
          cx="12"
          cy="12"
          r="1.4"
        />

        <circle
          cx="19"
          cy="12"
          r="1.4"
        />
      </svg>
    </button>
  );
}

/* =========================
   Back
========================= */

function BackFab({
  onClick,
  isArabic,
}: {
  onClick: () => void;
  isArabic: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={
        isArabic
          ? "رجوع"
          : "Back"
      }
      style={{
        bottom:
          "calc(env(safe-area-inset-bottom, 0px) + 1.5rem)",
        right:
          "calc(env(safe-area-inset-right, 0px) + 1.5rem)",
      }}
      className={[
        "fixed z-50",
        "h-12 w-12 rounded-2xl",
        "border border-[#d6b56a]/55 bg-black/35 backdrop-blur",
        "shadow-[0_10px_30px_rgba(0,0,0,0.45)]",
        "flex items-center justify-center",
        "active:scale-95 transition",
      ].join(" ")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-[#d6b56a]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d={
            isArabic
              ? "M10 7l5 5-5 5"
              : "M14 7l-5 5 5 5"
          }
        />
      </svg>
    </button>
  );
}

/* =========================
   Page
========================= */

export default function OccasionPage() {
  const router = useRouter();

  const {
    isArabic,
    direction,
  } = useLanguage();

  const [occasion, setOccasion] =
    useState<Occasion | "">("");

  const [
    weddingStyle,
    setWeddingStyle,
  ] = useState<WeddingStyle>("");

  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false);

  const selectedCard = [
    ...CARDS_TOP6,
    CHALET_CARD,
  ].find(
    (card) =>
      card.key === occasion
  );

  function next() {
    if (!occasion) return;

    const params =
      new URLSearchParams();

    params.set(
      "occasion",
      occasion
    );

    if (
      occasion === "wedding"
    ) {
      if (!weddingStyle) return;

      params.set(
        "weddingStyle",
        weddingStyle
      );
    }

    router.push(
      `/skin?${params.toString()}`
    );
  }

  const nextDisabled =
    !occasion ||
    !!selectedCard?.disabled ||
    (occasion === "wedding" &&
      !weddingStyle);

  return (
    <main
      dir={direction}
      className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black p-6"
    >
      {/* ثلاث نقاط */}
      <ThreeDotsButton
        onClick={() =>
          setMenuOpen(true)
        }
        ariaLabel={
          isArabic
            ? "القائمة"
            : "Menu"
        }
      />

      {/* Drawer */}
      <FazaaDrawer
        open={menuOpen}
        onClose={() =>
          setMenuOpen(false)
        }
      />

      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <header className="mb-6">
          <p className="text-neutral-400 text-sm">
            {isArabic
              ? "فزعة"
              : "Fazaa"}
          </p>

          <h1 className="text-2xl font-bold text-white">
            {isArabic
              ? "اختاري المناسبة"
              : "Choose the Occasion"}
          </h1>

          <p className="text-neutral-400 mt-2">
            {isArabic
              ? "نضبط لك الاقتراحات حسب المناسبة، لون البشرة، والمقاس."
              : "We'll tailor your recommendations based on the occasion, skin tone, and measurements."}
          </p>
        </header>

        {/* إطار الكروت */}
        <div className="relative rounded-3xl border border-[#d6b56a]/30 bg-white/5 p-3 shadow-[0_0_0_1px_rgba(214,181,106,0.08),0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur">
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-[#d6b56a]/18" />

          <div className="pointer-events-none absolute -top-16 left-1/2 h-28 w-[520px] -translate-x-1/2 rounded-full bg-[#d6b56a]/10 blur-3xl" />

          {/* Top 6 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CARDS_TOP6.map(
              (card) => (
                <OccasionButton
                  key={
                    card.key
                  }
                  card={
                    card
                  }
                  active={
                    occasion ===
                    card.key
                  }
                  onPick={() => {
                    if (
                      card.disabled
                    ) {
                      return;
                    }

                    setOccasion(
                      card.key
                    );

                    if (
                      card.key !==
                      "wedding"
                    ) {
                      setWeddingStyle(
                        ""
                      );
                    }
                  }}
                  isArabic={
                    isArabic
                  }
                />
              )
            )}
          </div>

          {/* الشاليهات */}
          <div className="mt-3 flex justify-center">
            <div className="w-full sm:w-[calc(50%-0.375rem)]">
              <OccasionButton
                card={
                  CHALET_CARD
                }
                active={
                  occasion ===
                  CHALET_CARD.key
                }
                onPick={() => {
                  // disabled
                }}
                isArabic={
                  isArabic
                }
              />
            </div>
          </div>
        </div>

        {/* Wedding style */}
        {occasion ===
          "wedding" && (
          <section className="mt-5 rounded-2xl border border-[#d6b56a]/20 bg-white/5 p-4">
            <h3 className="text-white font-semibold">
              {isArabic
                ? "ستايل الزواج"
                : "Wedding Style"}
            </h3>

            <p className="text-neutral-400 text-sm mt-1">
              {isArabic
                ? "اختاري ناعم أو ثقيل"
                : "Choose soft or statement"}
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {(
                [
                  "ناعم",
                  "ثقيل",
                ] as const
              ).map((style) => {
                const display =
                  style === "ناعم"
                    ? isArabic
                      ? "ناعم"
                      : "Soft"
                    : isArabic
                    ? "ثقيل"
                    : "Statement";

                return (
                  <button
                    key={
                      style
                    }
                    onClick={() =>
                      setWeddingStyle(
                        style
                      )
                    }
                    type="button"
                    className={[
                      "rounded-xl border py-3 font-semibold transition",
                      "bg-black/20 border-white/10 text-white hover:bg-black/30",
                      weddingStyle ===
                      style
                        ? "ring-2 ring-[#d6b56a]/30 border-[#d6b56a]/40"
                        : "",
                    ].join(
                      " "
                    )}
                  >
                    {display}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Next */}
        <button
          onClick={next}
          disabled={
            nextDisabled
          }
          type="button"
          className="relative z-10 mt-6 w-full rounded-2xl border border-[#d6b56a]/45 bg-gradient-to-r from-[#d6b56a]/25 via-white/5 to-[#d6b56a]/15 py-3 text-sm font-extrabold text-white transition disabled:opacity-40"
        >
          {isArabic
            ? "التالي"
            : "Next"}
        </button>

        <SiteFooter />
      </div>

      {/* رجوع */}
      <BackFab
        onClick={() =>
          router.back()
        }
        isArabic={
          isArabic
        }
      />
    </main>
  );
}

/* =========================
   Occasion card
========================= */

function OccasionButton({
  card,
  active,
  onPick,
  isArabic,
}: {
  card: OccasionCard;
  active: boolean;
  onPick: () => void;
  isArabic: boolean;
}) {
  const title = isArabic
    ? card.titleAr
    : card.titleEn;

  const subtitle = isArabic
    ? card.subtitleAr
    : card.subtitleEn;

  const comingSoon =
    isArabic
      ? card.comingSoonAr
      : card.comingSoonEn;

  return (
    <button
      disabled={
        !!card.disabled
      }
      onClick={onPick}
      type="button"
      aria-disabled={
        !!card.disabled
      }
      className={[
        "w-full relative rounded-2xl border p-4 transition",
        isArabic
          ? "text-right"
          : "text-left",
        "bg-white/5 hover:bg-white/10",
        "border-[#d6b56a]/25 hover:border-[#d6b56a]/45",
        "min-h-[92px]",
        "overflow-visible",
        active
          ? "ring-2 ring-[#d6b56a]/30"
          : "",
        card.disabled
          ? "opacity-55 cursor-not-allowed"
          : "",
      ].join(" ")}
    >
      {/* علامة الاختيار */}
      {active && (
        <span className="absolute top-2 left-2 z-30 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black border border-[#d6b56a]/85 pointer-events-none">
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 text-[#d6b56a]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 6 9 17l-5-5"
            />
          </svg>
        </span>
      )}

      {/* الأيقونة */}
      <div className="absolute left-[-57px] top-1/2 -translate-y-1/2 pointer-events-none">
        <div className="absolute inset-0 -z-10 h-[110px] w-[110px] rounded-full bg-[#d6b56a]/10 blur-2xl" />

        {card.icon}
      </div>

      {/* المحتوى */}
      <div className="pl-[92px]">
        <div>
          <h2 className="text-white font-semibold">
            {title}
          </h2>

          {subtitle ? (
            <p className="text-neutral-400 text-sm mt-1">
              {subtitle}
            </p>
          ) : null}

          {card.disabled ? (
            <p className="mt-2 text-[11px] text-[#d6b56a]/90">
              {comingSoon ||
                (isArabic
                  ? "قريبًا — نجهزها بذوق فزعة"
                  : "Coming soon — curated the Fazaa way")}
            </p>
          ) : null}
        </div>

        <div className="mt-3 h-px bg-white/10" />

        <p className="mt-2 text-[11px] text-neutral-400">
          {card.disabled
            ? isArabic
              ? "قريبًا"
              : "Coming soon"
            : ""}
        </p>
      </div>
    </button>
  );
}