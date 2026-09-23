"use client";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useState } from "react";
import SiteFooter from "@/app/components/FazaaFooter";
import FazaaDrawer from "@/app/components/fazaaDrawer";
import { useLanguage } from "@/app/components/LanguageProvider";

type Depth =
  | "فاتح جدًا"
  | "فاتح"
  | "حنطي"
  | "حنطي غامق"
  | "أسمر"
  | "داكن"
  | "";

type Undertone =
  | "بارد"
  | "دافئ"
  | "محايد"
  | "زيتوني"
  | "";

type DepthValue = Exclude<Depth, "">;
type UndertoneValue = Exclude<Undertone, "">;

/* =========================
   Skin depth
========================= */

const DEPTH_OPTIONS: {
  value: DepthValue;
  labelAr: string;
  labelEn: string;
  color: string;
}[] = [
  {
    value: "فاتح جدًا",
    labelAr: "فاتح جدًا",
    labelEn: "Very Fair",
    color: "#fdecef",
  },
  {
    value: "فاتح",
    labelAr: "فاتح",
    labelEn: "Fair",
    color: "#f6e6d8",
  },
  {
    value: "حنطي",
    labelAr: "حنطي",
    labelEn: "Medium",
    color: "#e1c4a8",
  },
  {
    value: "حنطي غامق",
    labelAr: "حنطي غامق",
    labelEn: "Tan",
    color: "#c49a6c",
  },
  {
    value: "أسمر",
    labelAr: "أسمر",
    labelEn: "Deep",
    color: "#8d5a3b",
  },
  {
    value: "داكن",
    labelAr: "داكن",
    labelEn: "Very Deep",
    color: "#3b2a23",
  },
];

/* =========================
   Undertone
========================= */

const UNDERTONE_OPTIONS: {
  value: UndertoneValue;
  labelAr: string;
  labelEn: string;
}[] = [
  {
    value: "بارد",
    labelAr: "بارد",
    labelEn: "Cool",
  },
  {
    value: "دافئ",
    labelAr: "دافئ",
    labelEn: "Warm",
  },
  {
    value: "محايد",
    labelAr: "محايد",
    labelEn: "Neutral",
  },
  {
    value: "زيتوني",
    labelAr: "زيتوني",
    labelEn: "Olive",
  },
];

const UNDERTONE_ICON_SRC: Record<
  UndertoneValue,
  string
> = {
  بارد: "/icons/undertone/cool.png",
  دافئ: "/icons/undertone/warm.png",
  محايد: "/icons/undertone/neutral.png",
  زيتوني: "/icons/undertone/olive-v2.png",
};

/* =========================
   Selected badge
========================= */

function SelectedBadge() {
  return (
    <span className="absolute top-0 left-0 -translate-x-1 -translate-y-1 z-30 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black border border-[#d6b56a] pointer-events-none">
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
  );
}

/* =========================
   Undertone icon
========================= */

function UndertoneIcon({
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
        h-[100px] w-[100px]
        object-contain select-none
        drop-shadow-[0_0_12px_rgba(214,181,106,0.55)]
        brightness-110 saturate-110
        pointer-events-none
      "
    />
  );
}

/* =========================
   Back button
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
        isArabic ? "رجوع" : "Back"
      }
      className="
        fixed bottom-6 right-6 z-50
        h-12 w-12 rounded-2xl
        border border-[#d6b56a]/55 bg-black/35 backdrop-blur
        shadow-[0_10px_30px_rgba(0,0,0,0.45)]
        flex items-center justify-center
        transition active:scale-95
      "
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
        top:
          "calc(env(safe-area-inset-top, 0px) + 1.5rem)",
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
   Page
========================= */

