"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import SiteFooter from "@/app/components/FazaaFooter";
import { useLanguage } from "@/app/components/LanguageProvider";

function PasswordField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-white">
        {label}
      </span>

      <input
        type="password"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-3 text-base md:text-sm text-white outline-none focus:border-[#d6b56a]/40 focus:ring-2 focus:ring-[#d6b56a]/10"
        placeholder="********"
        autoComplete="new-password"
      />
    </label>
  );
}

function getFriendlyResetError(
  error: unknown,
  isArabic: boolean
) {
  let code = "";
  let message = "";

  if (
    error &&
    typeof error === "object"
  ) {
    if (
      "code" in error &&
      typeof (
        error as {
          code?: unknown;
        }
      ).code === "string"
    ) {
      code = (
        error as {
          code: string;
        }
      ).code;
    }

    if (
      "message" in error &&
      typeof (
        error as {
          message?: unknown;
        }
      ).message === "string"
    ) {
      message = (
        error as {
          message: string;
        }
      ).message;
    }
  }

  const normalized =
    message.toLowerCase();

  if (
    code ===
      "same_password" ||
    normalized.includes(
      "same password"
    )
  ) {
    return isArabic
      ? "كلمة المرور الجديدة لازم تكون مختلفة عن كلمة المرور السابقة."
      : "Your new password must be different from your previous password.";
  }

  if (
    code ===
      "weak_password" ||
    normalized.includes(
      "password should"
    ) ||
    normalized.includes(
      "weak password"
    )
  ) {
    return isArabic
      ? "كلمة المرور لا تستوفي متطلبات الأمان. اختاري كلمة مرور أقوى."
      : "The password does not meet the security requirements. Choose a stronger password.";
  }

  if (
    normalized.includes(
      "expired"
    ) ||
    normalized.includes(
      "invalid"
    )
  ) {
    return isArabic
      ? "رابط الاستعادة غير صالح أو انتهت صلاحيته. اطلبي رابطًا جديدًا."
      : "The recovery link is invalid or has expired. Please request a new one.";
  }

  return isArabic
    ? "تعذر تحديث كلمة المرور. حاولي مرة ثانية."
    : "Unable to update your password. Please try again.";
}

