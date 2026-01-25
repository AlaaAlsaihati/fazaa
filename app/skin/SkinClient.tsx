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

  const [depth, setDepth] = useState<Depth>("");
  const [undertone, setUndertone] = useState<Undertone>("");

  const [showUndertoneHelp, setShowUndertoneHelp] = useState(false);

  function next() {
    if (!depth || !undertone) return;

    // ✅ نكمل على البرامز الحالية (عشان ما يضيع occasion ويخرب النتائج)
    const params = new URLSearchParams(sp.toString());
    params.set("depth", depth);
    params.set("undertone", undertone);

    router.push(`/measurements?${params.toString()}`);
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black p-6 flex flex-col"
    >
      <div className="mx-auto w-full max-w-2xl flex-1">
        {/* Header */}
        <header className="mb-6">
          <p className="text-neutral-400 text-sm">فزعة</p>
          <h1 className="text-2xl font-bold text-white">اختاري لون البشرة</h1>
          <p className="text-neutral-400 mt-2">
            عشان نطلع لك ألوان تبرزك وتطلع خيالية عليك ✨
          </p>
        </header>

        {/* ===== درجة البشرة ===== */}
        <section className="rounded-2xl border border-[#d6b56a]/18 bg-white/5 p-4 shadow-[0_0_0_1px_rgba(214,181,106,0.08)] backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-white font-semibold">درجة البشرة</h2>
              <p className="text-neutral-400 text-sm mt-1">
                اختاري الدرجة الأقرب لك
              </p>
            </div>

            <div className="h-10 w-10 rounded-full border border-[#d6b56a]/25 bg-[#d6b56a]/10 flex items-center justify-center">
              <span className="text-[#f3e0b0] text-sm font-bold">1</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4">
            {DEPTH_OPTIONS.map((opt) => {
              const active = depth === opt.label;

              return (
                <button
                  key={opt.label}
                  onClick={() => setDepth(opt.label)}
                  className="flex flex-col items-center gap-2"
                  type="button"
                >
                  <div
                    className={[
                      "h-14 w-14 sm:h-16 sm:w-16 rounded-full border-2 transition",
                      active
                        ? "border-[#d6b56a] ring-4 ring-[#d6b56a]/25"
                        : "border-white/15 hover:border-white/25",
                    ].join(" ")}
                    style={{ backgroundColor: opt.color }}
                  />

                  <span
                    className={[
                      "text-[12px] sm:text-sm font-semibold",
                      active ? "text-[#f3e0b0]" : "text-neutral-300",
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
        <section className="mt-4 rounded-2xl border border-[#d6b56a]/18 bg-white/5 p-4 shadow-[0_0_0_1px_rgba(214,181,106,0.08)] backdrop-blur">
          {/* عنوان + زر السهم الذهبي */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-white font-semibold">الأندرتون</h2>
              <p className="text-neutral-400 text-sm mt-1">حددي حرارة بشرتك</p>
            </div>

            <button
              type="button"
              onClick={() => setShowUndertoneHelp((v) => !v)}
              className="shrink-0 inline-flex items-center gap-2 rounded-full border border-[#d6b56a]/25 bg-black/20 px-3 py-2 text-[#f3e0b0] hover:bg-black/30 transition"
              aria-expanded={showUndertoneHelp}
              aria-controls="undertone-help"
              title="كيف أعرف الأندرتون؟"
            >
              <span className="text-sm font-semibold">كيف أعرف؟</span>

              <span
                className={[
                  "inline-flex h-8 w-8 items-center justify-center rounded-full",
                  "border border-[#d6b56a]/30 bg-[#d6b56a]/10",
                  "transition",
                  showUndertoneHelp ? "rotate-90" : "",
                ].join(" ")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-[#d6b56a]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12l-7.5 7.5M3 12h18"
                  />
                </svg>
              </span>
            </button>
          </div>

          {/* Dropdown help */}
          <div
            id="undertone-help"
            className={[
              "mt-4 overflow-hidden rounded-2xl border border-[#d6b56a]/18 bg-[#d6b56a]/10 px-4 transition-all",
              showUndertoneHelp
                ? "max-h-[260px] py-4 opacity-100"
                : "max-h-0 py-0 opacity-0",
            ].join(" ")}
          >
            <h3 className="text-[#f3e0b0] font-bold mb-2">
              كيف أعرف الأندرتون؟
            </h3>

            <ul className="space-y-2 text-sm text-neutral-100/90 leading-relaxed">
              <li className="flex gap-2">
                <span className="mt-[2px]">❄️</span>
                <span>
                  <b>بارد:</b> عروق المعصم تميل للأزرق أو البنفسجي.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-[2px]">🔥</span>
                <span>
                  <b>دافئ:</b> العروق تميل للأخضر.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-[2px]">⚖️</span>
                <span>
                  <b>محايد:</b> صعب تمييز لون العروق بوضوح.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-[2px]">🫒</span>
                <span>
                  <b>زيتوني:</b> لمحة خضراء/رمادية خفيفة بالبشرة.
                </span>
              </li>
            </ul>

            <p className="mt-3 text-xs text-neutral-200/80">
              * نستخدمها فقط لترتيب الترشيحات بدقة.
            </p>
          </div>

          {/* Buttons */}
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
          type="button"
        >
          التالي
        </button>

        {/* Footer داخل الصفحة */}
        <footer className="mt-10 text-center text-xs text-neutral-400">
          <div className="mx-auto mb-2 h-px w-32 bg-gradient-to-r from-transparent via-[#d6b56a]/40 to-transparent" />
          <div className="text-neutral-500">© 2026 FAZAA — All Rights Reserved</div>

          <div className="mt-1 inline-flex items-center gap-2 justify-center" dir="ltr">
            <span className="text-neutral-300">For contact</span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-[#d6b56a]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5A2.25 2.25 0 0 1 19.5 19.5H4.5A2.25 2.25 0 0 1 2.25 17.25V6.75m19.5 0-7.5 5.25a2.25 2.25 0 0 1-2.5 0l-7.5-5.25"
              />
            </svg>

            <span className="text-neutral-500">:</span>

            <a
              href="mailto:contact.fazaa@gmail.com"
              className="font-semibold tracking-[0.08em] text-[#f3e0b0] hover:text-[#d6b56a] transition"
              style={{ fontFamily: "ui-serif, Georgia, serif" }}
            >
              contact.fazaa@gmail.com
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}

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
      type="button"
      className={[
        "rounded-xl border px-4 py-3 font-semibold transition flex items-center justify-center gap-2",
        "bg-black/20 border-white/10 text-white hover:bg-black/30",
        active ? "ring-2 ring-[#d6b56a]/30 border-[#d6b56a]/35 bg-[#d6b56a]/10" : "",
      ].join(" ")}
    >
      <span>{emoji}</span>
      {label}
    </button>
  );
}