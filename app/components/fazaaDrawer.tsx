"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";

type Unit = "cm" | "in";

const STORAGE_KEY_BASE = "fazaa_measurements_v1"; // للتوافق مع القديم
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

function inToCm(vIn: number) {
  return vIn * 2.54;
}
function cmToIn(vCm: number) {
  return vCm / 2.54;
}
function toNum(v: string) {
  const n = Number(String(v || "").trim());
  return Number.isFinite(n) ? n : NaN;
}
function hasAnySavedValue(p: SavedPayload | null) {
  if (!p) return false;
  return !!(p.heightCm || p.bust || p.waist || p.hip);
}

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

export default function FazaaDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
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

  const [authMsg, setAuthMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );

  // --- measurements in drawer
  const [unit, setUnit] = useState<Unit>("cm");
  const [heightCm, setHeightCm] = useState("");
  const [bust, setBust] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");

  const [savedSnapshot, setSavedSnapshot] = useState<SavedPayload | null>(null);
  const [savedLastUpdated, setSavedLastUpdated] = useState<number | null>(null);

  const [measMode, setMeasMode] = useState<"idle" | "saved" | "updated">("idle");
  const [isDirty, setIsDirty] = useState(false);

  // user-scoped key (عشان ما تختفي/تتلخبط بين حسابات)
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

    const { data: listener } = supabase.auth.onAuthStateChange((_evt, session) => {
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
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  // load saved measurements (when open + when login changes)
  useEffect(() => {
    if (!open) return;

    // 1) جرّبي المفتاح الجديد أول
    const rawNew = safeLocalStorageGet(storageKey);

    // 2) لو ما فيه، جرّبي القديم (backward compatibility)
    const rawOld = storageKey !== STORAGE_KEY_BASE ? safeLocalStorageGet(STORAGE_KEY_BASE) : null;

    const raw = rawNew || rawOld;

    if (!raw) {
      setSavedSnapshot(null);
      setSavedLastUpdated(null);
      setMeasMode("idle");
      setIsDirty(false);
      setHeightCm("");
      setBust("");
      setWaist("");
      setHip("");
      setUnit("cm");
      return;
    }

    try {
      const saved = JSON.parse(raw) as SavedPayload;
      setSavedSnapshot(saved);
      setSavedLastUpdated(typeof saved.lastUpdated === "number" ? saved.lastUpdated : null);

      // عبّي الحقول من المحفوظ
      if (saved.unit === "cm" || saved.unit === "in") setUnit(saved.unit);
      if (typeof saved.heightCm === "string") setHeightCm(saved.heightCm);
      if (typeof saved.bust === "string") setBust(saved.bust);
      if (typeof saved.waist === "string") setWaist(saved.waist);
      if (typeof saved.hip === "string") setHip(saved.hip);

      setMeasMode("saved");
      setIsDirty(false);

      // لو كان من المفتاح القديم وانتي الآن مسجّلة، انسخي للمفتاح الجديد مرة وحدة
      if (sessionUser?.id && rawOld && !rawNew) {
        safeLocalStorageSet(storageKey, rawOld);
      }
    } catch {
      setSavedSnapshot(null);
      setSavedLastUpdated(null);
      setMeasMode("idle");
      setIsDirty(false);
    }
  }, [open, storageKey, sessionUser?.id]);

  const isLoggedIn = !!sessionUser;

  const isStale = useMemo(() => {
    if (!savedLastUpdated) return false;
    return Date.now() - savedLastUpdated >= STALE_DAYS * DAY_MS;
  }, [savedLastUpdated]);

  const bustOptions = unit === "cm" ? BUST_CM_OPTIONS : BUST_IN_OPTIONS;
  const waistOptions = unit === "cm" ? WAIST_CM_OPTIONS : WAIST_IN_OPTIONS;
  const hipOptions = unit === "cm" ? HIP_CM_OPTIONS : HIP_IN_OPTIONS;

  const canSave = useMemo(() => {
    if (!isLoggedIn) return false;
    const h = toNum(heightCm);
    const b = toNum(bust);
    const w = toNum(waist);
    const hp = toNum(hip);

    if (!heightCm || h < 140 || h > 210) return false;

    const bCm = unit === "cm" ? b : inToCm(b);
    const wCm = unit === "cm" ? w : inToCm(w);
    const hipCm = unit === "cm" ? hp : inToCm(hp);

    if (!bust || bCm < 60 || bCm > 160) return false;
    if (!waist || wCm < 45 || wCm > 160) return false;
    if (!hip || hipCm < 60 || hipCm > 180) return false;

    return true;
  }, [isLoggedIn, heightCm, bust, waist, hip, unit]);

  function markDirty() {
    setIsDirty(true);
    // إذا كان سابقاً "تم حفظ/تحديث" وبعد ما عدّل يرجع للوضع العادي
    setMeasMode(savedSnapshot ? "saved" : "idle");
  }

  function onChangeUnit(u: Unit) {
    if (u === unit) return;
    markDirty();
    setUnit(u);

    // تحويل القيم بدل ما نفرّغها
    const b = toNum(bust);
    const w = toNum(waist);
    const hp = toNum(hip);

    if (Number.isFinite(b)) {
      const next = u === "cm" ? Math.round(inToCm(b) * 10) / 10 : Math.round(cmToIn(b) * 10) / 10;
      setBust(String(next));
    }
    if (Number.isFinite(w)) {
      const next = u === "cm" ? Math.round(inToCm(w) * 10) / 10 : Math.round(cmToIn(w) * 10) / 10;
      setWaist(String(next));
    }
    if (Number.isFinite(hp)) {
      const next =
        u === "cm" ? Math.round(inToCm(hp) * 10) / 10 : Math.round(cmToIn(hp) * 10) / 10;
      setHip(String(next));
    }
  }

  function saveMeasurements() {
    if (!canSave) return;

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

    setIsDirty(false);
    // تثبت وتوضح للمستخدم
    setMeasMode(savedSnapshot ? "updated" : "saved");
  }

  async function handleLogin() {
    setAuthMsg(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error) throw error;

      setAuthMsg({ type: "ok", text: "تم تسجيل الدخول" });
      setShowForgot(false);
      setPassword("");
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
        options: {
          data: { name: cleanName },
        },
      });
      if (error) throw error;

      setAuthMsg({
        type: "ok",
        text: "تم إنشاء الحساب. لو عندك تفعيل بالبريد، راح توصلك رسالة.",
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
      // مهم: هذا المسار لازم يكون موجود عندك ويكمل تغيير كلمة المرور
      const redirectTo = `${window.location.origin}/auth/reset`;

      const { error } = await supabase.auth.resetPasswordForEmail(e, {
        redirectTo,
      });
      if (error) throw error;

      setAuthMsg({ type: "ok", text: "تم إرسال رابط إعادة كلمة المرور على إيميلك" });
      setShowForgot(false);
    } catch (err: any) {
      setAuthMsg({ type: "err", text: err?.message || "تعذر إرسال الرابط" });
    }
  }

  const overlayClass = open
    ? "opacity-100 pointer-events-auto"
    : "opacity-0 pointer-events-none";

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
          {/* Account */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-extrabold text-white">الحساب</div>
              {!isLoggedIn ? (
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
              ) : null}
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

            {!isLoggedIn ? (
              <>
                {/* Forgot Password View */}
                {showForgot ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-neutral-200">الإيميل</label>
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
                ) : (
                  <>
                    {/* Login/Register */}
                    {tab === "register" ? (
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-semibold text-neutral-200">الاسم</label>
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

                        {/* نسيت كلمة المرور داخل الداور */}
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
                  </>
                )}
              </>
            ) : (
              <>
                {/* logged in info */}
                <div className="text-xs text-neutral-300 space-y-1">
                  <div className="font-extrabold text-white">{sessionUser?.name || "مستخدم"}</div>
                  <div className="text-neutral-400">{sessionUser?.email}</div>
                </div>
              </>
            )}
          </div>

          {/* Measurements card (ONLY when logged in) */}
          {isLoggedIn ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-extrabold text-white">المقاسات</div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-neutral-300">
                    وحدة المحيطات:
                  </span>
                  <UnitToggle value={unit} onChange={onChangeUnit} />
                </div>
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

              <div className="mt-4 flex items-center justify-between gap-2">
                {/* زر حفظ/تحديث ثابت — يتغير شكله بعد التنفيذ ويثبت */}
                <button
                  type="button"
                  onClick={saveMeasurements}
                  disabled={!canSave}
                  className={[
                    "flex-1 rounded-2xl border py-2.5 text-xs font-extrabold transition",
                    !canSave
                      ? "border-white/10 bg-black/20 text-neutral-500"
                      : measMode === "updated"
                      ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
                      : measMode === "saved"
                      ? "border-[#d6b56a]/45 bg-[#d6b56a]/15 text-white hover:border-[#d6b56a]/70"
                      : "border-[#d6b56a]/45 bg-[#d6b56a]/15 text-white hover:border-[#d6b56a]/70",
                  ].join(" ")}
                >
                  {savedSnapshot && hasAnySavedValue(savedSnapshot)
                    ? measMode === "updated"
                      ? "تم تحديث المقاسات"
                      : "تحديث المقاسات"
                    : measMode === "saved"
                    ? "تم حفظ المقاسات"
                    : "حفظ المقاسات"}
                </button>

                {/* زر استخدام المحفوظ — ثابت ويثبت “تم استخدام…” */}
                {savedSnapshot && hasAnySavedValue(savedSnapshot) ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (!savedSnapshot) return;
                      if (savedSnapshot.unit === "cm" || savedSnapshot.unit === "in")
                        setUnit(savedSnapshot.unit);
                      if (typeof savedSnapshot.heightCm === "string") setHeightCm(savedSnapshot.heightCm);
                      if (typeof savedSnapshot.bust === "string") setBust(savedSnapshot.bust);
                      if (typeof savedSnapshot.waist === "string") setWaist(savedSnapshot.waist);
                      if (typeof savedSnapshot.hip === "string") setHip(savedSnapshot.hip);

                      setIsDirty(false);
                      setMeasMode("saved");
                    }}
                    className={[
                      "flex-1 rounded-2xl border py-2.5 text-xs font-extrabold transition",
                      "border-white/10 bg-black/20 text-white hover:bg-black/30",
                    ].join(" ")}
                  >
                    {isDirty ? "استخدام المقاسات المحفوظة" : "تم استخدام المقاسات المحفوظة"}
                  </button>
                ) : (
                  <div className="flex-1" />
                )}
              </div>

              <div className="mt-2 text-[11px] text-neutral-400">
                * الطول بالسنتيمتر دائمًا — ووحدة المحيطات حسب اختيارك.
              </div>
            </div>
          ) : null}

          {/* Logout card (ONLY when logged in) – آخر شي */}
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