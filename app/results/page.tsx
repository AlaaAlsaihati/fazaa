import { Suspense } from "react";
import ResultsClient from "./ResultsClient";

export default function Page({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const get = (k: string) => {
    const v = searchParams?.[k];
    return Array.isArray(v) ? v[0] : v;
  };

  const initialParams = {
    occasion: get("occasion"),
    weddingStyle: get("weddingStyle"),
    depth: get("depth"),
    undertone: get("undertone"),
    height: get("height"),
    bust: get("bust"),
    waist: get("waist"),
    hip: get("hip"),
    bodyShape: get("bodyShape"),
  };

  return (
    <Suspense fallback={null}>
      <ResultsClient initialParams={initialParams} />
    </Suspense>
  );
}