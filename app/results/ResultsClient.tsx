"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  products,
  type Product,
  type BodyShapeArabic,
  type Occasion,
  type WeddingStyle,
} from "@/app/data/products";
import { recommendSize } from "@/app/lib/recommendSize";
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
  // ✅ هذا هو اللي يمنع خطأ Typescript حتى لو ما انرسل شي
  initialParams = {},
}: {
  initialParams?: InitialParams;
}) {
  const sp = useSearchParams();

  const occasion = ((initialParams.occasion ?? sp.get("occasion") ?? "") as Occasion | "");
  const weddingStyle = ((initialParams.weddingStyle ?? sp.get("weddingStyle") ?? "") as WeddingStyle | "");

  const depth = initialParams.depth ?? sp.get("depth") ?? "";
  const undertone = initialParams.undertone ?? sp.get("undertone") ?? "";

  const height = Number(initialParams.height ?? sp.get("height") ?? 0);
  const bust = Number(initialParams.bust ?? sp.get("bust") ?? 0);
  const waist = Number(initialParams.waist ?? sp.get("waist") ?? 0);
  const hip = Number(initialParams.hip ?? sp.get("hip") ?? 0);

  const bodyShape = ((initialParams.bodyShape ?? sp.get("bodyShape") ?? "") as BodyShape);

  const top6 = useMemo(() => {
    if (!occasion) return [];

    const filtered = products.filter((p) => {
      if (p.occasion !== occasion) return false;

      if (occasion !== "abaya" && p.category === "abaya") return false;
      if (occasion === "abaya" && p.category !== "abaya") return false;

      if (occasion === "wedding") {
        if (!weddingStyle) return false;
        if (!p.weddingStyle) return false;
        if (p.weddingStyle !== weddingStyle) return false;
      }

      return true;
    });

    const scored = filtered.map((p) => {
      let score = 4;

      if (depth && p.bestFor?.depth?.includes(depth as any)) score += 3;
      if (undertone && p.bestFor?.undertone?.includes(undertone as any)) score += 3;

      if (occasion === "abaya" && bodyShape) {
        if (p.abayaBestForShapes?.includes(bodyShape)) score += 6;
        else score += 1;
      }

      return { p, score };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((x) => x.p);
  }, [occasion, weddingStyle, depth, undertone, bodyShape]);

  const explainText = useMemo(() => {
    const parts: string[] = [];

    if (occasion) parts.push(`المناسبة: ${OCCASION_LABEL[occasion] || occasion}`);
    if (occasion === "wedding" && weddingStyle) parts.push(`ستايل الزفاف: ${weddingStyle}`);
    if (depth) parts.push(`درجة البشرة: ${depth}`);
    if (undertone) parts.push(`الأندرتون: ${undertone}`);
    if (occasion === "abaya" && bodyShape) parts.push(`شكل الجسم: ${bodyShape}`);

    return parts.join(" • ");
  }, [occasion, weddingStyle, depth, undertone, bodyShape]);

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black px-6 py-10"
    >
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm text-neutral-400">نتائجك</p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white">
            اخترنا لك اطلالات تليق بك
          </h1>

          <p className="mt-3 text-sm text-neutral-400">
            هذه الإطلالات تم اختيارها بناءً على اختياراتك، لتظهر عليك بأفضل شكل ممكن.
          </p>

          {explainText ? (
            <p className="mt-3 text-xs text-neutral-500">
              <span className="text-neutral-300">{explainText}</span>
            </p>
          ) : null}

          {occasion === "abaya" ? (
            <p className="mt-3 text-xs text-neutral-500">
              * العبايات تُرتّب حسب شكل الجسم.
            </p>
          ) : null}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {top6.map((p) => {
            const rec = recommendSize(p, {
              heightCm: height,
              bustCm: bust,
              waistCm: waist,
              hipCm: hip,
            });

            return (
              <LuxuryCard
                key={p.id}
                p={p}
                recommendedSize={rec.size}
                sizeNote={rec.note}
                occasion={occasion}
                bodyShape={bodyShape}
              />
            );
          })}
        </div>

        {top6.length === 0 ? (
          <div className="mt-10 text-center text-neutral-300">
            ما لقينا نتائج تناسب اختياراتك حاليًا.
          </div>
        ) : null}

        {/* ✅ Footer موحّد */}
        <SiteFooter />
      </div>
    </main>
  );
}

function LuxuryCard({
  p,
  recommendedSize,
  sizeNote,
  occasion,
  bodyShape,
}: {
  p: Product;
  recommendedSize: string;
  sizeNote: string;
  occasion: "" | Occasion;
  bodyShape: "" | BodyShapeArabic;
}) {
  const why =
    occasion === "abaya" && bodyShape
      ? `تناسب شكل جسمك (${bodyShape}) + محسوبة على طولك`
      : "ألوان مناسبة لبشرتك + مقاس محسوب على قياساتك";

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-[#d6b56a]/35 bg-white/5 p-4 shadow-[0_0_0_1px_rgba(214,181,106,0.12),0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur">
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-[#d6b56a]/25" />

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/40">
        <img
          src={p.image}
          alt={p.title}
          className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://via.placeholder.com/600x800?text=No+Image";
          }}
        />
      </div>

      <div className="mt-4">
        <h3 className="text-base font-semibold text-white">{p.title}</h3>
        <p className="mt-1 text-sm text-neutral-400">{p.store}</p>

        <p className="mt-2 text-xs text-neutral-400 leading-relaxed">{why}</p>

        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-lg font-bold text-white">
            {p.priceSar}{" "}
            <span className="text-sm font-semibold text-neutral-300">ر.س</span>
          </p>

          <span className="inline-flex items-center rounded-full border border-[#d6b56a]/40 bg-[#d6b56a]/10 px-3 py-1 text-xs font-semibold text-[#f3e0b0]">
            المقاس المقترح: {recommendedSize}
          </span>
        </div>

        {sizeNote ? (
          <p className="mt-2 text-xs text-neutral-400 leading-relaxed">{sizeNote}</p>
        ) : null}

        <a
          href={p.url}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex w-full items-center justify-center rounded-2xl border border-[#d6b56a]/45 bg-gradient-to-r from-[#d6b56a]/20 via-white/5 to-[#d6b56a]/15 px-4 py-3 text-sm font-bold text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition hover:border-[#d6b56a]/70"
        >
          روحي للمتجر
        </a>
      </div>
    </div>
  );
}