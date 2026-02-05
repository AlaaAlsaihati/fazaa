"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";
import type { Occasion, WeddingStyle } from "@/app/data/products";
import SiteFooter from "@/app/components/FazaaFooter";

type OccasionCard = {
  key: Occasion;
  title: string;
  subtitle?: string;
  icon: ReactNode;
  disabled?: boolean;
  comingSoonText?: string;
};

function IconPng({ src, alt }: { src: string; alt: string }) {
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
    title: "زواج",
    subtitle: "إطلالة ملكية",
    icon: <IconPng src="/icons/wedding.png" alt="زواج" />,
  },
  {
    key: "engagement",
    title: "خطوبة",
    subtitle: "ستايل ناعم ومرتب",
    icon: <IconPng src="/icons/engagement.png" alt="خطوبة" />,
  },
  {
    key: "work",
    title: "عمل",
    subtitle: "رسمي وأنيق",
    icon: <IconPng src="/icons/work.png" alt="عمل" />,
  },
  {
    key: "abaya",
    title: "عبايات",
    subtitle: "فخامة يومية",
    icon: <IconPng src="/icons/abaya-v2.png" alt="عبايات" />,
  },
  {
    key: "ramadan",
    title: "غبقة / رمضان",
    subtitle: "لمسة راقية",
    icon: <IconPng src="/icons/ramadan.png" alt="غبقة / رمضان" />,
  },
  {
    key: "beach",
    title: "بحر",
    subtitle: "",
    icon: <IconPng src="/icons/beach.png" alt="بحر" />,
    disabled: true,
    comingSoonText: "قريبًا — نجهزها بذوق فزعة",
  },
];

const CHALET_CARD: OccasionCard = {
  key: "chalets",
  title: "شاليهات",
  subtitle: "",
  icon: <IconPng src="/icons/chalets.png" alt="شاليهات" />,
  disabled: true,
  comingSoonText: "قريبًا — نجهزها بذوق فزعة",
};

