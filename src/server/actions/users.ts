"use server";
import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getFormattedUsers() {
  const client = await clerkClient();
  const response = await client.users.getUserList({ limit: 100 });
  const users = response.data ?? [];

  return users.map((user) => ({
    id: user.id,
    name: user.fullName ?? "Unknown",
    // Convert role to string explicitly
    role:
      typeof user.publicMetadata?.role === "string"
        ? getRoleName(user.publicMetadata.role)
        : "Rol no asignado",
    initials: getInitials(user.fullName),
    email: user.primaryEmailAddress?.emailAddress ?? "Unknown",
  }));
}

function getInitials(name: string | null): string {
  if (!name) return "??";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

function getRoleName(role: string): string {
  switch (role) {
    case "admin":
      return "Administrador";
    case "auxiliar":
      return "Auxiliar de Administrador";
    case "evaluadorProyecto":
      return "Evaluador de Proyecto";
    case "evaluadorCondiciones":
      return "Evaluador de Condiciones";
    case "evaluadorGeneral":
      return "Evaluador General";
    default:
      return "Usuario";
  }
}

export async function getUserData(userId: string) {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    // Serializa solo lo que necesitas
    return {
      id: user.id,
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("No se pudo obtener la información del usuario");
  }
}

export async function updateUser(userId: string, formData: FormData) {
  try {
    // Extraer los campos que se enviaron en el formulario
    const updates: { firstName?: string; lastName?: string } = {};

    // Nombre
    const firstName = formData.get("firstName") as string | null;
    if (firstName) {
      updates.firstName = firstName;
    }

    // Apellido
    const lastName = formData.get("lastName") as string | null;
    if (lastName) {
      updates.lastName = lastName;
    }

    const client = await clerkClient();

    // Solo actualizar si hay campos para actualizar
    if (Object.keys(updates).length > 0) {
      await client.users.updateUser(userId, updates);

      // Revalidar la ruta para actualizar la información en la UI
      revalidatePath(`/admin/usuarios/editar/${userId}`);
    }

    return { success: true };
  } catch (error: unknown) {
    console.error("Error updating user:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al actualizar el usuario",
    };
  }
}

export async function deleteUser(userId: string) {
  try {
    const client = await clerkClient();

    // Eliminar el usuario
    await client.users.deleteUser(userId);

    // Revalidar la ruta para actualizar la lista de usuarios
    revalidatePath("/admin/usuarios");

    return { success: true };
  } catch (error: unknown) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al eliminar el usuario",
    };
  }
}
