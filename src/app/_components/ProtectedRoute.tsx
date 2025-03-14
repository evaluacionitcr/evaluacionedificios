"use client";
import { RedirectToSignIn, SignedIn, SignedOut, useAuth } from "@clerk/nextjs";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return <p>Loading...</p>; // Muestra un mensaje de carga mientras se verifica el estado
  }

  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
