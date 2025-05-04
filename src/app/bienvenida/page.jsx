import { Suspense } from "react";
import Tarjeta from "@/pages/Tarjetas";

export default function Page() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Tarjeta />
    </Suspense>
  );
}
