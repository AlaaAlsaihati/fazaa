"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SiteFooter from "@/app/components/FazaaFooter";
import FazaaDrawer from "@/app/components/fazaaDrawer";

type InitialParams = {
  occasion?: string;
  weddingStyle?: string;
  depth?: string;
  undertone?: string;
};

type BodyShapeArabic = "ساعة رملية" | "كمثري" | "مستقيم" | "تفاحة";
type Unit = "cm" | "in";

const STORAGE_KEY = "fazaa_measurements_v1";
const STALE_DAYS = 60;
const DAY_MS = 24 * 60 * 60 * 1000;

function toNum(v: string) {
  const n = Number(String(v || "").trim());
  return Number.isFinite(n) ? n : NaN;
}

function safeLocalStorageGet(key: string) {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeLocalStorageSet(key: string, val: string) {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, val);
  } catch {
    // ignore
  }
}

function range(min: number, max: number, step = 1) {
  const out: number[] = [];
  for (let x = min; x <= max + 1e-9; x += step) {
    const v = Math.round(x * 2) / 2;
    out.push(v);
  }
  return out;
}

function inToCm(vIn: number) {
  return vIn * 2.54;
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
const HEIGHT_OPTIONS = range(140, 210, 1);

const BUST_CM_OPTIONS = range(60, 160, 1);
const WAIST_CM_OPTIONS = range(45, 160, 1);
const HIP_CM_OPTIONS = range(60, 180, 1);

const BUST_IN_OPTIONS = range(24, 63, 0.5);
const WAIST_IN_OPTIONS = range(18, 63, 0.5);
const HIP_IN_OPTIONS = range(24, 71, 0.5);

function UnitToggle({
  value,
  onChange,
}: {
  value: Unit;
  onChange: (u: Unit) => void;
}) {
  return (
    <div className="inline-flex rounded-2xl border border-[#d6b56a]/45 bg-black/20 p-1">
      <button
        type="button"
        onClick={() => onChange("cm")}
        className={[
          "px-3 py-1.5 rounded-xl text-xs font-extrabold transition",
          value === "cm"
            ? "bg-[#d6b56a]/15 text-white border border-[#d6b56a]/35"
            : "text-neutral-300 hover:text-white",
        ].join(" ")}
      >
        سم
      </button>

      <button
        type="button"
        onClick={() => onChange("in")}
        className={[
          "px-3 py-1.5 rounded-xl text-xs font-extrabold transition",
          value === "in"
            ? "bg-[#d6b56a]/15 text-white border border-[#d6b56a]/35"
            : "text-neutral-300 hover:text-white",
        ].join(" ")}
      >
        إنش
      </button>
    </div>
  );
}

function BackFab({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="رجوع"
      className={[
        "fixed bottom-6 right-6 z-50",
        "h-12 w-12 rounded-2xl",
        "border border-[#d6b56a]/55 bg-black/35 backdrop-blur",
        "shadow-[0_10px_30px_rgba(0,0,0,0.45)]",
        "flex items-center justify-center",
        "active:scale-95 transition",
      ].join(" ")}
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

/* ===== زر الثلاث نقاط (أفقي) ===== */
function ThreeDotsButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="القائمة"
      className={[
        "fixed top-6 right-6 z-50",
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

type SavedPayload = {
  unit?: Unit;
  heightCm?: string;
  bust?: string;
  waist?: string;
  hip?: string;
  bodyShape?: BodyShapeArabic | "";
  lastUpdated?: number;
};

function hasAnySavedValue(p: SavedPayload | null) {
  if (!p) return false;
  return !!(p.heightCm || p.bust || p.waist || p.hip || p.bodyShape);
}

export default function MeasurementsClient({
  initialParams,
}: {
  initialParams: InitialParams;
}) {
  const router = useRouter();
  const sp = useSearchParams();

  const occasion = initialParams.occasion || sp.get("occasion") || "";
  const weddingStyle = initialParams.weddingStyle || sp.get("weddingStyle") || "";
  const depth = initialParams.depth || sp.get("depth") || "";
  const undertone = initialParams.undertone || sp.get("undertone") || "";

  // ✅ Drawer
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ Auth (مثل ما كان عندك)
  const user = useMemo(() => {
    try {
      if (typeof window === "undefined") return null;
      const raw = window.localStorage.getItem("fazaa_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const userName: string | null =
    user && typeof user.name === "string" && user.name.trim() ? user.name.trim() : null;

  const userEmail: string | null =
    user && typeof user.email === "string" && user.email.trim()
      ? user.email.trim().toLowerCase()
      : null;

  const isLoggedIn = !!userEmail;

  const history: { id: string; title: string; subtitle: string }[] = [];

  // ✅ الوحدة للمحيطات فقط (الطول ثابت سم)
  const [unit, setUnit] = useState<Unit>("cm");

  // ✅ Draft values
  const [heightCm, setHeightCm] = useState<string>("");
  const [bust, setBust] = useState<string>("");
  const [waist, setWaist] = useState<string>("");
  const [hip, setHip] = useState<string>("");
  const [bodyShape, setBodyShape] = useState<BodyShapeArabic | "">("");

  // ✅ Saved snapshot
  const [savedSnapshot, setSavedSnapshot] = useState<SavedPayload | null>(null);
  const [savedLastUpdated, setSavedLastUpdated] = useState<number | null>(null);

  // ✅ checkbox state
  const [useSaved, setUseSaved] = useState(false);

  // ✅ dirty (إذا المستخدم عدّل بيده)
  const [isDirty, setIsDirty] = useState(false);

  // ✅ flash بعد الحفظ
  const [savedFlash, setSavedFlash] = useState(false);

  // ✅ تحميل المحفوظ عند فتح الصفحة
  useEffect(() => {
    const raw = safeLocalStorageGet(STORAGE_KEY);
    if (!raw) {
      setSavedSnapshot(null);
      setSavedLastUpdated(null);
      setUseSaved(false);
      return;
    }

    try {
      const saved = JSON.parse(raw) as SavedPayload;
      setSavedSnapshot(saved);
      setSavedLastUpdated(typeof saved.lastUpdated === "number" ? saved.lastUpdated : null);

      if (!isLoggedIn) {
        setUseSaved(false);
      }
    } catch {
      setSavedSnapshot(null);
      setSavedLastUpdated(null);
      setUseSaved(false);
    }
  }, [isLoggedIn]);

  const hasSaved = useMemo(() => {
    return isLoggedIn && hasAnySavedValue(savedSnapshot);
  }, [isLoggedIn, savedSnapshot]);

  const isStale = useMemo(() => {
    if (!savedLastUpdated) return false;
    return Date.now() - savedLastUpdated >= STALE_DAYS * DAY_MS;
  }, [savedLastUpdated]);

  // ✅ خيارات حسب الوحدة
  const bustOptions = unit === "cm" ? BUST_CM_OPTIONS : BUST_IN_OPTIONS;
  const waistOptions = unit === "cm" ? WAIST_CM_OPTIONS : WAIST_IN_OPTIONS;
  const hipOptions = unit === "cm" ? HIP_CM_OPTIONS : HIP_IN_OPTIONS;

  // ✅ تحقق للنتائج (يشمل bodyShape)
  const fieldErrors = useMemo(() => {
    const h = toNum(heightCm);
    const b = toNum(bust);
    const w = toNum(waist);
    const hp = toNum(hip);

    const bCm = unit === "cm" ? b : inToCm(b);
    const wCm = unit === "cm" ? w : inToCm(w);
    const hipCm = unit === "cm" ? hp : inToCm(hp);

    return {
      height: !heightCm || h < 140 || h > 210 ? "x" : "",
      bust: !bust || bCm < 60 || bCm > 160 ? "x" : "",
      waist: !waist || wCm < 45 || wCm > 160 ? "x" : "",
      hip: !hip || hipCm < 60 || hipCm > 180 ? "x" : "",
      bodyShape: !bodyShape ? "x" : "",
    };
  }, [heightCm, bust, waist, hip, bodyShape, unit]);

  const canSubmit = useMemo(() => {
    return (
      !fieldErrors.height &&
      !fieldErrors.bust &&
      !fieldErrors.waist &&
      !fieldErrors.hip &&
      !fieldErrors.bodyShape
    );
  }, [fieldErrors]);

  // ✅ تحقق للحفظ/التحديث (بدون bodyShape)
  const canUpdateMeasurements = useMemo(() => {
    if (!isLoggedIn) return false;

    const h = toNum(heightCm);
    const b = toNum(bust);
    const w = toNum(waist);
    const hp = toNum(hip);

    if (!heightCm || !bust || !waist || !hip) return false;
    if (!Number.isFinite(h) || h < 140 || h > 210) return false;

    const bCm = unit === "cm" ? b : inToCm(b);
    const wCm = unit === "cm" ? w : inToCm(w);
    const hipCm = unit === "cm" ? hp : inToCm(hp);

    if (!Number.isFinite(bCm) || bCm < 60 || bCm > 160) return false;
    if (!Number.isFinite(wCm) || wCm < 45 || wCm > 160) return false;
    if (!Number.isFinite(hipCm) || hipCm < 60 || hipCm > 180) return false;

    return true;
  }, [isLoggedIn, heightCm, bust, waist, hip, unit]);

  function markDirty() {
    // أول ما المستخدم يلمس أي قيمة بيده:
    if (useSaved) setUseSaved(false);
    setIsDirty(true);
    setSavedFlash(false);
  }

  function onChangeUnit(u: Unit) {
    if (u === unit) return;
    markDirty();

    setUnit(u);

    // نفس سلوكك السابق: نفرّغ المحيطات وشكل الجسم عند تغيير الوحدة
    setBust("");
    setWaist("");
    setHip("");
    setBodyShape("");
  }

  function applySavedFromSnapshot() {
    if (!savedSnapshot) return;

    // تطبيق المحفوظ = مو dirty
    setUseSaved(true);
    setIsDirty(false);
    setSavedFlash(false);

    if (savedSnapshot.unit === "cm" || savedSnapshot.unit === "in") setUnit(savedSnapshot.unit);
    if (typeof savedSnapshot.heightCm === "string") setHeightCm(savedSnapshot.heightCm);
    if (typeof savedSnapshot.bust === "string") setBust(savedSnapshot.bust);
    if (typeof savedSnapshot.waist === "string") setWaist(savedSnapshot.waist);
    if (typeof savedSnapshot.hip === "string") setHip(savedSnapshot.hip);
    if (savedSnapshot.bodyShape) setBodyShape(savedSnapshot.bodyShape);
  }

  function saveOrUpdateMeasurements() {
    if (!canUpdateMeasurements) return;

    const payload: SavedPayload = {
      unit,
      heightCm,
      bust,
      waist,
      hip,
      bodyShape, // نخزنها لو موجودة (مو شرط للحفظ)
      lastUpdated: Date.now(),
    };

    safeLocalStorageSet(STORAGE_KEY, JSON.stringify(payload));

    // تحديث snapshot
    setSavedSnapshot(payload);
    setSavedLastUpdated(payload.lastUpdated ?? null);

    // بعد الحفظ: مو dirty + اعرض فلاش "تم"
    setIsDirty(false);
    setUseSaved(true);

    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1200);
  }

  function goResults() {
    if (!canSubmit) return;

    const params = new URLSearchParams();

    if (occasion) params.set("occasion", occasion);
    if (weddingStyle) params.set("weddingStyle", weddingStyle);
    if (depth) params.set("depth", depth);
    if (undertone) params.set("undertone", undertone);

    const h = toNum(heightCm);
    const b = toNum(bust);
    const w = toNum(waist);
    const hp = toNum(hip);

    const bustCm = unit === "cm" ? b : Math.round(inToCm(b) * 10) / 10;
    const waistCm = unit === "cm" ? w : Math.round(inToCm(w) * 10) / 10;
    const hipCm = unit === "cm" ? hp : Math.round(inToCm(hp) * 10) / 10;

    params.set("height", String(h));
    params.set("bust", String(bustCm));
    params.set("waist", String(waistCm));
    params.set("hip", String(hipCm));
    params.set("bodyShape", bodyShape);
    params.set("unit", unit);

    router.push(`/results?${params.toString()}`);
  }

  // ✅ placeholder المطلوب
  const circumPlaceholder = unit === "cm" ? "سنتيمتر" : "إنش";
  const heightPlaceholder = "سنتيمتر"; // ثابت

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black p-6"
    >
      <ThreeDotsButton onClick={() => setMenuOpen(true)} />

      <FazaaDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        userName={userName}
        history={history}
        onLoginClick={() => {
          setMenuOpen(false);
        }}
        onRegisterClick={() => {
          setMenuOpen(false);
        }}
        onHistoryClick={(id) => {
          console.log("history", id);
          setMenuOpen(false);
        }}
        onLogoutClick={() => {
          setMenuOpen(false);
        }}
      />

      <div className="mx-auto max-w-2xl">
        <header className="mb-6 text-center">
          <p className="text-sm text-neutral-400">الخطوة الأخيرة</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white">
            خلّينا نضبط المقاس المثالي لك
          </h1>
          <p className="mt-3 text-sm text-neutral-400">
            نطلع لك اقتراحات فخمة + مقاس محسوب عليك.
          </p>
        </header>

        <div className="relative overflow-hidden rounded-3xl border border-[#d6b56a]/35 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(214,181,106,0.12),0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur">
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-[#d6b56a]/22" />
          <div className="pointer-events-none absolute -top-24 left-1/2 h-40 w-[520px] -translate-x-1/2 rounded-full bg-[#d6b56a]/10 blur-3xl" />

          <div className="mb-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div />
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-neutral-300">
                  وحدة المحيطات:
                </span>
                <UnitToggle value={unit} onChange={onChangeUnit} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SelectField
              label="الطول "
              iconType="height"
              value={heightCm}
              onChange={(v) => {
                markDirty();
                setHeightCm(v);
              }}
              placeholder={heightPlaceholder}
              options={HEIGHT_OPTIONS}
            />

            <SelectField
              label="محيط الصدر"
              iconType="bust"
              value={bust}
              onChange={(v) => {
                markDirty();
                setBust(v);
              }}
              placeholder={circumPlaceholder}
              options={bustOptions}
            />

            <SelectField
              label="محيط الخصر"
              iconType="waist"
              value={waist}
              onChange={(v) => {
                markDirty();
                setWaist(v);
              }}
              placeholder={circumPlaceholder}
              options={waistOptions}
            />

            <SelectField
              label="محيط الأرداف"
              iconType="hip"
              value={hip}
              onChange={(v) => {
                markDirty();
                setHip(v);
              }}
              placeholder={circumPlaceholder}
              options={hipOptions}
            />
          </div>

          {/* ✅ نفس مكان الشيك بوكس: يا شيك بوكس أو زر صغير */}
          {isLoggedIn ? (
            <div className="mt-4 flex items-center justify-start">
              {!isDirty && hasSaved ? (
                // الحالة الطبيعية: شيك بوكس
                <label className="inline-flex items-center gap-2 text-xs text-neutral-300 select-none">
                  <input
                    type="checkbox"
                    checked={useSaved}
                    onChange={(e) => {
                      const v = e.target.checked;
                      setUseSaved(v);
                      if (v) applySavedFromSnapshot();
                    }}
                    className="h-4 w-4 rounded border-white/20 bg-black/30 accent-[#d6b56a]"
                  />
                  <span>استخدام المقاسات المحفوظة</span>

                  {useSaved && isStale ? (
                    <span className="mr-2 rounded-full border border-[#d6b56a]/35 bg-black/20 px-2 py-0.5 text-[10px] text-[#f3e0b0]">
                      مر {STALE_DAYS} يوم على آخر تحديث للمقاسات
                    </span>
                  ) : null}
                </label>
              ) : (
                // إذا عدّل أو ما عنده محفوظ: زر صغير بنفس المكان
                <button
                  type="button"
                  onClick={saveOrUpdateMeasurements}
                  disabled={!canUpdateMeasurements}
                  className={[
                    "inline-flex items-center justify-center",
                    "rounded-xl border px-3 py-2",
                    "text-xs font-extrabold transition",
                    "border-[#d6b56a]/45 bg-black/20 text-white",
                    "hover:border-[#d6b56a]/70 hover:bg-black/30",
                    !canUpdateMeasurements ? "opacity-40 hover:border-[#d6b56a]/45" : "",
                  ].join(" ")}
                >
                  {savedFlash ? "تم ✅" : hasSaved ? "تحديث المقاسات" : "حفظ المقاسات"}
                </button>
              )}
            </div>
          ) : null}

          <div className="mt-6">
            <p className="text-sm font-semibold text-white">شكل الجسم</p>

            <p className="mt-2 text-xs text-neutral-400">
              نستخدمه فقط لترتيب النتائج بدقة
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Chip
                label="ساعة رملية"
                active={bodyShape === "ساعة رملية"}
                onClick={() => {
                  markDirty();
                  setBodyShape("ساعة رملية");
                }}
              />
              <Chip
                label="كمثري"
                active={bodyShape === "كمثري"}
                onClick={() => {
                  markDirty();
                  setBodyShape("كمثري");
                }}
              />
              <Chip
                label="مستقيم"
                active={bodyShape === "مستقيم"}
                onClick={() => {
                  markDirty();
                  setBodyShape("مستقيم");
                }}
              />
              <Chip
                label="تفاحة"
                active={bodyShape === "تفاحة"}
                onClick={() => {
                  markDirty();
                  setBodyShape("تفاحة");
                }}
              />
            </div>
          </div>

          <button
            onClick={goResults}
            disabled={!canSubmit}
            className="mt-6 w-full rounded-2xl border border-[#d6b56a]/45 bg-gradient-to-r from-[#d6b56a]/25 via-white/5 to-[#d6b56a]/15 py-3 text-sm font-extrabold text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition hover:border-[#d6b56a]/70 disabled:opacity-40 disabled:hover:border-[#d6b56a]/45"
            type="button"
          >
            عرض النتائج
          </button>

          <p className="mt-3 text-center text-xs text-neutral-400">
            * الطول بالسنتيمتر دائمًا — ووحدة المحيطات حسب اختيارك.
          </p>
        </div>

        <SiteFooter />
      </div>

      <BackFab onClick={() => router.back()} />
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
            <option key={n} value={String(n)} className="bg-neutral-950 text-white">
              {n}
            </option>
          ))}
        </select>

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
        "h-[48px] w-full",
        "rounded-2xl border px-4 text-xs font-semibold transition",
        "bg-black/20 border-white/10 text-white hover:bg-black/30",
        "flex items-center justify-center gap-2",
        "overflow-hidden",
        active ? "ring-2 ring-[#d6b56a]/40 border-[#d6b56a]/35 bg-[#d6b56a]/10" : "",
      ].join(" ")}
    >
      <span className="mr-18 whitespace-nowrap">{label}</span>
      <span className="shrink-0">
        <ShapeIcon type={label} />
      </span>
    </button>
  );
}