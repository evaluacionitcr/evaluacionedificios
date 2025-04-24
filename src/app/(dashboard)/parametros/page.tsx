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
      <div className="container mx-auto py-6">
        <Table>
          <TableBody>
            {parameters.map((param) => (
              <TableRow key={param.id}>
                <TableCell className="text-xl font-semibold sm:text-2xl">Componentes</TableCell>
                <TableCell className="text-right">
                  <Link href={`/parametros/componentes`}>
                    <Button>
                      Editar
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}