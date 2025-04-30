import { Param } from "drizzle-orm";
import ParametersView from "~/components/views/parameters-view";
import Link from "next/link"; 
import { Button } from "~/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";

export default function Page() {
  const parameters = [
    { id: 1, name: "Parámetro 1", value: "Valor 1", description: "Descripción del parámetro 1" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Parámetros</h1>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Criterios para evaluación</h1>
        <div className="flex gap-2">
          
          <Link href={`/parametros/ejemplo`}>
            <Button>Previsualizar Evaluacion</Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto py-6 border border-gray-300 rounded-xl">
        <Table>
          <TableBody /* Componentes */>
              <TableRow>
                <TableCell className="text-xl font-semibold sm:text-2xl">Componentes</TableCell>
                <TableCell className="text-right">
                  <Link href={`/parametros/componentes`}>
                    <Button>
                      Editar
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>

           
              <TableRow /* Estado de conservación */>
                <TableCell className="text-xl font-semibold sm:text-2xl">Estado de conservación</TableCell>
                <TableCell className="text-right">
                  <Link href={`/parametros/conservacion`}>
                    <Button>
                      Editar
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>

              <TableRow /* Funcionalidad */>
                <TableCell className="text-xl font-semibold sm:text-2xl">Funcionalidad </TableCell>
                <TableCell className="text-right">
                  <Link href={`/parametros/funcionalidad`}>
                    <Button>
                      Editar
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>

              <TableRow /* Normativa */>
                <TableCell className="text-xl font-semibold sm:text-2xl">Normativa </TableCell>
                <TableCell className="text-right">
                  <Link href={`/parametros/normativa`}>
                    <Button>
                      Editar
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>

          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Priorización</h1>
      </div>
      <div className="container mx-auto py-6 border border-gray-300 rounded-xl">
        <Table>
          <TableBody /* Priorización */>
              <TableRow>
                <TableCell className="text-xl font-semibold sm:text-2xl">Criterios de evaluación</TableCell>
                <TableCell className="text-right">
                  <Link href={`/parametros/priorizacion`}>
                    <Button>
                      Editar
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>

          </TableBody>
        </Table>
        </div>
    </div>
  );
}