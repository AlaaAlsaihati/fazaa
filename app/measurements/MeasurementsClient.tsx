"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SiteFooter from "@/app/components/FazaaFooter";

type InitialParams = {
  occasion?: string;
  weddingStyle?: string;
  depth?: string;
  undertone?: string;
};

type BodyShapeArabic = "ساعة رملية" | "كمثري" | "مستقيم" | "تفاحة";

function toNum(v: string) {
  const n = Number(String(v || "").trim());
  return Number.isFinite(n) ? n : NaN;
}

function range(min: number, max: number, step = 1) {
  const out: number[] = [];
  for (let i = min; i <= max; i += step) out.push(i);
  return out;
}

/* ========= أيقونات ذهبية لِـ شكل الجسم ========= */
function ShapeIcon({ type }: { type: BodyShapeArabic }) {
  const base = "h-5 w-5 text-[#d6b56a] shrink-0";
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: base,
    "aria-hidden": true,
  };

  if (type === "ساعة رملية") {
    return (
      <svg {...common}>
        <path d="M8 4h8" />
        <path d="M9 6c3 3 3 9 0 12" />
        <path d="M15 6c-3 3-3 9 0 12" />
        <path d="M8 20h8" />
      </svg>
    );
  }

  if (type === "كمثري") {
    return (
      <svg {...common}>
        <path d="M9 5c2-1 4-1 6 0" />
        <path d="M9 7c-1 4 0 10 3 12" />
        <path d="M15 7c1 4 0 10-3 12" />
        <path d="M7.5 18c3 2 6 2 9 0" />
      </svg>
    );
  }

  if (type === "مستقيم") {
    return (
      <svg {...common}>
        <path d="M9 5v14" />
        <path d="M15 5v14" />
        <path d="M9 5h6" />
        <path d="M9 19h6" />
      </svg>
    );
  }

  // تفاحة
  return (
    <svg {...common}>
      <path d="M12 6c-3 0-5 2.4-5 5.4 0 4.2 2.2 7.1 5 7.1s5-2.9 5-7.1C17 8.4 15 6 12 6Z" />
      <path d="M12 6c.7-1.2 1.7-2 3-2" />
    </svg>
  );
}

/* ========= خيارات Dropdown ========= */
const HEIGHT_OPTIONS = range(120, 210, 1);
const BUST_OPTIONS = range(60, 160, 1);
const WAIST_OPTIONS = range(45, 160, 1);
const HIP_OPTIONS = range(60, 180, 1);

