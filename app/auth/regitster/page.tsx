"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

function safeSet(key: string, val: string) {
  try {
    window.localStorage.setItem(key, val);
  } catch {}
}

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  function submit() {
    const e = email.trim().toLowerCase();
    const n = name.trim();

    if (!e || !e.includes("@")) return;

    // إنشاء حساب مبسط: نفس تسجيل الدخول (حاليًا Local)
    safeSet("fazaa_user", JSON.stringify({ email: e, name: n || e.split("@")[0] }));
    safeSet("fazaa_token", "local");

    router.push("/");
  }

  return (
    <main dir="rtl" className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-[22px] border border-amber-300/25 bg-white/5 backdrop-blur p-6">
        <div className="text-lg font-extrabold">إنشاء حساب</div>

        <div className="mt-4 space-y-3">
          <Field label="البريد الإلكتروني" value={email} onChange={setEmail} type="email" />
          <Field label="الاسم" value={name} onChange={setName} />
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={submit}
            className="flex-1 rounded-xl border border-[#d6b56a]/45 bg-gradient-to-r from-[#d6b56a]/20 via-white/5 to-[#d6b56a]/10 py-2.5 text-sm font-extrabold text-white hover:border-[#d6b56a]/70 transition"
          >
            إنشاء
          </button>

          <button
            onClick={() => router.push("/")}
            className="flex-1 rounded-xl border border-white/15 bg-white/5 py-2.5 text-sm font-extrabold text-white hover:bg-white/10 hover:border-white/25 transition"
          >
            رجوع
          </button>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <div className="text-[11px] font-semibold text-neutral-300">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={[
          "mt-1 w-full rounded-xl border px-3 py-2 text-sm font-semibold transition",
          "border-white/10 bg-neutral-950 text-white",
          "focus:border-[#d6b56a]/40 focus:ring-2 focus:ring-[#d6b56a]/10 outline-none",
        ].join(" ")}
      />
    </label>
  );
}