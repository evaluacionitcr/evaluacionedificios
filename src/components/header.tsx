import { Building } from "lucide-react"
import { Button } from "~/components/ui/button"
import UserMenu from "./user-menu"
import Link from "next/link"
import { UserButton } from "@clerk/clerk-react"

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b bg-white p-4 shadow-sm">
      <div className="md:hidden">
        <Button variant="ghost" size="icon">
          <Building className="text-primary h-6 w-6" />
        </Button>
      </div>
      <div className="text-primary font-bold md:hidden">
        Oficina de Ingeniería
      </div>
      <div className="flex items-center gap-4 justify-items-end">
          <UserButton />

      </div>
    </header>
  );
}

