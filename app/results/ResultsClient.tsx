"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
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

const OCCASION_LABEL: Record<string, string> = {
  wedding: "زواج",
  engagement: "خطوبة",
  work: "عمل",
  abaya: "عبايات",
  ramadan: "غبقة / رمضان",
  beach: "بحر",
  chalets: "شاليهات",
};

export default function ResultsClient({
  initialParams = {},
}: {
  initialParams?: InitialParams;
}) {
  const sp = useSearchParams();

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

  const top6 = useMemo(() => {
    if (!occasion) return [];

    return products
      .filter((p) => {
        if (p.occasion !== occasion) return false;
        if (occasion === "wedding" && p.weddingStyle !== weddingStyle)
          return false;
        if (occasion === "abaya" && p.category !== "abaya") return false;
        if (occasion !== "abaya" && p.category === "abaya") return false;
        return true;
      })
      .map((p) => {
        let score = 4;
        if (depth && p.bestFor?.depth?.includes(depth as any)) score += 3;
        if (undertone && p.bestFor?.undertone?.includes(undertone as any))
          score += 3;
        if (
          occasion === "abaya" &&
          bodyShape &&
          p.abayaBestForShapes?.includes(bodyShape)
        )
          score += 6;
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
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm text-neutral-400">نتائجك</p>
          <h1 className="mt-2 text-3xl font-extrabold text-white">
            إطلالات مختارة بذوق فزعة
          </h1>
          <p className="mt-3 text-sm text-neutral-400">
            اخترناها لك بعناية لتناسبك من كل ناحية ✨
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
    try {
      await navigator.clipboard.writeText(deal.discountCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // fallback بسيط لو المتصفح منع clipboard
      const ta = document.createElement("textarea");
      ta.value = deal.discountCode;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  }

  return (
    <div className="rounded-3xl border border-[#d6b56a]/35 bg-white/5 p-4 shadow-[0_0_0_1px_rgba(214,181,106,0.12),0_18px_55px_rgba(0,0,0,0.55)] backdrop-blur">
      <img
        src={p.image}
        alt={p.title}
        className="h-64 w-full object-cover rounded-2xl border border-white/10"
        loading="lazy"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src =
            "https://via.placeholder.com/600x800?text=No+Image";
        }}
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

        {/* ✅ كود الخصم تحت السعر مع زر نسخ */}
        {deal?.discountCode ? (
          <div className="mt-3 rounded-2xl border border-[#d6b56a]/30 bg-[#d6b56a]/10 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-[#f3e0b0]">
                <span className="text-neutral-300">
                  {deal.discountLabel || "كود خصم"}
                </span>
                <span className="text-neutral-400">:</span>{" "}
                <b className="tracking-widest">{deal.discountCode}</b>
              </div>

              <button
                type="button"
                onClick={copyCode}
                className={[
                  "shrink-0 rounded-xl border px-3 py-2 text-xs font-bold transition",
                  "border-[#d6b56a]/45 bg-black/20 text-white hover:bg-black/30",
                ].join(" ")}
              >
                {copied ? "تم النسخ ✓" : "نسخ"}
              </button>
            </div>
          </div>
        ) : null}

        {sizeNote ? (
          <p className="mt-2 text-xs text-neutral-400">{sizeNote}</p>
        ) : null}

        <a
          href={finalUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex w-full justify-center rounded-2xl border border-[#d6b56a]/45 bg-gradient-to-r from-[#d6b56a]/25 via-white/5 to-[#d6b56a]/10 py-3 text-sm font-extrabold text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition hover:border-[#d6b56a]/70"
        >
          لتصفح المنتج
        </a>
      </div>
    </div>
  );
}