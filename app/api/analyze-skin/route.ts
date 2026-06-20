import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type AnalyzeTarget = "depth" | "undertone";

const DEPTH_VALUES = ["فاتح جدًا", "فاتح", "حنطي", "حنطي غامق", "أسمر", "داكن"];
const UNDERTONE_VALUES = ["بارد", "دافئ", "محايد", "زيتوني"];

function cleanResult(value: string, allowed: string[]) {
  const cleaned = String(value || "")
    .replace(/["'`{}[\]]/g, "")
    .trim();

  const exact = allowed.find((x) => cleaned === x || cleaned.includes(x));

  if (!exact) {
    throw new Error(`Invalid AI result: ${cleaned}`);
  }

  return exact;
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is missing" },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const target = formData.get("target") as AnalyzeTarget | null;
    const image = formData.get("image");

    if (!target || (target !== "depth" && target !== "undertone")) {
      return NextResponse.json({ error: "Invalid target" }, { status: 400 });
    }

    if (!(image instanceof File)) {
      return NextResponse.json({ error: "Image is missing" }, { status: 400 });
    }

    const bytes = await image.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mimeType = image.type || "image/jpeg";
    const imageUrl = `data:${mimeType};base64,${base64}`;

    const prompt =
      target === "depth"
        ? `
حللي لون البشرة الظاهر في الصورة فقط.
اختاري نتيجة واحدة فقط من هذه القائمة:
فاتح جدًا
فاتح
حنطي
حنطي غامق
أسمر
داكن

أرجعي كلمة واحدة فقط من القائمة بدون شرح.
`
        : `
حللي الأندرتون من صورة المعصم/العروق فقط.
اختاري نتيجة واحدة فقط من هذه القائمة:
بارد
دافئ
محايد
زيتوني

أرجعي كلمة واحدة فقط من القائمة بدون شرح.
`;

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: prompt },
            {
              type: "input_image",
              image_url: imageUrl,
              detail: "low",
            },
          ],
        },
      ],
    });

    const text = response.output_text || "";

    const suggestion =
      target === "depth"
        ? cleanResult(text, DEPTH_VALUES)
        : cleanResult(text, UNDERTONE_VALUES);
console.log("AI RAW RESPONSE:", text);
    return NextResponse.json({ suggestion });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Analysis failed" },
      { status: 500 }
    );
  }
}