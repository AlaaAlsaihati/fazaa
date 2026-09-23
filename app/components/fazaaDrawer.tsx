"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import {
  useLanguage,
  type AppLanguage,
} from "@/app/components/LanguageProvider";

type Unit = "cm" | "in";
type DrawerView = "main" | "settings";
type SettingsBusy =
  | "name"
  | "email"
  | "password"
  | "delete"
  | null;

type UiMessage = {
  type: "ok" | "err";
  text: string;
};

const STORAGE_KEY_BASE = "fazaa_measurements_v1";
const STALE_DAYS = 60;
const DAY_MS = 24 * 60 * 60 * 1000;

type SavedPayload = {
  unit?: Unit;
  heightCm?: string;
  bust?: string;
  waist?: string;
  hip?: string;
  lastUpdated?: number;
};

type HistoryItem = {
  id: string;
  title: string;
  subtitle: string;
  query: string;
  created_at?: string;
};

/* =========================
   Local storage
========================= */

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

function safeLocalStorageRemove(key: string) {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

/* =========================
   Helpers
========================= */

function range(min: number, max: number, step = 1) {
  const out: number[] = [];

  for (let x = min; x <= max + 1e-9; x += step) {
    out.push(x);
  }

  return out;
}

function toNum(v: string) {
  const n = Number(String(v || "").trim());
  return Number.isFinite(n) ? n : NaN;
}

function inToCm(vIn: number) {
  return vIn * 2.54;
}

function cmToIn(vCm: number) {
  return vCm / 2.54;
}

function hasAnySavedValue(p: SavedPayload | null) {
  if (!p) return false;

  return !!(
    p.heightCm ||
    p.bust ||
    p.waist ||
    p.hip
  );
}

function getErrorMessage(
  error: unknown,
  fallback: string
) {
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof (error as { message?: unknown }).message ===
      "string"
  ) {
    const message = (
      error as { message: string }
    ).message.trim();

    if (message) return message;
  }

  return fallback;
}

/* =========================
   Measurement options
========================= */

const HEIGHT_OPTIONS = range(140, 210, 1);

const BUST_CM_OPTIONS = range(60, 160, 1);
const WAIST_CM_OPTIONS = range(45, 160, 1);
const HIP_CM_OPTIONS = range(60, 180, 1);

const BUST_IN_OPTIONS = range(24, 63, 0.5);
const WAIST_IN_OPTIONS = range(18, 63, 0.5);
const HIP_IN_OPTIONS = range(24, 71, 0.5);

/* =========================
   Query helpers
========================= */

function normalizeResultsQuery(raw: string) {
  try {
    const s = String(raw || "").trim();

    if (!s) return "";

    if (
      s.startsWith("http://") ||
      s.startsWith("https://")
    ) {
      const u = new URL(s);
      return u.search ? u.search : "";
    }

    if (s.includes("?")) {
      const idx = s.indexOf("?");
      const after = s.slice(idx);

      return after.startsWith("?")
        ? after
        : `?${after}`;
    }

    return s.startsWith("?") ? s : `?${s}`;
  } catch {
    const s = String(raw || "").trim();

    if (!s) return "";

    if (s.includes("?")) {
      return s.slice(s.indexOf("?"));
    }

    return s.startsWith("?") ? s : `?${s}`;
  }
}

function subtitleFromQuery(
  query: string,
  isArabic: boolean
) {
  try {
    const q = query.startsWith("?")
      ? query.slice(1)
      : query;

    const p = new URLSearchParams(q);

    const bust = p.get("bust");
    const waist = p.get("waist");
    const hip = p.get("hip");
    const unit = p.get("unit");

    const unitText =
      unit === "in"
        ? isArabic
          ? "إنش"
          : "in"
        : isArabic
        ? "سم"
        : "cm";

    const parts: string[] = [];

    if (bust) {
      parts.push(
        isArabic
          ? `صدر ${bust} ${unitText}`
          : `Bust ${bust} ${unitText}`
      );
    }

    if (waist) {
      parts.push(
        isArabic
          ? `خصر ${waist} ${unitText}`
          : `Waist ${waist} ${unitText}`
      );
    }

    if (hip) {
      parts.push(
        isArabic
          ? `أرداف ${hip} ${unitText}`
          : `Hips ${hip} ${unitText}`
      );
    }

    return parts.length
      ? parts.join(" • ")
      : "";
  } catch {
    return "";
  }
}

function translateHistoryTitle(
  title: string,
  isArabic: boolean
) {
  if (isArabic) return title;

  const map: Record<string, string> = {
    زواج: "Wedding",
    "ملّكة / خطوبة": "Engagement",
    خطوبة: "Engagement",
    عمل: "Work",
    عباية: "Abaya",
    عبايات: "Abayas",
    رمضان: "Ramadan",
    "غبقة / رمضان": "Ramadan",
    بحر: "Beach",
    شاليهات: "Chalets",
    مناسبة: "Occasion",
    نتائج: "Results",
  };

  return map[title] || title;
}

/* =========================
   UI
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
        onClick={() => onChange("cm")}
        className={[
          "px-3 py-1.5 rounded-xl text-xs font-extrabold transition",
          value === "cm"
            ? "bg-[#d6b56a]/15 text-white border border-[#d6b56a]/35"
            : "text-neutral-300 hover:text-white",
        ].join(" ")}
      >
        {isArabic ? "سم" : "cm"}
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
        {isArabic ? "إنش" : "in"}
      </button>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  placeholder,
  options,
  isArabic,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  options: number[];
  isArabic: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-neutral-200">
        {label}
      </span>

      <div className="relative mt-2">
        <select
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          style={{ colorScheme: "dark" }}
          className={[
            "w-full appearance-none rounded-2xl border px-4 py-2.5 text-sm font-semibold transition",
            "border-white/10 bg-neutral-950 text-white",
            "focus:border-[#d6b56a]/40 focus:ring-2 focus:ring-[#d6b56a]/10",
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

          {options.map((n) => (
            <option
              key={n}
              value={String(n)}
              className="bg-neutral-950 text-white"
            >
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

function SectionDetails({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <details
      {...(defaultOpen
        ? { open: true }
        : {})}
      className="group rounded-3xl border border-white/10 bg-white/5"
    >
      <summary
        className={[
          "cursor-pointer list-none select-none",
          "px-4 py-3 flex items-center justify-between",
          "text-sm font-extrabold text-white",
        ].join(" ")}
      >
        <span>{title}</span>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-[#d6b56a] transition group-open:rotate-180"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.6}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </summary>

      <div className="px-4 pb-4 pt-1">
        {children}
      </div>
    </details>
  );
}

function GearIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="h-[18px] w-[18px]"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.6 3.2h4.8l.6 2.2c.5.2 1 .5 1.5.8l2.1-.7 2.4 4.1-1.6 1.5c0 .3.1.6.1.9s0 .6-.1.9l1.6 1.5-2.4 4.1-2.1-.7c-.5.3-1 .6-1.5.8l-.6 2.2H9.6L9 18.6c-.5-.2-1-.5-1.5-.8l-2.1.7L3 14.4l1.6-1.5c0-.3-.1-.6-.1-.9s0-.6.1-.9L3 9.6l2.4-4.1 2.1.7c.5-.3 1-.6 1.5-.8l.6-2.2Z"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function BackIcon({
  isArabic,
}: {
  isArabic: boolean;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d={
          isArabic
            ? "M15 6l-6 6 6 6"
            : "M9 6l6 6-6 6"
        }
      />
    </svg>
  );
}

/* =========================
   Drawer
========================= */

