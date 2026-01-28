"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";
import type { Occasion, WeddingStyle } from "@/app/data/products";
import SiteFooter from "@/app/components/FazaaFooter";

/* ========= ستايل ذهبي لامع للأيقونات ========= */

function GoldIconWrap({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-flex items-center justify-center">
      {/* glow خلفي خفيف */}
      <span className="absolute -inset-2 rounded-full bg-[#d6b56a]/10 blur-md" />
      <span className="relative">{children}</span>
    </span>
  );
}

function GoldDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff2c2" stopOpacity="1" />
        <stop offset="0.35" stopColor="#f3cf7a" stopOpacity="1" />
        <stop offset="0.7" stopColor="#d6b56a" stopOpacity="1" />
        <stop offset="1" stopColor="#a6762a" stopOpacity="1" />
      </linearGradient>

      <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1.8" result="blur" />
        <feColorMatrix
          in="blur"
          type="matrix"
          values="
            1 0 0 0 0.85
            0 1 0 0 0.70
            0 0 1 0 0.25
            0 0 0 0.55 0"
          result="goldBlur"
        />
        <feMerge>
          <feMergeNode in="goldBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

/* ========= أيقونات (ذهب + لمعة) ========= */

/** زواج — فستان “ساعة رملية” بدون علاق */
function IconWedding() {
  const id = "wedding";
  return (
    <GoldIconWrap>
      <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden>
        <GoldDefs id={id} />
        <g filter={`url(#${id}-glow)`} fill={`url(#${id}-g)`}>
          {/* bodice */}
          <path d="M32 10c-5 2-8 6-9 10 3 2 6 3 9 3s6-1 9-3c-1-4-4-8-9-10Z" />
          {/* waist + hourglass silhouette */}
          <path d="M23 24c2 9-2 14-7 22-1 2 0 4 2 5 8 4 17 4 28 0 2-1 3-3 2-5-5-8-9-13-7-22-3 2-6 3-9 3s-6-1-9-3Z" />
          {/* hem */}
          <path d="M16 54c6 4 12 6 16 6s10-2 16-6c-10 2-22 2-32 0Z" />
          {/* sparkle */}
          <path d="M50 18l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4Z" opacity="0.75" />
        </g>
      </svg>
    </GoldIconWrap>
  );
}

/** خطوبة — خاتم فخم */
function IconEngagement() {
  const id = "engagement";
  return (
    <GoldIconWrap>
      <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden>
        <GoldDefs id={id} />
        <g filter={`url(#${id}-glow)`} fill="none" stroke={`url(#${id}-g)`} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 28l10-14 10 14" />
          <path d="M32 26l6 8H26l6-8Z" />
          <circle cx="32" cy="40" r="12" />
          <path d="M22 40c4 3 8 4 10 4s6-1 10-4" opacity="0.65" />
        </g>
      </svg>
    </GoldIconWrap>
  );
}

/** عمل — حقيبة */
function IconWork() {
  const id = "work";
  return (
    <GoldIconWrap>
      <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden>
        <GoldDefs id={id} />
        <g filter={`url(#${id}-glow)`} fill="none" stroke={`url(#${id}-g)`} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 22h24a6 6 0 0 1 6 6v18a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6V28a6 6 0 0 1 6-6Z" />
          <path d="M26 22v-4a6 6 0 0 1 6-6h0a6 6 0 0 1 6 6v4" />
          <path d="M14 34h36" opacity="0.55" />
        </g>
      </svg>
    </GoldIconWrap>
  );
}

/** عبايات — عباية واضحة (مو فستان) */
function IconAbaya() {
  const id = "abaya";
  return (
    <GoldIconWrap>
      <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden>
        <GoldDefs id={id} />
        <g filter={`url(#${id}-glow)`} fill="none" stroke={`url(#${id}-g)`} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          {/* hood/neck */}
          <path d="M32 12c-6 3-10 8-10 12 4 3 7 4 10 4s6-1 10-4c0-4-4-9-10-12Z" />
          {/* abaya body (wide sleeves + straight fall) */}
          <path d="M18 26c-4 8-6 16-6 26 0 3 2 6 6 6h28c4 0 6-3 6-6 0-10-2-18-6-26" />
          <path d="M20 30c4 4 8 6 12 6s8-2 12-6" opacity="0.6" />
          {/* center seam */}
          <path d="M32 28v30" opacity="0.45" />
        </g>
      </svg>
    </GoldIconWrap>
  );
}

