import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import UserList from "~/components/users/user-list";

export default function UsersView() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-primary">Usuarios</h1>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/usuarios/agregar">
            <Button>Agregar Usuario</Button>
          </Link>
          <Link href="/admin/usuarios/roles">
            <Button variant="outline">Administrar Roles</Button>
          </Link>
        </div>
      </div>

      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-primary">Usuarios del Sistema</CardTitle>
          <CardDescription>
            Administre los usuarios que tienen acceso al sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <UserList />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
