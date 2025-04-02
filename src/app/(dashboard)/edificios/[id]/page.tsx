// src/app/(dashboard)/edificios/[id]/page.tsx

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import {
  ArrowLeft,
  Building,
  Calendar,
  Clock,
  MapPin,
  User,
} from "lucide-react";
import Link from "next/link";
import { getDetallesEdificio } from "~/server/actions/edificios";
import { notFound } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

interface Params {
  id: string;
}

export default async function EdificioDetallePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const edificios = await getDetallesEdificio(id);

  if (!edificios || edificios.length === 0) {
    notFound();
  }

  const edificio = edificios[0];
  if (!edificio) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/edificios">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5 text-primary" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-primary">{edificio.nombre}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-primary">
              Historial de Registros
            </CardTitle>
            <CardDescription>Registros históricos del edificio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Fecha Const.</TableHead>
                    <TableHead>No. Finca</TableHead>
                    <TableHead>Área (m²)</TableHead>
                    <TableHead>Uso</TableHead>
                    <TableHead>Valor USD/m²</TableHead>
                    <TableHead>Valor CRC/m²</TableHead>
                    <TableHead>Valor IR</TableHead>
                    <TableHead>Valor Actual</TableHead>
                    <TableHead>Depreciación</TableHead>
                    <TableHead>Año Reval.</TableHead>
                    <TableHead>Edad 2021</TableHead>
                    <TableHead>Vida Útil Hacienda</TableHead>
                    <TableHead>Vida Útil Experto</TableHead>
                    <TableHead>Es Renovación</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {edificios.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell>{e.nombre}</TableCell>
                      <TableCell>{e.fechaConstruccion ?? "N/A"}</TableCell>
                      <TableCell>{e.numeroFinca ?? "N/A"}</TableCell>
                      <TableCell>{e.m2Construccion ?? "N/A"}</TableCell>
                      <TableCell>{e.usoActual ?? "N/A"}</TableCell>
                      <TableCell>${e.valorDolarPorM2 ?? "0.00"}</TableCell>
                      <TableCell>₡{e.valorColonPorM2 ?? "0.00"}</TableCell>
                      <TableCell>₡{e.valorEdificioIR ?? "0.00"}</TableCell>
                      <TableCell>₡{e.valorActualRevaluado ?? "0.00"}</TableCell>
                      <TableCell>
                        ₡{e.depreciacionLinealAnual ?? "0.00"}
                      </TableCell>
                      <TableCell>{e.anoDeRevaluacion ?? "N/A"}</TableCell>
                      <TableCell>{e.edadAl2021 ?? 0} años</TableCell>
                      <TableCell>{e.vidaUtilHacienda ?? 0} años</TableCell>
                      <TableCell>{e.vidaUtilExperto ?? 0} años</TableCell>
                      <TableCell>{e.esRenovacion ? "Sí" : "No"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
