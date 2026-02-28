"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  products,
  type Product,
  type BodyShapeArabic,
  type Occasion,
  type WeddingStyle,
} from "@/app/data/products";
import { recommendSize } from "@/app/lib/recommendSize";
import { STORE_MAP } from "@/app/data/stores";
import SiteFooter from "@/app/components/FazaaFooter";
import FazaaDrawer from "@/app/components/fazaaDrawer";
import { supabase } from "@/app/lib/supabaseClient";

type BodyShape = "" | BodyShapeArabic;

type InitialParams = {
  occasion?: string;
  weddingStyle?: string;
  depth?: string;
  undertone?: string;
  height?: string;
  bust?: string;
  waist?: string;
  hip?: string;
  bodyShape?: string;
};

/* ===== زر الثلاث نقاط (أفقي) ===== */
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

/* ===== Labels (مطابقة لقيمك) ===== */
function occasionLabel(o: string) {
  if (o === "wedding") return "زواج";
  if (o === "engagement") return "ملّكة / خطوبة";
  if (o === "event") return "مناسبة";
  if (o === "abaya") return "عباية";
  if (o === "ramadan") return "رمضان";
  if (o === "beach") return "بحر";
  if (o === "chalets") return "شاليهات";
  return "نتائج";
}

function subtitleFromParams(params: {
  weddingStyle?: string;
  depth?: string;
  undertone?: string;
  bodyShape?: string;
}) {
  const parts: string[] = [];
  if (params.weddingStyle) parts.push(`ستايل: ${params.weddingStyle}`);
  if (params.depth) parts.push(`العمق: ${params.depth}`);
  if (params.undertone) parts.push(`الأندرتون: ${params.undertone}`);
  if (params.bodyShape) parts.push(`شكل الجسم: ${params.bodyShape}`);
  return parts.length ? parts.join(" • ") : "آخر تجربة محفوظة";
}

