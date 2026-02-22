import { supabase } from "@/app/lib/supabaseClient";

export type Unit = "cm" | "in";
export type BodyShapeArabic = "ساعة رملية" | "كمثري" | "مستقيم" | "تفاحة";

export type DbMeasurements = {
  unit: Unit;
  heightCm: string; // نخزنها كنص بالواجهة
  bust: string;
  waist: string;
  hip: string;
  bodyShape: BodyShapeArabic | "";
  updatedAt: number | null;
};

function toNumOrNull(v: string) {
  const n = Number(String(v || "").trim());
  return Number.isFinite(n) && v !== "" ? n : null;
}

function numToString(v: any) {
  if (v === null || v === undefined) return "";
  const n = Number(v);
  return Number.isFinite(n) ? String(n) : "";
}

export async function getCurrentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user?.id ?? null;
}

export async function loadMeasurementsFromDb(): Promise<DbMeasurements | null> {
  const uid = await getCurrentUserId();
  if (!uid) return null;

  const { data, error } = await supabase
    .from("user_measurements")
    .select("unit,height_cm,bust_cm,waist_cm,hip_cm,body_shape,updated_at")
    .eq("user_id", uid)
    .single();

  if (error || !data) return null;

  return {
    unit: (data.unit === "in" ? "in" : "cm") as Unit,
    heightCm: numToString(data.height_cm),
    bust: numToString(data.bust_cm),
    waist: numToString(data.waist_cm),
    hip: numToString(data.hip_cm),
    bodyShape: (data.body_shape as any) || "",
    updatedAt: data.updated_at ? new Date(data.updated_at).getTime() : null,
  };
}

export async function saveMeasurementsToDb(input: {
  unit: Unit;
  heightCm: string;
  bust: string;
  waist: string;
  hip: string;
  bodyShape: string;
}) {
  const uid = await getCurrentUserId();
  if (!uid) return { ok: false as const, error: "NOT_LOGGED_IN" };

  const payload = {
    user_id: uid,
    unit: input.unit,
    height_cm: toNumOrNull(input.heightCm),
    bust_cm: toNumOrNull(input.bust),
    waist_cm: toNumOrNull(input.waist),
    hip_cm: toNumOrNull(input.hip),
    body_shape: input.bodyShape || null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("user_measurements")
    .upsert(payload, { onConflict: "user_id" });

  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}

/** ترحيل مرّة وحدة: لو DB فاضي و localStorage فيه مقاسات → نرفعها للـ DB */
export async function migrateLocalToDbOnce(storageKey = "fazaa_measurements_v1") {
  const uid = await getCurrentUserId();
  if (!uid) return;

  // إذا فيه بيانات بالـ DB خلاص لا نسوي شيء
  const existing = await loadMeasurementsFromDb();
  if (existing && (existing.heightCm || existing.bust || existing.waist || existing.hip || existing.bodyShape)) {
    return;
  }

  // اقرأ localStorage
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(storageKey);
  } catch {
    raw = null;
  }
  if (!raw) return;

  try {
    const saved = JSON.parse(raw) as any;
    const unit = saved.unit === "in" ? "in" : "cm";
    const heightCm = typeof saved.heightCm === "string" ? saved.heightCm : "";
    const bust = typeof saved.bust === "string" ? saved.bust : "";
    const waist = typeof saved.waist === "string" ? saved.waist : "";
    const hip = typeof saved.hip === "string" ? saved.hip : "";
    const bodyShape = saved.bodyShape || "";

    const anyValue = !!heightCm || !!bust || !!waist || !!hip || !!bodyShape;
    if (!anyValue) return;

    await saveMeasurementsToDb({ unit, heightCm, bust, waist, hip, bodyShape });
  } catch {
    // ignore
  }
}