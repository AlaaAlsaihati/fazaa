"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import SiteFooter from "@/app/components/FazaaFooter";
import FazaaDrawer from "@/app/components/fazaaDrawer";
import { supabase } from "@/app/lib/supabaseClient";
import { useLanguage } from "@/app/components/LanguageProvider";

type InitialParams = {
  occasion?: string;
  weddingStyle?: string;
  depth?: string;
  undertone?: string;
};

type BodyShapeArabic =
  | "ساعة رملية"
  | "كمثري"
  | "مستقيم"
  | "تفاحة";

type Unit = "cm" | "in";

const STORAGE_KEY =
  "fazaa_measurements_v1";

/* =========================
   Helpers
========================= */

function toNum(v: string) {
  const n = Number(
    String(v || "").trim()
  );

  return Number.isFinite(n)
    ? n
    : NaN;
}

function safeLocalStorageGet(
  key: string
) {
  try {
    if (
      typeof window === "undefined"
    ) {
      return null;
    }

    return window.localStorage.getItem(
      key
    );
  } catch {
    return null;
  }
}

function safeLocalStorageSet(
  key: string,
  val: string
) {
  try {
    if (
      typeof window === "undefined"
    ) {
      return;
    }

    window.localStorage.setItem(
      key,
      val
    );
  } catch {
    // ignore
  }
}

function range(
  min: number,
  max: number,
  step = 1
) {
  const out: number[] = [];

  for (
    let x = min;
    x <= max + 1e-9;
    x += step
  ) {
    const v =
      Math.round(x * 2) / 2;

    out.push(v);
  }

  return out;
}

function inToCm(vIn: number) {
  return vIn * 2.54;
}

/* =========================
   Measurement icons
========================= */

function MeasureIconImg({
  type,
  isArabic,
}: {
  type:
    | "height"
    | "bust"
    | "waist"
    | "hip";
  isArabic: boolean;
}) {
  const map: Record<
    | "height"
    | "bust"
    | "waist"
    | "hip",
    string
  > = {
    height:
      "/icons/measurements/height.png",
    bust:
      "/icons/measurements/bust.png",
    waist:
      "/icons/measurements/waist.png",
    hip:
      "/icons/measurements/hip.png",
  };

  return (
    <img
      src={map[type]}
      alt=""
      draggable={false}
      className={[
        "h-7 w-7 shrink-0 object-contain transform scale-[5]",
        isArabic
          ? "-translate-x-2"
          : "translate-x-2",
      ].join(" ")}
    />
  );
}

function ShapeIcon({
  type,
  isArabic,
}: {
  type: BodyShapeArabic;
  isArabic: boolean;
}) {
  const map: Record<
    BodyShapeArabic,
    string
  > = {
    "ساعة رملية":
      "/icons/body-shapes/hourglass.png",
    كمثري:
      "/icons/body-shapes/pear.png",
    مستقيم:
      "/icons/body-shapes/straight.png",
    تفاحة:
      "/icons/body-shapes/apple.png",
  };

  return (
    <img
      src={map[type]}
      alt=""
      className={[
        "h-30 w-30 object-contain select-none pointer-events-none",
        isArabic
          ? "ml-6"
          : "mr-6",
      ].join(" ")}
      draggable={false}
    />
  );
}

/* =========================
   Dropdown options
========================= */

const HEIGHT_OPTIONS = range(
  140,
  210,
  1
);

const BUST_CM_OPTIONS = range(
  60,
  160,
  1
);

const WAIST_CM_OPTIONS = range(
  45,
  160,
  1
);

const HIP_CM_OPTIONS = range(
  60,
  180,
  1
);

const BUST_IN_OPTIONS = range(
  24,
  63,
  0.5
);

const WAIST_IN_OPTIONS = range(
  18,
  63,
  0.5
);

const HIP_IN_OPTIONS = range(
  24,
  71,
  0.5
);

