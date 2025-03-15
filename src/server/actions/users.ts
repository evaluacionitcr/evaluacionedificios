// server/actions/users.ts
"use server";
import { clerkClient } from "@clerk/nextjs/server";

export async function getFormattedUsers() {
  const client = await clerkClient();
  const response = await client.users.getUserList({ limit: 100 });
  const users = response.data || [];

  return users.map((user) => ({
    id: user.id,
    name: user.fullName ?? "Unknown",
    // Convert role to string explicitly
    role:
      typeof user.publicMetadata?.role === "string"
        ? getRoleName(user.publicMetadata.role)
        : "Rol no asignado",
    initials: getInitials(user.fullName),
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


