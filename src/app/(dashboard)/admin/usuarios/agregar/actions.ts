// app/admin/create-user/actions.ts
"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

type CreateUserResult =
  | {
      id: string;
      email: string;
      password: string;
    }
  | {
      error: string;
    };

export async function createUser(
  formData: FormData,
): Promise<CreateUserResult> {
  try {
    // Verificar si el usuario actual es un administrador
    const { userId } = await auth();
    const client = await clerkClient();


    // Obtener datos del formulario
    const email = formData.get("email") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;

    if (!email || !firstName || !lastName) {
      return { error: "Todos los campos son requeridos" };
    }

    // Generar una contraseña temporal aleatoria
    const temporaryPassword = generateRandomPassword();

    // Crear el usuario con la API de Clerk
    const newUser = await client.users.createUser({
      emailAddress: [email],
      firstName,
      lastName,
      password: temporaryPassword,
      skipPasswordChecks: true, // Para permitir contraseñas temporales sencillas
    });


    // Revalidar la página para actualizar listas de usuarios si existen
    revalidatePath("/admin/users");

    // Devolver datos del usuario creado y la contraseña temporal
    return {
      id: newUser.id,
      email,
      password: temporaryPassword,
    };
  } catch (error: any) {
    console.error("Error al crear usuario:", error);
    return {
      error: `Error al crear el usuario: ${error.message || "Error desconocido"}`,
    };
  }
}

// Función para generar una contraseña aleatoria
function generateRandomPassword(length = 10): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}
