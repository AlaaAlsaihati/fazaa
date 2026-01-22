"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { products, type Product } from "@/app/data/products";
import { recommendSize } from "@/app/lib/recommendSize";

export default function ResultsClient() {
  const sp = useSearchParams();

  const occasion = sp.get("occasion") || "";
  const weddingStyle = sp.get("weddingStyle") || "";
  const depth = sp.get("depth") || "";
  const undertone = sp.get("undertone") || "";

  const bust = Number(sp.get("bust") || 0);
  const waist = Number(sp.get("waist") || 0);
  const hip = Number(sp.get("hip") || 0);

  const top6 = useMemo(() => {
    const filtered = products.filter((p) => {
      if (occasion && p.occasion !== occasion) return false;

      if (
        occasion === "wedding" &&
        weddingStyle &&
        p.weddingStyle &&
        p.weddingStyle !== weddingStyle
      )
        return false;

      return true;
    });

    const scored = filtered.map((p) => {
      let score = 0;
      score += 4;

      if (depth && p.bestFor?.depth?.includes(depth as any)) score += 3;
      if (undertone && p.bestFor?.undertone?.includes(undertone as any)) score += 3;

      return { p, score };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((x) => x.p);
  }, [occasion, weddingStyle, depth, undertone]);

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black px-6 py-10"
    >
      <div className="mx-auto max-w-6xl">
        {/* عنوان + وصف */}
        <div className="text-center">
          <p className="text-sm text-neutral-400">نتائجك</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white">
            اخترنا لك اطلالات تليق بك
          </h1>
          <p className="mt-3 text-sm text-neutral-400">
            حسب اختياراتك:{" "}
            <span className="text-neutral-200">
              {occasion}
              {weddingStyle ? ` • ${weddingStyle}` : ""}{" "}
              {depth ? ` • ${depth}` : ""}{" "}
              {undertone ? ` • ${undertone}` : ""}
            </span>
          </p>
        </div>

        {/* Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {top6.map((p) => {
            const rec = recommendSize(p, {
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
              />
            );
          })}
        </div>

        {/* لا توجد نتائج */}
        {top6.length === 0 ? (
          <div className="mt-10 text-center text-neutral-300">
            ما لقينا نتائج تناسب اختياراتك حاليًا.
          </div>
        ) : null}
      </div>
    </main>
  );
}

function LuxuryCard({
  p,
  recommendedSize,
  sizeNote,
}: {
  p: Product;
  recommendedSize: string;
  sizeNote: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-[#d6b56a]/35 bg-white/5 p-4 shadow-[0_0_0_1px_rgba(214,181,106,0.12),0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur">
      {/* إطار ذهبي حول الكرت */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-[#d6b56a]/25" />

      {/* لمعة خفيفة على الكرت (مو الخلفية) */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-40 w-[520px] -translate-x-1/2 rounded-full bg-[#d6b56a]/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* صورة */}
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

      {/* نصوص */}
      <div className="mt-4">
        <h3 className="text-base font-semibold text-white">{p.title}</h3>
        <p className="mt-1 text-sm text-neutral-400">{p.store}</p>

        {/* سعر + المقاس المقترح */}
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

        {/* زر المتجر */}
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