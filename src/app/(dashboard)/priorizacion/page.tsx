import Link from "next/link";
import { Button } from "~/components/ui/button";
import ProjectList from "~/components/projects/project-list";

export default function PriorizacionPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex gap-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Reportes</h1>
        <Link href="/priorizacion/crearProyecto">
          <Button>Nuevo Proyecto</Button>
        </Link>
      </div>
      <div className="mt-6">
        <h2 className="mb-4 text-xl font-semibold">Proyectos por Campus/Centro Académico</h2>
        <div className="mt-4">
          <ProjectList />
        </div>
      </div>
    </div>
  );
}