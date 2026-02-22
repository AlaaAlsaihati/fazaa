"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";

const MEASUREMENTS_KEY = "fazaa_measurements_v1";
const UNIT_KEY = "fazaa_unit_v1";
const STALE_DAYS = 60;

type HistoryItem = {
  id: string;
  title: string;
  subtitle: string;
};

type SavedMeasurements = {
  unit?: "cm" | "in";
  height?: string;
  bust?: string;
  waist?: string;
  hip?: string;
  updatedAt?: number;
};

function safeGet(key: string) {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, val: string) {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, val);
  } catch {
    // ignore
  }
}

function normalizeEmail(v: string) {
  return String(v || "")
    .trim()
    .toLowerCase();
}

function normalizeName(v: string) {
  return String(v || "").trim().replace(/\s+/g, " ");
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ===== Badge ===== */
function SelectedBadge() {
  return (
    <span className="absolute top-0 left-0 -translate-x-1 -translate-y-1 z-30 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black border border-[#d6b56a] pointer-events-none">
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 text-[#d6b56a]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  );
}

export default function FazaaDrawer({
  open,
  onClose,

  // ✅ Backward compat (عشان صفحاتك ما نخربها)
  userName: _userName,
  onMeasurementsClick, // موجود بس ما نعرض زر “فتح صفحة المقاسات”
  onLoginClick,
  onRegisterClick,
  onLogoutClick,

  history = [],
  onHistoryClick,
}: {
  open: boolean;
  onClose: () => void;

  // backward compat props
  userName?: string | null;
  onMeasurementsClick?: () => void;
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
  onLogoutClick?: () => void;

  history?: HistoryItem[];
  onHistoryClick: (id: string) => void;
}) {
  // ===== Supabase auth session state =====
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);

  const isLoggedIn = useMemo(() => !!userId, [userId]);

  // ===== Auth UI state =====
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // ===== Measurements (داخل الدروار) =====
  const [measOpen, setMeasOpen] = useState(false);

  const [unit, setUnit] = useState<"cm" | "in">("cm");
  const [height, setHeight] = useState("");
  const [bust, setBust] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [savedAt, setSavedAt] = useState<number | null>(null);

  // ESC close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // ✅ لما يفتح الدروار: جيب الجلسة + الاسم (profiles أو metadata) + حمّل المقاسات (للمسجّل فقط)
  useEffect(() => {
    if (!open) return;

    (async () => {
      // reset auth UI
      setAuthOpen(false);
      setAuthError(null);
      setAuthSuccess(null);

      setLoginEmail("");
      setLoginPassword("");
      setRegName("");
      setRegEmail("");
      setRegPassword("");

      const { data } = await supabase.auth.getSession();
      const session = data.session;
      const u = session?.user ?? null;

      setUserId(u?.id ?? null);
      setUserEmail(u?.email ?? null);

      if (u?.id) {
        // 1) جرّبي الاسم من profiles
        const { data: prof } = await supabase
          .from("profiles")
          .select("name")
          .eq("id", u.id)
          .single();

        // 2) لو ما فيه، خذيه من user_metadata.name
        const metaName =
          typeof (u as any)?.user_metadata?.name === "string"
            ? String((u as any).user_metadata.name)
            : null;

        const finalName = (prof as any)?.name ?? metaName ?? null;
        setProfileName(finalName ? String(finalName) : null);

        // measurements local — بس للمسجّل
        const rawUnit = safeGet(UNIT_KEY);
        const nextUnit = rawUnit === "in" ? "in" : "cm";
        setUnit(nextUnit);

        const raw = safeGet(MEASUREMENTS_KEY);
        if (raw) {
          try {
            const m = JSON.parse(raw) as SavedMeasurements;
            setUnit(m.unit === "in" ? "in" : nextUnit);
            setHeight(typeof m.height === "string" ? m.height : "");
            setBust(typeof m.bust === "string" ? m.bust : "");
            setWaist(typeof m.waist === "string" ? m.waist : "");
            setHip(typeof m.hip === "string" ? m.hip : "");
            setSavedAt(typeof m.updatedAt === "number" ? m.updatedAt : null);
          } catch {
            setHeight("");
            setBust("");
            setWaist("");
            setHip("");
            setSavedAt(null);
          }
        } else {
          setHeight("");
          setBust("");
          setWaist("");
          setHip("");
          setSavedAt(null);
        }
      } else {
        setProfileName(null);
        setMeasOpen(false);
      }
    })();
  }, [open]);

  // ===== Helpers =====
  const canSave = useMemo(() => {
    return !!height && !!bust && !!waist && !!hip;
  }, [height, bust, waist, hip]);

  const stale60Days = useMemo(() => {
    if (!savedAt) return false;
    const diffDays = (Date.now() - savedAt) / (1000 * 60 * 60 * 24);
    return diffDays >= STALE_DAYS;
  }, [savedAt]);

  const measSummary = useMemo(() => {
    const h = height || "—";
    const b = bust || "—";
    const w = waist || "—";
    const hp = hip || "—";
    return `طول ${h} • صدر ${b} • خصر ${w} • أرداف ${hp}`;
  }, [height, bust, waist, hip]);

  function saveMeasurements() {
    if (!canSave) return;

    const payload: SavedMeasurements = {
      unit,
      height,
      bust,
      waist,
      hip,
      updatedAt: Date.now(),
    };

    safeSet(UNIT_KEY, unit);
    safeSet(MEASUREMENTS_KEY, JSON.stringify(payload));
    setSavedAt(payload.updatedAt ?? null);
  }

  // ===== Auth actions =====
  function openLogin() {
    setAuthMode("login");
    setAuthOpen(true);
    setAuthError(null);
    setAuthSuccess(null);
    onLoginClick?.();
  }

  function openRegister() {
    setAuthMode("register");
    setAuthOpen(true);
    setAuthError(null);
    setAuthSuccess(null);
    onRegisterClick?.();
  }

  async function doLogout() {
    setAuthError(null);
    setAuthSuccess(null);

    await supabase.auth.signOut();

    setUserId(null);
    setUserEmail(null);
    setProfileName(null);
    setAuthOpen(false);
    setMeasOpen(false);

    onLogoutClick?.();
  }

  async function doRegister() {
    setAuthError(null);
    setAuthSuccess(null);

    const name = normalizeName(regName);
    const email = normalizeEmail(regEmail);

    if (!name) return setAuthError("الاسم مطلوب.");
    if (!email || !isValidEmail(email)) return setAuthError("يرجى إدخال بريد إلكتروني صحيح.");
    if (!regPassword || regPassword.length < 6)
      return setAuthError("الباسورد لازم 6 أحرف أو أكثر.");

    // ✅ نخزن الاسم في metadata عشان يطلع مباشرة حتى لو profiles ما اشتغل
    const { data, error } = await supabase.auth.signUp({
      email,
      password: regPassword,
      options: {
        data: { name },
      },
    });

    if (error) return setAuthError(error.message);

    const uid = data.user?.id;
    if (uid) {
      // نخليه موجود أيضًا في profiles (اختياري بس ممتاز)
      await supabase.from("profiles").upsert({ id: uid, name });
    }

    setAuthSuccess("تم إنشاء الحساب ✅ افحصي ايميلك للتأكيد.");
    setAuthOpen(false);
  }

  async function doLogin() {
    setAuthError(null);
    setAuthSuccess(null);

    const email = normalizeEmail(loginEmail);
    if (!email || !isValidEmail(email)) return setAuthError("يرجى إدخال بريد إلكتروني صحيح.");
    if (!loginPassword) return setAuthError("اكتبي كلمة المرور.");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: loginPassword,
    });

    if (error) return setAuthError(error.message);

    const u = data.user;
    setUserId(u.id);
    setUserEmail(u.email ?? null);

    const { data: prof } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", u.id)
      .single();

    const metaName =
      typeof (u as any)?.user_metadata?.name === "string"
        ? String((u as any).user_metadata.name)
        : null;

    setProfileName((prof as any)?.name ?? metaName ?? null);

    setAuthSuccess("تم تسجيل الدخول ✅");
    setAuthOpen(false);
  }

  return (
    <>
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className={[
          "fixed inset-0 z-40",
          "bg-black/55 backdrop-blur-[2px]",
          "transition-opacity",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
      />

      {/* Panel */}
      <aside
        dir="rtl"
        className={[
          "fixed top-0 right-0 z-50 h-full w-[320px] sm:w-[360px]",
          "bg-gradient-to-b from-neutral-950 via-neutral-900 to-black",
          "border-l border-[#d6b56a]/25",
          "shadow-[0_30px_80px_rgba(0,0,0,0.65)]",
          "transition-transform duration-200",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-neutral-400">فزعة</div>
              <div className="mt-1 text-lg font-extrabold text-white">
                {isLoggedIn ? profileName ?? "حسابي" : "القائمة"}
              </div>
              {isLoggedIn && userEmail ? (
                <div className="mt-1 text-[11px] text-neutral-400">{userEmail}</div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="h-10 w-10 rounded-2xl border border-[#d6b56a]/30 bg-white/5 text-[#f3e0b0] hover:border-[#d6b56a]/50 transition"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-[#d6b56a]/35 to-transparent" />
        </div>

        {/* Content */}
        <div className="px-5 pb-6 space-y-4">
          {/* Account card */}
          <div className="rounded-2xl border border-[#d6b56a]/25 bg-white/5 p-4 backdrop-blur">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-white">الحساب</div>

              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={doLogout}
                  className="text-xs font-extrabold text-[#f3e0b0] hover:text-[#d6b56a] transition"
                >
                  تسجيل الخروج
                </button>
              ) : null}
            </div>

            {!isLoggedIn ? (
              <>
                {!authOpen ? (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={openLogin}
                      className="w-full rounded-2xl border border-[#d6b56a]/45 bg-gradient-to-r from-[#d6b56a]/20 via-white/5 to-[#d6b56a]/10 py-2.5 text-sm font-extrabold text-white hover:border-[#d6b56a]/70 transition"
                    >
                      تسجيل الدخول
                    </button>

                    <button
                      type="button"
                      onClick={openRegister}
                      className="w-full rounded-2xl border border-white/10 bg-black/20 py-2.5 text-sm font-extrabold text-white hover:border-[#d6b56a]/30 transition"
                    >
                      إنشاء حساب
                    </button>
                  </div>
                ) : (
                  <div className="mt-3">
                    {/* Tabs */}
                    <div className="inline-flex w-full rounded-2xl border border-white/10 bg-black/20 p-1">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode("login");
                          setAuthError(null);
                          setAuthSuccess(null);
                        }}
                        className={[
                          "w-1/2 rounded-xl py-2 text-xs font-extrabold transition",
                          authMode === "login"
                            ? "bg-[#d6b56a]/15 text-white border border-[#d6b56a]/35"
                            : "text-neutral-300 hover:text-white",
                        ].join(" ")}
                      >
                        تسجيل الدخول
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode("register");
                          setAuthError(null);
                          setAuthSuccess(null);
                        }}
                        className={[
                          "w-1/2 rounded-xl py-2 text-xs font-extrabold transition",
                          authMode === "register"
                            ? "bg-[#d6b56a]/15 text-white border border-[#d6b56a]/35"
                            : "text-neutral-300 hover:text-white",
                        ].join(" ")}
                      >
                        إنشاء حساب
                      </button>
                    </div>

                    {/* Form */}
                    {authMode === "login" ? (
                      <div className="mt-3 space-y-2">
                        <TextInput
                          label="البريد الإلكتروني"
                          value={loginEmail}
                          onChange={setLoginEmail}
                          placeholder="name@example.com"
                          inputMode="email"
                        />
                        <TextInput
                          label="كلمة المرور"
                          value={loginPassword}
                          onChange={setLoginPassword}
                          placeholder=""
                          inputMode="text"
                          type="password"
                        />

                        {authError ? (
                          <div className="text-[11px] text-red-300">{authError}</div>
                        ) : null}

                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setAuthOpen(false);
                              setAuthError(null);
                              setAuthSuccess(null);
                            }}
                            className="w-full rounded-2xl border border-white/10 bg-black/20 py-2.5 text-xs font-extrabold text-white hover:border-[#d6b56a]/30 transition"
                          >
                            إلغاء
                          </button>

                          <button
                            type="button"
                            onClick={doLogin}
                            className="w-full rounded-2xl border border-[#d6b56a]/45 bg-gradient-to-r from-[#d6b56a]/20 via-white/5 to-[#d6b56a]/10 py-2.5 text-xs font-extrabold text-white hover:border-[#d6b56a]/70 transition"
                          >
                            دخول
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 space-y-2">
                        <TextInput
                          label="الاسم"
                          value={regName}
                          onChange={setRegName}
                          placeholder="الاسم الكامل"
                          inputMode="text"
                        />
                        <TextInput
                          label="البريد الإلكتروني"
                          value={regEmail}
                          onChange={setRegEmail}
                          placeholder="name@example.com"
                          inputMode="email"
                        />
                        <TextInput
                          label="كلمة المرور"
                          value={regPassword}
                          onChange={setRegPassword}
                          placeholder=""
                          inputMode="text"
                          type="password"
                        />

                        {authError ? (
                          <div className="text-[11px] text-red-300">{authError}</div>
                        ) : null}

                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setAuthOpen(false);
                              setAuthError(null);
                              setAuthSuccess(null);
                            }}
                            className="w-full rounded-2xl border border-white/10 bg-black/20 py-2.5 text-xs font-extrabold text-white hover:border-[#d6b56a]/30 transition"
                          >
                            إلغاء
                          </button>

                          <button
                            type="button"
                            onClick={doRegister}
                            className="w-full rounded-2xl border border-[#d6b56a]/45 bg-gradient-to-r from-[#d6b56a]/20 via-white/5 to-[#d6b56a]/10 py-2.5 text-xs font-extrabold text-white hover:border-[#d6b56a]/70 transition"
                          >
                            إنشاء
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : null}

            {authSuccess ? (
              <div className="mt-2 text-[11px] text-emerald-200">{authSuccess}</div>
            ) : null}
          </div>

          {/* ✅ المقاسات: تظهر فقط للمسجّل — وفيها "حفظ" فقط */}
          {isLoggedIn ? (
            <div className="rounded-2xl border border-[#d6b56a]/25 bg-white/5 backdrop-blur overflow-hidden">
              <button
                type="button"
                onClick={() => setMeasOpen((s) => !s)}
                className="w-full relative p-4 text-right hover:bg-white/5 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-extrabold text-white">المقاسات</div>
                    <div className="mt-2 text-[11px] text-neutral-300">{measSummary}</div>

                    {/* ✅ تنبيه قديم (اختياري) بدون شيك بوكس */}
                    {savedAt && stale60Days ? (
                      <div className="mt-2 text-[11px] text-[#f3e0b0]">
                        ⚠️ مضى {STALE_DAYS} يوم على آخر تحديث — يفضّل تحديثها
                      </div>
                    ) : null}
                  </div>

                  <span className="text-[#d6b56a] text-lg">{measOpen ? "⌃" : "⌄"}</span>
                </div>

                {savedAt ? (
                  <span className="absolute top-3 left-3">
                    <SelectedBadge />
                  </span>
                ) : null}
              </button>

              {measOpen ? (
                <div className="px-4 pb-4">
                  {/* ❌ لا شيك بوكس استخدام المقاسات المحفوظة */}
                  {/* ❌ لا وحدة سم/إنش في الداور */}
                  <div className="grid grid-cols-2 gap-2">
                    <Input label="الطول" value={height} onChange={setHeight} />
                    <Input label="الصدر" value={bust} onChange={setBust} />
                    <Input label="الخصر" value={waist} onChange={setWaist} />
                    <Input label="الأرداف" value={hip} onChange={setHip} />
                  </div>

                  <div className="mt-3 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={saveMeasurements}
                      disabled={!canSave}
                      className={[
                        "rounded-xl border px-4 py-2 text-xs font-extrabold transition",
                        "border-[#d6b56a]/45 bg-gradient-to-r from-[#d6b56a]/20 via-white/5 to-[#d6b56a]/10 text-white",
                        "hover:border-[#d6b56a]/70",
                        !canSave ? "opacity-40 hover:border-[#d6b56a]/45" : "",
                      ].join(" ")}
                    >
                      حفظ
                    </button>
                  </div>

                  {/* ❌ لا زر فتح صفحة المقاسات */}
                  {/* ❌ لا نص “يمكن حفظ…” */}
                </div>
              ) : null}
            </div>
          ) : null}

          {/* History (logged in only) */}
          {isLoggedIn ? (
            <>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-[#d6b56a]/35 to-transparent" />

              <div className="space-y-2">
                {history.length ? (
                  history.map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => onHistoryClick(h.id)}
                      className={[
                        "w-full text-right rounded-2xl border border-white/10 bg-black/20 p-3",
                        "hover:bg-black/30 hover:border-[#d6b56a]/30 transition",
                      ].join(" ")}
                    >
                      <div className="text-sm font-semibold text-white">{h.title}</div>
                      <div className="mt-1 text-xs text-neutral-400">{h.subtitle}</div>
                    </button>
                  ))
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                    <div className="text-sm font-semibold text-white">لا توجد تجارب محفوظة</div>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      </aside>
    </>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <div className="text-[11px] font-semibold text-neutral-300">{label}</div>
      <input
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^\d.]/g, ""))}
        placeholder=""
        className={[
          "mt-1 w-full rounded-xl border px-3 py-2 text-sm font-semibold transition",
          "border-white/10 bg-neutral-950 text-white",
          "focus:border-[#d6b56a]/40 focus:ring-2 focus:ring-[#d6b56a]/10 outline-none",
        ].join(" ")}
      />
    </label>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
  inputMode,
  type,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  type?: React.HTMLInputTypeAttribute;
}) {
  return (
    <label className="block">
      <div className="text-[11px] font-semibold text-neutral-300">{label}</div>
      <input
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || ""}
        className={[
          "mt-1 w-full rounded-xl border px-3 py-2 text-sm font-semibold transition",
          "border-white/10 bg-neutral-950 text-white",
          "focus:border-[#d6b56a]/40 focus:ring-2 focus:ring-[#d6b56a]/10 outline-none",
        ].join(" ")}
      />
    </label>
  );
}