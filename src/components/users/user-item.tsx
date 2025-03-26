import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import UserDeleteButton from "./user-delete-button";

interface UserItemProps {
  user: {
    id: string;
    name: string;
    role: string;
    initials: string;
    email: string;
  };
}

export default function UserItem({ user }: UserItemProps) {
  return (
    <div className="flex items-center rounded-lg p-4 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800">
      <div className="flex min-w-0 flex-1 items-center">
        <Avatar className="mr-4 h-10 w-10">
          <AvatarImage src="/placeholder.svg" alt={`Avatar de ${user.name}`} />
          <AvatarFallback className="bg-gray-200 dark:bg-gray-600">
            {user.initials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-2">
            <h3 className="truncate font-medium">{user.name}</h3>
            <span className="hidden truncate text-xs text-muted-foreground sm:inline">
              •
            </span>
            <span className="truncate text-sm text-muted-foreground">
              {user.email}
            </span>
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {user.role}
            </span>
          </div>
        </div>
      </div>

      <div className="ml-4 flex items-center space-x-2">
        <Link href={`/admin/usuarios/editar/${user.id}`}>
          <Button variant="outline" size="sm" className="hidden sm:inline-flex">
            Editar
          </Button>
        </Link>
        <UserDeleteButton id={user.id} />
      </div>
    </div>
  );
}
