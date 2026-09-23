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

type SavedPayload = {
  unit?: Unit;
  heightCm?: string;
  bust?: string;
  waist?: string;
  hip?: string;
  bodyShape?: BodyShapeArabic | "";
  lastUpdated?: number;
};

const STORAGE_KEY =
  "fazaa_measurements_v1";

/* =========================
   Helpers
========================= */

function toNum(value: string) {
  const n = Number(
    String(value || "").trim()
  );

  return Number.isFinite(n)
    ? n
    : NaN;
}

function inToCm(value: number) {
  return value * 2.54;
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
  value: string
) {
  try {
    if (
      typeof window === "undefined"
    ) {
      return;
    }

    window.localStorage.setItem(
      key,
      value
    );
  } catch {
    // ignore
  }
}

function hasAnySavedValue(
  payload: SavedPayload | null
) {
  if (!payload) {
    return false;
  }

  return !!(
    payload.heightCm ||
    payload.bust ||
    payload.waist ||
    payload.hip ||
    payload.bodyShape
  );
}

function range(
  min: number,
  max: number,
  step = 1
) {
  const values: number[] = [];

  for (
    let x = min;
    x <= max + 1e-9;
    x += step
  ) {
    values.push(
      Math.round(x * 2) / 2
    );
  }

  return values;
}

/* =========================
   Options
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

const BODY_SHAPES: {
  value: BodyShapeArabic;
  ar: string;
  en: string;
}[] = [
  {
    value: "ساعة رملية",
    ar: "ساعة رملية",
    en: "Hourglass",
  },
  {
    value: "كمثري",
    ar: "كمثري",
    en: "Pear",
  },
  {
    value: "مستقيم",
    ar: "مستقيم",
    en: "Straight",
  },
  {
    value: "تفاحة",
    ar: "تفاحة",
    en: "Apple",
  },
];

/* =========================
   Icons
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
  const map = {
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
      draggable={false}
      className={[
        "h-30 w-30 object-contain select-none pointer-events-none",
        isArabic
          ? "ml-6"
          : "mr-6",
      ].join(" ")}
    />
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
   Unit toggle
========================= */

