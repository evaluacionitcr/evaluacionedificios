"use client";
import { useState, useEffect } from "react";
import { createUser } from "./actions";
import { Button } from "~/components/ui/button";

type UserResult = {
  id: string;
  email: string;
  password: string;
};

export default function CreateUserPage() {
  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<UserResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Efecto para abrir el mailto cuando se crea un usuario
  useEffect(() => {
    if (result?.email) {
      const subject = "Tus credenciales de acceso";
      const body = `Hola ${firstName || "Usuario"},

Aquí están tus credenciales de acceso:
Email: ${result.email}
Contraseña temporal: ${result.password}

Por favor, cambia tu contraseña después de iniciar sesión por primera vez.

Saludos,
El equipo de soporte`;

      // Cambiamos window.open por window.location.href
      window.location.href = `mailto:${result.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
  }, [result, firstName]);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const result = await createUser(formData);
      if ("error" in result) {
        throw new Error(result.error);
      }
      setResult(result as UserResult);
      // Limpiar el formulario
      setEmail("");
      setFirstName("");
      setLastName("");
    } catch (err: unknown) {
      // Type-safe error handling
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error desconocido");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto mt-10 max-w-md rounded-lg bg-white p-6 shadow-md">
      <h1 className="mb-6 text-2xl font-bold">Crear Nuevo Usuario</h1>
      <form action={handleSubmit}>
        <div className="mb-4">
          <label className="mb-2 block text-gray-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-gray-700" htmlFor="firstName">
            Nombre
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-gray-700" htmlFor="lastName">
            Apellido
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full rounded-md text-white hover:bg-blue-800 disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? "Creando..." : "Crear Usuario"}
        </Button>
      </form>
      {error && (
        <div className="mt-4 rounded-md bg-red-100 p-3 text-red-700">
          {error}
        </div>
      )}
      {result && (
        <div className="mt-4 rounded-md bg-green-100 p-3 text-green-700">
          <h3 className="font-bold">Usuario creado exitosamente</h3>
          <p>Email: {result.email}</p>
          <p>Contraseña temporal: {result.password}</p>
          <p className="mt-2 text-sm">
            Se ha abierto tu cliente de correo para enviar estas credenciales al
            usuario.
          </p>
        </div>
      )}
    </div>
  );
}
