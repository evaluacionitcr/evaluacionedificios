"use client";
import { useState, useEffect } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useFormStatus } from "react-dom";
import { updateUser, getUserData } from "~/server/actions/users";

// Define una interfaz para los datos serializados
interface SerializedUser {
  id: string;
  firstName: string;
  lastName: string;
}

export default function UserForm({ id }: { id: string }) {
  const [user, setUser] = useState<SerializedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true);
        // Obtener datos serializados del usuario
        const userData = await getUserData(id);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setMessage("Error al cargar los datos del usuario");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      // Fix the floating promise by using void operator
      void fetchUserData();
    }
  }, [id]);

  async function handleSubmit(formData: FormData) {
    try {
      // Crear un objeto con solo los campos que tienen valor
      const updatedFields = new FormData();
      // Copiar solo los campos que no están vacíos
      for (const [key, value] of formData.entries()) {
        if (value !== "" && (key !== "password" || value !== "")) {
          updatedFields.append(key, value);
        }
      }

      const result = await updateUser(id, updatedFields);
      if (result.success) {
        setMessage("Usuario actualizado correctamente");
        // Refrescar los datos del usuario
        const updatedUserData = await getUserData(id);
        setUser(updatedUserData);
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setMessage("Error al actualizar el usuario");
    }
  }

  if (loading) {
    return <div className="text-center">Cargando datos del usuario...</div>;
  }

  if (!user) {
    return <div className="text-center">No se encontró el usuario</div>;
  }

  return (
    <div>
      <h1 className="mb-4 text-center text-2xl font-bold">
        Formulario de usuario
      </h1>
      {message && (
        <div
          className={`mb-4 rounded p-2 text-center ${message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
        >
          {message}
        </div>
      )}
      <form action={handleSubmit} className="mx-auto w-1/3 space-y-4">
        {/* Nombre */}
        <div className="space-y-1">
          <label className="block font-medium text-gray-700">Nombre:</label>
          <Input
            type="text"
            name="firstName"
            defaultValue={user.firstName}
            placeholder="Nombre"
            className="w-full rounded-md border-2 border-blue-500 p-2 focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <div className="space-y-1">
          <label className="block font-medium text-gray-700">Apellido:</label>
          <Input
            type="text"
            name="lastName"
            defaultValue={user.lastName}
            placeholder="Apellido"
            className="w-full rounded-md border-2 border-blue-500 p-2 focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <SubmitButton />
      </form>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Guardando..." : "Guardar"}
    </Button>
  );
}
