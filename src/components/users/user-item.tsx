import { Button } from "~/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import Link from "next/link";

interface UserItemProps {
  user: {
    name: string
    role: string
    initials: string
  }
}

export default function UserItem({ user }: UserItemProps) {
  return (
    <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
      <Avatar className="h-10 w-10 mr-4">
        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Avatar" />
        <AvatarFallback>{user.initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="font-medium">{user.name}</div>
        <div className="text-sm text-muted-foreground">{user.role}</div>
      </div>
      <Link href={`/admin/usuarios/editarUsuario`}>
        <Button variant="ghost" size="sm">
          Editar
        </Button>
      </Link>
    </div>
  )
}

