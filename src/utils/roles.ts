import { Roles } from "~/types/globals";
import { auth } from "@clerk/nextjs/server";

export const checkRole = async (role: Roles) => {
  const { sessionClaims } = await auth();
  console.log("Session Claims:", sessionClaims);

  if (!sessionClaims?.metadata?.role) {
    console.log("No role found");
    return false;
  }

  return sessionClaims.metadata.role === role;
};
