// app/lib/recommendSize.ts

import {
  Product,
  AbayaSize,
  DEFAULT_ABAYA_HEIGHT_CHART,
} from "@/app/data/products";

type BodyMeasurements = {
  heightCm?: number;
  bustCm: number;
  waistCm: number;
  hipCm: number;
};

type SizeResult = {
  size: string;
  note: string;
};

const safe = (n: any) =>
  Number.isFinite(Number(n)) ? Number(n) : 0;

/* =========================
   عبايات – حسب الطول
========================= */
function recommendAbayaSize(
  product: Product,
  body: BodyMeasurements
): SizeResult {
  const h = safe(body.heightCm);
  if (!h) {
    return {
      size: "غير محدد",
      note: "أدخلي طولك عشان نحدد مقاس العباية بدقة.",
    };
  }

  const chart =
    product.abayaSizeChart || DEFAULT_ABAYA_HEIGHT_CHART;

  let closest = chart[0];
  let bestDiff = Infinity;

  for (const row of chart) {
    const [min, max] = row.height;
    let diff = 0;
    if (h < min) diff = min - h;
    else if (h > max) diff = h - max;

    if (diff < bestDiff) {
      bestDiff = diff;
      closest = row;
    }
  }

  return {
    size: String(closest.size),
    note:
      bestDiff === 0
        ? "مقاس مضبوط حسب طولك."
        : "مقاس قريب — لو تحبين العباية أطول أو أقصر عدّلي حسب ذوقك.",
  };
}

/* =========================
   فساتين / عام
========================= */
type Band = {
  label: string;
  bust: [number, number];
  waist: [number, number];
  hip: [number, number];
};

const BANDS: Band[] = [
  { label: "XS", bust: [78, 84], waist: [58, 64], hip: [84, 90] },
  { label: "S", bust: [84, 90], waist: [64, 70], hip: [90, 96] },
  { label: "M", bust: [90, 96], waist: [70, 76], hip: [96, 102] },
  { label: "L", bust: [96, 102], waist: [76, 84], hip: [102, 110] },
  { label: "XL", bust: [102, 110], waist: [84, 92], hip: [110, 118] },
  { label: "XXL", bust: [110, 118], waist: [92, 102], hip: [118, 128] },
];

export function recommendSize(
  product: Product,
  body: BodyMeasurements
): SizeResult {
  // ✅ لو عباية
  if (product.category === "abaya") {
    return recommendAbayaSize(product, body);
  }

  const bust = safe(body.bustCm);
  const waist = safe(body.waistCm);
  const hip = safe(body.hipCm);

  let best = BANDS[0];
  let score = Infinity;

  for (const b of BANDS) {
    const d =
      Math.abs(bust - (b.bust[0] + b.bust[1]) / 2) +
      Math.abs(waist - (b.waist[0] + b.waist[1]) / 2) +
      Math.abs(hip - (b.hip[0] + b.hip[1]) / 2);

    if (d < score) {
      score = d;
      best = b;
    }
  }

  let note = "مقاس محسوب حسب قياساتك.";

// أولوية الأرداف
if (hip > best.hip[1]) {
  note =
    "الأرداف أكبر من نطاق المقاس — يفضّل أخذ مقاس أعلى لو القصة ضيقة.";
}

// الصدر
else if (bust > best.bust[1]) {
  note =
    "محيط الصدر أكبر من نطاق المقاس — لو التصميم محدد من الأعلى قد تحتاجين مقاس أكبر.";
}

// الخصر
else if (waist > best.waist[1]) {
  note =
    "محيط الخصر أكبر من نطاق المقاس — الفساتين المحددة على الخصر قد تكون أضيق.";
}

  return { size: best.label, note };
}