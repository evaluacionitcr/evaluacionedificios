import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import UserForm from "~/components/users/user-form";

export default function EditUsersView({ id }: { id: string }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Editar usuario</h1>
        <div className="flex gap-2"></div>
      </div>
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-primary">Editar usuario</CardTitle>
          <CardDescription>Edite los datos del usuario</CardDescription>
        </CardHeader>
        <CardContent>
          <UserForm id={id} />
        </CardContent>
      </Card>
    </div>
  );
}