function UnitToggle({
  value,
  onChange,
  isArabic,
}: {
  value: Unit;
  onChange: (unit: Unit) => void;
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
   Select
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

  onChange: (
    value: string
  ) => void;

  placeholder: string;

  options: number[];

  isArabic: boolean;
}) {
  return (
    <label className="block">
      <span className="inline-flex items-center gap-2 text-sm font-semibold text-white">
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
            "w-full appearance-none rounded-2xl border py-3 text-sm font-semibold transition",
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
            {placeholder}
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
   Body shape
========================= */

function ShapeChip({
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
      type="button"
      onClick={onClick}
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

/* =========================
   Main
========================= */

export default function MeasurementsClient({
  initialParams,
}: {
  initialParams: InitialParams;
}) {
  const router =
    useRouter();

  const sp =
    useSearchParams();

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
    sp.get(
      "weddingStyle"
    ) ||
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
  ] =
    useState<string | null>(
      null
    );

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } =
        await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      const user =
        data.session?.user ??
        null;

      setIsLoggedIn(
        !!user
      );

      setUserId(
        user?.id ??
          null
      );
    })();

    const { data: listener } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {
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
     User-scoped storage
  ========================= */

  const storageKey =
    useMemo(() => {
      return userId
        ? `${STORAGE_KEY}:${userId}`
        : STORAGE_KEY;
    }, [userId]);

  /* =========================
     Draft
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
  ] =
    useState<
      BodyShapeArabic | ""
    >("");

  /* =========================
     Saved state
  ========================= */

  const [
    savedSnapshot,
    setSavedSnapshot,
  ] =
    useState<SavedPayload | null>(
      null
    );

  /*
    مهم:
    ما نعبّي الحقول تلقائيًا.
    فقط نعرف إن فيه بيانات محفوظة.
  */
  const [
    isDirty,
    setIsDirty,
  ] = useState(false);

  const [
    lastAction,
    setLastAction,
  ] = useState<
    | "saved"
    | "applied"
    | null
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
        migrate legacy key
        إلى user-scoped key
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

  /*
    ما نعتبر فيه محفوظ
    إلا لو المستخدم عنده حساب
  */
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
     Dropdown options
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

  /*
    الحفظ / التحديث:
    يحتاج القياسات فقط.
    شكل الجسم ليس شرط للحفظ.
  */
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

  /*
    عرض النتائج يحتاج
    القياسات + شكل الجسم
  */
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

  /*
    الحفظ والتحديث
    للحسابات فقط
  */
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
     Dirty
  ========================= */

  function markDirty() {
    /*
      أول ما المستخدم يغير
      أي قيمة:
      نفس الزر يتحول من
      "استخدام المحفوظ"
      إلى "تحديث المقاسات"
      إذا عنده محفوظ.
    */
    setIsDirty(true);

    /*
      أي تعديل يلغي
      "تم الحفظ"
      أو
      "تم استخدام..."
    */
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

    /*
      نفس السلوك القديم
    */
    setBust("");
    setWaist("");
    setHip("");
    setBodyShape("");
  }

  /* =========================
     Use saved
  ========================= */

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

  /* =========================
     Save / update
  ========================= */

  function saveOrUpdateMeasurements() {
    if (!canUpdate) {
      return;
    }

    const payload: SavedPayload =
      {
        unit,
        heightCm,
        bust,
        waist,
        hip,

        /*
          اختياري بالحفظ
        */
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

  /* =========================
     Results
  ========================= */

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
            inToCm(b) * 10
          ) / 10;

    const waistCm =
      unit === "cm"
        ? w
        : Math.round(
            inToCm(w) * 10
          ) / 10;

    const hipCm =
      unit === "cm"
        ? hp
        : Math.round(
            inToCm(hp) * 10
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
      نخلي القيمة الداخلية
      عربية مثل قبل
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
     Text
  ========================= */

  const heightPlaceholder =
    isArabic
      ? "سنتيمتر"
      : "Centimeters";

  const circumferencePlaceholder =
    unit === "cm"
      ? isArabic
        ? "سنتيمتر"
        : "Centimeters"
      : isArabic
      ? "إنش"
      : "Inches";

  /*
    الخاصية تظهر فقط
    للمستخدم المسجل.
  */
  const showActionButton =
    isLoggedIn;

  /*
    مهم جدًا:
    هذا نفس منطق الزر القديم.
    زر واحد فقط.
  */
  const actionLabel =
    useMemo(() => {
      /*
        بعد الحفظ / التحديث
      */
      if (
        lastAction ===
        "saved"
      ) {
        return hasSaved
          ? isArabic
            ? "تم تحديث المقاسات"
            : "Measurements updated"
          : isArabic
          ? "تم حفظ المقاسات"
          : "Measurements saved";
      }

      /*
        بعد الضغط على
        استخدام المحفوظ
      */
      if (
        lastAction ===
        "applied"
      ) {
        return isArabic
          ? "تم استخدام المقاسات المحفوظة"
          : "Saved measurements applied";
      }

      /*
        المستخدم بدأ يعدل:
        عنده محفوظ = تحديث
        ما عنده محفوظ = حفظ
      */
      if (isDirty) {
        return hasSaved
          ? isArabic
            ? "تحديث المقاسات"
            : "Update measurements"
          : isArabic
          ? "حفظ المقاسات"
          : "Save measurements";
      }

      /*
        المستخدم ما عدّل:
        عنده محفوظ = استخدام
        ما عنده محفوظ = حفظ
      */
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

  /*
    نفس منطق التعطيل القديم.
  */
  const actionDisabled =
    useMemo(() => {
      /*
        بعد "تم..."
        نخليه ثابت لين
        المستخدم يعدل شيء.
      */
      if (lastAction) {
        return true;
      }

      /*
        إذا بدأ يعدل:
        ما يتفعل إلا بعد
        إكمال القياسات.
      */
      if (isDirty) {
        return !canUpdate;
      }

      /*
        ما عدل شيء:
        إذا عنده محفوظ
        يقدر يستخدمه.
      */
      if (hasSaved) {
        return false;
      }

      /*
        ما عنده محفوظ
        وما دخل قياسات بعد.
      */
      return true;
    }, [
      lastAction,
      isDirty,
      canUpdate,
      hasSaved,
    ]);

  /*
    زر واحد فقط.
  */
  function onActionClick() {
    if (!isLoggedIn) {
      return;
    }

    if (lastAction) {
      return;
    }

    /*
      بدأ يعدل:
      حفظ أو تحديث
    */
    if (isDirty) {
      saveOrUpdateMeasurements();

      return;
    }

    /*
      ما عدل وعنده محفوظ:
      استخدام المحفوظ
    */
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
              onChange={(value) => {
                markDirty();

                setHeightCm(
                  value
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
              onChange={(value) => {
                markDirty();

                setBust(
                  value
                );
              }}
              placeholder={
                circumferencePlaceholder
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
              onChange={(value) => {
                markDirty();

                setWaist(
                  value
                );
              }}
              placeholder={
                circumferencePlaceholder
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
              onChange={(value) => {
                markDirty();

                setHip(
                  value
                );
              }}
              placeholder={
                circumferencePlaceholder
              }
              options={
                hipOptions
              }
              isArabic={
                isArabic
              }
            />
          </div>

          {/* =========================
              ONE SAVED-MEASUREMENTS BUTTON
              الحسابات فقط
          ========================== */}

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
                  "inline-flex max-w-full items-center justify-center",
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
                  <ShapeChip
                    key={
                      shape.value
                    }
                    value={
                      shape.value
                    }
                    label={
                      isArabic
                        ? shape.ar
                        : shape.en
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
            type="button"
            onClick={
              goResults
            }
            disabled={
              !canSubmit
            }
            className="mt-6 w-full rounded-2xl border border-[#d6b56a]/45 bg-gradient-to-r from-[#d6b56a]/25 via-white/5 to-[#d6b56a]/15 py-3 text-sm font-extrabold text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition hover:border-[#d6b56a]/70 disabled:opacity-40 disabled:hover:border-[#d6b56a]/45"
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