"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

type Unit = "cm" | "in";

const STORAGE_KEY_BASE = "fazaa_measurements_v1"; // للتوافق مع القديم
const STALE_DAYS = 60;
const DAY_MS = 24 * 60 * 60 * 1000;

type SavedPayload = {
  unit?: Unit; // وحدة المحيطات فقط
  heightCm?: string; // الطول دائمًا سم
  bust?: string; // قيمة حسب unit
  waist?: string;
  hip?: string;
  lastUpdated?: number;
};

type HistoryItem = {
  id: string;
  title: string;
  subtitle: string;
  query: string; // ✅ query
  created_at?: string;
};

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
  for (let x = min; x <= max + 1e-9; x += step) out.push(x);
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
  return !!(p.heightCm || p.bust || p.waist || p.hip);
}

/* ===== Options (نفس فكرة صفحة القياسات) ===== */
const HEIGHT_OPTIONS = range(140, 210, 1);

const BUST_CM_OPTIONS = range(60, 160, 1);
const WAIST_CM_OPTIONS = range(45, 160, 1);
const HIP_CM_OPTIONS = range(60, 180, 1);

const BUST_IN_OPTIONS = range(24, 63, 0.5);
const WAIST_IN_OPTIONS = range(18, 63, 0.5);
const HIP_IN_OPTIONS = range(24, 71, 0.5);

/* ===== UI bits ===== */
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

function SelectField({
  label,
  value,
  onChange,
  placeholder,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  options: number[];
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-neutral-200">{label}</span>

      <div className="relative mt-2">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ colorScheme: "dark" }}
          className={[
            "w-full appearance-none rounded-2xl border px-4 py-2.5 text-sm font-semibold transition",
            "border-white/10 bg-neutral-950 text-white",
            "focus:border-[#d6b56a]/40 focus:ring-2 focus:ring-[#d6b56a]/10",
          ].join(" ")}
        >
          <option value="" disabled className="bg-neutral-950 text-neutral-400">
            {placeholder || "اختاري"}
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

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={[
        "h-4 w-4 text-[#d6b56a] transition-transform",
        open ? "rotate-180" : "rotate-0",
      ].join(" ")}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
    </svg>
  );
}

function normalizeResultsTarget(query: string) {
  // يدعم:
  // 1) "/results?...."
  // 2) "?...."
  // 3) "occasion=...&..."
  // 4) "/results" (نادر)
  const q = (query || "").trim();
  if (!q) return null;

  if (q.startsWith("/results")) return q;
  if (q.startsWith("?")) return `/results${q}`;
  if (q.includes("=")) return `/results?${q}`;
  return `/results`;
}

