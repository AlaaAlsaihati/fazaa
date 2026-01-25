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

        {/* ================= درجة البشرة ================= */}
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
                  <div
                    className={[
                      "h-16 w-16 rounded-full border-2 transition",
                      active
                        ? "border-[#d6b56a] ring-4 ring-[#d6b56a]/30"
                        : "border-white/20",
                    ].join(" ")}
                    style={{ backgroundColor: opt.color }}
                  />

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

        {/* ================= الأندرتون ================= */}
        <section className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
          <h2 className="text-white font-semibold">الأندرتون</h2>
          <p className="text-neutral-400 text-sm mt-1">
            حددي حرارة بشرتك
          </p>

          {/* ✅ شرح الأندرتون بسهم ذهبي */}
          <div className="mt-3 rounded-2xl border border-[#d6b56a]/30 bg-[#d6b56a]/10 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d6b56a]/60 bg-[#d6b56a]/20 shadow-[0_0_0_1px_rgba(214,181,106,0.25)]">
                <span className="text-[#f3e0b0] text-lg">➜</span>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#f3e0b0]">
                  كيف أعرف الأندرتون؟
                </p>

                <ul className="mt-2 list-disc pr-5 text-sm text-neutral-200/90 space-y-1 leading-relaxed">
                  <li>
                    <b className="text-white">بارد ❄️</b>:
                    عروق المعصم تميل للأزرق أو البنفسجي.
                  </li>
                  <li>
                    <b className="text-white">دافئ 🔥</b>:
                    العروق تميل للأخضر.
                  </li>
                  <li>
                    <b className="text-white">محايد ⚖️</b>:
                    صعب تمييز لون العروق بوضوح.
                  </li>
                  <li>
                    <b className="text-white">زيتوني 🫒</b>:
                    لمحة خضراء أو رمادية خفيفة بالبشرة.
                  </li>
                </ul>

                <p className="mt-2 text-xs text-neutral-300">
                  * نستخدمه فقط لترتيب الترشيحات بدقة.
                </p>
              </div>
            </div>
          </div>

          {/* أزرار الأندرتون */}
          <div className="mt-4 grid grid-cols-2 gap-3">
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
        active ? "ring-2 ring-[#d6b56a]/50 border-[#d6b56a]/40" : "",
      ].join(" ")}
    >
      <span>{emoji}</span>
      {label}
    </button>
  );
}