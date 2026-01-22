import MeasurementsClient from "./MeasurementsClient";

export default function MeasurementsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  return (
    <MeasurementsClient
      initialParams={{
        occasion: Array.isArray(searchParams?.occasion)
          ? searchParams?.occasion[0]
          : searchParams?.occasion,

        weddingStyle: Array.isArray(searchParams?.weddingStyle)
          ? searchParams?.weddingStyle[0]
          : searchParams?.weddingStyle,

        depth: Array.isArray(searchParams?.depth)
          ? searchParams?.depth[0]
          : searchParams?.depth,

        undertone: Array.isArray(searchParams?.undertone)
          ? searchParams?.undertone[0]
          : searchParams?.undertone,
      }}
    />
  );
}