/* =========================
   Unit toggle
========================= */

function UnitToggle({
  value,
  onChange,
  isArabic,
}: {
  value: Unit;
  onChange: (u: Unit) => void;
  isArabic: boolean;
}) {
  return (
    <div className="inline-flex rounded-2xl border border-[#d6b56a]/45 bg-black/20 p-1">
      <button
        type="button"
        onClick={() =>
          onChange("cm")
        }
        className={[
          "px-3 py-1.5 rounded-xl text-xs font-extrabold transition",
          value === "cm"
            ? "bg-[#d6b56a]/15 text-white border border-[#d6b56a]/35"
            : "text-neutral-300 hover:text-white",
        ].join(" ")}
      >
        {isArabic
          ? "سم"
          : "cm"}
      </button>

      <button
        type="button"
        onClick={() =>
          onChange("in")
        }
        className={[
          "px-3 py-1.5 rounded-xl text-xs font-extrabold transition",
          value === "in"
            ? "bg-[#d6b56a]/15 text-white border border-[#d6b56a]/35"
            : "text-neutral-300 hover:text-white",
        ].join(" ")}
      >
        {isArabic
          ? "إنش"
          : "in"}
      </button>
    </div>
  );
}

/* =========================
   Back
========================= */

function BackFab({
  onClick,
  isArabic,
}: {
  onClick: () => void;
  isArabic: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={
        isArabic
          ? "رجوع"
          : "Back"
      }
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
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d={
            isArabic
              ? "M10 7l5 5-5 5"
              : "M14 7l-5 5 5 5"
          }
        />
      </svg>
    </button>
  );
}

/* =========================
   Three dots
========================= */

function ThreeDotsButton({
  onClick,
  ariaLabel,
}: {
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        top:
          "calc(env(safe-area-inset-top, 0px) + 1.5rem)",
        right:
          "calc(env(safe-area-inset-right, 0px) + 1.5rem)",
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
        <circle
          cx="5"
          cy="12"
          r="1.4"
        />

        <circle
          cx="12"
          cy="12"
          r="1.4"
        />

        <circle
          cx="19"
          cy="12"
          r="1.4"
        />
      </svg>
    </button>
  );
}

/* =========================
   Saved payload
========================= */

type SavedPayload = {
  unit?: Unit;
  heightCm?: string;
  bust?: string;
  waist?: string;
  hip?: string;
  bodyShape?:
    | BodyShapeArabic
    | "";
  lastUpdated?: number;
};

function hasAnySavedValue(
  p: SavedPayload | null
) {
  if (!p) return false;

  return !!(
    p.heightCm ||
    p.bust ||
    p.waist ||
    p.hip ||
    p.bodyShape
  );
}

/* =========================
   Body shapes
========================= */

const BODY_SHAPES: {
  value: BodyShapeArabic;
  labelAr: string;
  labelEn: string;
}[] = [
  {
    value: "ساعة رملية",
    labelAr: "ساعة رملية",
    labelEn: "Hourglass",
  },
  {
    value: "كمثري",
    labelAr: "كمثري",
    labelEn: "Pear",
  },
  {
    value: "مستقيم",
    labelAr: "مستقيم",
    labelEn: "Straight",
  },
  {
    value: "تفاحة",
    labelAr: "تفاحة",
    labelEn: "Apple",
  },
];

/* =========================
   Main page
========================= */

