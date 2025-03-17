import { Button } from "~/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import Link from "next/link";
import UserDeleteButton from "./user-delete-button";

interface UserItemProps {
  user: {
    id : string
    name: string
    role: string
    initials: string
  }
}

export default function UserItem({ user }: UserItemProps) {
  return (
    <div className="flex items-center rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
      <Avatar className="mr-4 h-10 w-10">
        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Avatar" />
        <AvatarFallback>{user.initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="font-medium">{user.name}</div>
        <div className="text-sm text-muted-foreground">{user.role}</div>
      </div>
      <div>
        <UserDeleteButton id={user.id} />
        <Link href={`/admin/usuarios/editar/${user.id}`}>
          <Button variant="ghost" size="sm">
            Editar
          </Button>
        </Link>
      </div>
    </div>
  );
}