/** غبقة/رمضان — هلال + لمعة */
function IconRamadan() {
  const id = "ramadan";
  return (
    <GoldIconWrap>
      <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden>
        <GoldDefs id={id} />
        <g filter={`url(#${id}-glow)`} fill={`url(#${id}-g)`}>
          {/* crescent */}
          <path d="M40 14c-10 3-18 13-18 24 0 12 9 22 21 22 5 0 9-1 13-4-4 1-8 1-12 0-10-2-18-11-18-22 0-9 5-17 14-20Z" />
          {/* sparkle */}
          <path d="M48 24l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4Z" opacity="0.8" />
        </g>
      </svg>
    </GoldIconWrap>
  );
}

/** بحر — موج + نجمة */
function IconBeach() {
  const id = "beach";
  return (
    <GoldIconWrap>
      <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden>
        <GoldDefs id={id} />
        <g filter={`url(#${id}-glow)`} fill="none" stroke={`url(#${id}-g)`} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 36c6-6 12-6 18 0s12 6 18 0 12-6 18 0" />
          <path d="M10 44c6-6 12-6 18 0s12 6 18 0 12-6 18 0" />
          <path d="M48 18l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4Z" opacity="0.8" />
        </g>
      </svg>
    </GoldIconWrap>
  );
}

/** الشاليهات — نخلة/كوخ */
function IconChalets() {
  const id = "chalets";
  return (
    <GoldIconWrap>
      <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden>
        <GoldDefs id={id} />
        <g filter={`url(#${id}-glow)`} fill="none" stroke={`url(#${id}-g)`} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          {/* island */}
          <path d="M14 44c6-6 30-6 36 0" />
          {/* hut */}
          <path d="M36 38l8 6v10H28V44l8-6Z" />
          <path d="M28 44h16" opacity="0.55" />
          {/* palm */}
          <path d="M20 26v28" />
          <path d="M20 26c-6 2-10 6-12 10" />
          <path d="M20 26c6 2 10 6 12 10" />
        </g>
      </svg>
    </GoldIconWrap>
  );
}

/* ========= البيانات ========= */

type OccasionCard = {
  key: Occasion;
  title: string;
  subtitle?: string;
  icon: ReactNode;
  disabled?: boolean;
  comingSoonText?: string;
};

const OCCASIONS: OccasionCard[] = [
  { key: "wedding", title: "زواج", subtitle: "إطلالة ملكية", icon: <IconWedding /> },
  { key: "engagement", title: "خطوبة", subtitle: "ستايل ناعم ومرتب", icon: <IconEngagement /> },

  { key: "work", title: "عمل", subtitle: "رسمي وأنيق", icon: <IconWork /> },
  { key: "abaya", title: "عبايات", subtitle: "فخامة يومية", icon: <IconAbaya /> },
  { key: "ramadan", title: "غبقة / رمضان", subtitle: "لمسة راقية", icon: <IconRamadan /> },

  {
    key: "beach",
    title: "البحر",
    subtitle: "",
    icon: <IconBeach />,
    disabled: true,
    comingSoonText: "قريبًا — نجهزها بذوق فزعة",
  },

  {
    key: "chalets",
    title: "الشاليهات",
    subtitle: "",
    icon: <IconChalets />,
    disabled: true,
    comingSoonText: "قريبًا — نجهزها بذوق فزعة",
  },
];

/* ========= الصفحة ========= */