export default function FazaaDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();

  const {
    language,
    setLanguage,
    isArabic,
    direction,
  } = useLanguage();

  const [drawerView, setDrawerView] =
    useState<DrawerView>("main");

  const [tab, setTab] =
    useState<"login" | "register">(
      "login"
    );

  /* =========================
     Auth
  ========================= */

  const [sessionUser, setSessionUser] =
    useState<{
      id: string;
      email: string | null;
      name: string | null;
    } | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [showForgot, setShowForgot] =
    useState(false);

  const [forgotEmail, setForgotEmail] =
    useState("");

  const [authMsg, setAuthMsg] =
    useState<UiMessage | null>(null);

  /* =========================
     Settings
  ========================= */

  const [
    settingsName,
    setSettingsName,
  ] = useState("");

  const [
    settingsEmail,
    setSettingsEmail,
  ] = useState("");

  const [
    settingsPassword,
    setSettingsPassword,
  ] = useState("");

  const [
    settingsPasswordConfirm,
    setSettingsPasswordConfirm,
  ] = useState("");

  const [
    settingsMsg,
    setSettingsMsg,
  ] = useState<UiMessage | null>(null);

  const [
    settingsBusy,
    setSettingsBusy,
  ] = useState<SettingsBusy>(null);

  const [
    deleteConfirm,
    setDeleteConfirm,
  ] = useState(false);

  /* =========================
     Measurements
  ========================= */

  const [unit, setUnit] =
    useState<Unit>("cm");

  const [heightCm, setHeightCm] =
    useState("");

  const [bust, setBust] =
    useState("");

  const [waist, setWaist] =
    useState("");

  const [hip, setHip] =
    useState("");

  const [
    savedSnapshot,
    setSavedSnapshot,
  ] = useState<SavedPayload | null>(null);

  const [
    savedLastUpdated,
    setSavedLastUpdated,
  ] = useState<number | null>(null);

  const [
    saveStatus,
    setSaveStatus,
  ] = useState<
    | "idle"
    | "saved_done"
    | "updated_done"
  >("idle");

  /* =========================
     History
  ========================= */

  const [history, setHistory] = useState<
    HistoryItem[]
  >([]);

  const [
    historyLoading,
    setHistoryLoading,
  ] = useState(false);

  const [
    historyErr,
    setHistoryErr,
  ] = useState<string | null>(null);

  const isLoggedIn = !!sessionUser;

  const storageKey = useMemo(() => {
    const uid = sessionUser?.id;

    return uid
      ? `${STORAGE_KEY_BASE}:${uid}`
      : STORAGE_KEY_BASE;
  }, [sessionUser?.id]);

  /* =========================
     Session
  ========================= */

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } =
        await supabase.auth.getSession();

      if (!mounted) return;

      const u = data.session?.user;

      setSessionUser(
        u
          ? {
              id: u.id,
              email: u.email ?? null,
              name:
                (u.user_metadata
                  ?.name as string) ??
                null,
            }
          : null
      );
    })();

    const { data: listener } =
      supabase.auth.onAuthStateChange(
        (_evt, session) => {
          const u = session?.user;

          setSessionUser(
            u
              ? {
                  id: u.id,
                  email:
                    u.email ?? null,
                  name:
                    (u.user_metadata
                      ?.name as string) ??
                    null,
                }
              : null
          );
        }
      );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!open) {
      setDrawerView("main");
      setDeleteConfirm(false);
      setSettingsMsg(null);
    }
  }, [open]);

  useEffect(() => {
    if (!sessionUser && drawerView === "settings") {
      setDrawerView("main");
    }
  }, [sessionUser, drawerView]);

  /* =========================
     Saved measurements
  ========================= */

  useEffect(() => {
    if (!open) return;

    const rawNew =
      safeLocalStorageGet(storageKey);

    const rawOld =
      storageKey !== STORAGE_KEY_BASE
        ? safeLocalStorageGet(
            STORAGE_KEY_BASE
          )
        : null;

    const raw = rawNew || rawOld;

    if (!raw) {
      setSavedSnapshot(null);
      setSavedLastUpdated(null);
      setSaveStatus("idle");

      setUnit("cm");
      setHeightCm("");
      setBust("");
      setWaist("");
      setHip("");

      return;
    }

    try {
      const saved = JSON.parse(
        raw
      ) as SavedPayload;

      setSavedSnapshot(saved);

      setSavedLastUpdated(
        typeof saved.lastUpdated ===
          "number"
          ? saved.lastUpdated
          : null
      );

      if (
        saved.unit === "cm" ||
        saved.unit === "in"
      ) {
        setUnit(saved.unit);
      }

      if (
        typeof saved.heightCm ===
        "string"
      ) {
        setHeightCm(saved.heightCm);
      }

      if (
        typeof saved.bust === "string"
      ) {
        setBust(saved.bust);
      }

      if (
        typeof saved.waist === "string"
      ) {
        setWaist(saved.waist);
      }

      if (
        typeof saved.hip === "string"
      ) {
        setHip(saved.hip);
      }

      setSaveStatus("idle");

      if (
        sessionUser?.id &&
        rawOld &&
        !rawNew
      ) {
        safeLocalStorageSet(
          storageKey,
          rawOld
        );
      }
    } catch {
      setSavedSnapshot(null);
      setSavedLastUpdated(null);
      setSaveStatus("idle");
    }
  }, [
    open,
    storageKey,
    sessionUser?.id,
  ]);

  const isStale = useMemo(() => {
    if (!savedLastUpdated) {
      return false;
    }

    return (
      Date.now() -
        savedLastUpdated >=
      STALE_DAYS * DAY_MS
    );
  }, [savedLastUpdated]);

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

  const canSave = useMemo(() => {
    if (!isLoggedIn) return false;

    const h = toNum(heightCm);

    if (
      !heightCm ||
      h < 140 ||
      h > 210
    ) {
      return false;
    }

    const b = toNum(bust);
    const w = toNum(waist);
    const hp = toNum(hip);

    const bCm =
      unit === "cm" ? b : inToCm(b);

    const wCm =
      unit === "cm" ? w : inToCm(w);

    const hipCm =
      unit === "cm"
        ? hp
        : inToCm(hp);

    if (
      !bust ||
      bCm < 60 ||
      bCm > 160
    ) {
      return false;
    }

    if (
      !waist ||
      wCm < 45 ||
      wCm > 160
    ) {
      return false;
    }

    if (
      !hip ||
      hipCm < 60 ||
      hipCm > 180
    ) {
      return false;
    }

    return true;
  }, [
    isLoggedIn,
    heightCm,
    bust,
    waist,
    hip,
    unit,
  ]);

  function markDirty() {
    setSaveStatus("idle");
  }

  function onChangeUnit(next: Unit) {
    if (next === unit) return;

    markDirty();
    setUnit(next);

    const b = toNum(bust);
    const w = toNum(waist);
    const hp = toNum(hip);

    if (Number.isFinite(b)) {
      const conv =
        next === "cm"
          ? Math.round(
              inToCm(b) * 10
            ) / 10
          : Math.round(
              cmToIn(b) * 10
            ) / 10;

      setBust(String(conv));
    }

    if (Number.isFinite(w)) {
      const conv =
        next === "cm"
          ? Math.round(
              inToCm(w) * 10
            ) / 10
          : Math.round(
              cmToIn(w) * 10
            ) / 10;

      setWaist(String(conv));
    }

    if (Number.isFinite(hp)) {
      const conv =
        next === "cm"
          ? Math.round(
              inToCm(hp) * 10
            ) / 10
          : Math.round(
              cmToIn(hp) * 10
            ) / 10;

      setHip(String(conv));
    }
  }

  function saveMeasurements() {
    if (!canSave) return;

    const hadSaved = !!(
      savedSnapshot &&
      hasAnySavedValue(savedSnapshot)
    );

    const payload: SavedPayload = {
      unit,
      heightCm,
      bust,
      waist,
      hip,
      lastUpdated: Date.now(),
    };

    safeLocalStorageSet(
      storageKey,
      JSON.stringify(payload)
    );

    setSavedSnapshot(payload);

    setSavedLastUpdated(
      payload.lastUpdated ?? null
    );

    setSaveStatus(
      hadSaved
        ? "updated_done"
        : "saved_done"
    );
  }

  /* =========================
     Auth actions
  ========================= */

  async function handleLogin() {
    setAuthMsg(null);

    try {
      const { error } =
        await supabase.auth.signInWithPassword(
          {
            email: email
              .trim()
              .toLowerCase(),
            password,
          }
        );

      if (error) throw error;

      setShowForgot(false);
      setPassword("");
      setAuthMsg(null);
    } catch (error: unknown) {
      setAuthMsg({
        type: "err",
        text: getErrorMessage(
          error,
          isArabic
            ? "تعذر تسجيل الدخول"
            : "Unable to sign in"
        ),
      });
    }
  }

  async function handleRegister() {
    setAuthMsg(null);

    try {
      const cleanEmail = email
        .trim()
        .toLowerCase();

      const cleanName = name.trim();

      const { error } =
        await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              name: cleanName,
            },
          },
        });

      if (error) throw error;

      setAuthMsg({
        type: "ok",
        text: isArabic
          ? "تم إرسال رابط التفعيل إلى بريدك الإلكتروني"
          : "A verification link has been sent to your email",
      });

      setPassword("");
    } catch (error: unknown) {
      setAuthMsg({
        type: "err",
        text: getErrorMessage(
          error,
          isArabic
            ? "تعذر إنشاء الحساب"
            : "Unable to create account"
        ),
      });
    }
  }

  async function handleLogout() {
    setAuthMsg(null);

    await supabase.auth.signOut();

    setDrawerView("main");

    onClose();
  }

  async function handleSendReset() {
    setAuthMsg(null);

    const e = forgotEmail
      .trim()
      .toLowerCase();

    if (!e) {
      setAuthMsg({
        type: "err",
        text: isArabic
          ? "اكتبي الإيميل أول"
          : "Enter your email first",
      });

      return;
    }

    try {
      const redirectTo =
        `${window.location.origin}/auth/reset`;

      const { error } =
        await supabase.auth.resetPasswordForEmail(
          e,
          {
            redirectTo,
          }
        );

      if (error) throw error;

      setAuthMsg({
        type: "ok",
        text: isArabic
          ? "تم إرسال رابط إعادة كلمة المرور على إيميلك"
          : "A password reset link has been sent to your email",
      });

      setShowForgot(false);
    } catch (error: unknown) {
      setAuthMsg({
        type: "err",
        text: getErrorMessage(
          error,
          isArabic
            ? "تعذر إرسال الرابط"
            : "Unable to send the link"
        ),
      });
    }
  }

  /* =========================
     Settings
  ========================= */

  function openSettings() {
    if (!sessionUser) return;

    setSettingsName(
      sessionUser.name || ""
    );

    setSettingsEmail(
      sessionUser.email || ""
    );

    setSettingsPassword("");
    setSettingsPasswordConfirm("");
    setSettingsMsg(null);
    setDeleteConfirm(false);

    setDrawerView("settings");
  }

  function closeSettings() {
    setSettingsMsg(null);
    setDeleteConfirm(false);
    setSettingsPassword("");
    setSettingsPasswordConfirm("");
    setDrawerView("main");
  }

  async function handleUpdateName() {
    const cleanName =
      settingsName.trim();

    setSettingsMsg(null);

    if (!cleanName) {
      setSettingsMsg({
        type: "err",
        text: isArabic
          ? "اكتبي الاسم أول"
          : "Enter your name first",
      });

      return;
    }

    try {
      setSettingsBusy("name");

      const { error } =
        await supabase.auth.updateUser({
          data: {
            name: cleanName,
          },
        });

      if (error) throw error;

      setSessionUser((current) =>
        current
          ? {
              ...current,
              name: cleanName,
            }
          : current
      );

      setSettingsMsg({
        type: "ok",
        text: isArabic
          ? "تم تحديث الاسم بنجاح"
          : "Name updated successfully",
      });
    } catch (error: unknown) {
      setSettingsMsg({
        type: "err",
        text: getErrorMessage(
          error,
          isArabic
            ? "تعذر تحديث الاسم"
            : "Unable to update your name"
        ),
      });
    } finally {
      setSettingsBusy(null);
    }
  }

  async function handleUpdateEmail() {
    const cleanEmail =
      settingsEmail
        .trim()
        .toLowerCase();

    setSettingsMsg(null);

    if (
      !cleanEmail ||
      !cleanEmail.includes("@")
    ) {
      setSettingsMsg({
        type: "err",
        text: isArabic
          ? "اكتبي بريد إلكتروني صحيح"
          : "Enter a valid email address",
      });

      return;
    }

    if (
      cleanEmail ===
      sessionUser?.email
        ?.trim()
        .toLowerCase()
    ) {
      setSettingsMsg({
        type: "err",
        text: isArabic
          ? "هذا هو بريدك الحالي"
          : "This is already your current email",
      });

      return;
    }

    try {
      setSettingsBusy("email");

      const { error } =
        await supabase.auth.updateUser({
          email: cleanEmail,
        });

      if (error) throw error;

      setSettingsMsg({
        type: "ok",
        text: isArabic
          ? "تم إرسال طلب تغيير البريد. لإكمال التغيير، أكدي الرسائل المرسلة إلى بريدك الحالي والبريد الجديد."
          : "Your email change request was sent. To complete the change, confirm the messages sent to your current and new email addresses.",
      });
    } catch (error: unknown) {
      setSettingsMsg({
        type: "err",
        text: getErrorMessage(
          error,
          isArabic
            ? "تعذر تحديث البريد الإلكتروني"
            : "Unable to update your email"
        ),
      });
    } finally {
      setSettingsBusy(null);
    }
  }

  async function handleUpdatePassword() {
    setSettingsMsg(null);

    if (
      settingsPassword.length < 6
    ) {
      setSettingsMsg({
        type: "err",
        text: isArabic
          ? "كلمة المرور لازم تكون 6 أحرف على الأقل"
          : "Password must be at least 6 characters",
      });

      return;
    }

    if (
      settingsPassword !==
      settingsPasswordConfirm
    ) {
      setSettingsMsg({
        type: "err",
        text: isArabic
          ? "كلمتا المرور غير متطابقتين"
          : "Passwords do not match",
      });

      return;
    }

    try {
      setSettingsBusy("password");

      const { error } =
        await supabase.auth.updateUser({
          password: settingsPassword,
        });

      if (error) throw error;

      setSettingsPassword("");
      setSettingsPasswordConfirm("");

      setSettingsMsg({
        type: "ok",
        text: isArabic
          ? "تم تحديث كلمة المرور بنجاح"
          : "Password updated successfully",
      });
    } catch (error: unknown) {
      setSettingsMsg({
        type: "err",
        text: getErrorMessage(
          error,
          isArabic
            ? "تعذر تحديث كلمة المرور"
            : "Unable to update your password"
        ),
      });
    } finally {
      setSettingsBusy(null);
    }
  }

  async function handleDeleteAccount() {
    if (!sessionUser) return;

    setSettingsMsg(null);

    const uid = sessionUser.id;

    try {
      setSettingsBusy("delete");

      const {
        data: sessionData,
        error: sessionError,
      } =
        await supabase.auth.getSession();

      if (
        sessionError ||
        !sessionData.session
      ) {
        throw new Error(
          isArabic
            ? "انتهت جلسة تسجيل الدخول. سجلي دخول من جديد وحاولي مرة ثانية."
            : "Your session has expired. Sign in again and try again."
        );
      }

      const token =
        sessionData.session
          .access_token;

      const {
        data,
        error,
      } =
        await supabase.functions.invoke(
          "delete-account",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      if (error) {
        throw error;
      }

      if (
        data &&
        typeof data === "object" &&
        "error" in data &&
        typeof (
          data as {
            error?: unknown;
          }
        ).error === "string"
      ) {
        throw new Error(
          (
            data as {
              error: string;
            }
          ).error
        );
      }

      safeLocalStorageRemove(
        `${STORAGE_KEY_BASE}:${uid}`
      );

      safeLocalStorageRemove(
        STORAGE_KEY_BASE
      );

      safeLocalStorageRemove(
        "fazaa_user"
      );

      safeLocalStorageRemove(
        "fazaa_token"
      );

      try {
        await supabase.auth.signOut();
      } catch {
        // الحساب حُذف بالفعل
      }

      setDeleteConfirm(false);
      setSettingsBusy(null);
      setDrawerView("main");

      onClose();

      router.replace("/");
    } catch (error: unknown) {
      setSettingsMsg({
        type: "err",
        text: getErrorMessage(
          error,
          isArabic
            ? "تعذر حذف الحساب. حاولي مرة ثانية."
            : "Unable to delete the account. Please try again."
        ),
      });

      setSettingsBusy(null);
    }
  }

  /* =========================
     History
  ========================= */

  useEffect(() => {
    if (!open) return;

    if (!sessionUser?.id) {
      setHistory([]);
      setHistoryErr(null);
      setHistoryLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      setHistoryLoading(true);
      setHistoryErr(null);

      try {
        const { data, error } =
          await supabase
            .from("fazaa_history")
            .select(
              "id,title,subtitle,query,created_at"
            )
            .eq(
              "user_id",
              sessionUser.id
            )
            .order(
              "created_at",
              {
                ascending: false,
              }
            )
            .limit(10);

        if (cancelled) return;

        if (error) throw error;

        setHistory(
          (data || []) as HistoryItem[]
        );
      } catch (error: unknown) {
        if (cancelled) return;

        setHistory([]);

        setHistoryErr(
          getErrorMessage(
            error,
            isArabic
              ? "تعذر تحميل النتائج السابقة"
              : "Unable to load previous results"
          )
        );
      } finally {
        if (!cancelled) {
          setHistoryLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    open,
    sessionUser?.id,
    isArabic,
  ]);

  /* =========================
     Display values
  ========================= */

  const overlayClass = open
    ? "opacity-100 pointer-events-auto"
    : "opacity-0 pointer-events-none";

  const hasSaved = !!(
    savedSnapshot &&
    hasAnySavedValue(savedSnapshot)
  );

  const saveButtonText = !hasSaved
    ? saveStatus === "saved_done"
      ? isArabic
        ? "تم حفظ المقاسات"
        : "Measurements saved"
      : isArabic
      ? "حفظ المقاسات"
      : "Save measurements"
    : saveStatus === "updated_done"
    ? isArabic
      ? "تم تحديث المقاسات"
      : "Measurements updated"
    : isArabic
    ? "تحديث المقاسات"
    : "Update measurements";

  const saveButtonClass = [
    "w-full rounded-2xl border py-2.5 text-xs font-extrabold transition",
    !canSave
      ? "border-white/10 bg-black/20 text-neutral-500"
      : saveStatus ===
          "updated_done" ||
        saveStatus === "saved_done"
      ? "border-[#d6b56a]/55 bg-[#d6b56a]/18 text-white"
      : "border-[#d6b56a]/45 bg-[#d6b56a]/15 text-white hover:border-[#d6b56a]/70",
  ].join(" ");

  const cmText = isArabic
    ? "سم"
    : "cm";

  const inText = isArabic
    ? "إنش"
    : "in";

  const centimeterText = isArabic
    ? "سنتيمتر"
    : "Centimeters";

  /* =========================
     Render
  ========================= */

  return (
    <>
      <div
        className={[
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition",
          overlayClass,
        ].join(" ")}
        onClick={onClose}
      />

      <aside
        className={[
          "fixed right-0 z-50 w-[360px] max-w-[92vw] flex flex-col",
          "bg-neutral-950/95 border-l border-white/10",
          "shadow-[0_30px_80px_rgba(0,0,0,0.65)]",
          "transition-transform duration-300",
          open
            ? "translate-x-0"
            : "translate-x-full",
        ].join(" ")}
        style={{
          top: "env(safe-area-inset-top)",
          height:
            "calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom))",
        }}
        dir={direction}
      >
        {/* =====================
            HEADER
        ====================== */}

        <div className="px-5 py-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="text-sm font-extrabold text-white">
              {drawerView === "settings"
                ? isArabic
                  ? "الإعدادات"
                  : "Settings"
                : isArabic
                ? "القائمة"
                : "Menu"}
            </div>

            {drawerView ===
            "settings" ? (
              <button
                type="button"
                onClick={closeSettings}
                className="h-10 w-10 rounded-2xl border border-[#d6b56a]/35 bg-black/30 text-[#d6b56a] hover:border-[#d6b56a]/60 transition flex items-center justify-center"
                aria-label={
                  isArabic
                    ? "رجوع"
                    : "Back"
                }
              >
                <BackIcon
                  isArabic={isArabic}
                />
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="h-10 w-10 rounded-2xl border border-[#d6b56a]/35 bg-black/30 text-[#d6b56a] hover:border-[#d6b56a]/60 transition"
                aria-label={
                  isArabic
                    ? "إغلاق"
                    : "Close"
                }
              >
                ✕
              </button>
            )}
          </div>

          {isLoggedIn &&
          drawerView === "main" ? (
            <div className="mt-3">
              <div className="text-sm font-extrabold text-white">
                {sessionUser?.name ||
                  (isArabic
                    ? "مستخدم"
                    : "User")}
              </div>

              {/* الترس أقصى اليسار */}
              <div
                dir="ltr"
                className="mt-1 flex items-center gap-3"
              >
                <button
                  type="button"
                  onClick={openSettings}
                  aria-label={
                    isArabic
                      ? "الإعدادات"
                      : "Settings"
                  }
                  title={
                    isArabic
                      ? "الإعدادات"
                      : "Settings"
                  }
                  className={[
                    "shrink-0",
                    "h-8 w-8 rounded-xl",
                    "flex items-center justify-center",
                    "border border-[#d6b56a]/30",
                    "bg-black/25 text-[#d6b56a]",
                    "hover:border-[#d6b56a]/60 hover:bg-[#d6b56a]/10",
                    "transition",
                  ].join(" ")}
                >
                  <GearIcon />
                </button>

                <div
                  dir="ltr"
                  className="min-w-0 flex-1 truncate text-right text-xs text-neutral-400"
                >
                  {sessionUser?.email}
                </div>
              </div>

              <div className="mt-3 h-px w-full bg-[#d6b56a]/35" />
            </div>
          ) : null}
        </div>

        {/* =====================
            SETTINGS VIEW
        ====================== */}

        {drawerView ===
        "settings" ? (
          <div className="p-5 space-y-4 overflow-y-auto flex-1 min-h-0">
            {settingsMsg ? (
              <div
                className={[
                  "rounded-2xl px-3 py-3 text-xs font-semibold border leading-5",
                  settingsMsg.type ===
                  "ok"
                    ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
                    : "border-rose-400/30 bg-rose-500/10 text-rose-100",
                ].join(" ")}
              >
                {settingsMsg.text}
              </div>
            ) : null}

            {/* اللغة */}
            <section className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-extrabold text-white">
                {isArabic
                  ? "اللغة"
                  : "Language"}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                {(
                  [
                    {
                      value: "ar",
                      label:
                        "العربية",
                    },
                    {
                      value: "en",
                      label:
                        "English",
                    },
                  ] as {
                    value: AppLanguage;
                    label: string;
                  }[]
                ).map(
                  ({
                    value,
                    label,
                  }) => {
                    const active =
                      language ===
                      value;

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setLanguage(
                            value
                          )
                        }
                        className={[
                          "rounded-2xl border px-3 py-2.5 text-xs font-extrabold transition",
                          active
                            ? "border-[#d6b56a]/60 bg-[#d6b56a]/15 text-white ring-1 ring-[#d6b56a]/20"
                            : "border-white/10 bg-black/20 text-neutral-300 hover:border-white/20",
                        ].join(
                          " "
                        )}
                      >
                        {label}
                      </button>
                    );
                  }
                )}
              </div>
            </section>

            {/* الاسم */}
            <section className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-extrabold text-white">
                {isArabic
                  ? "الاسم"
                  : "Name"}
              </div>

              <input
                type="text"
                value={settingsName}
                onChange={(e) =>
                  setSettingsName(
                    e.target.value
                  )
                }
                autoComplete="name"
                className="mt-3 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-white outline-none focus:border-[#d6b56a]/40 focus:ring-2 focus:ring-[#d6b56a]/10"
              />

              <button
                type="button"
                onClick={
                  handleUpdateName
                }
                disabled={
                  settingsBusy !==
                  null
                }
                className="mt-3 w-full rounded-2xl border border-[#d6b56a]/45 bg-[#d6b56a]/15 py-2.5 text-xs font-extrabold text-white hover:border-[#d6b56a]/70 transition disabled:opacity-50"
              >
                {settingsBusy ===
                "name"
                  ? isArabic
                    ? "جاري الحفظ..."
                    : "Saving..."
                  : isArabic
                  ? "حفظ الاسم"
                  : "Save name"}
              </button>
            </section>

            {/* الإيميل */}
            <section className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-extrabold text-white">
                {isArabic
                  ? "البريد الإلكتروني"
                  : "Email"}
              </div>

              <input
                type="email"
                dir="ltr"
                value={
                  settingsEmail
                }
                onChange={(e) =>
                  setSettingsEmail(
                    e.target.value
                  )
                }
                autoComplete="email"
                className="mt-3 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2.5 text-left text-sm text-white outline-none focus:border-[#d6b56a]/40 focus:ring-2 focus:ring-[#d6b56a]/10"
              />

              <p className="mt-2 text-[11px] leading-5 text-neutral-400">
                {isArabic
                  ? "عند تغيير البريد، سيطلب منك تأكيد البريد الحالي والبريد الجديد لإكمال التغيير."
                  : "When changing your email, confirmation will be required from both your current and new email addresses."}
              </p>

              <button
                type="button"
                onClick={
                  handleUpdateEmail
                }
                disabled={
                  settingsBusy !==
                  null
                }
                className="mt-3 w-full rounded-2xl border border-[#d6b56a]/45 bg-[#d6b56a]/15 py-2.5 text-xs font-extrabold text-white hover:border-[#d6b56a]/70 transition disabled:opacity-50"
              >
                {settingsBusy ===
                "email"
                  ? isArabic
                    ? "جاري الإرسال..."
                    : "Sending..."
                  : isArabic
                  ? "تغيير البريد"
                  : "Change email"}
              </button>
            </section>

            {/* كلمة المرور */}
            <section className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-extrabold text-white">
                {isArabic
                  ? "كلمة المرور"
                  : "Password"}
              </div>

              <label className="mt-3 block">
                <div className="text-xs font-semibold text-neutral-300">
                  {isArabic
                    ? "كلمة المرور الجديدة"
                    : "New password"}
                </div>

                <input
                  type="password"
                  value={
                    settingsPassword
                  }
                  onChange={(e) =>
                    setSettingsPassword(
                      e.target
                        .value
                    )
                  }
                  autoComplete="new-password"
                  placeholder="********"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-white outline-none focus:border-[#d6b56a]/40 focus:ring-2 focus:ring-[#d6b56a]/10"
                />
              </label>

              <label className="mt-3 block">
                <div className="text-xs font-semibold text-neutral-300">
                  {isArabic
                    ? "تأكيد كلمة المرور"
                    : "Confirm password"}
                </div>

                <input
                  type="password"
                  value={
                    settingsPasswordConfirm
                  }
                  onChange={(e) =>
                    setSettingsPasswordConfirm(
                      e.target
                        .value
                    )
                  }
                  autoComplete="new-password"
                  placeholder="********"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-white outline-none focus:border-[#d6b56a]/40 focus:ring-2 focus:ring-[#d6b56a]/10"
                />
              </label>

              <button
                type="button"
                onClick={
                  handleUpdatePassword
                }
                disabled={
                  settingsBusy !==
                  null
                }
                className="mt-3 w-full rounded-2xl border border-[#d6b56a]/45 bg-[#d6b56a]/15 py-2.5 text-xs font-extrabold text-white hover:border-[#d6b56a]/70 transition disabled:opacity-50"
              >
                {settingsBusy ===
                "password"
                  ? isArabic
                    ? "جاري التحديث..."
                    : "Updating..."
                  : isArabic
                  ? "تحديث كلمة المرور"
                  : "Update password"}
              </button>
            </section>

            {/* حذف الحساب */}
            <section className="rounded-3xl border border-rose-400/25 bg-rose-500/[0.06] p-4">
              <div className="text-sm font-extrabold text-rose-100">
                {isArabic
                  ? "حذف الحساب"
                  : "Delete account"}
              </div>

              <p className="mt-2 text-[11px] leading-5 text-neutral-400">
                {isArabic
                  ? "حذف الحساب نهائي. سيتم حذف بيانات حسابك والمقاسات وسجل النتائج المرتبط بالحساب."
                  : "Account deletion is permanent. Your account data, saved measurements, and result history linked to the account will be deleted."}
              </p>

              {!deleteConfirm ? (
                <button
                  type="button"
                  onClick={() => {
                    setSettingsMsg(
                      null
                    );

                    setDeleteConfirm(
                      true
                    );
                  }}
                  disabled={
                    settingsBusy !==
                    null
                  }
                  className="mt-3 w-full rounded-2xl border border-rose-400/35 bg-rose-500/10 py-2.5 text-xs font-extrabold text-rose-100 hover:bg-rose-500/15 transition disabled:opacity-50"
                >
                  {isArabic
                    ? "حذف الحساب"
                    : "Delete account"}
                </button>
              ) : (
                <div className="mt-3 rounded-2xl border border-rose-400/30 bg-black/25 p-3">
                  <div className="text-xs font-bold text-rose-100">
                    {isArabic
                      ? "هل أنتِ متأكدة؟ لا يمكن التراجع عن هذا الإجراء."
                      : "Are you sure? This action cannot be undone."}
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteConfirm(
                          false
                        )
                      }
                      disabled={
                        settingsBusy ===
                        "delete"
                      }
                      className="rounded-xl border border-white/10 bg-black/20 py-2.5 text-xs font-extrabold text-white hover:bg-black/30 transition disabled:opacity-50"
                    >
                      {isArabic
                        ? "إلغاء"
                        : "Cancel"}
                    </button>

                    <button
                      type="button"
                      onClick={
                        handleDeleteAccount
                      }
                      disabled={
                        settingsBusy ===
                        "delete"
                      }
                      className="rounded-xl border border-rose-400/40 bg-rose-500/15 py-2.5 text-xs font-extrabold text-rose-100 hover:bg-rose-500/25 transition disabled:opacity-50"
                    >
                      {settingsBusy ===
                      "delete"
                        ? isArabic
                          ? "جاري الحذف..."
                          : "Deleting..."
                        : isArabic
                        ? "حذف نهائي"
                        : "Delete permanently"}
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        ) : (
          /* =====================
              MAIN DRAWER
          ====================== */

          <div className="p-5 space-y-4 overflow-y-auto flex-1 min-h-0">
            {/* غير مسجلة دخول */}
            {!isLoggedIn ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-extrabold text-white">
                    {isArabic
                      ? "الحساب"
                      : "Account"}
                  </div>

                  <div className="inline-flex rounded-2xl border border-[#d6b56a]/25 bg-black/20 p-1">
                    <button
                      type="button"
                      onClick={() => {
                        setTab(
                          "login"
                        );

                        setShowForgot(
                          false
                        );

                        setAuthMsg(
                          null
                        );
                      }}
                      className={[
                        "px-3 py-1.5 rounded-xl text-xs font-extrabold transition",
                        tab ===
                        "login"
                          ? "bg-[#d6b56a]/15 text-white border border-[#d6b56a]/35"
                          : "text-neutral-300 hover:text-white",
                      ].join(
                        " "
                      )}
                    >
                      {isArabic
                        ? "تسجيل الدخول"
                        : "Sign in"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setTab(
                          "register"
                        );

                        setShowForgot(
                          false
                        );

                        setAuthMsg(
                          null
                        );
                      }}
                      className={[
                        "px-3 py-1.5 rounded-xl text-xs font-extrabold transition",
                        tab ===
                        "register"
                          ? "bg-[#d6b56a]/15 text-white border border-[#d6b56a]/35"
                          : "text-neutral-300 hover:text-white",
                      ].join(
                        " "
                      )}
                    >
                      {isArabic
                        ? "إنشاء حساب"
                        : "Create account"}
                    </button>
                  </div>
                </div>

                {authMsg ? (
                  <div
                    className={[
                      "mb-3 rounded-2xl px-3 py-2 text-xs font-semibold border",
                      authMsg.type ===
                      "ok"
                        ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
                        : "border-rose-400/30 bg-rose-500/10 text-rose-100",
                    ].join(
                      " "
                    )}
                  >
                    {authMsg.text}
                  </div>
                ) : null}

                {showForgot ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-neutral-200">
                        {isArabic
                          ? "الإيميل"
                          : "Email"}
                      </label>

                      <input
                        type="email"
                        dir="ltr"
                        value={
                          forgotEmail
                        }
                        onChange={(
                          e
                        ) =>
                          setForgotEmail(
                            e.target
                              .value
                          )
                        }
                        placeholder="example@email.com"
                        autoComplete="email"
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2.5 text-left text-sm text-white focus:border-[#d6b56a]/40 focus:ring-2 focus:ring-[#d6b56a]/10 outline-none"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={
                          handleSendReset
                        }
                        className="flex-1 rounded-2xl border border-[#d6b56a]/45 bg-[#d6b56a]/15 py-2.5 text-xs font-extrabold text-white hover:border-[#d6b56a]/70 transition"
                      >
                        {isArabic
                          ? "إرسال رابط"
                          : "Send link"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowForgot(
                            false
                          );

                          setAuthMsg(
                            null
                          );
                        }}
                        className="flex-1 rounded-2xl border border-white/10 bg-black/20 py-2.5 text-xs font-extrabold text-white hover:bg-black/30 transition"
                      >
                        {isArabic
                          ? "رجوع"
                          : "Back"}
                      </button>
                    </div>
                  </div>
                ) : tab ===
                  "register" ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-neutral-200">
                        {isArabic
                          ? "الاسم"
                          : "Name"}
                      </label>

                      <input
                        value={name}
                        onChange={(
                          e
                        ) =>
                          setName(
                            e.target
                              .value
                          )
                        }
                        autoComplete="name"
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-white focus:border-[#d6b56a]/40 focus:ring-2 focus:ring-[#d6b56a]/10 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-neutral-200">
                        {isArabic
                          ? "البريد الإلكتروني"
                          : "Email"}
                      </label>

                      <input
                        type="email"
                        dir="ltr"
                        value={email}
                        onChange={(
                          e
                        ) =>
                          setEmail(
                            e.target
                              .value
                          )
                        }
                        autoComplete="email"
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2.5 text-left text-sm text-white focus:border-[#d6b56a]/40 focus:ring-2 focus:ring-[#d6b56a]/10 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-neutral-200">
                        {isArabic
                          ? "كلمة المرور"
                          : "Password"}
                      </label>

                      <input
                        type="password"
                        value={
                          password
                        }
                        onChange={(
                          e
                        ) =>
                          setPassword(
                            e.target
                              .value
                          )
                        }
                        autoComplete="new-password"
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-white focus:border-[#d6b56a]/40 focus:ring-2 focus:ring-[#d6b56a]/10 outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={
                        handleRegister
                      }
                      className="w-full rounded-2xl border border-[#d6b56a]/45 bg-gradient-to-r from-[#d6b56a]/25 via-white/5 to-[#d6b56a]/15 py-2.5 text-xs font-extrabold text-white hover:border-[#d6b56a]/70 transition"
                    >
                      {isArabic
                        ? "إنشاء"
                        : "Create account"}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-neutral-200">
                        {isArabic
                          ? "البريد الإلكتروني"
                          : "Email"}
                      </label>

                      <input
                        type="email"
                        dir="ltr"
                        value={email}
                        onChange={(
                          e
                        ) =>
                          setEmail(
                            e.target
                              .value
                          )
                        }
                        autoComplete="email"
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2.5 text-left text-sm text-white focus:border-[#d6b56a]/40 focus:ring-2 focus:ring-[#d6b56a]/10 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-neutral-200">
                        {isArabic
                          ? "كلمة المرور"
                          : "Password"}
                      </label>

                      <input
                        type="password"
                        value={
                          password
                        }
                        onChange={(
                          e
                        ) =>
                          setPassword(
                            e.target
                              .value
                          )
                        }
                        autoComplete="current-password"
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-white focus:border-[#d6b56a]/40 focus:ring-2 focus:ring-[#d6b56a]/10 outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-start">
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgot(
                            true
                          );

                          setForgotEmail(
                            email.trim()
                          );

                          setAuthMsg(
                            null
                          );
                        }}
                        className="text-xs font-bold text-[#d6b56a] hover:text-[#f3e0b0] transition"
                      >
                        {isArabic
                          ? "نسيت كلمة المرور؟"
                          : "Forgot password?"}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={
                        handleLogin
                      }
                      className="w-full rounded-2xl border border-[#d6b56a]/45 bg-gradient-to-r from-[#d6b56a]/25 via-white/5 to-[#d6b56a]/15 py-2.5 text-xs font-extrabold text-white hover:border-[#d6b56a]/70 transition"
                    >
                      {isArabic
                        ? "دخول"
                        : "Sign in"}
                    </button>
                  </div>
                )}
              </div>
            ) : null}

            {/* المقاسات */}
            {isLoggedIn ? (
              <SectionDetails
                title={
                  isArabic
                    ? "المقاسات"
                    : "Measurements"
                }
                defaultOpen={false}
              >
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-semibold text-neutral-300">
                    {isArabic
                      ? "وحدة المحيطات:"
                      : "Measurement unit:"}
                  </div>

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

                {savedSnapshot &&
                hasAnySavedValue(
                  savedSnapshot
                ) &&
                isStale ? (
                  <div className="mt-3 rounded-2xl border border-[#d6b56a]/25 bg-black/20 px-3 py-2 text-[11px] text-[#f3e0b0]">
                    {isArabic
                      ? `مر ${STALE_DAYS} يوم على آخر تحديث للمقاسات`
                      : `${STALE_DAYS} days have passed since your measurements were last updated`}
                  </div>
                ) : null}

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <SelectField
                    label={
                      isArabic
                        ? `الطول (${cmText})`
                        : `Height (${cmText})`
                    }
                    value={
                      heightCm
                    }
                    onChange={(
                      v
                    ) => {
                      markDirty();
                      setHeightCm(
                        v
                      );
                    }}
                    placeholder={
                      centimeterText
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
                        ? `محيط الصدر (${
                            unit ===
                            "cm"
                              ? cmText
                              : inText
                          })`
                        : `Bust (${
                            unit ===
                            "cm"
                              ? cmText
                              : inText
                          })`
                    }
                    value={bust}
                    onChange={(
                      v
                    ) => {
                      markDirty();
                      setBust(v);
                    }}
                    placeholder={
                      unit === "cm"
                        ? centimeterText
                        : inText
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
                        ? `محيط الخصر (${
                            unit ===
                            "cm"
                              ? cmText
                              : inText
                          })`
                        : `Waist (${
                            unit ===
                            "cm"
                              ? cmText
                              : inText
                          })`
                    }
                    value={waist}
                    onChange={(
                      v
                    ) => {
                      markDirty();
                      setWaist(v);
                    }}
                    placeholder={
                      unit === "cm"
                        ? centimeterText
                        : inText
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
                        ? `محيط الأرداف (${
                            unit ===
                            "cm"
                              ? cmText
                              : inText
                          })`
                        : `Hips (${
                            unit ===
                            "cm"
                              ? cmText
                              : inText
                          })`
                    }
                    value={hip}
                    onChange={(
                      v
                    ) => {
                      markDirty();
                      setHip(v);
                    }}
                    placeholder={
                      unit === "cm"
                        ? centimeterText
                        : inText
                    }
                    options={
                      hipOptions
                    }
                    isArabic={
                      isArabic
                    }
                  />
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    onClick={
                      saveMeasurements
                    }
                    disabled={
                      !canSave
                    }
                    className={
                      saveButtonClass
                    }
                  >
                    {
                      saveButtonText
                    }
                  </button>

                  <div className="mt-2 text-[11px] text-neutral-400">
                    {isArabic
                      ? "* الطول بالسنتيمتر دائمًا — ووحدة المحيطات حسب اختيارك."
                      : "* Height is always in centimeters — circumference units follow your selection."}
                  </div>
                </div>
              </SectionDetails>
            ) : null}

            {/* آخر النتائج */}
            {isLoggedIn ? (
              <SectionDetails
                title={
                  isArabic
                    ? "آخر النتائج"
                    : "Recent results"
                }
                defaultOpen={false}
              >
                {historyLoading ? (
                  <div className="text-xs text-neutral-400">
                    {isArabic
                      ? "جاري التحميل…"
                      : "Loading…"}
                  </div>
                ) : historyErr ? (
                  <div className="text-xs text-rose-200/90">
                    {historyErr}
                  </div>
                ) : history.length ===
                  0 ? (
                  <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-xs text-neutral-300">
                    {isArabic
                      ? "ما عندك نتائج سابقة"
                      : "You don't have any previous results"}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {history.map(
                      (h) => (
                        <button
                          key={
                            h.id
                          }
                          type="button"
                          onClick={() => {
                            if (
                              !h.query
                            ) {
                              return;
                            }

                            const q =
                              normalizeResultsQuery(
                                h.query
                              );

                            if (!q) {
                              return;
                            }

                            onClose();

                            router.push(
                              `/results${q}`
                            );
                          }}
                          className={[
                            "w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-3",
                            "hover:bg-black/30 transition",
                            isArabic
                              ? "text-right"
                              : "text-left",
                          ].join(
                            " "
                          )}
                        >
                          <div className="text-xs font-extrabold text-white">
                            {translateHistoryTitle(
                              h.title,
                              isArabic
                            )}
                          </div>

                          <div className="mt-1 text-[11px] text-neutral-400">
                            {subtitleFromQuery(
                              normalizeResultsQuery(
                                h.query
                              ),
                              isArabic
                            ) ||
                              h.subtitle}
                          </div>
                        </button>
                      )
                    )}
                  </div>
                )}
              </SectionDetails>
            ) : null}

            {/* تسجيل الخروج */}
            {isLoggedIn ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <button
                  type="button"
                  onClick={
                    handleLogout
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black/25 py-2.5 text-xs font-extrabold text-white hover:bg-black/35 transition"
                >
                  {isArabic
                    ? "تسجيل الخروج"
                    : "Sign out"}
                </button>
              </div>
            ) : null}
          </div>
        )}
      </aside>
    </>
  );
}