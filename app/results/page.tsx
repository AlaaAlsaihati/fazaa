import ResultsClient from "./ResultsClient";

export default function Page({
  searchParams,
}: {
  searchParams: {
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
}) {
  return <ResultsClient initialParams={searchParams} />;
}