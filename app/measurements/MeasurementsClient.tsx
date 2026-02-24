"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SiteFooter from "@/app/components/FazaaFooter";
import FazaaDrawer from "@/app/components/fazaaDrawer";
import { supabase } from "@/app/lib/supabaseClient";

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

function UnitToggle({ value, onChange }: { value: Unit; onChange: (u: Unit) => void }) {
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

export default function MeasurementsClient({ initialParams }: { initialParams: InitialParams }) {
  const router = useRouter();
  const sp = useSearchParams();

  const occasion = initialParams.occasion || sp.get("occasion") || "";
  const weddingStyle = initialParams.weddingStyle || sp.get("weddingStyle") || "";
  const depth = initialParams.depth || sp.get("depth") || "";
  const undertone = initialParams.undertone || sp.get("undertone") || "";

  // Drawer
  const [menuOpen, setMenuOpen] = useState(false);
  const history: { id: string; title: string; subtitle: string }[] = [];

  // Auth (Supabase ONLY)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setIsLoggedIn(!!data.session?.user);
    })();

    const { data: listener } = supabase.auth.onAuthStateChange((_evt, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  // Unit
  const [unit, setUnit] = useState<Unit>("cm");

  // Draft values
  const [heightCm, setHeightCm] = useState<string>("");
  const [bust, setBust] = useState<string>("");
  const [waist, setWaist] = useState<string>("");
  const [hip, setHip] = useState<string>("");
  const [bodyShape, setBodyShape] = useState<BodyShapeArabic | "">("");

  // Saved snapshot
  const [savedSnapshot, setSavedSnapshot] = useState<SavedPayload | null>(null);
  const [savedLastUpdated, setSavedLastUpdated] = useState<number | null>(null);

  // dirty
  const [isDirty, setIsDirty] = useState(false);

  // آخر إجراء ثبت للمستخدم (يثبت لين يتغير شيء)
  const [lastAction, setLastAction] = useState<"saved" | "applied" | null>(null);

  // Load saved (no auto-apply)
  useEffect(() => {
    const raw = safeLocalStorageGet(STORAGE_KEY);

    if (!raw) {
      setSavedSnapshot(null);
      setSavedLastUpdated(null);
      setLastAction(null);
      return;
    }

    try {
      const saved = JSON.parse(raw) as SavedPayload;
      setSavedSnapshot(saved);
      setSavedLastUpdated(typeof saved.lastUpdated === "number" ? saved.lastUpdated : null);
      setLastAction(null);
    } catch {
      setSavedSnapshot(null);
      setSavedLastUpdated(null);
      setLastAction(null);
    }
  }, [isLoggedIn]);

  const hasSaved = useMemo(() => {
    return isLoggedIn && hasAnySavedValue(savedSnapshot);
  }, [isLoggedIn, savedSnapshot]);

  const isStale = useMemo(() => {
    if (!savedLastUpdated) return false;
    return Date.now() - savedLastUpdated >= STALE_DAYS * DAY_MS;
  }, [savedLastUpdated]);

  const bustOptions = unit === "cm" ? BUST_CM_OPTIONS : BUST_IN_OPTIONS;
  const waistOptions = unit === "cm" ? WAIST_CM_OPTIONS : WAIST_IN_OPTIONS;
  const hipOptions = unit === "cm" ? HIP_CM_OPTIONS : HIP_IN_OPTIONS;

  // ✅ Validation للمقاسات فقط (بدون bodyShape) — للحفظ/التحديث
  const measErrors = useMemo(() => {
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
    };
  }, [heightCm, bust, waist, hip, unit]);

  const canSaveMeasurements = useMemo(() => {
    return !measErrors.height && !measErrors.bust && !measErrors.waist && !measErrors.hip;
  }, [measErrors]);

  // ✅ Validation لعرض النتائج (يشمل bodyShape)
  const canSubmit = useMemo(() => {
    return canSaveMeasurements && !!bodyShape;
  }, [canSaveMeasurements, bodyShape]);

  const canUpdate = useMemo(() => {
    return isLoggedIn && canSaveMeasurements;
  }, [isLoggedIn, canSaveMeasurements]);

  function markDirty() {
    setIsDirty(true);
    setLastAction(null); // أي تعديل يلغي “تم…”
  }

  function onChangeUnit(u: Unit) {
    if (u === unit) return;
    markDirty();

    setUnit(u);
    setBust("");
    setWaist("");
    setHip("");
    // body shape ما له علاقة بالحفظ، بس نخليه زي سلوكك السابق
    setBodyShape("");
  }

  function applySavedFromSnapshot() {
    if (!savedSnapshot) return;

    setIsDirty(false);
    setLastAction("applied");

    if (savedSnapshot.unit === "cm" || savedSnapshot.unit === "in") setUnit(savedSnapshot.unit);
    if (typeof savedSnapshot.heightCm === "string") setHeightCm(savedSnapshot.heightCm);
    if (typeof savedSnapshot.bust === "string") setBust(savedSnapshot.bust);
    if (typeof savedSnapshot.waist === "string") setWaist(savedSnapshot.waist);
    if (typeof savedSnapshot.hip === "string") setHip(savedSnapshot.hip);
    if (savedSnapshot.bodyShape) setBodyShape(savedSnapshot.bodyShape);
  }

  function saveOrUpdateMeasurements() {
    if (!canUpdate) return;

    const payload: SavedPayload = {
      unit,
      heightCm,
      bust,
      waist,
      hip,
      // نخزّن bodyShape إذا موجود (اختياري)، بس مو شرط للحفظ
      bodyShape: bodyShape || "",
      lastUpdated: Date.now(),
    };

    safeLocalStorageSet(STORAGE_KEY, JSON.stringify(payload));

    setSavedSnapshot(payload);
    setSavedLastUpdated(payload.lastUpdated ?? null);

    setIsDirty(false);
    setLastAction("saved"); // ✅ تثبت “تم تحديث…” وما ترجع
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

  const circumPlaceholder = unit === "cm" ? "سنتيمتر" : "إنش";
  const heightPlaceholder = "سنتيمتر";

  // ✅ زر واحد: يا استخدام / يا حفظ-تحديث / يا تم…
  const showActionButton = isLoggedIn;

  const actionLabel = useMemo(() => {
    // لو تم حفظ/تحديث: تثبت
    if (lastAction === "saved") return hasSaved ? "تم تحديث المقاسات" : "تم حفظ المقاسات";

    // لو تم تطبيق المحفوظ: تثبت
    if (lastAction === "applied") return "تم استخدام المقاسات المحفوظة";

    // غير كذا:
    if (isDirty) return hasSaved ? "تحديث المقاسات" : "حفظ المقاسات";

    // مو dirty
    return hasSaved ? "استخدام المقاسات المحفوظة" : "حفظ المقاسات";
  }, [lastAction, isDirty, hasSaved]);

  const actionDisabled = useMemo(() => {
    // إذا ثبتت “تم …” نخليه disabled لين المستخدم يعدّل شي
    if (lastAction) return true;

    if (isDirty) return !canUpdate;

    // مو dirty:
    if (hasSaved) return false; // استخدام المحفوظ متاح
    return true; // ما عنده محفوظ وما عدّل شي -> ما في شيء يسويه
  }, [lastAction, isDirty, canUpdate, hasSaved]);

  function onActionClick() {
    if (!isLoggedIn) return;
    if (lastAction) return;

    if (isDirty) {
      saveOrUpdateMeasurements();
      return;
    }

    // مو dirty
    if (hasSaved) applySavedFromSnapshot();
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black p-6"
    >
      <ThreeDotsButton onClick={() => setMenuOpen(true)} />

      <FazaaDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        userName={null}
        history={history}
        onLoginClick={() => setMenuOpen(false)}
        onRegisterClick={() => setMenuOpen(false)}
        onHistoryClick={() => setMenuOpen(false)}
        onLogoutClick={() => setMenuOpen(false)}
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

          {/* ✅ زر واحد */}
          {showActionButton ? (
            <div className="mt-4 flex items-center justify-start">
              <button
                type="button"
                onClick={onActionClick}
                disabled={actionDisabled}
                className={[
                  "inline-flex items-center gap-2",
                  "rounded-xl border px-3 py-2",
                  "text-xs font-extrabold transition",
                  "border-[#d6b56a]/45 bg-black/20 text-white hover:border-[#d6b56a]/70",
                  "disabled:opacity-60 disabled:hover:border-[#d6b56a]/45",
                  // لمسة “تم …” بشكل احترافي بدون أيقونات
                  lastAction ? "bg-[#d6b56a]/10 border-[#d6b56a]/60" : "",
                ].join(" ")}
              >
                <span>{actionLabel}</span>

                {!isDirty && lastAction === "applied" && isStale ? (
                  <span className="mr-2 rounded-full border border-[#d6b56a]/35 bg-black/20 px-2 py-0.5 text-[10px] text-[#f3e0b0]">
                    مر {STALE_DAYS} يوم على آخر تحديث للمقاسات
                  </span>
                ) : null}
              </button>
            </div>
          ) : null}

          <div className="mt-6">
            <p className="text-sm font-semibold text-white">شكل الجسم</p>
            <p className="mt-2 text-xs text-neutral-400">نستخدمه فقط لترتيب النتائج بدقة</p>

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