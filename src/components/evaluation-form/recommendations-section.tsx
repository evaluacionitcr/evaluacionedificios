"use client"

import type React from "react"

import { Button } from "~/components/ui/button"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Save, SendHorizonal } from "lucide-react"

interface RecommendationsSectionProps {
  formData: {
    recomendaciones: string
    conclusiones: string
  }
  handleChange: (field: string, value: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export default function RecommendationsSection({ formData, handleChange, onSubmit }: RecommendationsSectionProps) {
  return (
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
              value={formData.recomendaciones}
              onChange={(e) => handleChange("recomendaciones", e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="conclusiones">Conclusiones</Label>
            <Textarea
              id="conclusiones"
              placeholder="Ingrese sus conclusiones finales sobre el estado del edificio..."
              value={formData.conclusiones}
              onChange={(e) => handleChange("conclusiones", e.target.value)}
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
          <Button type="submit" onClick={onSubmit}>
            <SendHorizonal className="mr-2 h-4 w-4" />
            Enviar Evaluación
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

