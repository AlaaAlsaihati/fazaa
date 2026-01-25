"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Occasion, WeddingStyle } from "@/app/data/products";
import SiteFooter from "@/app/components/FazaaFooter";

const OCCASIONS: {
  key: Occasion;
  title: string;
  subtitle: string;
  icon: string;
  disabled?: boolean;
  comingSoonText?: string;
}[] = [
  { key: "wedding", title: "زواج", subtitle: "إطلالة ملكية", icon: "💍" },
  { key: "engagement", title: "خطوبة", subtitle: "ستايل ناعم ومرتب", icon: "✨" },
  { key: "work", title: "عمل", subtitle: "رسمي وأنيق", icon: "🖤" },
  { key: "abaya", title: "عبايات", subtitle: "فخامة يومية", icon: "🧿" },
  { key: "ramadan", title: "غبقة / رمضان", subtitle: "لمعة هادية", icon: "🌙" },

  {
    key: "beach",
    title: "البحر",
    subtitle: "",
    icon: "🌊",
    disabled: true,
    comingSoonText: "قريبًا — نجهزها بذوق فزعة",
  },
  {
    key: "chalets",
    title: "الشاليهات",
    subtitle: "",
    icon: "🏝️",
    disabled: true,
    comingSoonText: "قريبًا — نجهزها بذوق فزعة",
  },
];

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
            نضبط لك الاقتراحات حسب المناسبة، الذوق، والمقاس.
          </p>
        </header>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {OCCASIONS.map((o) => {
            const isActive = occasion === o.key;

            if (o.disabled) {
              return (
                <div key={o.key} className="relative group">
                  <div className="pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition duration-200 z-10">
                    <div className="rounded-xl border border-[#d6b56a]/40 bg-black/80 px-3 py-2 text-xs text-[#f3e0b0] shadow-[0_12px_40px_rgba(0,0,0,0.55)] backdrop-blur">
                      {o.comingSoonText}
                    </div>
                    <div className="mx-auto mt-1 h-2 w-2 rotate-45 border-r border-b border-[#d6b56a]/40 bg-black/80" />
                  </div>

                  <div className="relative overflow-hidden rounded-2xl border border-[#d6b56a]/25 bg-white/5 p-3 opacity-60 cursor-not-allowed">
                    <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-[#d6b56a]/15" />
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-white font-semibold text-base">
                          {o.title}
                        </h2>
                        <p className="mt-2 text-[11px] text-[#d6b56a]">
                          قريبًا — نجهزها بذوق فزعة
                        </p>
                      </div>
                      <div className="text-lg">{o.icon}</div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <button
                key={o.key}
                onClick={() => {
                  setOccasion(o.key);
                  if (o.key !== "wedding") setWeddingStyle("");
                }}
                className={[
                  "relative overflow-hidden group text-right rounded-2xl border p-3 transition",
                  "bg-white/5 hover:bg-white/10",
                  "border-[#d6b56a]/22 hover:border-[#d6b56a]/40",
                  "shadow-[0_0_0_1px_rgba(214,181,106,0.08),0_18px_45px_rgba(0,0,0,0.45)]",
                  isActive ? "ring-2 ring-[#d6b56a]/25 border-[#d6b56a]/55" : "",
                ].join(" ")}
                type="button"
              >
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-[#d6b56a]/16" />
                <div className="pointer-events-none absolute -top-16 left-1/2 h-28 w-[420px] -translate-x-1/2 rounded-full bg-[#d6b56a]/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-white font-semibold text-base">
                      {o.title}
                    </h2>
                    {o.subtitle ? (
                      <p className="text-neutral-400 text-sm mt-1">
                        {o.subtitle}
                      </p>
                    ) : null}
                  </div>
                  <div className="text-lg">{o.icon}</div>
                </div>

                <div className="mt-3 h-[1px] bg-white/10" />
                <p className="mt-2 text-[11px] text-neutral-400">
                  اضغطي للاختيار
                </p>
              </button>
            );
          })}
        </div>

        {/* Wedding Style */}
        {occasion === "wedding" && (
          <section className="relative mt-5 overflow-hidden rounded-2xl border border-[#d6b56a]/18 bg-white/5 p-4">
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-[#d6b56a]/12" />

            <h3 className="text-white font-semibold">ستايل الزواج</h3>
            <p className="text-neutral-400 text-sm mt-1">اختاري ناعم أو ثقيل</p>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <StyleButton
                label="ناعم"
                active={weddingStyle === "ناعم"}
                onClick={() => setWeddingStyle("ناعم")}
              />
              <StyleButton
                label="ثقيل"
                active={weddingStyle === "ثقيل"}
                onClick={() => setWeddingStyle("ثقيل")}
              />
            </div>
          </section>
        )}

        {/* ✅ Next — صار نفس ستايل الرئيسية */}
        <button
          onClick={next}
          disabled={!occasion || (occasion === "wedding" && !weddingStyle)}
          className="mt-6 w-full rounded-2xl border border-[#d6b56a]/45 bg-gradient-to-r from-[#d6b56a]/25 via-white/5 to-[#d6b56a]/15 py-3 text-sm font-extrabold text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition hover:border-[#d6b56a]/70 disabled:opacity-40 disabled:hover:border-[#d6b56a]/45"
          type="button"
        >
          التالي
        </button>

        {/* ✅ Footer موحّد */}
        <SiteFooter />
      </div>
    </main>
  );
}

function StyleButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={[
        "rounded-xl border px-4 py-3 font-semibold transition",
        "bg-black/20 border-white/10 text-white hover:bg-black/30",
        active ? "ring-2 ring-[#d6b56a]/30 border-[#d6b56a]/35" : "",
      ].join(" ")}
    >
      {label}
    </button>
  );
}