export default function MeasurementsClient({
  initialParams,
}: {
  initialParams: InitialParams;
}) {
  const router = useRouter();
  const sp = useSearchParams();

  const occasion = initialParams.occasion || sp.get("occasion") || "";
  const weddingStyle =
    initialParams.weddingStyle || sp.get("weddingStyle") || "";
  const depth = initialParams.depth || sp.get("depth") || "";
  const undertone = initialParams.undertone || sp.get("undertone") || "";

  // ✅ كلها Dropdown values
  const [heightCm, setHeightCm] = useState<string>("");
  const [bustCm, setBustCm] = useState<string>("");
  const [waistCm, setWaistCm] = useState<string>("");
  const [hipCm, setHipCm] = useState<string>("");

  const [bodyShape, setBodyShape] = useState<BodyShapeArabic | "">("");

  const fieldErrors = useMemo(() => {
    const h = toNum(heightCm);
    const b = toNum(bustCm);
    const w = toNum(waistCm);
    const hip = toNum(hipCm);

    return {
      height:
        !heightCm || h < 120 || h > 210 ? "اختاري طولك (120–210 سم)." : "",
      bust: !bustCm || b < 60 || b > 160 ? "اختاري محيط الصدر (60–160 سم)." : "",
      waist:
        !waistCm || w < 45 || w > 160 ? "اختاري محيط الخصر (45–160 سم)." : "",
      hip: !hipCm || hip < 60 || hip > 180 ? "اختاري محيط الأرداف (60–180 سم)." : "",
      bodyShape: !bodyShape ? "اختاري شكل جسمك (يفيد خصوصًا في العبايات)." : "",
    };
  }, [heightCm, bustCm, waistCm, hipCm, bodyShape]);

  const canSubmit = useMemo(() => {
    return (
      !fieldErrors.height &&
      !fieldErrors.bust &&
      !fieldErrors.waist &&
      !fieldErrors.hip &&
      !fieldErrors.bodyShape
    );
  }, [fieldErrors]);

  function goResults() {
    if (!canSubmit) return;

    const params = new URLSearchParams();

    if (occasion) params.set("occasion", occasion);
    if (weddingStyle) params.set("weddingStyle", weddingStyle);
    if (depth) params.set("depth", depth);
    if (undertone) params.set("undertone", undertone);

    params.set("height", String(toNum(heightCm)));
    params.set("bust", String(toNum(bustCm)));
    params.set("waist", String(toNum(waistCm)));
    params.set("hip", String(toNum(hipCm)));
    params.set("bodyShape", bodyShape);

    router.push(`/results?${params.toString()}`);
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black p-6"
    >
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <header className="mb-6 text-center">
          <p className="text-sm text-neutral-400">الخطوة الأخيرة</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white">
            خلّينا نضبط المقاس المثالي لك
          </h1>
          <p className="mt-3 text-sm text-neutral-400">
            نطلع لك اقتراحات فخمة + مقاس محسوب عليك.
          </p>
        </header>

        {/* Luxury Card */}
        <div className="relative overflow-hidden rounded-3xl border border-[#d6b56a]/35 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(214,181,106,0.12),0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur">
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-[#d6b56a]/22" />
          <div className="pointer-events-none absolute -top-24 left-1/2 h-40 w-[520px] -translate-x-1/2 rounded-full bg-[#d6b56a]/10 blur-3xl" />

          {/* Dropdown Fields */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SelectField
              label="طولك (سم)"
              value={heightCm}
              onChange={setHeightCm}
              placeholder="اختاري"
              options={HEIGHT_OPTIONS}
              error={fieldErrors.height}
            />

            <SelectField
              label="محيط الصدر (سم)"
              value={bustCm}
              onChange={setBustCm}
              placeholder="اختاري"
              options={BUST_OPTIONS}
              error={fieldErrors.bust}
            />

            <SelectField
              label="محيط الخصر (سم)"
              value={waistCm}
              onChange={setWaistCm}
              placeholder="اختاري"
              options={WAIST_OPTIONS}
              error={fieldErrors.waist}
            />

            <SelectField
              label="محيط الأرداف (سم)"
              value={hipCm}
              onChange={setHipCm}
              placeholder="اختاري"
              options={HIP_OPTIONS}
              error={fieldErrors.hip}
            />
          </div>

          {/* Body shape */}
          <div className="mt-6">
            <p className="text-sm font-semibold text-white">شكل جسمك</p>

            <p className="mt-2 text-xs text-neutral-400">
              نستخدمه فقط لترتيب النتائج بدقة — خصوصًا في قسم العبايات.
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Chip
                label="ساعة رملية"
                active={bodyShape === "ساعة رملية"}
                onClick={() => setBodyShape("ساعة رملية")}
              />
              <Chip
                label="كمثري"
                active={bodyShape === "كمثري"}
                onClick={() => setBodyShape("كمثري")}
              />
              <Chip
                label="مستقيم"
                active={bodyShape === "مستقيم"}
                onClick={() => setBodyShape("مستقيم")}
              />
              <Chip
                label="تفاحة"
                active={bodyShape === "تفاحة"}
                onClick={() => setBodyShape("تفاحة")}
              />
            </div>

            {fieldErrors.bodyShape ? (
              <p className="mt-2 text-xs text-red-200/90">
                {fieldErrors.bodyShape}
              </p>
            ) : null}
          </div>

          {/* CTA */}
          <button
            onClick={goResults}
            disabled={!canSubmit}
            className="mt-6 w-full rounded-2xl border border-[#d6b56a]/45 bg-gradient-to-r from-[#d6b56a]/25 via-white/5 to-[#d6b56a]/15 py-3 text-sm font-extrabold text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition hover:border-[#d6b56a]/70 disabled:opacity-40 disabled:hover:border-[#d6b56a]/45"
            type="button"
          >
            عرض النتائج
          </button>

          <p className="mt-3 text-center text-xs text-neutral-400">
            * القياسات بالسنتيمتر — نستخدمها فقط لحساب المقاس المقترح.
          </p>
        </div>

        <SiteFooter />
      </div>
    </main>
  );
}

function SelectField({
  label,
  value,
  onChange,
  placeholder,
  options,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  options: number[];
  error?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-white">{label}</span>

      <div className="relative mt-2">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={[
            "w-full appearance-none rounded-2xl border px-4 py-3 text-white outline-none transition",
            "border-white/10 bg-black/30",
            "focus:border-[#d6b56a]/40 focus:ring-2 focus:ring-[#d6b56a]/10",
            error ? "border-red-500/30" : "",
          ].join(" ")}
        >
          <option value="" disabled className="text-neutral-500">
            {placeholder || "اختاري"}
          </option>

          {options.map((n) => (
            <option key={n} value={n} className="text-black">
              {n}
            </option>
          ))}
        </select>

        {/* سهم ذهبي */}
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-[#d6b56a]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {error ? <p className="mt-2 text-xs text-red-200/90">{error}</p> : null}
    </label>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: BodyShapeArabic;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={[
        "rounded-2xl border px-4 py-3 text-sm font-semibold transition",
        "bg-black/20 border-white/10 text-white hover:bg-black/30",
        "flex items-center justify-center gap-2",
        active
          ? "ring-2 ring-[#d6b56a]/40 border-[#d6b56a]/35 bg-[#d6b56a]/10"
          : "",
      ].join(" ")}
    >
      <ShapeIcon type={label} />
      {label}
    </button>
  );
}