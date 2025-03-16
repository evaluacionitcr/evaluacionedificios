import { redirect } from "next/navigation";
import { checkRole } from "~/utils/roles";
import { clerkClient } from "@clerk/nextjs/server";
import { removeRole, setRole } from "./_actions";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function AdminDashboard() {
  if (!(await checkRole("admin"))) {
    console.log("role not admin");
    redirect("/");
  }

  // Obtener todos los usuarios sin filtrar por búsqueda
  const client = await clerkClient();
  const users = await client.users.getUserList({ limit: 100 });

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/admin/usuarios">
        <Button variant="ghost" size="icon" className="mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </Link>
      <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">
          Panel de Administración
        </h1>
        <p className="mb-6 text-gray-600">
          Este es el panel de administración protegido, restringido a usuarios
          con el rol{" "}
          <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-sm">
            admin
          </code>
          .
        </p>

        {users.data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    Nombre
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    Correo Electrónico
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    Rol Actual
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.data.map((user) => {
                  const primaryEmail = user.emailAddresses.find(
                    (email) => email.id === user.primaryEmailAddressId,
                  )?.emailAddress;
                  const currentRole = user.publicMetadata.role as string;

                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {primaryEmail}
                      </td>
                      <td className="px-4 py-3">
                        {currentRole ? (
                          <span
                            className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                              currentRole === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {currentRole}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <form action={setRole} className="inline-block">
                            <input type="hidden" value={user.id} name="id" />
                            <input type="hidden" value="admin" name="role" />
                            <button
                              type="submit"
                              className="rounded bg-purple-600 px-3 py-1 text-sm text-white transition hover:bg-purple-700"
                            >
                              Admin
                            </button>
                          </form>
                          <form action={setRole} className="inline-block">
                            <input type="hidden" value={user.id} name="id" />
                            <input type="hidden" value="auxiliar" name="role" />
                            <button
                              type="submit"
                              className="rounded bg-blue-600 px-3 py-1 text-sm text-white transition hover:bg-blue-700"
                            >
                              Auxiliar de Administrador
                            </button>
                          </form>
                          <form action={setRole} className="inline-block">
                            <input type="hidden" value={user.id} name="id" />
                            <input
                              type="hidden"
                              value="evaluadorProyecto"
                              name="role"
                            />
                            <button
                              type="submit"
                              className="rounded bg-green-600 px-3 py-1 text-sm text-white transition hover:bg-green-700"
                            >
                              Evaluador de Proyectos
                            </button>
                          </form>
                          <form action={setRole} className="inline-block">
                            <input type="hidden" value={user.id} name="id" />
                            <input
                              type="hidden"
                              value="evaluadorCondiciones"
                              name="role"
                            />
                            <button
                              type="submit"
                              className="rounded bg-yellow-600 px-3 py-1 text-sm text-white transition hover:bg-yellow-700"
                            >
                              Evaluador de Condiciones
                            </button>
                          </form>
                          <form action={setRole} className="inline-block">
                            <input type="hidden" value={user.id} name="id" />
                            <input
                              type="hidden"
                              value="evaluadorGeneral"
                              name="role"
                            />
                            <button
                              type="submit"
                              className="rounded bg-orange-600 px-3 py-1 text-sm text-white transition hover:bg-orange-700"
                            >
                              Evaluador General
                            </button>
                          </form>
                          <form action={removeRole} className="inline-block">
                            <input type="hidden" value={user.id} name="id" />
                            <button
                              type="submit"
                              className="rounded bg-red-600 px-3 py-1 text-sm text-white transition hover:bg-red-700"
                            >
                              Quitar Rol
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            No hay usuarios disponibles en el sistema
          </div>
        )}
      </div>
    </div>
  );
}
