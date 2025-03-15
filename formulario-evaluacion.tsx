"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Textarea } from "~/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { ArrowLeft, Save, SendHorizonal } from "lucide-react"

export default function FormularioEvaluacion() {
  const [activeTab, setActiveTab] = useState("general")
  const [formData, setFormData] = useState({
    edificio: "",
    fecha: "",
    evaluador: "",
    tipoEvaluacion: "completa",
    condicionGeneral: "bueno",
    observaciones: "",
  })

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Datos enviados:", formData)
    // Aquí iría la lógica para enviar los datos
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" className="mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Nueva Evaluación de Edificio</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
              <CardDescription>Ingrese la información básica de la evaluación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edificio">Edificio</Label>
                  <Select value={formData.edificio} onValueChange={(value) => handleChange("edificio", value)}>
                    <SelectTrigger id="edificio">
                      <SelectValue placeholder="Seleccionar edificio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fi-01">Facultad de Ingeniería</SelectItem>
                      <SelectItem value="fc-02">Facultad de Ciencias</SelectItem>
                      <SelectItem value="bc-01">Biblioteca Central</SelectItem>
                      <SelectItem value="ea-01">Edificio Administrativo</SelectItem>
                      <SelectItem value="ap-01">Auditorio Principal</SelectItem>
                      <SelectItem value="fm-01">Facultad de Medicina</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fecha">Fecha de Evaluación</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => handleChange("fecha", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="evaluador">Evaluador</Label>
                  <Select value={formData.evaluador} onValueChange={(value) => handleChange("evaluador", value)}>
                    <SelectTrigger id="evaluador">
                      <SelectValue placeholder="Seleccionar evaluador" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rm">Roberto Méndez</SelectItem>
                      <SelectItem value="ls">Laura Sánchez</SelectItem>
                      <SelectItem value="cm">Carlos Mendoza</SelectItem>
                      <SelectItem value="mr">María Rodríguez</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo-evaluacion">Tipo de Evaluación</Label>
                  <Select
                    value={formData.tipoEvaluacion}
                    onValueChange={(value) => handleChange("tipoEvaluacion", value)}
                  >
                    <SelectTrigger id="tipo-evaluacion">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completa">Evaluación Completa</SelectItem>
                      <SelectItem value="estructural">Evaluación Estructural</SelectItem>
                      <SelectItem value="seguridad">Evaluación de Seguridad</SelectItem>
                      <SelectItem value="mantenimiento">Evaluación de Mantenimiento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detalles de la Evaluación</CardTitle>
              <CardDescription>Complete los criterios de evaluación para el edificio</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="estructura">Estructura</TabsTrigger>
                  <TabsTrigger value="instalaciones">Instalaciones</TabsTrigger>
                  <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Condición General del Edificio</Label>
                    <RadioGroup
                      value={formData.condicionGeneral}
                      onValueChange={(value) => handleChange("condicionGeneral", value)}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="excelente" id="excelente" />
                        <Label htmlFor="excelente" className="font-normal">
                          Excelente (90-100%)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bueno" id="bueno" />
                        <Label htmlFor="bueno" className="font-normal">
                          Bueno (70-89%)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="regular" id="regular" />
                        <Label htmlFor="regular" className="font-normal">
                          Regular (50-69%)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="deficiente" id="deficiente" />
                        <Label htmlFor="deficiente" className="font-normal">
                          Deficiente (0-49%)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="observaciones">Observaciones Generales</Label>
                    <Textarea
                      id="observaciones"
                      placeholder="Ingrese sus observaciones sobre el estado general del edificio..."
                      value={formData.observaciones}
                      onChange={(e) => handleChange("observaciones", e.target.value)}
                      rows={4}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="estructura" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label>Estado de Cimientos</Label>
                      <RadioGroup defaultValue="bueno" className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="excelente" id="cimientos-excelente" />
                          <Label htmlFor="cimientos-excelente" className="font-normal">
                            Excelente
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="bueno" id="cimientos-bueno" />
                          <Label htmlFor="cimientos-bueno" className="font-normal">
                            Bueno
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="regular" id="cimientos-regular" />
                          <Label htmlFor="cimientos-regular" className="font-normal">
                            Regular
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="deficiente" id="cimientos-deficiente" />
                          <Label htmlFor="cimientos-deficiente" className="font-normal">
                            Deficiente
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label>Estado de Columnas y Vigas</Label>
                      <RadioGroup defaultValue="bueno" className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="excelente" id="columnas-excelente" />
                          <Label htmlFor="columnas-excelente" className="font-normal">
                            Excelente
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="bueno" id="columnas-bueno" />
                          <Label htmlFor="columnas-bueno" className="font-normal">
                            Bueno
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="regular" id="columnas-regular" />
                          <Label htmlFor="columnas-regular" className="font-normal">
                            Regular
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="deficiente" id="columnas-deficiente" />
                          <Label htmlFor="columnas-deficiente" className="font-normal">
                            Deficiente
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="estructura-observaciones">Observaciones de Estructura</Label>
                      <Textarea
                        id="estructura-observaciones"
                        placeholder="Ingrese sus observaciones sobre la estructura del edificio..."
                        rows={3}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="instalaciones" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label>Sistema Eléctrico</Label>
                      <RadioGroup defaultValue="bueno" className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="excelente" id="electrico-excelente" />
                          <Label htmlFor="electrico-excelente" className="font-normal">
                            Excelente
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="bueno" id="electrico-bueno" />
                          <Label htmlFor="electrico-bueno" className="font-normal">
                            Bueno
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="regular" id="electrico-regular" />
                          <Label htmlFor="electrico-regular" className="font-normal">
                            Regular
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="deficiente" id="electrico-deficiente" />
                          <Label htmlFor="electrico-deficiente" className="font-normal">
                            Deficiente
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label>Sistema Hidráulico</Label>
                      <RadioGroup defaultValue="regular" className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="excelente" id="hidraulico-excelente" />
                          <Label htmlFor="hidraulico-excelente" className="font-normal">
                            Excelente
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="bueno" id="hidraulico-bueno" />
                          <Label htmlFor="hidraulico-bueno" className="font-normal">
                            Bueno
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="regular" id="hidraulico-regular" />
                          <Label htmlFor="hidraulico-regular" className="font-normal">
                            Regular
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="deficiente" id="hidraulico-deficiente" />
                          <Label htmlFor="hidraulico-deficiente" className="font-normal">
                            Deficiente
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instalaciones-observaciones">Observaciones de Instalaciones</Label>
                      <Textarea
                        id="instalaciones-observaciones"
                        placeholder="Ingrese sus observaciones sobre las instalaciones del edificio..."
                        rows={3}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="seguridad" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label>Sistema Contra Incendios</Label>
                      <RadioGroup defaultValue="regular" className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="excelente" id="incendios-excelente" />
                          <Label htmlFor="incendios-excelente" className="font-normal">
                            Excelente
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="bueno" id="incendios-bueno" />
                          <Label htmlFor="incendios-bueno" className="font-normal">
                            Bueno
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="regular" id="incendios-regular" />
                          <Label htmlFor="incendios-regular" className="font-normal">
                            Regular
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="deficiente" id="incendios-deficiente" />
                          <Label htmlFor="incendios-deficiente" className="font-normal">
                            Deficiente
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label>Rutas de Evacuación</Label>
                      <RadioGroup defaultValue="bueno" className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="excelente" id="evacuacion-excelente" />
                          <Label htmlFor="evacuacion-excelente" className="font-normal">
                            Excelente
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="bueno" id="evacuacion-bueno" />
                          <Label htmlFor="evacuacion-bueno" className="font-normal">
                            Bueno
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="regular" id="evacuacion-regular" />
                          <Label htmlFor="evacuacion-regular" className="font-normal">
                            Regular
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="deficiente" id="evacuacion-deficiente" />
                          <Label htmlFor="evacuacion-deficiente" className="font-normal">
                            Deficiente
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="seguridad-observaciones">Observaciones de Seguridad</Label>
                      <Textarea
                        id="seguridad-observaciones"
                        placeholder="Ingrese sus observaciones sobre la seguridad del edificio..."
                        rows={3}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recomendaciones y Conclusiones</CardTitle>
              <CardDescription>Agregue sus recomendaciones finales y conclusiones de la evaluación</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recomendaciones">Recomendaciones</Label>
                  <Textarea
                    id="recomendaciones"
                    placeholder="Ingrese sus recomendaciones para mejorar el estado del edificio..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="conclusiones">Conclusiones</Label>
                  <Textarea
                    id="conclusiones"
                    placeholder="Ingrese sus conclusiones finales sobre el estado del edificio..."
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Guardar Borrador</Button>
              <div className="flex gap-2">
                <Button variant="outline" type="button">
                  <Save className="mr-2 h-4 w-4" />
                  Guardar
                </Button>
                <Button type="submit">
                  <SendHorizonal className="mr-2 h-4 w-4" />
                  Enviar Evaluación
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  )
}

