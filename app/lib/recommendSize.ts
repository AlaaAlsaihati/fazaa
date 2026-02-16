/// app/lib/recommendSize.ts

import {
  Product,
  DEFAULT_ABAYA_HEIGHT_CHART,
} from "@/app/data/products";

type Unit = "cm" | "in";

type BodyMeasurements = {
  // الطول دائمًا سم عندك (لكن نخليه مرن)
  heightCm?: number;

  // القياسات الأساسية (نعتبرها سم، لكن لو unit=in نحولها داخل الدالة)
  bustCm?: number;
  waistCm?: number;
  hipCm?: number;

  // اختياري للمستقبل/لو وصل بالغلط
  unit?: Unit;
};

type SizeResult = {
  size: string;
  note: string;
};

const safe = (n: any) => (Number.isFinite(Number(n)) ? Number(n) : 0);

function inToCm(vIn: number) {
  return vIn * 2.54;
}

function normalizeBody(body: BodyMeasurements) {
  const unit: Unit = body.unit === "in" ? "in" : "cm";

  const bustRaw = safe(body.bustCm);
  const waistRaw = safe(body.waistCm);
  const hipRaw = safe(body.hipCm);

  // ✅ لو الوحدة إنش نحول هنا (عشان باقي المنطق يبقى على سم)
  const bust = unit === "in" ? inToCm(bustRaw) : bustRaw;
  const waist = unit === "in" ? inToCm(waistRaw) : waistRaw;
  const hip = unit === "in" ? inToCm(hipRaw) : hipRaw;

  const height = safe(body.heightCm);

  // تقريب بسيط (مو ضروري لكنه يخلي المخرجات أنظف)
  const round1 = (x: number) => Math.round(x * 10) / 10;

  return {
    unit,
    heightCm: height || 0,
    bustCm: round1(bust),
    waistCm: round1(waist),
    hipCm: round1(hip),
  };
}

/* =========================
   عبايات – حسب الطول
========================= */
function recommendAbayaSize(product: Product, body: BodyMeasurements): SizeResult {
  const norm = normalizeBody(body);
  const h = safe(norm.heightCm);

  if (!h) {
    return {
      size: "غير محدد",
      note: "أدخلي طولك عشان نحدد مقاس العباية بدقة.",
    };
  }

  const chart = product.abayaSizeChart || DEFAULT_ABAYA_HEIGHT_CHART;

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

function mid([a, b]: [number, number]) {
  return (a + b) / 2;
}

function inRange(v: number, [min, max]: [number, number]) {
  return v >= min && v <= max;
}

function outsideNote(
  bust: number,
  waist: number,
  hip: number,
  band: Band
) {
  // أولوية الأرداف ثم الصدر ثم الخصر (مثل ما كنتِ)
  if (hip > band.hip[1]) {
    return "الأرداف أكبر من نطاق المقاس — يفضّل أخذ مقاس أعلى لو القصة ضيقة.";
  }
  if (hip < band.hip[0]) {
    return "الأرداف أصغر من نطاق المقاس — لو تحبين القصة ضيقة ممكن مقاس أصغر (حسب التصميم).";
  }

  if (bust > band.bust[1]) {
    return "محيط الصدر أكبر من نطاق المقاس — لو التصميم محدد من الأعلى قد تحتاجين مقاس أكبر.";
  }
  if (bust < band.bust[0]) {
    return "محيط الصدر أصغر من نطاق المقاس — لو تحبين القصة ضيقة ممكن مقاس أصغر (حسب التصميم).";
  }

  if (waist > band.waist[1]) {
    return "محيط الخصر أكبر من نطاق المقاس — الفساتين المحددة على الخصر قد تكون أضيق.";
  }
  if (waist < band.waist[0]) {
    return "محيط الخصر أصغر من نطاق المقاس — لو التصميم محدد على الخصر ممكن مقاس أصغر يناسبك.";
  }

  return "مقاس محسوب حسب قياساتك.";
}

export function recommendSize(product: Product, body: BodyMeasurements): SizeResult {
  // ✅ لو عباية
  if (product.category === "abaya") {
    return recommendAbayaSize(product, body);
  }

  const norm = normalizeBody(body);

  const bust = safe(norm.bustCm);
  const waist = safe(norm.waistCm);
  const hip = safe(norm.hipCm);

  // ✅ لو فيه نقص بالقياسات (0/undefined)
  if (!bust || !waist || !hip) {
    return {
      size: "غير محدد",
      note: "أكملي قياسات الصدر والخصر والأرداف عشان نطلع لك المقاس بدقة.",
    };
  }

  // 1) نحاول نلقى Band مناسب بالكامل
  const fitting = BANDS.filter(
    (b) =>
      inRange(bust, b.bust) &&
      inRange(waist, b.waist) &&
      inRange(hip, b.hip)
  );

  // لو لقيت أكثر من واحد، خذي الأقرب لمركز النطاقات
  if (fitting.length > 0) {
    let best = fitting[0];
    let bestScore = Infinity;

    for (const b of fitting) {
      const d =
        Math.abs(bust - mid(b.bust)) +
        Math.abs(waist - mid(b.waist)) +
        Math.abs(hip - mid(b.hip));
      if (d < bestScore) {
        bestScore = d;
        best = b;
      }
    }

    return { size: best.label, note: "مقاس محسوب حسب قياساتك." };
  }

  // 2) إذا ما فيه Band مناسب: خذي الأقرب (مثل منطقك القديم لكن أدق بالملاحظة)
  let best = BANDS[0];
  let score = Infinity;

  for (const b of BANDS) {
    const d =
      Math.abs(bust - mid(b.bust)) +
      Math.abs(waist - mid(b.waist)) +
      Math.abs(hip - mid(b.hip));
    if (d < score) {
      score = d;
      best = b;
    }
  }

  const note = outsideNote(bust, waist, hip, best);
  return { size: best.label, note };
}