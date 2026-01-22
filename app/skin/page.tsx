import { Suspense } from "react";
import SkinClient from "./SkinClient";

export const dynamic = "force-dynamic";

export default function SkinPage() {
  return (
    <Suspense fallback={null}>
      <SkinClient />
    </Suspense>
  );
}