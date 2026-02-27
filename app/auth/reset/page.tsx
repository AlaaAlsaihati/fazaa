"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import SiteFooter from "@/app/components/FazaaFooter";

function PasswordField({
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
      <span className="text-sm font-semibold text-white">{label}</span>
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-3 text-sm text-white focus:border-[#d6b56a]/40 focus:ring-2 focus:ring-[#d6b56a]/10 outline-none"
        placeholder="********"
        autoComplete="new-password"
      />
    </label>
  );
}

export default function ResetPasswordPage() {
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [sessionOk, setSessionOk] = useState(false);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [status, setStatus] = useState<
    { type: "ok" | "err"; text: string } | null
  >(null);

  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  // لازم يكون فيه session user (Supabase يحطه لما تفتح رابط الاستعادة)
  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSessionOk(!!data.session?.user);
      setReady(true);
    })();

    const { data: listener } = supabase.auth.onAuthStateChange((_evt, session) => {
      setSessionOk(!!session?.user);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const canSubmit = useMemo(() => {
    if (done) return false;
    if (!password || password.length < 6) return false;
    if (password !== confirm) return false;
    return true;
  }, [password, confirm, done]);

  async function handleUpdatePassword() {
    setStatus(null);

    if (!sessionOk) {
      setStatus({
        type: "err",
        text: "الرابط غير صالح أو انتهت صلاحيته. ارجعي واطلبي رابط جديد.",
      });
      return;
    }

    if (!canSubmit) return;

    try {
      setSaving(true);

      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setDone(true);
      setStatus({ type: "ok", text: "تم تحديث كلمة المرور بنجاح" });
    } catch (e: any) {
      setStatus({ type: "err", text: e?.message || "تعذر تحديث كلمة المرور" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black p-6"
    >
      <div className="mx-auto max-w-xl">
        <header className="mb-6 text-center">
          <p className="text-sm text-neutral-400">استعادة الحساب</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white">
            تعيين كلمة مرور جديدة
          </h1>
          <p className="mt-3 text-sm text-neutral-400">
            بعد التحديث ارجعي وسجّلي دخول من التطبيق.
          </p>
        </header>

        <div className="relative overflow-hidden rounded-3xl border border-[#d6b56a]/35 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(214,181,106,0.12),0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur">
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-[#d6b56a]/22" />
          <div className="pointer-events-none absolute -top-24 left-1/2 h-40 w-[520px] -translate-x-1/2 rounded-full bg-[#d6b56a]/10 blur-3xl" />

          {!ready ? (
            <div className="text-sm text-neutral-300">جاري التحميل…</div>
          ) : !sessionOk ? (
            <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              الرابط غير صالح أو منتهي. ارجعي واطلبي رابط جديد من “نسيت كلمة المرور”.
            </div>
          ) : (
            <div className="space-y-4">
              {status ? (
                <div
                  className={[
                    "rounded-2xl px-4 py-3 text-sm border",
                    status.type === "ok"
                      ? "border-[#d6b56a]/35 bg-[#d6b56a]/10 text-[#f3e0b0]"
                      : "border-rose-400/30 bg-rose-500/10 text-rose-100",
                  ].join(" ")}
                >
                  {status.text}
                </div>
              ) : null}

              <PasswordField
                label="كلمة المرور الجديدة"
                value={password}
                onChange={setPassword}
              />
              <PasswordField
                label="تأكيد كلمة المرور"
                value={confirm}
                onChange={setConfirm}
              />

              <button
                type="button"
                onClick={handleUpdatePassword}
                disabled={!canSubmit || saving}
                className="mt-2 w-full rounded-2xl border border-[#d6b56a]/45 bg-gradient-to-r from-[#d6b56a]/25 via-white/5 to-[#d6b56a]/15 py-3 text-sm font-extrabold text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition hover:border-[#d6b56a]/70 disabled:opacity-40 disabled:hover:border-[#d6b56a]/45"
              >
                {done ? "تم التحديث" : saving ? "جاري التحديث..." : "تحديث كلمة المرور"}
              </button>

              {done ? (
                <button
                  type="button"
                  onClick={() => router.push("/auth/login")}
                  className="w-full rounded-2xl border border-white/10 bg-black/20 py-3 text-sm font-extrabold text-white hover:bg-black/30 transition"
                >
                  رجوع لتسجيل الدخول
                </button>
              ) : null}
            </div>
          )}
        </div>

        <SiteFooter />
      </div>
    </main>
  );
}