export default function OccasionPage() {
  const router = useRouter();
  const [occasion, setOccasion] = useState<Occasion | "">("");
  const [weddingStyle, setWeddingStyle] = useState<WeddingStyle>("");

  const selectedCard = [...CARDS_TOP6, CHALET_CARD].find((c) => c.key === occasion);

  function next() {
    if (!occasion) return;

    const params = new URLSearchParams();
    params.set("occasion", occasion);

    if (occasion === "wedding") {
      if (!weddingStyle) return;
      params.set("weddingStyle", weddingStyle);
    }

    router.push(`/skin?${params.toString()}`);
  }

  const nextDisabled =
    !occasion ||
    !!selectedCard?.disabled ||
    (occasion === "wedding" && !weddingStyle);

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black p-6"
    >
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <header className="mb-6">
          <p className="text-neutral-400 text-sm">فزعة</p>
          <h1 className="text-2xl font-bold text-white">اختاري المناسبة</h1>
          <p className="text-neutral-400 mt-2">
            نضبط لك الاقتراحات حسب المناسبة، لون البشرة، والمقاس.
          </p>
        </header>

        {/* ✅ الإطار الذهبي اللي يجمع الكروت */}
        <div className="relative rounded-3xl border border-[#d6b56a]/30 bg-white/5 p-3 shadow-[0_0_0_1px_rgba(214,181,106,0.08),0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur">
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-[#d6b56a]/18" />
          <div className="pointer-events-none absolute -top-16 left-1/2 h-28 w-[520px] -translate-x-1/2 rounded-full bg-[#d6b56a]/10 blur-3xl" />

          {/* Top 6 (2×3) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CARDS_TOP6.map((o) => (
              <OccasionButton
                key={o.key}
                o={o}
                active={occasion === o.key}
                onPick={() => {
                  if (o.disabled) return;
                  setOccasion(o.key);
                  if (o.key !== "wedding") setWeddingStyle("");
                }}
              />
            ))}
          </div>

          {/* ✅ الشاليهات كرت لوحده تحت بالنص + نفس الحجم */}
          <div className="mt-3 flex justify-center">
            <div className="w-full sm:w-[calc(50%-0.375rem)]">
              <OccasionButton
                o={CHALET_CARD}
                active={occasion === CHALET_CARD.key}
                onPick={() => {
                  // disabled
                }}
              />
            </div>
          </div>
        </div>

        {/* Wedding style */}
        {occasion === "wedding" && (
          <section className="mt-5 rounded-2xl border border-[#d6b56a]/20 bg-white/5 p-4">
            <h3 className="text-white font-semibold">ستايل الزواج</h3>
            <p className="text-neutral-400 text-sm mt-1">اختاري ناعم أو ثقيل</p>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {(["ناعم", "ثقيل"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setWeddingStyle(s as WeddingStyle)}
                  type="button"
                  className={[
                    "rounded-xl border py-3 font-semibold transition",
                    "bg-black/20 border-white/10 text-white hover:bg-black/30",
                    weddingStyle === s
                      ? "ring-2 ring-[#d6b56a]/30 border-[#d6b56a]/40"
                      : "",
                  ].join(" ")}
                >
                  {s}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Next */}
        <button
          onClick={next}
          disabled={nextDisabled}
          type="button"
          className="relative z-10 mt-6 w-full rounded-2xl border border-[#d6b56a]/45 bg-gradient-to-r from-[#d6b56a]/25 via-white/5 to-[#d6b56a]/15 py-3 text-sm font-extrabold text-white transition disabled:opacity-40"
          /* ✅ FIX: رفعنا الزر فوق أي عناصر طالعة من الكروت */
        >
          التالي
        </button>

        <SiteFooter />
      </div>
    </main>
  );
}

function OccasionButton({
  o,
  active,
  onPick,
}: {
  o: OccasionCard;
  active: boolean;
  onPick: () => void;
}) {
  return (
    <button
      disabled={!!o.disabled}
      onClick={onPick}
      type="button"
      aria-disabled={!!o.disabled}
      className={[
        "w-full relative rounded-2xl border p-4 text-right transition",
        "bg-white/5 hover:bg-white/10",
        "border-[#d6b56a]/25 hover:border-[#d6b56a]/45",
        "min-h-[92px]",
        "overflow-visible",
        active ? "ring-2 ring-[#d6b56a]/30" : "",
        o.disabled ? "opacity-55 cursor-not-allowed" : "",
      ].join(" ")}
    >
      {/* ✅ علامة الاختيار (داخل الكرت) */}
      {active && (
        <span className="absolute top-2 left-2 z-30 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black border border-[#d6b56a]/85 pointer-events-none">
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 text-[#d6b56a]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 6 9 17l-5-5" />
          </svg>
        </span>
      )}

      {/* ✅ الأيقونة يسار + كبيرة + مدموجة */}
      <div
        className="absolute left-[-57px] top-1/2 -translate-y-1/2 pointer-events-none"
        /* ✅ FIX: أهم سطر — يمنع الأيقونة تغطي زر التالي وتخطف الضغط */
      >
        {/* glow base (خففناه شوي) */}
        <div className="absolute inset-0 -z-10 h-[110px] w-[110px] rounded-full bg-[#d6b56a]/10 blur-2xl" />
        {o.icon}
      </div>

      {/* ✅ محتوى الكرت */}
      <div className="pl-[92px]">
        <div>
          <h2 className="text-white font-semibold">{o.title}</h2>

          {o.subtitle ? <p className="text-neutral-400 text-sm mt-1">{o.subtitle}</p> : null}

          {o.disabled ? (
            <p className="mt-2 text-[11px] text-[#d6b56a]/90">
              {o.comingSoonText ?? "قريبًا — نجهزها بذوق فزعة"}
            </p>
          ) : null}
        </div>

        <div className="mt-3 h-px bg-white/10" />
        <p className="mt-2 text-[11px] text-neutral-400">{o.disabled ? "قريبًا" : "اضغطي للاختيار"}</p>
      </div>
    </button>
  );
}