export default function OccasionPage() {
  const router = useRouter();
  const [occasion, setOccasion] = useState<Occasion | "">("");
  const [weddingStyle, setWeddingStyle] = useState<WeddingStyle>("");

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

  const firstSix = OCCASIONS.filter((o) => o.key !== "chalets");
  const chalets = OCCASIONS.find((o) => o.key === "chalets");

  return (
    <main dir="rtl" className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black p-6">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <header className="mb-6">
          <p className="text-neutral-400 text-sm">فزعة</p>
          <h1 className="text-2xl font-bold text-white">اختاري المناسبة</h1>
          <p className="text-neutral-400 mt-2">نضبط لك الاقتراحات حسب المناسبة، لون البشرة، والمقاس.</p>
        </header>

        {/* أول 6: شبكة 2×3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {firstSix.map((o) => {
            const active = occasion === o.key;

            return (
              <button
                key={o.key}
                disabled={!!o.disabled}
                onClick={() => {
                  if (o.disabled) return;
                  setOccasion(o.key);
                  if (o.key !== "wedding") setWeddingStyle("");
                }}
                className={[
                  "relative rounded-2xl border p-4 text-right transition",
                  "bg-white/5 hover:bg-white/10",
                  "border-[#d6b56a]/25 hover:border-[#d6b56a]/45",
                  active ? "ring-2 ring-[#d6b56a]/30" : "",
                  o.disabled ? "opacity-55 cursor-not-allowed" : "",
                ].join(" ")}
                type="button"
                aria-disabled={!!o.disabled}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-white font-semibold">{o.title}</h2>

                    {o.subtitle ? <p className="text-neutral-400 text-sm mt-1">{o.subtitle}</p> : null}

                    {o.disabled && (
                      <p className="mt-2 text-[11px] text-[#d6b56a]/90">
                        {o.comingSoonText ?? "قريبًا — نجهزها بذوق فزعة"}
                      </p>
                    )}
                  </div>

                  {o.icon}
                </div>

                <div className="mt-3 h-px bg-white/10" />
                <p className="mt-2 text-[11px] text-neutral-400">{o.disabled ? "قريبًا" : "اضغطي للاختيار"}</p>
              </button>
            );
          })}
        </div>

        {/* الشاليهات: كرت لوحده تحت بالنص وبنفس الحجم */}
        {chalets && (
          <div className="mt-3 flex justify-center">
            <button
              key={chalets.key}
              disabled={!!chalets.disabled}
              onClick={() => {
                if (chalets.disabled) return;
                setOccasion(chalets.key);
                setWeddingStyle("");
              }}
              className={[
                "relative rounded-2xl border p-4 text-right transition",
                "bg-white/5 hover:bg-white/10",
                "border-[#d6b56a]/25 hover:border-[#d6b56a]/45",
                occasion === chalets.key ? "ring-2 ring-[#d6b56a]/30" : "",
                chalets.disabled ? "opacity-55 cursor-not-allowed" : "",
                // ✅ نفس عرض كرت الشبكة في sm (عمودين)
                "w-full sm:w-[calc(50%-0.375rem)]",
              ].join(" ")}
              type="button"
              aria-disabled={!!chalets.disabled}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-white font-semibold">{chalets.title}</h2>

                  {chalets.subtitle ? <p className="text-neutral-400 text-sm mt-1">{chalets.subtitle}</p> : null}

                  {chalets.disabled && (
                    <p className="mt-2 text-[11px] text-[#d6b56a]/90">
                      {chalets.comingSoonText ?? "قريبًا — نجهزها بذوق فزعة"}
                    </p>
                  )}
                </div>

                {chalets.icon}
              </div>

              <div className="mt-3 h-px bg-white/10" />
              <p className="mt-2 text-[11px] text-neutral-400">{chalets.disabled ? "قريبًا" : "اضغطي للاختيار"}</p>
            </button>
          </div>
        )}

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
                    weddingStyle === s ? "ring-2 ring-[#d6b56a]/30 border-[#d6b56a]/40" : "",
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
          disabled={!occasion || (occasion === "wedding" && !weddingStyle)}
          type="button"
          className="mt-6 w-full rounded-2xl border border-[#d6b56a]/45 bg-gradient-to-r from-[#d6b56a]/25 via-white/5 to-[#d6b56a]/15 py-3 text-sm font-extrabold text-white transition disabled:opacity-40"
        >
          التالي
        </button>

        <SiteFooter />
      </div>
    </main>
  );
}