export default function FazaaDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();

  const [tab, setTab] = useState<"login" | "register">("login");

  // --- auth state
  const [sessionUser, setSessionUser] = useState<{
    id: string;
    email: string | null;
    name: string | null;
  } | null>(null);

  // --- auth forms
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // --- forgot password (inside drawer)
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const [authMsg, setAuthMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  // --- measurements in drawer (only logged in)
  const [unit, setUnit] = useState<Unit>("cm"); // وحدة المحيطات
  const [heightCm, setHeightCm] = useState(""); // دائمًا سم
  const [bust, setBust] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");

  const [savedSnapshot, setSavedSnapshot] = useState<SavedPayload | null>(null);
  const [savedLastUpdated, setSavedLastUpdated] = useState<number | null>(null);

  // ✅ زر واحد فقط + يثبت بعد التنفيذ
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saved_done" | "updated_done"
  >("idle");

  // تاريخ النتائج
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyErr, setHistoryErr] = useState<string | null>(null);

  const isLoggedIn = !!sessionUser;

  // ✅ Accordion states
  const [measOpen, setMeasOpen] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(true);

  // user-scoped key
  const storageKey = useMemo(() => {
    const uid = sessionUser?.id;
    return uid ? `${STORAGE_KEY_BASE}:${uid}` : STORAGE_KEY_BASE;
  }, [sessionUser?.id]);

  // read session
  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      const u = data.session?.user;
      setSessionUser(
        u
          ? {
              id: u.id,
              email: u.email ?? null,
              name: (u.user_metadata?.name as string) ?? null,
            }
          : null
      );
    })();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_evt, session) => {
        const u = session?.user;
        setSessionUser(
          u
            ? {
                id: u.id,
                email: u.email ?? null,
                name: (u.user_metadata?.name as string) ?? null,
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

  // ✅ تحميل تلقائي للمحفوظ (عند فتح الداور + عند تغير اليوزر)
  useEffect(() => {
    if (!open) return;

    const rawNew = safeLocalStorageGet(storageKey);
    const rawOld =
      storageKey !== STORAGE_KEY_BASE
        ? safeLocalStorageGet(STORAGE_KEY_BASE)
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
      const saved = JSON.parse(raw) as SavedPayload;
      setSavedSnapshot(saved);
      setSavedLastUpdated(
        typeof saved.lastUpdated === "number" ? saved.lastUpdated : null
      );

      if (saved.unit === "cm" || saved.unit === "in") setUnit(saved.unit);
      if (typeof saved.heightCm === "string") setHeightCm(saved.heightCm);
      if (typeof saved.bust === "string") setBust(saved.bust);
      if (typeof saved.waist === "string") setWaist(saved.waist);
      if (typeof saved.hip === "string") setHip(saved.hip);

      setSaveStatus("idle");

      // migrate old -> new key once
      if (sessionUser?.id && rawOld && !rawNew) {
        safeLocalStorageSet(storageKey, rawOld);
      }
    } catch {
      setSavedSnapshot(null);
      setSavedLastUpdated(null);
      setSaveStatus("idle");
    }
  }, [open, storageKey, sessionUser?.id]);

  const isStale = useMemo(() => {
    if (!savedLastUpdated) return false;
    return Date.now() - savedLastUpdated >= STALE_DAYS * DAY_MS;
  }, [savedLastUpdated]);

  // dropdown options for circumferences
  const bustOptions = unit === "cm" ? BUST_CM_OPTIONS : BUST_IN_OPTIONS;
  const waistOptions = unit === "cm" ? WAIST_CM_OPTIONS : WAIST_IN_OPTIONS;
  const hipOptions = unit === "cm" ? HIP_CM_OPTIONS : HIP_IN_OPTIONS;

  // ✅ صلاحية الحفظ
  const canSave = useMemo(() => {
    if (!isLoggedIn) return false;

    const h = toNum(heightCm);
    if (!heightCm || h < 140 || h > 210) return false;

    const b = toNum(bust);
    const w = toNum(waist);
    const hp = toNum(hip);

    const bCm = unit === "cm" ? b : inToCm(b);
    const wCm = unit === "cm" ? w : inToCm(w);
    const hipCm = unit === "cm" ? hp : inToCm(hp);

    if (!bust || bCm < 60 || bCm > 160) return false;
    if (!waist || wCm < 45 || wCm > 160) return false;
    if (!hip || hipCm < 60 || hipCm > 180) return false;

    return true;
  }, [isLoggedIn, heightCm, bust, waist, hip, unit]);

  function markDirty() {
    setSaveStatus("idle");
  }

  function onChangeUnit(next: Unit) {
    if (next === unit) return;

    markDirty();
    setUnit(next);

    // تحويل القيم بدل ما نفرّغها
    const b = toNum(bust);
    const w = toNum(waist);
    const hp = toNum(hip);

    if (Number.isFinite(b)) {
      const conv =
        next === "cm"
          ? Math.round(inToCm(b) * 10) / 10
          : Math.round(cmToIn(b) * 10) / 10;
      setBust(String(conv));
    }
    if (Number.isFinite(w)) {
      const conv =
        next === "cm"
          ? Math.round(inToCm(w) * 10) / 10
          : Math.round(cmToIn(w) * 10) / 10;
      setWaist(String(conv));
    }
    if (Number.isFinite(hp)) {
      const conv =
        next === "cm"
          ? Math.round(inToCm(hp) * 10) / 10
          : Math.round(cmToIn(hp) * 10) / 10;
      setHip(String(conv));
    }
  }

  function saveMeasurements() {
    if (!canSave) return;

    const hadSaved = !!(savedSnapshot && hasAnySavedValue(savedSnapshot));

    const payload: SavedPayload = {
      unit,
      heightCm,
      bust,
      waist,
      hip,
      lastUpdated: Date.now(),
    };

    safeLocalStorageSet(storageKey, JSON.stringify(payload));
    setSavedSnapshot(payload);
    setSavedLastUpdated(payload.lastUpdated ?? null);

    setSaveStatus(hadSaved ? "updated_done" : "saved_done");
  }

  async function handleLogin() {
    setAuthMsg(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error) throw error;

      setShowForgot(false);
      setPassword("");
      setAuthMsg(null);
    } catch (e: any) {
      setAuthMsg({ type: "err", text: e?.message || "تعذر تسجيل الدخول" });
    }
  }

  async function handleRegister() {
    setAuthMsg(null);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanName = name.trim();

      const { error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: { data: { name: cleanName } },
      });
      if (error) throw error;

      setAuthMsg({
        type: "ok",
        text: "تم إنشاء الحساب. إذا عندك تفعيل بالبريد، راح توصلك رسالة.",
      });
      setPassword("");
    } catch (e: any) {
      setAuthMsg({ type: "err", text: e?.message || "تعذر إنشاء الحساب" });
    }
  }

  async function handleLogout() {
    setAuthMsg(null);
    await supabase.auth.signOut();
    onClose();
  }

  async function handleSendReset() {
    setAuthMsg(null);

    const e = forgotEmail.trim().toLowerCase();
    if (!e) {
      setAuthMsg({ type: "err", text: "اكتبي الإيميل أول" });
      return;
    }

    try {
      const redirectTo = `${window.location.origin}/auth/reset`;

      const { error } = await supabase.auth.resetPasswordForEmail(e, {
        redirectTo,
      });
      if (error) throw error;

      setAuthMsg({
        type: "ok",
        text: "تم إرسال رابط إعادة كلمة المرور على إيميلك",
      });
      setShowForgot(false);
    } catch (err: any) {
      setAuthMsg({ type: "err", text: err?.message || "تعذر إرسال الرابط" });
    }
  }

  // ✅ تحميل الهستري من Supabase (إذا مسجلة دخول + الداور مفتوح)
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
        const { data, error } = await supabase
          .from("fazaa_history")
          .select("id,title,subtitle,query,created_at")
          .eq("user_id", sessionUser.id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (cancelled) return;
        if (error) throw error;

        setHistory((data || []) as HistoryItem[]);
      } catch (e: any) {
        if (cancelled) return;
        setHistory([]);
        setHistoryErr(e?.message || "تعذر تحميل النتائج السابقة");
      } finally {
        if (!cancelled) setHistoryLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, sessionUser?.id]);

  const overlayClass = open
    ? "opacity-100 pointer-events-auto"
    : "opacity-0 pointer-events-none";

  // زر واحد فقط: حفظ/تحديث + يثبت بعد التنفيذ
  const hasSaved = !!(savedSnapshot && hasAnySavedValue(savedSnapshot));
  const saveButtonText = !hasSaved
    ? saveStatus === "saved_done"
      ? "تم حفظ المقاسات"
      : "حفظ المقاسات"
    : saveStatus === "updated_done"
    ? "تم تحديث المقاسات"
    : "تحديث المقاسات";

  const saveButtonClass = [
    "w-full rounded-2xl border py-2.5 text-xs font-extrabold transition",
    !canSave
      ? "border-white/10 bg-black/20 text-neutral-500"
      : saveStatus === "updated_done" || saveStatus === "saved_done"
      ? "border-[#d6b56a]/55 bg-[#d6b56a]/18 text-white"
      : "border-[#d6b56a]/45 bg-[#d6b56a]/15 text-white hover:border-[#d6b56a]/70",
  ].join(" ");

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
          "fixed top-0 right-0 z-50 h-full w-[360px] max-w-[92vw]",
          "bg-neutral-950/95 border-l border-white/10",
          "shadow-[0_30px_80px_rgba(0,0,0,0.65)]",
          "transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="text-sm font-extrabold text-white">القائمة</div>
          <button
            type="button"
            onClick={onClose}
            className="h-10 w-10 rounded-2xl border border-[#d6b56a]/35 bg-black/30 text-[#d6b56a] hover:border-[#d6b56a]/60 transition"
            aria-label="إغلاق"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto h-[calc(100%-64px)]">
          {/* ✅ ACCOUNT: لو مسجل -> بدون كرت */}
          {isLoggedIn ? (
            <div className="px-1">
              <div className="text-white font-extrabold text-sm">
                {sessionUser?.name || "مستخدم"}
              </div>
              <div className="text-neutral-400 text-xs mt-1">
                {sessionUser?.email}
              </div>
            </div>
          ) : (
            /* ❗ إذا مو مسجل: نخلي نفس كرت الحساب القديم (لأنه نموذج) */
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-extrabold text-white">الحساب</div>

                <div className="inline-flex rounded-2xl border border-[#d6b56a]/25 bg-black/20 p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setTab("login");
                      setShowForgot(false);
                      setAuthMsg(null);
                    }}
                    className={[
                      "px-3 py-1.5 rounded-xl text-xs font-extrabold transition",
                      tab === "login"
                        ? "bg-[#d6b56a]/15 text-white border border-[#d6b56a]/35"
                        : "text-neutral-300 hover:text-white",
                    ].join(" ")}
                  >
                    تسجيل الدخول
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTab("register");
                      setShowForgot(false);
                      setAuthMsg(null);
                    }}
                    className={[
                      "px-3 py-1.5 rounded-xl text-xs font-extrabold transition",
                      tab === "register"
                        ? "bg-[#d6b56a]/15 text-white border border-[#d6b56a]/35"
                        : "text-neutral-300 hover:text-white",
                    ].join(" ")}
                  >
                    إنشاء حساب
                  </button>
                </div>
              </div>

              {authMsg ? (
                <div
                  className={[
                    "mb-3 rounded-2xl px-3 py-2 text-xs font-semibold border",
                    authMsg.type === "ok"
                      ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
                      : "border-rose-400/30 bg-rose-500/10 text-rose-100",
                  ].join(" ")}
                >
                  {authMsg.text}
                </div>
              ) : null}

              {showForgot ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-neutral-200">
                      الإيميل
                    </label>
                    <input
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="example@email.com"
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-white focus:border-[#d6b56a]/40 focus:ring-2 focus:ring-[#d6b56a]/10 outline-none"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSendReset}
                      className="flex-1 rounded-2xl border border-[#d6b56a]/45 bg-[#d6b56a]/15 py-2.5 text-xs font-extrabold text-white hover:border-[#d6b56a]/70 transition"
                    >
                      إرسال رابط
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgot(false);
                        setAuthMsg(null);
                      }}
                      className="flex-1 rounded-2xl border border-white/10 bg-black/20 py-2.5 text-xs font-extrabold text-white hover:bg-black/30 transition"
                    >
                      رجوع
                    </button>
                  </div>
                </div>
              ) : tab === "register" ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-neutral-200">
                      الاسم
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-white focus:border-[#d6b56a]/40 focus:ring-2 focus:ring-[#d6b56a]/10 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-200">
                      البريد الإلكتروني
                    </label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-white focus:border-[#d6b56a]/40 focus:ring-2 focus:ring-[#d6b56a]/10 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-200">
                      كلمة المرور
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-white focus:border-[#d6b56a]/40 focus:ring-2 focus:ring-[#d6b56a]/10 outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleRegister}
                    className="w-full rounded-2xl border border-[#d6b56a]/45 bg-gradient-to-r from-[#d6b56a]/25 via-white/5 to-[#d6b56a]/15 py-2.5 text-xs font-extrabold text-white hover:border-[#d6b56a]/70 transition"
                  >
                    إنشاء
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-neutral-200">
                      البريد الإلكتروني
                    </label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-white focus:border-[#d6b56a]/40 focus:ring-2 focus:ring-[#d6b56a]/10 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-200">
                      كلمة المرور
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-white focus:border-[#d6b56a]/40 focus:ring-2 focus:ring-[#d6b56a]/10 outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-start">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgot(true);
                        setForgotEmail(email.trim());
                        setAuthMsg(null);
                      }}
                      className="text-xs font-bold text-[#d6b56a] hover:text-[#f3e0b0] transition"
                    >
                      نسيت كلمة المرور؟
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogin}
                    className="w-full rounded-2xl border border-[#d6b56a]/45 bg-gradient-to-r from-[#d6b56a]/25 via-white/5 to-[#d6b56a]/15 py-2.5 text-xs font-extrabold text-white hover:border-[#d6b56a]/70 transition"
                  >
                    دخول
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ✅ MEASUREMENTS Accordion */}
          {isLoggedIn ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
              <button
                type="button"
                onClick={() => setMeasOpen((v) => !v)}
                className="w-full px-4 py-4 flex items-center justify-between"
              >
                <div className="text-sm font-extrabold text-white">المقاسات</div>
                <Chevron open={measOpen} />
              </button>

              {measOpen ? (
                <div className="px-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-semibold text-neutral-300">
                      وحدة المحيطات:
                    </div>
                    <UnitToggle value={unit} onChange={onChangeUnit} />
                  </div>

                  {savedSnapshot && hasAnySavedValue(savedSnapshot) && isStale ? (
                    <div className="mt-3 rounded-2xl border border-[#d6b56a]/25 bg-black/20 px-3 py-2 text-[11px] text-[#f3e0b0]">
                      مر {STALE_DAYS} يوم على آخر تحديث للمقاسات
                    </div>
                  ) : null}

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <SelectField
                      label="الطول (سم)"
                      value={heightCm}
                      onChange={(v) => {
                        markDirty();
                        setHeightCm(v);
                      }}
                      placeholder="سنتيمتر"
                      options={HEIGHT_OPTIONS}
                    />

                    <SelectField
                      label={`محيط الصدر (${unit === "cm" ? "سم" : "إنش"})`}
                      value={bust}
                      onChange={(v) => {
                        markDirty();
                        setBust(v);
                      }}
                      placeholder={unit === "cm" ? "سنتيمتر" : "إنش"}
                      options={bustOptions}
                    />

                    <SelectField
                      label={`محيط الخصر (${unit === "cm" ? "سم" : "إنش"})`}
                      value={waist}
                      onChange={(v) => {
                        markDirty();
                        setWaist(v);
                      }}
                      placeholder={unit === "cm" ? "سنتيمتر" : "إنش"}
                      options={waistOptions}
                    />

                    <SelectField
                      label={`محيط الأرداف (${unit === "cm" ? "سم" : "إنش"})`}
                      value={hip}
                      onChange={(v) => {
                        markDirty();
                        setHip(v);
                      }}
                      placeholder={unit === "cm" ? "سنتيمتر" : "إنش"}
                      options={hipOptions}
                    />
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={saveMeasurements}
                      disabled={!canSave}
                      className={saveButtonClass}
                    >
                      {saveButtonText}
                    </button>

                    <div className="mt-2 text-[11px] text-neutral-400">
                      * الطول بالسنتيمتر دائمًا — ووحدة المحيطات حسب اختيارك.
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {/* ✅ HISTORY Accordion */}
          {isLoggedIn ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
              <button
                type="button"
                onClick={() => setHistoryOpen((v) => !v)}
                className="w-full px-4 py-4 flex items-center justify-between"
              >
                <div className="text-sm font-extrabold text-white">
                  النتائج المحفوظة
                </div>
                <Chevron open={historyOpen} />
              </button>

              {historyOpen ? (
                <div className="px-4 pb-4">
                  {historyLoading ? (
                    <div className="text-xs text-neutral-400">جاري التحميل…</div>
                  ) : historyErr ? (
                    <div className="text-xs text-rose-200/90">{historyErr}</div>
                  ) : history.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-xs text-neutral-300">
                      ما عندك نتائج محفوظة للحين
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {history.map((h) => (
                        <button
                          key={h.id}
                          type="button"
                          onClick={() => {
                            const target = normalizeResultsTarget(h.query);
                            if (!target) return;
                            onClose();
                            router.push(target);
                          }}
                          className={[
                            "w-full text-right rounded-2xl border border-white/10 bg-black/20 px-3 py-3",
                            "hover:bg-black/30 transition",
                          ].join(" ")}
                        >
                          <div className="text-xs font-extrabold text-white">
                            {h.title}
                          </div>
                          <div className="mt-1 text-[11px] text-neutral-400">
                            {h.subtitle}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          ) : null}

          {/* 4) LOGOUT */}
          {isLoggedIn ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-2xl border border-white/10 bg-black/25 py-2.5 text-xs font-extrabold text-white hover:bg-black/35 transition"
              >
                تسجيل الخروج
              </button>
            </div>
          ) : null}
        </div>
      </aside>
    </>
  );
}