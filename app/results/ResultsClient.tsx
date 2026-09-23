"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
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
import { useLanguage } from "@/app/components/LanguageProvider";

type BodyShape =
  | ""
  | BodyShapeArabic;

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

/* =========================
   Three dots
========================= */

function ThreeDotsButton({
  onClick,
  ariaLabel,
}: {
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        top:
          "calc(env(safe-area-inset-top, 0px) + 1.5rem)",
        right:
          "calc(env(safe-area-inset-right, 0px) + 1.5rem)",
      }}
      className={[
        "fixed z-30",
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
        <circle
          cx="5"
          cy="12"
          r="1.4"
        />

        <circle
          cx="12"
          cy="12"
          r="1.4"
        />

        <circle
          cx="19"
          cy="12"
          r="1.4"
        />
      </svg>
    </button>
  );
}

/* =========================
   History labels
   نخليها بالقيم الأصلية
========================= */

function occasionLabel(
  occasion: string
) {
  if (
    occasion === "wedding"
  ) {
    return "زواج";
  }

  if (
    occasion ===
    "engagement"
  ) {
    return "ملّكة / خطوبة";
  }

  if (
    occasion === "work"
  ) {
    return "عمل";
  }

  if (
    occasion === "event"
  ) {
    return "مناسبة";
  }

  if (
    occasion === "abaya"
  ) {
    return "عباية";
  }

  if (
    occasion === "ramadan"
  ) {
    return "رمضان";
  }

  if (
    occasion === "beach"
  ) {
    return "بحر";
  }

  if (
    occasion === "chalets"
  ) {
    return "شاليهات";
  }

  return "نتائج";
}

function subtitleFromParams(
  params: {
    weddingStyle?: string;
    depth?: string;
    undertone?: string;
    bodyShape?: string;
  }
) {
  const parts: string[] =
    [];

  if (
    params.weddingStyle
  ) {
    parts.push(
      `ستايل: ${params.weddingStyle}`
    );
  }

  if (params.depth) {
    parts.push(
      `العمق: ${params.depth}`
    );
  }

  if (
    params.undertone
  ) {
    parts.push(
      `الأندرتون: ${params.undertone}`
    );
  }

  if (
    params.bodyShape
  ) {
    parts.push(
      `شكل الجسم: ${params.bodyShape}`
    );
  }

  return parts.length
    ? parts.join(" • ")
    : "آخر تجربة محفوظة";
}

/* =========================
   Translate size output
========================= */

function translateSize(
  size: string,
  isArabic: boolean
) {
  if (isArabic) {
    return size;
  }

  if (
    size === "غير محدد"
  ) {
    return "Not determined";
  }

  return size;
}

function translateSizeNote(
  note: string,
  isArabic: boolean
) {
  if (isArabic) {
    return note;
  }

  const map: Record<
    string,
    string
  > = {
    "أدخلي طولك عشان نحدد مقاس العباية بدقة.":
      "Enter your height so we can suggest the most suitable abaya size.",

    "مقاس مضبوط حسب طولك.":
      "This size matches your height.",

    "مقاس قريب — لو تحبين العباية أطول أو أقصر عدّلي حسب ذوقك.":
      "This is the closest size based on your height. Adjust depending on whether you prefer your abaya longer or shorter.",

    "الأرداف أكبر من نطاق المقاس — يفضّل أخذ مقاس أعلى لو القصة ضيقة.":
      "Your hip measurement is above this size range. Consider sizing up if the fit is narrow.",

    "الأرداف أصغر من نطاق المقاس — لو تحبين القصة ضيقة ممكن مقاس أصغر (حسب التصميم).":
      "Your hip measurement is below this size range. A smaller size may work if you prefer a closer fit, depending on the design.",

    "محيط الصدر أكبر من نطاق المقاس — لو التصميم محدد من الأعلى قد تحتاجين مقاس أكبر.":
      "Your bust measurement is above this size range. You may need a larger size if the design is fitted at the top.",

    "محيط الصدر أصغر من نطاق المقاس — لو تحبين القصة ضيقة ممكن مقاس أصغر (حسب التصميم).":
      "Your bust measurement is below this size range. A smaller size may work if you prefer a closer fit, depending on the design.",

    "محيط الخصر أكبر من نطاق المقاس — الفساتين المحددة على الخصر قد تكون أضيق.":
      "Your waist measurement is above this size range. Fitted-waist styles may feel tighter.",

    "محيط الخصر أصغر من نطاق المقاس — لو التصميم محدد على الخصر ممكن مقاس أصغر يناسبك.":
      "Your waist measurement is below this size range. A smaller size may suit you if the design is fitted at the waist.",

    "مقاس محسوب حسب قياساتك.":
      "Suggested based on your measurements.",

    "أكملي قياسات الصدر والخصر والأرداف عشان نطلع لك المقاس بدقة.":
      "Complete your bust, waist, and hip measurements so we can suggest a size more accurately.",
  };

  return map[note] || note;
}