export default function ResultsClient({
  initialParams = {},
}: {
  initialParams?: InitialParams;
}) {
  const sp = useSearchParams();
  const router = useRouter();

  // ✅ Drawer state
  const [menuOpen, setMenuOpen] = useState(false);

  const occasion = ((initialParams.occasion ?? sp.get("occasion") ?? "") as
    | Occasion
    | "");

  const weddingStyle = ((initialParams.weddingStyle ??
    sp.get("weddingStyle") ??
    "") as WeddingStyle | "");

  const depth = initialParams.depth ?? sp.get("depth") ?? "";
  const undertone = initialParams.undertone ?? sp.get("undertone") ?? "";

  const height = Number(initialParams.height ?? sp.get("height") ?? 0);
  const bust = Number(initialParams.bust ?? sp.get("bust") ?? 0);
  const waist = Number(initialParams.waist ?? sp.get("waist") ?? 0);
  const hip = Number(initialParams.hip ?? sp.get("hip") ?? 0);

  const bodyShape = ((initialParams.bodyShape ??
    sp.get("bodyShape") ??
    "") as BodyShape);

  const queryString = useMemo(() => sp.toString(), [sp]);

  // ✅ يمنع الحفظ المكرر داخل نفس الصفحة
  const savedOnceRef = useRef<string>("");

  // ✅ حفظ الهستري في Supabase (إذا مسجل دخول) — بدون تكرار
  useEffect(() => {
    if (!occasion) return;

    const query = `/results?${queryString}`;

    // منع تكرار داخل نفس الرندر/التغييرات
    if (savedOnceRef.current === query) return;
    savedOnceRef.current = query;

    let cancelled = false;

    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const u = data.session?.user;
        if (!u) return;

        const title = occasionLabel(String(occasion));

        const subtitle =
          occasion === "abaya"
            ? subtitleFromParams({
                weddingStyle: "",
                depth,
                undertone,
                bodyShape: bodyShape || "",
              })
            : subtitleFromParams({
                weddingStyle: weddingStyle || "",
                depth,
                undertone,
              });

        // ✅ 1) شيّك إذا نفس query محفوظة قبل (عشان ما تتكرر)
        const { data: exists, error: existsErr } = await supabase
          .from("fazaa_history")
          .select("id")
          .eq("user_id", u.id)
          .eq("query", query)
          .limit(1);

        if (cancelled) return;
        if (existsErr) {
          // silent
        } else if (exists && exists.length > 0) {
          return; // موجودة مسبقًا
        }

        // ✅ 2) insert مرّة وحدة
        const { error } = await supabase.from("fazaa_history").insert({
          user_id: u.id,
          title,
          subtitle,
          query,
        });

        if (cancelled) return;
        if (error) {
          // silent
        }
      } catch {
        // silent
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [occasion, weddingStyle, depth, undertone, bodyShape, queryString]);

  const top6 = useMemo(() => {
    if (!occasion) return [];

    return products
      .filter((p) => {
        if (p.occasion !== occasion) return false;

        // زواج: لازم يطابق الستايل
        if (occasion === "wedding" && p.weddingStyle !== weddingStyle) return false;

        // عباية: بس abaya
        if (occasion === "abaya" && p.category !== "abaya") return false;

        // غير العباية: لا تعرض abaya
        if (occasion !== "abaya" && p.category === "abaya") return false;

        return true;
      })
      .map((p) => {
        let score = 4;

        if (depth && p.bestFor?.depth?.includes(depth as any)) score += 3;
        if (undertone && p.bestFor?.undertone?.includes(undertone as any)) score += 3;

        if (
          occasion === "abaya" &&
          bodyShape &&
          p.abayaBestForShapes?.includes(bodyShape)
        ) {
          score += 6;
        }

        return { p, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((x) => x.p);
  }, [occasion, weddingStyle, depth, undertone, bodyShape]);

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black px-6 py-10"
    >
      {/* ✅ الثلاث نقاط */}
      <ThreeDotsButton onClick={() => setMenuOpen(true)} />

      {/* ✅ Drawer (المفروض توقيعه open/onClose فقط) */}
      <FazaaDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm text-neutral-400">نتائجك</p>
          <h1 className="mt-2 text-3xl font-extrabold text-white">
            إطلالات مختارة بذوق فزعة
          </h1>
          <p className="mt-3 text-sm text-neutral-400">
            مختارة لك بعناية لتناسب مناسبتك، لون بشرتك، ومقاسك ✨
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {top6.map((p) => {
            const rec = recommendSize(p, {
              heightCm: height,
              bustCm: bust,
              waistCm: waist,
              hipCm: hip,
            });

            const deal = STORE_MAP[p.store];

            return (
              <LuxuryCard
                key={p.id}
                p={p}
                recommendedSize={rec.size}
                sizeNote={rec.note}
                deal={deal}
              />
            );
          })}
        </div>

        <SiteFooter />
      </div>

      {/* زر الرجوع */}
      <button
        type="button"
        onClick={() => router.back()}
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
    </main>
  );
}

function LuxuryCard({
  p,
  recommendedSize,
  sizeNote,
  deal,
}: {
  p: Product;
  recommendedSize: string;
  sizeNote: string;
  deal?: {
    discountCode?: string;
    discountLabel?: string;
    affiliateBaseUrl?: string;
  };
}) {
  const finalUrl = deal?.affiliateBaseUrl || p.url;
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    if (!deal?.discountCode) return;
    await navigator.clipboard.writeText(deal.discountCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="rounded-3xl border border-[#d6b56a]/35 bg-white/5 p-4 backdrop-blur">
      <img
        src={p.image}
        alt={p.title}
        className="h-64 w-full object-cover rounded-2xl border border-white/10"
        loading="lazy"
      />

      <div className="mt-4">
        <h3 className="text-white font-semibold">{p.title}</h3>
        <p className="text-neutral-400 text-sm">{p.store}</p>

        <div className="mt-3 flex justify-between items-center gap-3">
          <p className="text-lg font-bold text-white">
            {p.priceSar} <span className="text-sm text-neutral-300">ر.س</span>
          </p>

          <span className="rounded-full border border-[#d6b56a]/40 bg-[#d6b56a]/10 px-3 py-1 text-xs font-semibold text-[#f3e0b0]">
            المقاس المقترح: {recommendedSize}
          </span>
        </div>

        {deal?.discountCode && (
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={copyCode}
              className="rounded-full border border-[#d6b56a]/40 bg-[#d6b56a]/10 px-3 py-1 text-xs font-semibold text-[#f3e0b0]"
            >
              {copied ? "تم النسخ ✓" : deal.discountCode}
            </button>
          </div>
        )}

        {sizeNote && <p className="mt-2 text-xs text-neutral-400">{sizeNote}</p>}

        <a
          href={finalUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex w-full justify-center rounded-2xl border border-[#d6b56a]/45 bg-gradient-to-r from-[#d6b56a]/25 via-white/5 to-[#d6b56a]/10 py-3 text-sm font-extrabold text-white"
        >
          لتصفح المنتج
        </a>
      </div>
    </div>
  );
}