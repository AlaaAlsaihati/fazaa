"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

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

export default function MeasurementsClient({
  initialParams,
}: {
  initialParams: InitialParams;
}) {
  const router = useRouter();

  const occasion = initialParams.occasion || "";
  const weddingStyle = initialParams.weddingStyle || "";
  const depth = initialParams.depth || "";
  const undertone = initialParams.undertone || "";

  // القياسات
  const [heightCm, setHeightCm] = useState("");
  const [bustCm, setBustCm] = useState("");
  const [waistCm, setWaistCm] = useState("");
  const [hipCm, setHipCm] = useState("");

  // ✅ صار إلزامي
  const [bodyShape, setBodyShape] = useState<BodyShapeArabic | "">("");

  const errors = useMemo(() => {
    const e: string[] = [];

    const h = toNum(heightCm);
    const b = toNum(bustCm);
    const w = toNum(waistCm);
    const hip = toNum(hipCm);

    if (!heightCm || !Number.isFinite(h) || h < 120 || h > 210) {
      e.push("الطول لازم يكون بين 120 و 210 سم.");
    }
    if (!bustCm || !Number.isFinite(b) || b < 60 || b > 160) {
      e.push("محيط الصدر لازم يكون بين 60 و 160 سم.");
    }
    if (!waistCm || !Number.isFinite(w) || w < 45 || w > 160) {
      e.push("محيط الخصر لازم يكون بين 45 و 160 سم.");
    }
    if (!hipCm || !Number.isFinite(hip) || hip < 60 || hip > 180) {
      e.push("محيط الأرداف لازم يكون بين 60 و 180 سم.");
    }

    // ✅ إلزامي: شكل الجسم
    if (!bodyShape) {
      e.push("اختاري شكل جسمك عشان نرتّب لك النتائج بدقة (خصوصًا العبايات).");
    }

    return e;
  }, [heightCm, bustCm, waistCm, hipCm, bodyShape]);

  const canSubmit = errors.length === 0;

  function goResults() {
    if (!canSubmit) return;

    const params = new URLSearchParams();

    if (occasion) params.set("occasion", occasion);
    if (weddingStyle) params.set("weddingStyle", weddingStyle);

    // اللي جاي من صفحة البشرة
    if (depth) params.set("depth", depth);
    if (undertone) params.set("undertone", undertone);

    // القياسات
    params.set("height", String(toNum(heightCm)));
    params.set("bust", String(toNum(bustCm)));
    params.set("waist", String(toNum(waistCm)));
    params.set("hip", String(toNum(hipCm)));

    // ✅ الآن إلزامي
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
            عشان نطلع لك اقتراحات فخمة + مقاس محسوب عليك 🔥
          </p>
        </header>

        {/* Luxury Card */}
        <div className="relative overflow-hidden rounded-3xl border border-[#d6b56a]/35 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(214,181,106,0.12),0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur">
          {/* إطار ذهبي */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-[#d6b56a]/25" />

          {/* لمعة خفيفة داخل الكرت */}
          <div className="pointer-events-none absolute -top-24 left-1/2 h-40 w-[520px] -translate-x-1/2 rounded-full bg-[#d6b56a]/10 blur-3xl" />

          {/* Inputs */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="طولك (سم)"
              value={heightCm}
              onChange={setHeightCm}
              placeholder="مثال: 165"
            />
            <Field
              label="محيط الصدر (سم)"
              value={bustCm}
              onChange={setBustCm}
              placeholder="مثال: 90"
            />
            <Field
              label="محيط الخصر (سم)"
              value={waistCm}
              onChange={setWaistCm}
              placeholder="مثال: 70"
            />
            <Field
              label="محيط الأرداف (سم)"
              value={hipCm}
              onChange={setHipCm}
              placeholder="مثال: 98"
            />
          </div>

          {/* Body shape (صار إلزامي) */}
          <div className="mt-6">
            <p className="text-sm font-semibold text-white">
              شكل جسمك <span className="text-[#f3e0b0]">(إلزامي)</span>
            </p>

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
          </div>

          {/* Errors */}
          {errors.length > 0 ? (
            <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
              <p className="text-sm font-semibold text-red-200">تأكدي من التالي:</p>
              <ul className="mt-2 list-disc pr-5 text-sm text-red-100/90 space-y-1">
                {errors.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* CTA */}
          <button
            onClick={goResults}
            disabled={!canSubmit}
            className="mt-6 w-full rounded-2xl border border-[#d6b56a]/45 bg-gradient-to-r from-[#d6b56a]/25 via-white/5 to-[#d6b56a]/15 py-3 text-sm font-extrabold text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition hover:border-[#d6b56a]/70 disabled:opacity-40 disabled:hover:border-[#d6b56a]/45"
          >
            عرض النتائج
          </button>

          {/* Small hint */}
          <p className="mt-3 text-center text-xs text-neutral-400">
            * القياسات بالسنتيمتر — نستخدمها فقط لحساب المقاس المقترح.
          </p>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-white">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputMode="numeric"
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-neutral-500 focus:border-[#d6b56a]/40 focus:ring-2 focus:ring-[#d6b56a]/10"
      />
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
        active ? "ring-2 ring-[#d6b56a]/40 border-[#d6b56a]/35 bg-[#d6b56a]/10" : "",
      ].join(" ")}
    >
      {label}
    </button>
  );
}