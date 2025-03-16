"use client"

import { useState } from "react"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"

interface EvaluationDetailsSectionProps {
  formData: {
    condicionGeneral: string
    observaciones: string
  }
  handleChange: (field: string, value: string) => void
}

export default function EvaluationDetailsSection({ formData, handleChange }: EvaluationDetailsSectionProps) {
  const [activeTab, setActiveTab] = useState("general")

  return (
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
            <StructureEvaluationTab />
          </TabsContent>

          <TabsContent value="instalaciones" className="space-y-4">
            <InstallationsEvaluationTab />
          </TabsContent>

          <TabsContent value="seguridad" className="space-y-4">
            <SecurityEvaluationTab />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function StructureEvaluationTab() {
  return (
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
  )
}

function InstallationsEvaluationTab() {
  return (
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
  )
}

function SecurityEvaluationTab() {
  return (
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
  )
}