export default function SkinClient() {
  const router = useRouter();
  const sp = useSearchParams();

  const {
    isArabic,
    direction,
  } = useLanguage();

  const [depth, setDepth] =
    useState<Depth>("");

  const [
    undertone,
    setUndertone,
  ] = useState<Undertone>("");

  const [
    drawerOpen,
    setDrawerOpen,
  ] = useState(false);

  function next() {
    if (!depth || !undertone) {
      return;
    }

    const params =
      new URLSearchParams(
        sp.toString()
      );

    /*
      مهم:
      نخزن القيم العربية الأصلية
      حتى يظل منطق التوصيات كما هو.
    */
    params.set(
      "depth",
      depth
    );

    params.set(
      "undertone",
      undertone
    );

    router.push(
      `/measurements?${params.toString()}`
    );
  }

  return (
    <main
      dir={direction}
      className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black px-4 py-4"
    >
      <div className="mx-auto w-full max-w-xl">
        {/* Header */}
        <header className="mb-3">
          <p className="text-neutral-400 text-xs">
            {isArabic
              ? "فزعة"
              : "Fazaa"}
          </p>

          <h1 className="text-xl sm:text-2xl font-bold text-white">
            {isArabic
              ? "اختاري لون البشرة"
              : "Choose Your Skin Tone"}
          </h1>

          <p className="text-neutral-400 mt-1 text-sm">
            {isArabic
              ? "عشان نطلع لك ألوان تبرزك وتطلع خيالية عليك ✨"
              : "We'll use it to recommend colors that complement you beautifully ✨"}
          </p>
        </header>

        {/* =====================
            Skin depth
        ====================== */}

        <section className="rounded-2xl border border-[#d6b56a]/20 bg-white/5 p-3 backdrop-blur">
          <h2 className="text-white font-semibold text-sm">
            {isArabic
              ? "درجة البشرة"
              : "Skin Tone"}
          </h2>

          <p className="text-neutral-400 text-xs mt-1">
            {isArabic
              ? "اختاري الدرجة الأقرب لك"
              : "Choose the shade closest to yours"}
          </p>

          <div className="mt-3 grid grid-cols-3 gap-3">
            {DEPTH_OPTIONS.map(
              (option) => {
                const active =
                  depth ===
                  option.value;

                const label =
                  isArabic
                    ? option.labelAr
                    : option.labelEn;

                return (
                  <button
                    key={
                      option.value
                    }
                    onClick={() =>
                      setDepth(
                        option.value
                      )
                    }
                    className="flex flex-col items-center gap-2"
                    type="button"
                  >
                    <div className="relative overflow-visible">
                      <div
                        className={[
                          "h-12 w-12 sm:h-14 sm:w-14 rounded-full transition border",
                          active
                            ? "border-[#d6b56a] ring-2 ring-[#d6b56a]/35"
                            : "border-[#d6b56a]/35 hover:border-[#d6b56a]/70",
                        ].join(
                          " "
                        )}
                        style={{
                          backgroundColor:
                            option.color,
                        }}
                      />

                      {active && (
                        <SelectedBadge />
                      )}
                    </div>

                    <span
                      className={[
                        "text-xs sm:text-sm font-semibold text-center",
                        active
                          ? "text-[#f3e0b0]"
                          : "text-neutral-300",
                      ].join(
                        " "
                      )}
                    >
                      {label}
                    </span>
                  </button>
                );
              }
            )}
          </div>
        </section>

        {/* =====================
            Undertone
        ====================== */}

        <section className="mt-3 rounded-2xl border border-[#d6b56a]/20 bg-white/5 p-3 backdrop-blur">
          <h2 className="text-white font-semibold text-sm">
            {isArabic
              ? "الأندرتون"
              : "Undertone"}
          </h2>

          <p className="text-neutral-400 text-xs mt-1">
            {isArabic
              ? "التدرج الداخلي للبشرة"
              : "The underlying tone of your skin"}
          </p>

          <details className="mt-3 mb-3 rounded-xl bg-black/25 border border-white/10 px-4 py-3">
            <summary className="cursor-pointer text-xs text-[#f3e0b0] font-semibold">
              {isArabic
                ? "كيف أحدد الأندرتون؟"
                : "How do I find my undertone?"}
            </summary>

            <div className="mt-2 text-xs text-neutral-300 space-y-2">
              <ul
                className={[
                  "list-disc space-y-1",
                  isArabic
                    ? "pr-5"
                    : "pl-5",
                ].join(" ")}
              >
                <li>
                  {isArabic
                    ? "عروق زرقاء/ بنفسجية → بارد"
                    : "Blue or purple veins → Cool"}
                </li>

                <li>
                  {isArabic
                    ? "عروق خضراء → دافئ"
                    : "Green veins → Warm"}
                </li>

                <li>
                  {isArabic
                    ? "صعب تميز اللون → محايد"
                    : "Hard to tell → Neutral"}
                </li>

                <li>
                  {isArabic
                    ? "أخضر مائل للرمادي → زيتوني"
                    : "Green with a grayish tone → Olive"}
                </li>
              </ul>
            </div>
          </details>

          <div className="grid grid-cols-2 gap-3">
            {UNDERTONE_OPTIONS.map(
              (option) => (
                <UndertoneCard
                  key={
                    option.value
                  }
                  value={
                    option.value
                  }
                  label={
                    isArabic
                      ? option.labelAr
                      : option.labelEn
                  }
                  iconSrc={
                    UNDERTONE_ICON_SRC[
                      option.value
                    ]
                  }
                  active={
                    undertone ===
                    option.value
                  }
                  onPick={() =>
                    setUndertone(
                      option.value
                    )
                  }
                  isArabic={
                    isArabic
                  }
                />
              )
            )}
          </div>
        </section>

        {/* Next */}
        <button
          onClick={next}
          disabled={
            !depth ||
            !undertone
          }
          type="button"
          className="mt-4 w-full rounded-2xl border border-[#d6b56a]/45 bg-gradient-to-r from-[#d6b56a]/25 via-white/5 to-[#d6b56a]/15 py-3 text-sm font-extrabold text-white transition disabled:opacity-40"
        >
          {isArabic
            ? "التالي"
            : "Next"}
        </button>

        <div className="mt-3">
          <SiteFooter />
        </div>
      </div>

      {/* Three dots */}
      <ThreeDotsButton
        onClick={() =>
          setDrawerOpen(true)
        }
        ariaLabel={
          isArabic
            ? "القائمة"
            : "Menu"
        }
      />

      {/* Drawer */}
      <FazaaDrawer
        open={drawerOpen}
        onClose={() =>
          setDrawerOpen(false)
        }
      />

      {/* Back */}
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
   Undertone card
========================= */

function UndertoneCard({
  value,
  label,
  iconSrc,
  active,
  onPick,
  isArabic,
}: {
  value: UndertoneValue;
  label: string;
  iconSrc: string;
  active: boolean;
  onPick: () => void;
  isArabic: boolean;
}) {
  return (
    <button
      onClick={onPick}
      type="button"
      aria-label={label}
      data-value={value}
      className={[
        "w-full relative rounded-xl border p-3 transition",
        isArabic
          ? "text-right"
          : "text-left",
        "bg-white/5 hover:bg-white/10",
        "border-[#d6b56a]/25 hover:border-[#d6b56a]/45",
        "min-h-[72px]",
        "overflow-visible",
        active
          ? "ring-2 ring-[#d6b56a]/30"
          : "",
      ].join(" ")}
    >
      {active && (
        <SelectedBadge />
      )}

      <div
        className={[
          "absolute top-1/2 -translate-y-1/2",
          isArabic
            ? "left-[0px]"
            : "right-[0px]",
        ].join(" ")}
      >
        <UndertoneIcon
          src={iconSrc}
          alt={label}
        />
      </div>

      <div
        className={
          isArabic
            ? "pl-[20px]"
            : "pr-[20px]"
        }
      >
        <div className="flex items-center justify-center gap-1">
          <span className="text-white font-semibold text-lg">
            {label}
          </span>
        </div>
      </div>
    </button>
  );
}