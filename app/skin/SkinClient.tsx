"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import SiteFooter from "@/app/components/FazaaFooter";
import FazaaDrawer from "@/app/components/fazaaDrawer";

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

function CameraIconButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="كاميرا"
      className="absolute top-3 left-3 z-20 text-[#d6b56a]/85 hover:text-[#f3e0b0] transition active:scale-95"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 8.5h3.2L8.8 6.5h6.4l1.6 2H20v9.5H4V8.5Z"
        />
        <circle cx="12" cy="13.2" r="3.1" />
      </svg>
    </button>
  );
}

function UndertoneIcon({ src, alt }: { src: string; alt: string }) {
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

function BackFab({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="رجوع"
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
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 7l5 5-5 5" />
      </svg>
    </button>
  );
}

function ThreeDotsButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="القائمة"
      style={{
        top: "calc(env(safe-area-inset-top, 0px) + 1.5rem)",
        right: "calc(env(safe-area-inset-right, 0px) + 1.5rem)",
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
        <circle cx="5" cy="12" r="1.4" />
        <circle cx="12" cy="12" r="1.4" />
        <circle cx="19" cy="12" r="1.4" />
      </svg>
    </button>
  );
}

export default function SkinClient() {
  const router = useRouter();
  const sp = useSearchParams();

  const [depth, setDepth] = useState<Depth>("");
  const [undertone, setUndertone] = useState<Undertone>("");

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [instructionTarget, setInstructionTarget] = useState<"depth" | "undertone" | null>(null);
  const [suggestionText, setSuggestionText] = useState("");

  const depthInputRef = useRef<HTMLInputElement | null>(null);
  const undertoneInputRef = useRef<HTMLInputElement | null>(null);

  function openCameraInstructions(target: "depth" | "undertone") {
    setInstructionTarget(target);
  }

  function openCamera() {
    if (instructionTarget === "depth") {
      depthInputRef.current?.click();
    }

    if (instructionTarget === "undertone") {
      undertoneInputRef.current?.click();
    }

    setInstructionTarget(null);
  }
async function handleImagePicked(
  target: "depth" | "undertone",
  file?: File | null
) {
  if (!file) return;

  try {
    const formData = new FormData();
    formData.append("target", target);
    formData.append("image", file);

const res = await fetch("https://www.fazaa-app.com/api/analyze-skin", {
        method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || "تعذر تحليل الصورة");
    }

    if (target === "depth") {
      setSuggestionText(`اللون المقترح: ${data.suggestion}`);
    } else {
      setSuggestionText(`الأندرتون المقترح: ${data.suggestion}`);
    }
 } catch (err: any) {
  setSuggestionText(`تعذر تحليل الصورة: ${err?.message || "خطأ غير معروف"}`);
}
}
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
      <input
        ref={depthInputRef}
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={(e) => handleImagePicked("depth", e.target.files?.[0])}
      />

      <input
        ref={undertoneInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleImagePicked("undertone", e.target.files?.[0])}
      />

      <div className="mx-auto w-full max-w-xl">
        <header className="mb-3">
          <p className="text-neutral-400 text-xs">فزعة</p>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            اختاري لون البشرة
          </h1>
          <p className="text-neutral-400 mt-1 text-sm">
            عشان نطلع لك ألوان تبرزك وتطلع خيالية عليك ✨
          </p>
        </header>

        <section className="relative rounded-2xl border border-[#d6b56a]/20 bg-white/5 p-3 backdrop-blur">
          <CameraIconButton onClick={() => openCameraInstructions("depth")} />

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

        <section className="relative mt-3 rounded-2xl border border-[#d6b56a]/20 bg-white/5 p-3 backdrop-blur">
          <CameraIconButton onClick={() => openCameraInstructions("undertone")} />

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

      {instructionTarget ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-3xl border border-[#d6b56a]/30 bg-neutral-950 p-5 text-center shadow-[0_30px_80px_rgba(0,0,0,0.65)]">
            <h3 className="text-white font-extrabold">
              {instructionTarget === "depth" ? "تحليل لون البشرة" : "تحليل الأندرتون"}
            </h3>

            <div className="mt-4 text-sm text-neutral-300 leading-loose text-right">
              {instructionTarget === "depth" ? (
                <>
                  <p>• استخدمي إضاءة طبيعية</p>
                  <p>• اجعلي الوجه ظاهرًا بالكامل داخل الإطار</p>
                  <p>• بدون مكياج</p>
                </>
              ) : (
                <>
                  <p>• استخدمي إضاءة طبيعية</p>
                  <p>• صوري باطن المعصم بوضوح</p>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={openCamera}
              className="mt-5 w-full rounded-2xl border border-[#d6b56a]/45 bg-gradient-to-r from-[#d6b56a]/25 via-white/5 to-[#d6b56a]/15 py-3 text-sm font-extrabold text-white transition"
            >
              التالي
            </button>

            <button
              type="button"
              onClick={() => setInstructionTarget(null)}
              className="mt-3 text-xs font-semibold text-neutral-400 hover:text-white transition"
            >
              إغلاق
            </button>
          </div>
        </div>
      ) : null}

      {suggestionText ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-3xl border border-[#d6b56a]/30 bg-neutral-950 p-5 text-center shadow-[0_30px_80px_rgba(0,0,0,0.65)]">
            <p className="text-[#f3e0b0] text-sm font-extrabold leading-loose">
              {suggestionText}
            </p>

            <button
              type="button"
              onClick={() => setSuggestionText("")}
              className="mt-5 w-full rounded-2xl border border-[#d6b56a]/45 bg-black/25 py-3 text-sm font-extrabold text-white transition"
            >
              إغلاق
            </button>
          </div>
        </div>
      ) : null}

      <ThreeDotsButton onClick={() => setDrawerOpen(true)} />

      <FazaaDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <BackFab onClick={() => router.back()} />
    </main>
  );
}

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

      <div className="absolute left-[0px] top-1/2 -translate-y-1/2">
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