export default function MeasurementsClient({
  initialParams,
}: {
  initialParams: InitialParams;
}) {
  const router = useRouter();
  const sp = useSearchParams();

  const {
    isArabic,
    direction,
  } = useLanguage();

  const occasion =
    initialParams.occasion ||
    sp.get("occasion") ||
    "";

  const weddingStyle =
    initialParams.weddingStyle ||
    sp.get("weddingStyle") ||
    "";

  const depth =
    initialParams.depth ||
    sp.get("depth") ||
    "";

  const undertone =
    initialParams.undertone ||
    sp.get("undertone") ||
    "";

  /* =========================
     Drawer
  ========================= */

  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false);

  /* =========================
     Auth
  ========================= */

  const [
    isLoggedIn,
    setIsLoggedIn,
  ] = useState(false);

  const [
    userId,
    setUserId,
  ] = useState<string | null>(
    null
  );

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } =
        await supabase.auth.getSession();

      if (!mounted) return;

      const user =
        data.session?.user ??
        null;

      setIsLoggedIn(
        !!user
      );

      setUserId(
        user?.id ?? null
      );
    })();

    const { data: listener } =
      supabase.auth.onAuthStateChange(
        (_evt, session) => {
          const user =
            session?.user ??
            null;

          setIsLoggedIn(
            !!user
          );

          setUserId(
            user?.id ??
              null
          );
        }
      );

    return () => {
      mounted = false;

      listener.subscription.unsubscribe();
    };
  }, []);

  /* =========================
     User-scoped local storage
  ========================= */

  const storageKey =
    useMemo(() => {
      return userId
        ? `${STORAGE_KEY}:${userId}`
        : STORAGE_KEY;
    }, [userId]);

  /* =========================
     Form state
  ========================= */

  const [
    unit,
    setUnit,
  ] =
    useState<Unit>("cm");

  const [
    heightCm,
    setHeightCm,
  ] = useState("");

  const [
    bust,
    setBust,
  ] = useState("");

  const [
    waist,
    setWaist,
  ] = useState("");

  const [
    hip,
    setHip,
  ] = useState("");

  const [
    bodyShape,
    setBodyShape,
  ] = useState<
    BodyShapeArabic | ""
  >("");

  /* =========================
     Saved values
  ========================= */

  const [
    savedSnapshot,
    setSavedSnapshot,
  ] =
    useState<SavedPayload | null>(
      null
    );

  const [
    isDirty,
    setIsDirty,
  ] = useState(false);

  const [
    lastAction,
    setLastAction,
  ] = useState<
    "saved" | "applied" | null
  >(null);

  /* =========================
     Load saved
  ========================= */

  useEffect(() => {
    const rawNew =
      safeLocalStorageGet(
        storageKey
      );

    const rawOld =
      storageKey !==
      STORAGE_KEY
        ? safeLocalStorageGet(
            STORAGE_KEY
          )
        : null;

    const raw =
      rawNew || rawOld;

    if (!raw) {
      setSavedSnapshot(
        null
      );

      setLastAction(
        null
      );

      return;
    }

    try {
      const saved =
        JSON.parse(
          raw
        ) as SavedPayload;

      setSavedSnapshot(
        saved
      );

      setLastAction(
        null
      );

      /*
        migrate old -> user-scoped key
      */
      if (
        userId &&
        rawOld &&
        !rawNew
      ) {
        safeLocalStorageSet(
          storageKey,
          rawOld
        );
      }
    } catch {
      setSavedSnapshot(
        null
      );

      setLastAction(
        null
      );
    }
  }, [
    isLoggedIn,
    storageKey,
    userId,
  ]);

  const hasSaved =
    useMemo(() => {
      return (
        isLoggedIn &&
        hasAnySavedValue(
          savedSnapshot
        )
      );
    }, [
      isLoggedIn,
      savedSnapshot,
    ]);

  /* =========================
     Options
  ========================= */

  const bustOptions =
    unit === "cm"
      ? BUST_CM_OPTIONS
      : BUST_IN_OPTIONS;

  const waistOptions =
    unit === "cm"
      ? WAIST_CM_OPTIONS
      : WAIST_IN_OPTIONS;

  const hipOptions =
    unit === "cm"
      ? HIP_CM_OPTIONS
      : HIP_IN_OPTIONS;

  /* =========================
     Validation
  ========================= */

  const measErrors =
    useMemo(() => {
      const h =
        toNum(heightCm);

      const b =
        toNum(bust);

      const w =
        toNum(waist);

      const hp =
        toNum(hip);

      const bCm =
        unit === "cm"
          ? b
          : inToCm(b);

      const wCm =
        unit === "cm"
          ? w
          : inToCm(w);

      const hipCm =
        unit === "cm"
          ? hp
          : inToCm(hp);

      return {
        height:
          !heightCm ||
          h < 140 ||
          h > 210
            ? "x"
            : "",

        bust:
          !bust ||
          bCm < 60 ||
          bCm > 160
            ? "x"
            : "",

        waist:
          !waist ||
          wCm < 45 ||
          wCm > 160
            ? "x"
            : "",

        hip:
          !hip ||
          hipCm < 60 ||
          hipCm > 180
            ? "x"
            : "",
      };
    }, [
      heightCm,
      bust,
      waist,
      hip,
      unit,
    ]);

  const canSaveMeasurements =
    useMemo(() => {
      return (
        !measErrors.height &&
        !measErrors.bust &&
        !measErrors.waist &&
        !measErrors.hip
      );
    }, [measErrors]);

  const canSubmit =
    useMemo(() => {
      return (
        canSaveMeasurements &&
        !!bodyShape
      );
    }, [
      canSaveMeasurements,
      bodyShape,
    ]);

  const canUpdate =
    useMemo(() => {
      return (
        isLoggedIn &&
        canSaveMeasurements
      );
    }, [
      isLoggedIn,
      canSaveMeasurements,
    ]);

  /* =========================
     Actions
  ========================= */

  function markDirty() {
    setIsDirty(true);
    setLastAction(null);
  }

  function onChangeUnit(
    nextUnit: Unit
  ) {
    if (
      nextUnit === unit
    ) {
      return;
    }

    markDirty();

    setUnit(
      nextUnit
    );

    setBust("");
    setWaist("");
    setHip("");
    setBodyShape("");
  }

  function applySavedFromSnapshot() {
    if (!savedSnapshot) {
      return;
    }

    setIsDirty(false);

    setLastAction(
      "applied"
    );

    if (
      savedSnapshot.unit ===
        "cm" ||
      savedSnapshot.unit ===
        "in"
    ) {
      setUnit(
        savedSnapshot.unit
      );
    }

    if (
      typeof savedSnapshot.heightCm ===
      "string"
    ) {
      setHeightCm(
        savedSnapshot.heightCm
      );
    }

    if (
      typeof savedSnapshot.bust ===
      "string"
    ) {
      setBust(
        savedSnapshot.bust
      );
    }

    if (
      typeof savedSnapshot.waist ===
      "string"
    ) {
      setWaist(
        savedSnapshot.waist
      );
    }

    if (
      typeof savedSnapshot.hip ===
      "string"
    ) {
      setHip(
        savedSnapshot.hip
      );
    }

    if (
      savedSnapshot.bodyShape
    ) {
      setBodyShape(
        savedSnapshot.bodyShape
      );
    }
  }

  function saveOrUpdateMeasurements() {
    if (!canUpdate) {
      return;
    }

    const payload: SavedPayload = {
      unit,
      heightCm,
      bust,
      waist,
      hip,
      bodyShape:
        bodyShape || "",
      lastUpdated:
        Date.now(),
    };

    safeLocalStorageSet(
      storageKey,
      JSON.stringify(
        payload
      )
    );

    setSavedSnapshot(
      payload
    );

    setIsDirty(false);

    setLastAction(
      "saved"
    );
  }

  function goResults() {
    if (!canSubmit) {
      return;
    }

    const params =
      new URLSearchParams();

    if (occasion) {
      params.set(
        "occasion",
        occasion
      );
    }

    if (weddingStyle) {
      params.set(
        "weddingStyle",
        weddingStyle
      );
    }

    if (depth) {
      params.set(
        "depth",
        depth
      );
    }

    if (undertone) {
      params.set(
        "undertone",
        undertone
      );
    }

    const h =
      toNum(heightCm);

    const b =
      toNum(bust);

    const w =
      toNum(waist);

    const hp =
      toNum(hip);

    const bustCm =
      unit === "cm"
        ? b
        : Math.round(
            inToCm(b) *
              10
          ) / 10;

    const waistCm =
      unit === "cm"
        ? w
        : Math.round(
            inToCm(w) *
              10
          ) / 10;

    const hipCm =
      unit === "cm"
        ? hp
        : Math.round(
            inToCm(hp) *
              10
          ) / 10;

    params.set(
      "height",
      String(h)
    );

    params.set(
      "bust",
      String(bustCm)
    );

    params.set(
      "waist",
      String(waistCm)
    );

    params.set(
      "hip",
      String(hipCm)
    );

    /*
      القيمة الداخلية تبقى عربية
    */
    params.set(
      "bodyShape",
      bodyShape
    );

    params.set(
      "unit",
      unit
    );

    router.push(
      `/results?${params.toString()}`
    );
  }

  /* =========================
     Labels
  ========================= */

  const circumPlaceholder =
    unit === "cm"
      ? isArabic
        ? "سنتيمتر"
        : "Centimeters"
      : isArabic
      ? "إنش"
      : "Inches";

  const heightPlaceholder =
    isArabic
      ? "سنتيمتر"
      : "Centimeters";

  const showActionButton =
    isLoggedIn;

  const actionLabel =
    useMemo(() => {
      if (
        lastAction ===
        "saved"
      ) {
        if (hasSaved) {
          return isArabic
            ? "تم تحديث المقاسات"
            : "Measurements updated";
        }

        return isArabic
          ? "تم حفظ المقاسات"
          : "Measurements saved";
      }

      if (
        lastAction ===
        "applied"
      ) {
        return isArabic
          ? "تم استخدام المقاسات المحفوظة"
          : "Saved measurements applied";
      }

      if (isDirty) {
        return hasSaved
          ? isArabic
            ? "تحديث المقاسات"
            : "Update measurements"
          : isArabic
          ? "حفظ المقاسات"
          : "Save measurements";
      }

      return hasSaved
        ? isArabic
          ? "استخدام المقاسات المحفوظة"
          : "Use saved measurements"
        : isArabic
        ? "حفظ المقاسات"
        : "Save measurements";
    }, [
      lastAction,
      isDirty,
      hasSaved,
      isArabic,
    ]);

  const actionDisabled =
    useMemo(() => {
      if (lastAction) {
        return true;
      }

      if (isDirty) {
        return !canUpdate;
      }

      if (hasSaved) {
        return false;
      }

      return true;
    }, [
      lastAction,
      isDirty,
      canUpdate,
      hasSaved,
    ]);

  function onActionClick() {
    if (!isLoggedIn) {
      return;
    }

    if (lastAction) {
      return;
    }

    if (isDirty) {
      saveOrUpdateMeasurements();
      return;
    }

    if (hasSaved) {
      applySavedFromSnapshot();
    }
  }

  /* =========================
     Render
  ========================= */

  return (
    <main
      dir={direction}
      className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black p-6"
    >
      <ThreeDotsButton
        onClick={() =>
          setMenuOpen(true)
        }
        ariaLabel={
          isArabic
            ? "القائمة"
            : "Menu"
        }
      />

      <FazaaDrawer
        open={menuOpen}
        onClose={() =>
          setMenuOpen(false)
        }
      />

      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <header className="mb-6 text-center">
          <p className="text-sm text-neutral-400">
            {isArabic
              ? "الخطوة الأخيرة"
              : "Final Step"}
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white">
            {isArabic
              ? "خلّينا نضبط المقاس المثالي لك"
              : "Let's Find Your Best Fit"}
          </h1>

          <p className="mt-3 text-sm text-neutral-400">
            {isArabic
              ? "نطلع لك اقتراحات فخمة + مقاس محسوب عليك."
              : "We'll recommend pieces for you with a size suggestion based on your measurements."}
          </p>
        </header>

        {/* Main card */}
        <div className="relative overflow-hidden rounded-3xl border border-[#d6b56a]/35 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(214,181,106,0.12),0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur">
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-[#d6b56a]/22" />

          <div className="pointer-events-none absolute -top-24 left-1/2 h-40 w-[520px] -translate-x-1/2 rounded-full bg-[#d6b56a]/10 blur-3xl" />

          {/* Unit */}
          <div className="mb-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div />

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-neutral-300">
                  {isArabic
                    ? "وحدة المحيطات:"
                    : "Measurement unit:"}
                </span>

                <UnitToggle
                  value={unit}
                  onChange={
                    onChangeUnit
                  }
                  isArabic={
                    isArabic
                  }
                />
              </div>
            </div>
          </div>

          {/* Measurements */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SelectField
              label={
                isArabic
                  ? "الطول"
                  : "Height"
              }
              iconType="height"
              value={
                heightCm
              }
              onChange={(v) => {
                markDirty();

                setHeightCm(
                  v
                );
              }}
              placeholder={
                heightPlaceholder
              }
              options={
                HEIGHT_OPTIONS
              }
              isArabic={
                isArabic
              }
            />

            <SelectField
              label={
                isArabic
                  ? "محيط الصدر"
                  : "Bust"
              }
              iconType="bust"
              value={bust}
              onChange={(v) => {
                markDirty();

                setBust(v);
              }}
              placeholder={
                circumPlaceholder
              }
              options={
                bustOptions
              }
              isArabic={
                isArabic
              }
            />

            <SelectField
              label={
                isArabic
                  ? "محيط الخصر"
                  : "Waist"
              }
              iconType="waist"
              value={waist}
              onChange={(v) => {
                markDirty();

                setWaist(v);
              }}
              placeholder={
                circumPlaceholder
              }
              options={
                waistOptions
              }
              isArabic={
                isArabic
              }
            />

            <SelectField
              label={
                isArabic
                  ? "محيط الأرداف"
                  : "Hips"
              }
              iconType="hip"
              value={hip}
              onChange={(v) => {
                markDirty();

                setHip(v);
              }}
              placeholder={
                circumPlaceholder
              }
              options={
                hipOptions
              }
              isArabic={
                isArabic
              }
            />
          </div>

          {/* Saved measurement action */}
          {showActionButton ? (
            <div className="mt-4 flex items-center justify-start">
              <button
                type="button"
                onClick={
                  onActionClick
                }
                disabled={
                  actionDisabled
                }
                className={[
                  "inline-flex max-w-full items-center",
                  "rounded-xl border px-3 py-2",
                  "text-xs font-extrabold transition",
                  "whitespace-nowrap",
                  "border-[#d6b56a]/45 bg-black/20 text-white hover:border-[#d6b56a]/70",
                  "disabled:opacity-60 disabled:hover:border-[#d6b56a]/45",
                  lastAction
                    ? "bg-[#d6b56a]/10 border-[#d6b56a]/60"
                    : "",
                ].join(" ")}
              >
                {actionLabel}
              </button>
            </div>
          ) : null}

          {/* Body shape */}
          <div className="mt-6">
            <p className="text-sm font-semibold text-white">
              {isArabic
                ? "شكل الجسم"
                : "Body Shape"}
            </p>

            <p className="mt-2 text-xs text-neutral-400">
              {isArabic
                ? "نستخدمه فقط لترتيب النتائج بدقة"
                : "We use this only to improve the order of your recommendations"}
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {BODY_SHAPES.map(
                (shape) => (
                  <Chip
                    key={
                      shape.value
                    }
                    value={
                      shape.value
                    }
                    label={
                      isArabic
                        ? shape.labelAr
                        : shape.labelEn
                    }
                    active={
                      bodyShape ===
                      shape.value
                    }
                    onClick={() => {
                      markDirty();

                      setBodyShape(
                        shape.value
                      );
                    }}
                    isArabic={
                      isArabic
                    }
                  />
                )
              )}
            </div>
          </div>

          {/* Results */}
          <button
            onClick={
              goResults
            }
            disabled={
              !canSubmit
            }
            className="mt-6 w-full rounded-2xl border border-[#d6b56a]/45 bg-gradient-to-r from-[#d6b56a]/25 via-white/5 to-[#d6b56a]/15 py-3 text-sm font-extrabold text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition hover:border-[#d6b56a]/70 disabled:opacity-40 disabled:hover:border-[#d6b56a]/45"
            type="button"
          >
            {isArabic
              ? "عرض النتائج"
              : "View Results"}
          </button>

          <p className="mt-3 text-center text-xs text-neutral-400">
            {isArabic
              ? "* الطول بالسنتيمتر دائمًا — ووحدة المحيطات حسب اختيارك."
              : "* Height is always measured in centimeters — circumference units follow your selection."}
          </p>
        </div>

        <SiteFooter />
      </div>

      <BackFab
        onClick={() =>
          router.back()
        }
        isArabic={
          isArabic
        }
      />
    </main>
  );
}

/* =========================
   Select field
========================= */

function SelectField({
  label,
  iconType,
  value,
  onChange,
  placeholder,
  options,
  isArabic,
}: {
  label: string;
  iconType:
    | "height"
    | "bust"
    | "waist"
    | "hip";
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  options: number[];
  isArabic: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-white inline-flex items-center gap-2">
        <span>
          {label}
        </span>

        <span className="pointer-events-none">
          <MeasureIconImg
            type={
              iconType
            }
            isArabic={
              isArabic
            }
          />
        </span>
      </span>

      <div className="relative mt-2">
        <select
          dir={
            isArabic
              ? "rtl"
              : "ltr"
          }
          value={value}
          onChange={(e) =>
            onChange(
              e.target.value
            )
          }
          style={{
            colorScheme:
              "dark",
          }}
          className={[
            "w-full appearance-none rounded-2xl border py-3 text-sm font-semibold transition overflow-hidden shrink-0",
            "border-white/10 bg-neutral-950 text-white",
            "focus:border-[#d6b56a]/40 focus:ring-2 focus:ring-[#d6b56a]/10",
            isArabic
              ? "px-4 text-right"
              : "pl-4 pr-10 text-left",
          ].join(" ")}
        >
          <option
            value=""
            disabled
            className="bg-neutral-950 text-neutral-400"
          >
            {placeholder ||
              (isArabic
                ? "اختاري"
                : "Select")}
          </option>

          {options.map(
            (n) => (
              <option
                key={n}
                value={String(
                  n
                )}
                className="bg-neutral-950 text-white"
              >
                {n}
              </option>
            )
          )}
        </select>

        <div
          className={[
            "pointer-events-none absolute inset-y-0 flex items-center",
            isArabic
              ? "left-3"
              : "right-3",
          ].join(" ")}
        >
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

/* =========================
   Body shape chip
========================= */

function Chip({
  value,
  label,
  active,
  onClick,
  isArabic,
}: {
  value: BodyShapeArabic;
  label: string;
  active: boolean;
  onClick: () => void;
  isArabic: boolean;
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
        active
          ? "ring-2 ring-[#d6b56a]/40 border-[#d6b56a]/35 bg-[#d6b56a]/10"
          : "",
      ].join(" ")}
    >
      <span
        className={[
          "whitespace-nowrap",
          isArabic
            ? "mr-18"
            : "ml-18",
        ].join(" ")}
      >
        {label}
      </span>

      <span className="shrink-0">
        <ShapeIcon
          type={value}
          isArabic={
            isArabic
          }
        />
      </span>
    </button>
  );
}