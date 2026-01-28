"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";
import type { Occasion, WeddingStyle } from "@/app/data/products";
import SiteFooter from "@/app/components/FazaaFooter";

/* ========= أيقونات ذهبية (خطوط فقط) ========= */

function IconDress() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 text-[#d6b56a]" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M12 3l3 4-3 2-3-2 3-4Z" />
      <path d="M9 9l-4 10h14l-4-10" />
    </svg>
  );
}

function IconRing() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 text-[#d6b56a]" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="12" cy="14" r="5" />
      <path d="M10 6l2-3 2 3" />
    </svg>
  );
}

function IconBag() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 text-[#d6b56a]" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="5" y="8" width="14" height="11" rx="2" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

function IconAbaya() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 text-[#d6b56a]" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M12 3v18" />
      <path d="M6 6l6-3 6 3-3 15H9L6 6Z" />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 text-[#d6b56a]" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M21 12.5A8.5 8.5 0 1 1 11.5 3a7 7 0 0 0 9.5 9.5Z" />
    </svg>
  );
}

function IconWaves() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 text-[#d6b56a]" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M2 14c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
      <path d="M2 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
    </svg>
  );
}

function IconIsland() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 text-[#d6b56a]" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M12 13c4 0 7 1 9 3H3c2-2 5-3 9-3Z" />
      <path d="M12 5v8" />
      <path d="M12 5c2 1 3 2 4 4" />
      <path d="M12 5c-2 1-3 2-4 4" />
    </svg>
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
  { key: "wedding", title: "زواج", subtitle: "إطلالة ملكية", icon: <IconDress /> },
  { key: "engagement", title: "خطوبة", subtitle: "ستايل ناعم ومرتب", icon: <IconRing /> },

  {
    key: "chalets",
    title: "الشاليهات",
    subtitle: "",
    icon: <IconIsland />,
    disabled: true,
    comingSoonText: "قريبًا — نجهزها بذوق فزعة",
  },

  { key: "work", title: "عمل", subtitle: "رسمي وأنيق", icon: <IconBag /> },
  { key: "abaya", title: "عبايات", subtitle: "فخامة يومية", icon: <IconAbaya /> },
  { key: "ramadan", title: "غبقة / رمضان", subtitle: "لمسة راقية", icon: <IconMoon /> },

  {
    key: "beach",
    title: "البحر",
    subtitle: "",
    icon: <IconWaves />,
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

  return (
    <main dir="rtl" className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black p-6">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <header className="mb-6">
          <p className="text-neutral-400 text-sm">فزعة</p>
          <h1 className="text-2xl font-bold text-white">اختاري المناسبة</h1>
          <p className="text-neutral-400 mt-2">نضبط لك الاقتراحات حسب المناسبة، لون البشرة، والمقاس.</p>
        </header>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {OCCASIONS.map((o) => {
            const active = occasion === o.key;
            const isChalets = o.key === "chalets";

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
                  isChalets ? "sm:col-span-2" : "",
                ].join(" ")}
                type="button"
                aria-disabled={!!o.disabled}
              >
                <div className={isChalets ? "flex items-center justify-between" : "flex items-start justify-between"}>
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