import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import UserList from "~/components/user-list"
import UserListWrapper from "./UserListWrapper"
import Link from 'next/link'

export default function UsersView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <div className="flex gap-4">
          <Button>Agregar Usuario</Button>
          <Link href="/admin">
            <Button>Manejar Roles</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuarios del Sistema</CardTitle>
          <CardDescription>
            Administre los usuarios que tienen acceso al sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserListWrapper />
        </CardContent>
      </Card>
    </div>
  );
}

