import { Suspense } from "react";
import ResultsClient from "./ResultsClient";

export default function Page({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const initialParams = {
    occasion: typeof searchParams.occasion === "string" ? searchParams.occasion : undefined,
    weddingStyle:
      typeof searchParams.weddingStyle === "string" ? searchParams.weddingStyle : undefined,
    depth: typeof searchParams.depth === "string" ? searchParams.depth : undefined,
    undertone: typeof searchParams.undertone === "string" ? searchParams.undertone : undefined,
    height: typeof searchParams.height === "string" ? searchParams.height : undefined,
    bust: typeof searchParams.bust === "string" ? searchParams.bust : undefined,
    waist: typeof searchParams.waist === "string" ? searchParams.waist : undefined,
    hip: typeof searchParams.hip === "string" ? searchParams.hip : undefined,
    bodyShape:
      typeof searchParams.bodyShape === "string" ? searchParams.bodyShape : undefined,
  };

  return (
    <Suspense fallback={null}>
      <ResultsClient initialParams={initialParams} />
    </Suspense>
  );
}