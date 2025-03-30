import { Building } from "lucide-react";
import { Button } from "~/components/ui/button";
import { UserButton } from "@clerk/clerk-react";

interface HeaderProps {
  children?: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b bg-white p-4 shadow-sm">
      <div className="flex items-center gap-4">
        {children}
        <div className="font-bold text-primary">Oficina de Ingeniería</div>
      </div>

      <div>
        <UserButton />
      </div>
    </header>
  );
}
