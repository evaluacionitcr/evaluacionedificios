import { Building } from "lucide-react";
import { Button } from "~/components/ui/button";
import { UserButton } from "@clerk/clerk-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b bg-white p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="md:hidden">
          <Button variant="ghost" size="icon">
            <Building className="h-6 w-6 text-primary" />
          </Button>
        </div>
        <div className="font-bold text-primary md:hidden">
          Oficina de Ingeniería
        </div>
      </div>

      <div>
        <UserButton />
      </div>
    </header>
  );
}
