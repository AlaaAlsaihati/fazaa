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

/* ========= أيقونات ذهبية (خطوط فقط) ========= */

function IconSparkle() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 text-[#d6b56a]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l1.6 5.2L19 10l-5.4 1.8L12 17l-1.6-5.2L5 10l5.4-1.8L12 3Z" />
    </svg>
  );
}

function IconSun() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 text-[#d6b56a]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3.2" />
      <path strokeLinecap="round" d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M4.4 4.4l1.6 1.6M18 18l1.6 1.6M19.6 4.4 18 6M6 18l-1.6 1.6" />
    </svg>
  );
}

function IconBalance() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 text-[#d6b56a]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 8h12" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 8l-3 5h6l-3-5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 8l-3 5h6l-3-5Z" />
    </svg>
  );
}

function IconOlive() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 text-[#d6b56a]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 6c3 0 5 2.3 5 5.3 0 4.4-3.9 7.2-7 7.2S5 15.7 5 11.3C5 8.3 7 6 10 6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5c0-1.6 1.2-2.7 3-3" />
    </svg>
  );
}

const DEPTH_OPTIONS: {
  label: Exclude<Depth, "">;
  color: string;
}[] = [
  { label: "فاتح جدًا", color: "#fdecef" },
  { label: "فاتح", color: "#f6e6d8" },
  { label: "حنطي", color: "#e1c4a8" },
  { label: "حنطي غامق", color: "#c49a6c" },
  { label: "أسمر", color: "#8d5a3b" },
  { label: "داكن", color: "#3b2a23" },
];

export default function SkinPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [depth, setDepth] = useState<Depth>("");
  const [undertone, setUndertone] = useState<Undertone>("");

  const [showUndertoneHelp, setShowUndertoneHelp] = useState(false);

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
      className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black p-6 flex flex-col"
    >
      <div className="mx-auto w-full max-w-2xl flex-1">
        {/* Header */}
        <header className="mb-5">
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
                      "h-12 w-12 sm:h-14 sm:w-14 rounded-full border-2 transition",
                      active
                        ? "border-[#d6b56a] ring-4 ring-[#d6b56a]/25"
                        : "border-white/15 hover:border-white/25",
                    ].join(" ")}
                    style={{ backgroundColor: opt.color }}
                  />

                  {/* ✅ شلنا الإيموجي – صار ستايل براند */}
                  <span
                    className={[
                      "text-[12px] sm:text-sm font-semibold",
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
        <section className="mt-4 rounded-2xl border border-[#d6b56a]/18 bg-white/5 p-4 shadow-[0_0_0_1px_rgba(214,181,106,0.08)] backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-white font-semibold">الأندرتون</h2>
              <p className="text-neutral-400 text-sm mt-1"> اختاري التدرج الأنسب لبشرتك</p>
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
                <span className="mt-[2px]">•</span>
                <span>
                  <b>بارد:</b> عروق المعصم تميل للأزرق أو البنفسجي.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-[2px]">•</span>
                <span>
                  <b>دافئ:</b> العروق تميل للأخضر.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-[2px]">•</span>
                <span>
                  <b>محايد:</b> صعب تمييز لون العروق بوضوح.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-[2px]">•</span>
                <span>
                  <b>زيتوني:</b> لمحة خضراء/رمادية خفيفة بالبشرة.
                </span>
              </li>
            </ul>

            <p className="mt-3 text-xs text-neutral-200/80">
              * نستخدمها فقط لترتيب الترشيحات بدقة.
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <UndertoneButton
              label="بارد"
              icon={<IconSparkle />}
              active={undertone === "بارد"}
              onClick={() => setUndertone("بارد")}
            />
            <UndertoneButton
              label="دافئ"
              icon={<IconSun />}
              active={undertone === "دافئ"}
              onClick={() => setUndertone("دافئ")}
            />
            <UndertoneButton
              label="محايد"
              icon={<IconBalance />}
              active={undertone === "محايد"}
              onClick={() => setUndertone("محايد")}
            />
            <UndertoneButton
              label="زيتوني"
              icon={<IconOlive />}
              active={undertone === "زيتوني"}
              onClick={() => setUndertone("زيتوني")}
            />
          </div>
        </section>

        {/* Next */}
        <button
          onClick={next}
          disabled={!depth || !undertone}
          type="button"
          className="mt-6 w-full rounded-2xl border border-[#d6b56a]/45 bg-gradient-to-r from-[#d6b56a]/25 via-white/5 to-[#d6b56a]/15 py-3 text-sm font-extrabold text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition hover:border-[#d6b56a]/70 disabled:opacity-40 disabled:hover:border-[#d6b56a]/45"
        >
          التالي
        </button>

        {/* Footer */}
        <SiteFooter />
      </div>
    </main>
  );
}

function UndertoneButton({
  label,
  icon,
  active,
  onClick,
}: {
  label: Undertone;
  icon: React.ReactNode;
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
        active
          ? "ring-2 ring-[#d6b56a]/30 border-[#d6b56a]/35 bg-[#d6b56a]/10"
          : "",
      ].join(" ")}
    >
      {icon}
      {label}
    </button>
  );
}