// app/lib/recommendSize.ts

type BodyMeasurements = {
  bustCm: number;
  waistCm: number;
  hipCm: number;
};

type SizeResult = {
  size: string;
  note: string;
};

type SizeBand = {
  label: string; // XS, S, M, L, XL...
  bust: [number, number];
  waist: [number, number];
  hip: [number, number];
};

const DEFAULT_BANDS: SizeBand[] = [
  { label: "XS", bust: [78, 84], waist: [58, 64], hip: [84, 90] },
  { label: "S",  bust: [84, 90], waist: [64, 70], hip: [90, 96] },
  { label: "M",  bust: [90, 96], waist: [70, 76], hip: [96, 102] },
  { label: "L",  bust: [96, 102], waist: [76, 84], hip: [102, 110] },
  { label: "XL", bust: [102, 110], waist: [84, 92], hip: [110, 118] },
  { label: "XXL", bust: [110, 118], waist: [92, 102], hip: [118, 128] },
];

const safeNum = (n: any) => (Number.isFinite(Number(n)) ? Number(n) : 0);

function inRange(v: number, r: [number, number]) {
  const [min, max] = r;
  return v >= min && v <= max;
}

function distToRange(value: number, range?: [number, number]) {
  if (!value || !range) return 0;
  const [min, max] = range;
  if (value < min) return min - value;
  if (value > max) return value - max;
  return 0;
}

/**
 * تقدير المقاس بدون جدول (عام):
 * - نختار الباند اللي يعطي أقل “مسافة” خارج النطاق عبر bust/waist/hip
 * - نضيف ملاحظة حسب توافق القياسات
 */
function estimateSizeFromBands(body: BodyMeasurements): SizeResult {
  const bust = safeNum(body?.bustCm);
  const waist = safeNum(body?.waistCm);
  const hip = safeNum(body?.hipCm);

  if (!bust && !waist && !hip) {
    return {
      size: "غير متوفر",
      note: "أدخلي قياسات (صدر/خصر/أرداف) عشان نقترح المقاس بدقة.",
    };
  }

  // لو في قياس واحد بس، نشتغل عليه
  const active = {
    bust: bust || 0,
    waist: waist || 0,
    hip: hip || 0,
  };

  let best = DEFAULT_BANDS[0];
  let bestScore = Number.POSITIVE_INFINITY;

  for (const b of DEFAULT_BANDS) {
    const bustD = distToRange(active.bust, b.bust);
    const waistD = distToRange(active.waist, b.waist);
    const hipD = distToRange(active.hip, b.hip);

    // نجمع فقط المقاييس اللي المستخدم دخلها فعلاً
    const score =
      (bust ? bustD : 0) +
      (waist ? waistD : 0) +
      (hip ? hipD : 0);

    if (score < bestScore) {
      bestScore = score;
      best = b;
    }
  }

  // تحليل بسيط لإعطاء ملاحظة مفيدة
  const okBust = bust ? inRange(bust, best.bust) : true;
  const okWaist = waist ? inRange(waist, best.waist) : true;
  const okHip = hip ? inRange(hip, best.hip) : true;

  let note = "مقاس تقديري بناءً على قياساتك.";
  if (okBust && okWaist && okHip) {
    note = "ممتاز—قياساتك ضمن نطاق هذا المقاس (تقديري).";
  } else {
    // لو خرج قياس واحد غالبًا خذي الأكبر/تروحين للأعلى حسب القصة
    note =
      "قريب جدًا—إذا القَصّة ضيقة أو القماش غير مطاط، خذي مقاس أعلى. وإذا القصة واسعة، نفس المقاس غالبًا يكفي.";
  }

  return { size: best.label, note };
}

/**
 * إذا عند المنتج sizeChart (مخصص)، نستخدمه.
 * وإذا ما عنده، نستخدم التقدير العام.
 */
export function recommendSize(
  product: any,
  body: BodyMeasurements
): SizeResult {
  const bust = safeNum(body?.bustCm);
  const waist = safeNum(body?.waistCm);
  const hip = safeNum(body?.hipCm);

  // 1) لو ما في جدول مقاسات للمنتج: تقدير عام
  const chart = product?.sizeChart;
  if (!Array.isArray(chart) || chart.length === 0) {
    return estimateSizeFromBands({ bustCm: bust, waistCm: waist, hipCm: hip });
  }

  // 2) لو فيه جدول مقاسات: نختار الأقرب
  let best = chart[0];
  let bestScore = Number.POSITIVE_INFINITY;

  for (const s of chart) {
    const bustD = distToRange(bust, s?.bust);
    const waistD = distToRange(waist, s?.waist);
    const hipD = distToRange(hip, s?.hip);

    const score =
      (bust ? bustD : 0) +
      (waist ? waistD : 0) +
      (hip ? hipD : 0);

    if (score < bestScore) {
      bestScore = score;
      best = s;
    }
  }

  const label = best?.label || best?.size || "غير متوفر";

  const note =
    bestScore === 0
      ? "ممتاز—قياساتك داخل نطاق هذا المقاس (حسب جدول المنتج)."
      : "قريب جدًا—قد يختلف حسب قصة المنتج (ضيق/واسع) وخامة القماش.";

  return { size: String(label), note };
}