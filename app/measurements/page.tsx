import MeasurementsClient from "./MeasurementsClient";

export default function Page({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const initialParams = {
    occasion: typeof searchParams.occasion === "string" ? searchParams.occasion : undefined,
    weddingStyle: typeof searchParams.weddingStyle === "string" ? searchParams.weddingStyle : undefined,
    depth: typeof searchParams.depth === "string" ? searchParams.depth : undefined,
    undertone: typeof searchParams.undertone === "string" ? searchParams.undertone : undefined,
  };

  return <MeasurementsClient initialParams={initialParams} />;
}