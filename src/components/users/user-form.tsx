"use client";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export default function UserForm() {
  return (
    <div>
      <h1 className="text-center text-2xl font-bold mb-4">Formulario de usuario</h1>
      <form className="space-y-4 w-1/3 mx-auto">
        {/* Nombre */}
        <div className="space-y-1">
          <label className="block text-gray-700 font-medium">Nombre actual:</label>
          <Input type="text" placeholder="Nombre" className="w-full border-2 border-blue-500 p-2 rounded-md focus:ring-2 focus:ring-blue-300" />
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="block text-gray-700 font-medium">Email actual:</label>
          <Input type="email" placeholder="Email" className="w-full border-2 border-blue-500 p-2 rounded-md focus:ring-2 focus:ring-blue-300" />
        </div>

        {/* Contraseña */}
        <div className="space-y-1">
          <label className="block text-gray-700 font-medium">Contraseña actual:</label>
          <Input type="password" placeholder="Contraseña" className="w-full border-2 border-blue-500 p-2 rounded-md focus:ring-2 focus:ring-blue-300" />
        </div>

        {/* Rol */}
        <div className="space-y-1">
          <label className="block text-gray-700 font-medium">Rol:</label>
          <select className="w-full border-2 border-blue-500 p-2 rounded-md focus:ring-2 focus:ring-blue-300">
            <option value="administrador">Administrador</option>
            <option value="auxiliarAdministrador">Auxiliar Administrador</option>
            <option value="evaluadorGeneral">Evaluador General</option>
            <option value="evaluadorProyecto">Evaluador de Proyecto</option>
          </select>
        </div>

        {/* Botón */}
        <Button type="submit" className="w-full">Guardar</Button>
      </form>
    </div>
  );
}
