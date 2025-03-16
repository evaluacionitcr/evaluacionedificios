import { Button } from "~/components/ui/button";
import Link from "next/link";
export default function ParametersView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Parámetros</h1>
        <Link href="/parametro">
          <Button>Nuevo Parámetro</Button>
        </Link>
      </div>

    </div>
  );
}
