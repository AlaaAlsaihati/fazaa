import { Suspense } from "react";
import SkinClient from "./SkinClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SkinClient />
    </Suspense>
  );
}