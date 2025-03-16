import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Progress } from "~/components/ui/progress"
import { ArrowLeft, Building, Calendar, Clock, MapPin, User } from "lucide-react"
import Link from "next/link"

export default function EdificioDetallePage({ params }: { params: { id: string } }) {
  // En una aplicación real, aquí cargarías los datos del edificio según el ID
  const edificio = {
    id: params.id,
    nombre: "Facultad de Ingeniería",
    codigo: "FI-01",
    ubicacion: "Campus Central",
    fechaConstruccion: "1985",
    ultimaRenovacion: "2018",
    estado: "Excelente",
    condicion: 85,
    area: "4,500 m²",
    pisos: 4,
    responsable: "Ing. Roberto Méndez",
    ultimaEvaluacion: "15/01/2025",
    proximaEvaluacion: "15/01/2026",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/edificios">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5 text-primary" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-primary">{edificio.nombre}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-primary">Información General</CardTitle>
              <CardDescription>Datos básicos del edificio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <Building className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Código</p>
                    <p>{edificio.codigo}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ubicación</p>
                    <p>{edificio.ubicacion}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Fecha de Construcción</p>
                    <p>{edificio.fechaConstruccion}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Última Renovación</p>
                    <p>{edificio.ultimaRenovacion}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <User className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Responsable</p>
                    <p>{edificio.responsable}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Última Evaluación</p>
                    <p>{edificio.ultimaEvaluacion}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="evaluaciones">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="evaluaciones">Evaluaciones</TabsTrigger>
              <TabsTrigger value="mantenimientos">Mantenimientos</TabsTrigger>
              <TabsTrigger value="documentos">Documentos</TabsTrigger>
            </TabsList>
            <TabsContent value="evaluaciones">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-primary">Historial de Evaluaciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">Evaluación Completa</h3>
                          <p className="text-sm text-muted-foreground">15/01/2025</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Ver Detalles
                        </Button>
                      </div>
                      <p className="text-sm mb-2">Evaluador: Ing. Roberto Gómez</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Condición General:</span>
                          <span className="font-medium text-green-600">Excelente (85%)</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">Evaluación Estructural</h3>
                          <p className="text-sm text-muted-foreground">10/07/2024</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Ver Detalles
                        </Button>
                      </div>
                      <p className="text-sm mb-2">Evaluador: Ing. Carlos Mendoza</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Condición Estructural:</span>
                          <span className="font-medium text-green-600">Excelente (90%)</span>
                        </div>
                        <Progress value={90} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="mantenimientos">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-primary">Mantenimientos Programados</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No hay mantenimientos programados actualmente.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="documentos">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-primary">Documentos Relacionados</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex justify-between items-center p-2 border-b">
                      <span>Planos Arquitectónicos.pdf</span>
                      <Button variant="ghost" size="sm">
                        Descargar
                      </Button>
                    </li>
                    <li className="flex justify-between items-center p-2 border-b">
                      <span>Certificado Estructural 2023.pdf</span>
                      <Button variant="ghost" size="sm">
                        Descargar
                      </Button>
                    </li>
                    <li className="flex justify-between items-center p-2 border-b">
                      <span>Manual de Mantenimiento.pdf</span>
                      <Button variant="ghost" size="sm">
                        Descargar
                      </Button>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-primary">Estado Actual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Condición General</span>
                    <span className="text-sm text-green-600 font-medium">{edificio.condicion}%</span>
                  </div>
                  <Progress value={edificio.condicion} className="h-2" />
                </div>
                <div className="pt-2 border-t">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Estado:</div>
                    <div className="font-medium text-green-600">{edificio.estado}</div>
                    <div className="text-muted-foreground">Área:</div>
                    <div>{edificio.area}</div>
                    <div className="text-muted-foreground">Pisos:</div>
                    <div>{edificio.pisos}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-primary">Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full">Programar Evaluación</Button>
              <Button variant="outline" className="w-full">
                Registrar Mantenimiento
              </Button>
              <Button variant="outline" className="w-full">
                Subir Documento
              </Button>
              <Button variant="outline" className="w-full">
                Editar Información
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-primary">Próximos Eventos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Evaluación Anual</div>
                    <div className="text-xs text-muted-foreground">{edificio.proximaEvaluacion}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

