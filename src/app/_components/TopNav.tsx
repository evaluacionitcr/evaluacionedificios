"use client"
import { useAuth, UserButton } from "@clerk/nextjs";

export function TopNav() {
  const { isSignedIn } = useAuth();

  return (
    <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Sistema de Evaluaciones ITCR</span>
        </div>
        <div className="flex items-center gap-2">
          {isSignedIn && (
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                },
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
