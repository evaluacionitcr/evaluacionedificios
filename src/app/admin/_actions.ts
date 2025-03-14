"use server";

import { checkRole } from "~/utils/roles";
import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function setRole(formData: FormData): Promise<void> {
  const client = await clerkClient();
  // Check that the user trying to set the role is an admin
  if (!checkRole("admin")) {
    // Instead of returning, throw an error
    throw new Error("Not Authorized");
  }

  try {
    await client.users.updateUserMetadata(formData.get("id") as string, {
      publicMetadata: { role: formData.get("role") },
    });

    // Revalidate the page to show updated data
    revalidatePath("/admin");
  } catch (err) {
    // Instead of returning the error, throw it
    throw new Error(
      `Failed to set role: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}

export async function removeRole(formData: FormData): Promise<void> {
  const client = await clerkClient();

  if (!checkRole("admin")) {
    throw new Error("Not Authorized");
  }

  try {
    await client.users.updateUserMetadata(formData.get("id") as string, {
      publicMetadata: { role: null },
    });

    // Revalidate the page to show updated data
    revalidatePath("/admin");
  } catch (err) {
    throw new Error(
      `Failed to remove role: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}
