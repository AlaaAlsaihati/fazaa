"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import SiteFooter from "@/app/components/FazaaFooter";

type Depth =
  | "فاتح جدًا"
  | "فاتح"
  | "حنطي"
  | "حنطي غامق"
  | "أسمر"
  | "داكن"
  | "";

type Undertone = "بارد" | "دافئ" | "محايد" | "زيتوني" | "";

const DEPTH_OPTIONS = [
  { label: "فاتح جدًا", color: "#fdecef" },
  { label: "فاتح", color: "#f6e6d8" },
  { label: "حنطي", color: "#e1c4a8" },
  { label: "حنطي غامق", color: "#c49a6c" },
  { label: "أسمر", color: "#8d5a3b" },
  { label: "داكن", color: "#3b2a23" },
] as const;

const UNDERTONE_ICON_SRC: Record<Exclude<Undertone, "">, string> = {
  بارد: "/icons/undertone/cool.png",
  دافئ: "/icons/undertone/warm.png",
  محايد: "/icons/undertone/neutral.png",
  زيتوني: "/icons/undertone/olive-v2.png",
};

/* ===== علامة التحديد ===== */
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
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  );
}

/* ===== أيقونة الأندرتون (نفس الحجم – لا يتغير) ===== */
function UndertoneIcon({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      className="
        h-[130px] w-[130px]
        object-contain select-none
        drop-shadow-[0_0_12px_rgba(214,181,106,0.55)]
        brightness-110 saturate-110
        pointer-events-none
      "
    />
  );
}

export default function SkinClient() {
  const router = useRouter();
  const sp = useSearchParams();

  const [depth, setDepth] = useState<Depth>("");
  const [undertone, setUndertone] = useState<Undertone>("");

  function next() {
    if (!depth || !undertone) return;

    const params = new URLSearchParams(sp.toString());
    params.set("depth", depth);
    params.set("undertone", undertone);

    router.push(`/measurements?${params.toString()}`);
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black px-4 py-4"
    >
      <div className="mx-auto w-full max-w-xl">
        {/* Header */}
        <header className="mb-3">
          <p className="text-neutral-400 text-xs">فزعة</p>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            اختاري لون البشرة
          </h1>
          <p className="text-neutral-400 mt-1 text-sm">
            عشان نطلع لك ألوان تبرزك وتطلع خيالية عليك ✨
          </p>
        </header>

        {/* ===== درجة البشرة ===== */}
        <section className="rounded-2xl border border-[#d6b56a]/20 bg-white/5 p-3 backdrop-blur">
          <h2 className="text-white font-semibold text-sm">درجة البشرة</h2>
          <p className="text-neutral-400 text-xs mt-1">
            اختاري الدرجة الأقرب لك
          </p>

          <div className="mt-3 grid grid-cols-3 gap-3">
            {DEPTH_OPTIONS.map((opt) => {
              const active = depth === opt.label;

              return (
                <button
                  key={opt.label}
                  onClick={() => setDepth(opt.label)}
                  className="flex flex-col items-center gap-2"
                  type="button"
                >
                  {/* wrapper */}
                  <div className="relative overflow-visible">
                    <div
                      className={[
                        "h-12 w-12 sm:h-14 sm:w-14 rounded-full transition border",
                        active
                          ? "border-[#d6b56a] ring-2 ring-[#d6b56a]/35"
                          : "border-[#d6b56a]/35 hover:border-[#d6b56a]/70",
                      ].join(" ")}
                      style={{ backgroundColor: opt.color }}
                    />

                    {active && <SelectedBadge />}
                  </div>

                  <span
                    className={[
                      "text-xs sm:text-sm font-semibold",
                      active ? "text-[#f3e0b0]" : "text-neutral-300",
                    ].join(" ")}
                  >
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ===== الأندرتون ===== */}
        <section className="mt-3 rounded-2xl border border-[#d6b56a]/20 bg-white/5 p-3 backdrop-blur">
          <h2 className="text-white font-semibold text-sm">الأندرتون</h2>
          <p className="text-neutral-400 text-xs mt-1">
            التدرج الداخلي للبشرة
          </p>

          <details className="mt-3 mb-3 rounded-xl bg-black/25 border border-white/10 px-4 py-3">
            <summary className="cursor-pointer text-xs text-[#f3e0b0] font-semibold">
              كيف أحدد الأندرتون؟
            </summary>
            <div className="mt-2 text-xs text-neutral-300 space-y-2">
              <ul className="list-disc pr-5 space-y-1">
                <li>عروق زرقاء/ بنفسجية → بارد</li>
                <li>عروق خضراء → دافئ</li>
                <li>صعب تميز اللون → محايد</li>
                <li>اخضر مائل للرمادي → زيتوني</li>
              </ul>
            </div>
          </details>

          {/* كروت الأندرتون */}
          <div className="grid grid-cols-2 gap-3">
            {(["بارد", "دافئ", "محايد", "زيتوني"] as const).map((u) => (
              <UndertoneCard
                key={u}
                label={u}
                iconSrc={UNDERTONE_ICON_SRC[u]}
                active={undertone === u}
                onPick={() => setUndertone(u)}
              />
            ))}
          </div>
        </section>

        <button
          onClick={next}
          disabled={!depth || !undertone}
          type="button"
          className="mt-4 w-full rounded-2xl border border-[#d6b56a]/45 bg-gradient-to-r from-[#d6b56a]/25 via-white/5 to-[#d6b56a]/15 py-3 text-sm font-extrabold text-white transition disabled:opacity-40"
        >
          التالي
        </button>

        <div className="mt-3">
          <SiteFooter />
        </div>
      </div>
    </main>
  );
}

/* ===== كرت الأندرتون (أصغر) ===== */
function UndertoneCard({
  label,
  iconSrc,
  active,
  onPick,
}: {
  label: Exclude<Undertone, "">;
  iconSrc: string;
  active: boolean;
  onPick: () => void;
}) {
  return (
    <button
      onClick={onPick}
      type="button"
      className={[
        "w-full relative rounded-xl border p-3 text-right transition",
        "bg-white/5 hover:bg-white/10",
        "border-[#d6b56a]/25 hover:border-[#d6b56a]/45",
        "min-h-[72px]",
        "overflow-visible",
        active ? "ring-2 ring-[#d6b56a]/30" : "",
      ].join(" ")}
    >
      {active && <SelectedBadge />}

     <div className="absolute left-[20px] top-1/2 -translate-y-1/2">
  <UndertoneIcon src={iconSrc} alt={label} />
</div>

    <div className="pl-[20px]">
  <div className="flex items-center justify-center gap-1">
    <span className="text-white font-semibold text-lg">{label}</span>
  </div>
</div>
    </button>
  );
}