"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Depth =
  | "فاتح جدًا"
  | "فاتح"
  | "حنطي"
  | "حنطي غامق"
  | "أسمر"
  | "داكن"
  | "";

type Undertone = "بارد" | "دافئ" | "محايد" | "زيتوني" | "";

const DEPTH_OPTIONS: {
  label: Exclude<Depth, "">;
  emoji: string;
  color: string;
}[] = [
  { label: "فاتح جدًا", emoji: "🌸", color: "#fdecef" },
  { label: "فاتح", emoji: "🤍", color: "#f6e6d8" },
  { label: "حنطي", emoji: "🌾", color: "#e1c4a8" },
  { label: "حنطي غامق", emoji: "🌰", color: "#c49a6c" },
  { label: "أسمر", emoji: "🤎", color: "#8d5a3b" },
  { label: "داكن", emoji: "🖤", color: "#3b2a23" },
];

export default function SkinPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const occasion = sp.get("occasion") || "";
  const weddingStyle = sp.get("weddingStyle") || "";

  const [depth, setDepth] = useState<Depth>("");
  const [undertone, setUndertone] = useState<Undertone>("");

  function next() {
    if (!depth || !undertone) return;

    const params = new URLSearchParams();
    if (occasion) params.set("occasion", occasion);
    if (weddingStyle) params.set("weddingStyle", weddingStyle);
    params.set("depth", depth);
    params.set("undertone", undertone);

    router.push(`/measurements?${params.toString()}`);
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
          <h1 className="text-2xl font-bold text-white">
            اختاري لون البشرة
          </h1>
          <p className="text-neutral-400 mt-2">
            عشان نطلع لك ألوان تبرزك وتطلع خيالية عليك ✨
          </p>
        </header>

        {/* ===== درجة البشرة ===== */}
        <section className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <h2 className="text-white font-semibold">درجة البشرة</h2>
          <p className="text-neutral-400 text-sm mt-1">
            اختاري الدرجة الأقرب لك
          </p>

          <div className="mt-4 grid grid-cols-3 gap-4">
            {DEPTH_OPTIONS.map((opt) => {
              const active = depth === opt.label;

              return (
                <button
                  key={opt.label}
                  onClick={() => setDepth(opt.label)}
                  className="flex flex-col items-center gap-2"
                >
                  {/* دائرة اللون */}
                  <div
                    className={[
                      "h-16 w-16 rounded-full border-2 transition",
                      active
                        ? "border-[#d6b56a] ring-4 ring-[#d6b56a]/30"
                        : "border-white/20",
                    ].join(" ")}
                    style={{ backgroundColor: opt.color }}
                  />

                  {/* الاسم */}
                  <span
                    className={[
                      "text-sm font-semibold",
                      active
                        ? "text-[#f3e0b0]"
                        : "text-neutral-300",
                    ].join(" ")}
                  >
                    {opt.emoji} {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ===== الأندرتون ===== */}
        <section className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
          <h2 className="text-white font-semibold">الأندرتون</h2>
          <p className="text-neutral-400 text-sm mt-1">
            حددي حرارة بشرتك
          </p>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <UndertoneButton
              label="بارد"
              emoji="❄️"
              active={undertone === "بارد"}
              onClick={() => setUndertone("بارد")}
            />
            <UndertoneButton
              label="دافئ"
              emoji="🔥"
              active={undertone === "دافئ"}
              onClick={() => setUndertone("دافئ")}
            />
            <UndertoneButton
              label="محايد"
              emoji="⚖️"
              active={undertone === "محايد"}
              onClick={() => setUndertone("محايد")}
            />
            <UndertoneButton
              label="زيتوني"
              emoji="🫒"
              active={undertone === "زيتوني"}
              onClick={() => setUndertone("زيتوني")}
            />
          </div>
        </section>

        {/* Next */}
        <button
          onClick={next}
          disabled={!depth || !undertone}
          className="mt-6 w-full rounded-2xl bg-white text-black py-3 font-bold disabled:opacity-40"
        >
          التالي
        </button>
      </div>
    </main>
  );
}

/* ===== Components ===== */

function UndertoneButton({
  label,
  emoji,
  active,
  onClick,
}: {
  label: Undertone;
  emoji: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-xl border px-4 py-3 font-semibold transition flex items-center justify-center gap-2",
        "bg-black/20 border-white/10 text-white hover:bg-black/30",
        active ? "ring-2 ring-white/50 border-white/30" : "",
      ].join(" ")}
    >
      <span>{emoji}</span>
      {label}
    </button>
  );
}