/* =========================
   Main Results
========================= */

export default function ResultsClient({
  initialParams = {},
}: {
  initialParams?: InitialParams;
}) {
  const sp =
    useSearchParams();

  const router =
    useRouter();

  const {
    isArabic,
    direction,
  } = useLanguage();

  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false);

  const occasion =
    ((
      initialParams.occasion ??
      sp.get("occasion") ??
      ""
    ) as Occasion | "");

  const weddingStyle =
    ((
      initialParams.weddingStyle ??
      sp.get(
        "weddingStyle"
      ) ??
      ""
    ) as
      | WeddingStyle
      | "");

  const depth =
    initialParams.depth ??
    sp.get("depth") ??
    "";

  const undertone =
    initialParams.undertone ??
    sp.get(
      "undertone"
    ) ??
    "";

  const height =
    Number(
      initialParams.height ??
        sp.get("height") ??
        0
    );

  const bust =
    Number(
      initialParams.bust ??
        sp.get("bust") ??
        0
    );

  const waist =
    Number(
      initialParams.waist ??
        sp.get("waist") ??
        0
    );

  const hip =
    Number(
      initialParams.hip ??
        sp.get("hip") ??
        0
    );

  const bodyShape =
    ((
      initialParams.bodyShape ??
      sp.get(
        "bodyShape"
      ) ??
      ""
    ) as BodyShape);

  const queryString =
    useMemo(
      () => sp.toString(),
      [sp]
    );

  /*
    يمنع حفظ نفس
    النتيجة أكثر من مرة
  */
  const savedOnceRef =
    useRef<string>("");

  /* =========================
     Save history
  ========================= */

  useEffect(() => {
    if (!occasion) {
      return;
    }

    const query =
      `/results?${queryString}`;

    if (
      savedOnceRef.current ===
      query
    ) {
      return;
    }

    savedOnceRef.current =
      query;

    let cancelled =
      false;

    (async () => {
      try {
        const { data } =
          await supabase.auth.getSession();

        const user =
          data.session?.user;

        if (!user) {
          return;
        }

        const title =
          occasionLabel(
            String(
              occasion
            )
          );

        const subtitle =
          occasion ===
          "abaya"
            ? subtitleFromParams(
                {
                  weddingStyle:
                    "",
                  depth,
                  undertone,
                  bodyShape:
                    bodyShape ||
                    "",
                }
              )
            : subtitleFromParams(
                {
                  weddingStyle:
                    weddingStyle ||
                    "",
                  depth,
                  undertone,
                }
              );

        /*
          نتأكد أول أن
          نفس النتيجة مو محفوظة
        */
        const {
          data: exists,
          error:
            existsErr,
        } =
          await supabase
            .from(
              "fazaa_history"
            )
            .select("id")
            .eq(
              "user_id",
              user.id
            )
            .eq(
              "query",
              query
            )
            .limit(1);

        if (cancelled) {
          return;
        }

        if (
          !existsErr &&
          exists &&
          exists.length > 0
        ) {
          return;
        }

        const { error } =
          await supabase
            .from(
              "fazaa_history"
            )
            .insert({
              user_id:
                user.id,
              title,
              subtitle,
              query,
            });

        if (cancelled) {
          return;
        }

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
  }, [
    occasion,
    weddingStyle,
    depth,
    undertone,
    bodyShape,
    queryString,
  ]);

  /* =========================
     Best 6 products
  ========================= */

  const top6 =
    useMemo(() => {
      if (!occasion) {
        return [];
      }

      return products
        .filter((product) => {
          /*
            لازم المناسبة
            تطابق
          */
          if (
            product.occasion !==
            occasion
          ) {
            return false;
          }

          /*
            الزواج لازم
            يطابق الستايل
          */
          if (
            occasion ===
              "wedding" &&
            product.weddingStyle !==
              weddingStyle
          ) {
            return false;
          }

          /*
            إذا عباية:
            نعرض عبايات فقط
          */
          if (
            occasion ===
              "abaya" &&
            product.category !==
              "abaya"
          ) {
            return false;
          }

          /*
            باقي المناسبات:
            لا نعرض عبايات
          */
          if (
            occasion !==
              "abaya" &&
            product.category ===
              "abaya"
          ) {
            return false;
          }

          return true;
        })
        .map(
          (product) => {
            /*
              هذا نفس منطق
              مشروعك الحالي لاختيار
              الأقرب للمدخلات.
              ما نعرض أي نقاط للمستخدمة.
            */
            let match = 4;

            if (
              depth &&
              product.bestFor
                ?.depth?.includes(
                  depth as any
                )
            ) {
              match += 3;
            }

            if (
              undertone &&
              product.bestFor
                ?.undertone?.includes(
                  undertone as any
                )
            ) {
              match += 3;
            }

            if (
              occasion ===
                "abaya" &&
              bodyShape &&
              product.abayaBestForShapes?.includes(
                bodyShape
              )
            ) {
              match += 6;
            }

            return {
              product,
              match,
            };
          }
        )
        .sort(
          (a, b) =>
            b.match -
            a.match
        )
        .slice(0, 6)
        .map(
          (item) =>
            item.product
        );
    }, [
      occasion,
      weddingStyle,
      depth,
      undertone,
      bodyShape,
    ]);

  return (
    <main
      dir={direction}
      className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black px-6 py-10"
    >
      {/* Three dots */}
      <ThreeDotsButton
        onClick={() =>
          setMenuOpen(true)
        }
        ariaLabel={
          isArabic
            ? "القائمة"
            : "Menu"
        }
      />

      {/* Drawer */}
      <FazaaDrawer
        open={menuOpen}
        onClose={() =>
          setMenuOpen(false)
        }
      />

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center">
          <p className="text-sm text-neutral-400">
            {isArabic
              ? "نتائجك"
              : "Your Results"}
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-white">
            {isArabic
              ? "إطلالات مختارة بذوق فزعة"
              : "Looks Selected the Fazaa Way"}
          </h1>

          <p className="mt-3 text-sm text-neutral-400">
            {isArabic
              ? "مختارة لك بعناية لتناسب مناسبتك، لون بشرتك، ومقاسك ✨"
              : "Carefully selected to suit your occasion, skin tone, and measurements ✨"}
          </p>
        </div>

        {/* Results */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {top6.map(
            (product) => {
              const rec =
                recommendSize(
                  product,
                  {
                    heightCm:
                      height,
                    bustCm:
                      bust,
                    waistCm:
                      waist,
                    hipCm:
                      hip,
                  }
                );

              const deal =
                STORE_MAP[
                  product.store
                ];

              return (
                <LuxuryCard
                  key={
                    product.id
                  }
                  product={
                    product
                  }
                  recommendedSize={translateSize(
                    rec.size,
                    isArabic
                  )}
                  sizeNote={translateSizeNote(
                    rec.note,
                    isArabic
                  )}
                  deal={
                    deal
                  }
                  isArabic={
                    isArabic
                  }
                />
              );
            }
          )}
        </div>

        <SiteFooter />
      </div>

      {/* Back */}
      <button
        type="button"
        onClick={() =>
          router.back()
        }
        aria-label={
          isArabic
            ? "رجوع"
            : "Back"
        }
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
          strokeWidth={
            2.5
          }
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d={
              isArabic
                ? "M10 7l5 5-5 5"
                : "M14 7l-5 5 5 5"
            }
          />
        </svg>
      </button>
    </main>
  );
}

/* =========================
   Product card
========================= */

function LuxuryCard({
  product,
  recommendedSize,
  sizeNote,
  deal,
  isArabic,
}: {
  product: Product;
  recommendedSize: string;
  sizeNote: string;

  deal?: {
    discountCode?: string;
    discountLabel?: string;
    affiliateBaseUrl?: string;
  };

  isArabic: boolean;
}) {
  const finalUrl =
    deal?.affiliateBaseUrl ||
    product.url;

  const [
    copied,
    setCopied,
  ] = useState(false);

  async function copyCode() {
    if (
      !deal?.discountCode
    ) {
      return;
    }

    await navigator.clipboard.writeText(
      deal.discountCode
    );

    setCopied(true);

    setTimeout(
      () =>
        setCopied(false),
      1800
    );
  }

  return (
    <div className="rounded-3xl border border-[#d6b56a]/35 bg-white/5 p-4 backdrop-blur">
      <img
        src={
          product.image
        }
        alt={
          product.title
        }
        className="h-64 w-full object-cover rounded-2xl border border-white/10"
        loading="lazy"
      />

      <div className="mt-4">
        {/* اسم المنتج يبقى اسم المتجر الأصلي */}
        <h3 className="text-white font-semibold">
          {product.title}
        </h3>

        <p className="text-neutral-400 text-sm">
          {product.store}
        </p>

        <div className="mt-3 flex justify-between items-center gap-3">
          <p className="text-lg font-bold text-white">
            {product.priceSar}{" "}
            <span className="text-sm text-neutral-300">
              {isArabic
                ? "ر.س"
                : "SAR"}
            </span>
          </p>

          <span className="rounded-full border border-[#d6b56a]/40 bg-[#d6b56a]/10 px-3 py-1 text-xs font-semibold text-[#f3e0b0]">
            {isArabic
              ? `المقاس المقترح: ${recommendedSize}`
              : `Suggested size: ${recommendedSize}`}
          </span>
        </div>

        {/* Discount */}
        {deal?.discountCode && (
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={
                copyCode
              }
              aria-label={
                isArabic
                  ? "نسخ كود الخصم"
                  : "Copy discount code"
              }
              className="rounded-full border border-[#d6b56a]/40 bg-[#d6b56a]/10 px-3 py-1 text-xs font-semibold text-[#f3e0b0]"
            >
              {copied
                ? isArabic
                  ? "تم النسخ ✓"
                  : "Copied ✓"
                : deal.discountCode}
            </button>
          </div>
        )}

        {sizeNote && (
          <p className="mt-2 text-xs text-neutral-400 leading-5">
            {sizeNote}
          </p>
        )}

        <a
          href={finalUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex w-full justify-center rounded-2xl border border-[#d6b56a]/45 bg-gradient-to-r from-[#d6b56a]/25 via-white/5 to-[#d6b56a]/10 py-3 text-sm font-extrabold text-white"
        >
          {isArabic
            ? "لتصفح المنتج"
            : "View Product"}
        </a>
      </div>
    </div>
  );
}