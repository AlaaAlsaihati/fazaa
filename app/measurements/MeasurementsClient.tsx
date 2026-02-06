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

/* ========= أيقونات القياسات (PNG) ========= */
function MeasureIconImg({ type }: { type: "height" | "bust" | "waist" | "hip" }) {
  const map: Record<"height" | "bust" | "waist" | "hip", string> = {
    height: "/icons/measurements/height.png",
    bust: "/icons/measurements/bust.png",
    waist: "/icons/measurements/waist.png",
    hip: "/icons/measurements/hip.png",
  };

  return (
    <img
  src={map[type]}
  alt=""
  draggable={false}
  className="h-7 w-7 shrink-0 object-contain transform scale-[5] -translate-x-2"
/>
  );
}

function ShapeIcon({ type }: { type: BodyShapeArabic }) {
  const map: Record<BodyShapeArabic, string> = {
    "ساعة رملية": "/icons/body-shapes/hourglass.png",
    "كمثري": "/icons/body-shapes/pear.png",
    "مستقيم": "/icons/body-shapes/straight.png",
    "تفاحة": "/icons/body-shapes/apple.png",
  };

  return (
    <img
      src={map[type]}
      alt=""
      className="h-30 w-30 object-contain select-none pointer-events-none ml-6"
      draggable={false}
    />
  );
}

/* ========= خيارات Dropdown ========= */
/* ✅ الطول يبدأ من 140 */
const HEIGHT_OPTIONS = range(140, 210, 1);
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

  // ✅ التحقق موجود عشان زر النتائج يشتغل صح (بس بدون رسائل/أحمر)
  const fieldErrors = useMemo(() => {
    const h = toNum(heightCm);
    const b = toNum(bustCm);
    const w = toNum(waistCm);
    const hip = toNum(hipCm);

    return {
      height: !heightCm || h < 140 || h > 210 ? "x" : "",
      bust: !bustCm || b < 60 || b > 160 ? "x" : "",
      waist: !waistCm || w < 45 || w > 160 ? "x" : "",
      hip: !hipCm || hip < 60 || hip > 180 ? "x" : "",
      bodyShape: !bodyShape ? "x" : "",
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
              label="الطول (سم)"
              iconType="height"
              value={heightCm}
              onChange={setHeightCm}
              placeholder="اختاري"
              options={HEIGHT_OPTIONS}
            />

            <SelectField
              label="محيط الصدر (سم)"
              iconType="bust"
              value={bustCm}
              onChange={setBustCm}
              placeholder="اختاري"
              options={BUST_OPTIONS}
            />

            <SelectField
              label="محيط الخصر (سم)"
              iconType="waist"
              value={waistCm}
              onChange={setWaistCm}
              placeholder="اختاري"
              options={WAIST_OPTIONS}
            />

            <SelectField
              label="محيط الأرداف (سم)"
              iconType="hip"
              value={hipCm}
              onChange={setHipCm}
              placeholder="اختاري"
              options={HIP_OPTIONS}
            />
          </div>

          {/* Body shape */}
          <div className="mt-6">
            <p className="text-sm font-semibold text-white">شكل الجسم</p>

            <p className="mt-2 text-xs text-neutral-400">
              نستخدمه فقط لترتيب النتائج بدقة
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
  iconType,
  value,
  onChange,
  placeholder,
  options,
}: {
  label: string;
  iconType: "height" | "bust" | "waist" | "hip";
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  options: number[];
}) {
  return (
    <label className="block">
      {/* ✅ النص + الأيقونة (الأيقونة يسار النص) */}
      <span className="text-sm font-semibold text-white inline-flex items-center gap-2">
  <span>{label}</span>
  <span className="pointer-events-none">
    <MeasureIconImg type={iconType} />
  </span>
</span>

      <div className="relative mt-2">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ colorScheme: "dark" }}
          className={[
            "w-full appearance-none rounded-2xl border px-4 py-3 text-sm font-semibold transition overflow-hidden shrink-0",
            "border-white/10 bg-neutral-950 text-white",
            "focus:border-[#d6b56a]/40 focus:ring-2 focus:ring-[#d6b56a]/10",
          ].join(" ")}
        >
          <option value="" disabled className="bg-neutral-950 text-neutral-400">
            {placeholder || "اختاري"}
          </option>

          {options.map((n) => (
            <option key={n} value={n} className="bg-neutral-950 text-white">
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
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
        // ✅ ثبّت الحجم
        "h-[48px] w-full",
        "rounded-2xl border px-4 text-xs font-semibold transition",
        "bg-black/20 border-white/10 text-white hover:bg-black/30",

        // ✅ ترتيب ثابت + منع تمدد
        "flex items-center justify-center gap-2",
        "overflow-hidden",

        active
          ? "ring-2 ring-[#d6b56a]/40 border-[#d6b56a]/35 bg-[#d6b56a]/10"
          : "",
      ].join(" ")}
    >
      {/* ✅ النص ما يلف */}
      <span className="mr-18 whitespace-nowrap">{label}</span>

      {/* ✅ الأيقونة ثابتة المقاس */}
      <span className="shrink-0">
        <ShapeIcon type={label} />
      </span>
    </button>
  );
}