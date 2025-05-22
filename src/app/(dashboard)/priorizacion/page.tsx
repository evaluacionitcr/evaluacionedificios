"use client";
import Link from "next/link"; 
import { Button } from "~/components/ui/button";

export default function PriorizacionPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reportes</h1>
        <div className="flex gap-2">
          <Link href="/priorizacion/crearProyecto">
            <Button>Nuevo Proyecto</Button>
          </Link>
        </div>
    </div>
    )
}