export default function ResetPasswordPage() {
  const router =
    useRouter();

  const {
    isArabic,
    direction,
  } = useLanguage();

  const [
    ready,
    setReady,
  ] = useState(false);

  const [
    sessionOk,
    setSessionOk,
  ] = useState(false);

  const [
    recoveryDetected,
    setRecoveryDetected,
  ] = useState(false);

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    confirm,
    setConfirm,
  ] = useState("");

  const [
    status,
    setStatus,
  ] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    done,
    setDone,
  ] = useState(false);

  /* =========================
     Recovery session
  ========================= */

  useEffect(() => {
    let mounted = true;

    /*
      نسجل الـlistener أولًا حتى ما نفوت
      PASSWORD_RECOVERY عند فتح الرابط.
    */
    const {
      data: listener,
    } =
      supabase.auth.onAuthStateChange(
        (
          event,
          session
        ) => {
          if (!mounted) {
            return;
          }

          if (
            event ===
            "PASSWORD_RECOVERY"
          ) {
            setRecoveryDetected(
              true
            );

            setSessionOk(
              !!session?.user
            );

            setReady(true);

            return;
          }

          if (
            event ===
            "SIGNED_OUT"
          ) {
            if (!done) {
              setSessionOk(
                false
              );
            }

            return;
          }

          if (
            session?.user
          ) {
            setSessionOk(
              true
            );
          }
        }
      );

    /*
      fallback:
      بعض المتصفحات تنشئ Session من رابط
      الاستعادة قبل تشغيل الـeffect.
    */
    (async () => {
      try {
        const {
          data,
        } =
          await supabase.auth.getSession();

        if (!mounted) {
          return;
        }

        if (
          data.session?.user
        ) {
          setSessionOk(
            true
          );
        }
      } finally {
        if (mounted) {
          setReady(true);
        }
      }
    })();

    /*
      وجود token/code في عنوان صفحة
      الاستعادة دليل إضافي إن المستخدم
      جاء من رابط الإيميل.
    */
    try {
      const url =
        new URL(
          window.location.href
        );

      const hash =
        url.hash.toLowerCase();

      if (
        hash.includes(
          "type=recovery"
        ) ||
        url.searchParams.has(
          "code"
        ) ||
        url.searchParams.get(
          "type"
        ) === "recovery"
      ) {
        setRecoveryDetected(
          true
        );
      }
    } catch {
      // ignore
    }

    return () => {
      mounted = false;

      listener.subscription.unsubscribe();
    };
  }, [done]);

  /* =========================
     Validation
  ========================= */

  const canSubmit =
    useMemo(() => {
      if (done) {
        return false;
      }

      if (
        !sessionOk
      ) {
        return false;
      }

      if (
        !password ||
        password.length < 6
      ) {
        return false;
      }

      if (
        password !== confirm
      ) {
        return false;
      }

      return true;
    }, [
      password,
      confirm,
      done,
      sessionOk,
    ]);

  /* =========================
     Update password
  ========================= */

  async function handleUpdatePassword() {
    setStatus(null);

    if (!sessionOk) {
      setStatus({
        type: "err",

        text: isArabic
          ? "رابط الاستعادة غير صالح أو انتهت صلاحيته. ارجعي للتطبيق واطلبي رابطًا جديدًا."
          : "The recovery link is invalid or has expired. Return to the app and request a new one.",
      });

      return;
    }

    if (!password) {
      setStatus({
        type: "err",

        text: isArabic
          ? "اكتبي كلمة المرور الجديدة."
          : "Enter your new password.",
      });

      return;
    }

    if (
      password.length < 6
    ) {
      setStatus({
        type: "err",

        text: isArabic
          ? "كلمة المرور لازم تكون 6 أحرف على الأقل."
          : "Password must be at least 6 characters.",
      });

      return;
    }

    if (
      password !== confirm
    ) {
      setStatus({
        type: "err",

        text: isArabic
          ? "كلمتا المرور غير متطابقتين."
          : "Passwords do not match.",
      });

      return;
    }

    if (!canSubmit) {
      return;
    }

    try {
      setSaving(true);

      const {
        error,
      } =
        await supabase.auth.updateUser(
          {
            password,
          }
        );

      if (error) {
        throw error;
      }

      /*
        بعد نجاح تغيير كلمة المرور
        نخرج من جلسة الاستعادة حتى
        تسجل المستخدمة دخول طبيعي
        بكلمة المرور الجديدة.
      */
      try {
        await supabase.auth.signOut();
      } catch {
        // password already updated
      }

      setDone(true);

      setPassword("");
      setConfirm("");

      setStatus({
        type: "ok",

        text: isArabic
          ? "تم تحديث كلمة المرور بنجاح."
          : "Your password has been updated successfully.",
      });
    } catch (
      error: unknown
    ) {
      setStatus({
        type: "err",

        text:
          getFriendlyResetError(
            error,
            isArabic
          ),
      });
    } finally {
      setSaving(false);
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
      <div className="mx-auto max-w-xl">
        <header className="mb-6 text-center">
          <p className="text-sm text-neutral-400">
            {isArabic
              ? "استعادة الحساب"
              : "Account Recovery"}
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white">
            {isArabic
              ? "تعيين كلمة مرور جديدة"
              : "Set a New Password"}
          </h1>

          <p className="mt-3 text-sm text-neutral-400">
            {isArabic
              ? "اختاري كلمة مرور جديدة لحسابك."
              : "Choose a new password for your account."}
          </p>
        </header>

        <div className="relative overflow-hidden rounded-3xl border border-[#d6b56a]/35 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(214,181,106,0.12),0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur">
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-[#d6b56a]/22" />

          <div className="pointer-events-none absolute -top-24 left-1/2 h-40 w-[520px] -translate-x-1/2 rounded-full bg-[#d6b56a]/10 blur-3xl" />

          {!ready ? (
            <div className="text-sm text-neutral-300">
              {isArabic
                ? "جاري التحميل…"
                : "Loading…"}
            </div>
          ) : !sessionOk &&
            !done ? (
            <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm leading-6 text-rose-100">
              {isArabic
                ? "رابط الاستعادة غير صالح أو منتهي. ارجعي للتطبيق واطلبي رابطًا جديدًا من «نسيت كلمة المرور»."
                : "This recovery link is invalid or has expired. Return to the app and request a new link using “Forgot password?”"}
            </div>
          ) : (
            <div className="space-y-4">
              {status ? (
                <div
                  className={[
                    "rounded-2xl border px-4 py-3 text-sm leading-6",

                    status.type ===
                    "ok"
                      ? "border-[#d6b56a]/35 bg-[#d6b56a]/10 text-[#f3e0b0]"
                      : "border-rose-400/30 bg-rose-500/10 text-rose-100",
                  ].join(
                    " "
                  )}
                >
                  {
                    status.text
                  }
                </div>
              ) : null}

              {!done ? (
                <>
                  <PasswordField
                    label={
                      isArabic
                        ? "كلمة المرور الجديدة"
                        : "New Password"
                    }
                    value={
                      password
                    }
                    onChange={
                      setPassword
                    }
                  />

                  <PasswordField
                    label={
                      isArabic
                        ? "تأكيد كلمة المرور"
                        : "Confirm Password"
                    }
                    value={
                      confirm
                    }
                    onChange={
                      setConfirm
                    }
                  />

                  <p className="text-[11px] text-neutral-400">
                    {isArabic
                      ? "يجب أن تكون كلمة المرور 6 أحرف على الأقل."
                      : "Password must be at least 6 characters."}
                  </p>

                  <button
                    type="button"
                    onClick={
                      handleUpdatePassword
                    }
                    disabled={
                      !canSubmit ||
                      saving
                    }
                    className="mt-2 w-full rounded-2xl border border-[#d6b56a]/45 bg-gradient-to-r from-[#d6b56a]/25 via-white/5 to-[#d6b56a]/15 py-3 text-sm font-extrabold text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition hover:border-[#d6b56a]/70 disabled:opacity-40 disabled:hover:border-[#d6b56a]/45"
                  >
                    {saving
                      ? isArabic
                        ? "جاري التحديث..."
                        : "Updating..."
                      : isArabic
                      ? "تحديث كلمة المرور"
                      : "Update Password"}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    router.replace(
                      "/"
                    )
                  }
                  className="w-full rounded-2xl border border-[#d6b56a]/45 bg-[#d6b56a]/15 py-3 text-sm font-extrabold text-white transition hover:border-[#d6b56a]/70"
                >
                  {isArabic
                    ? "العودة إلى فزعة"
                    : "Return to Fazaa"}
                </button>
              )}
            </div>
          )}
        </div>

        <SiteFooter />
      </div>
    </main>
  );
}