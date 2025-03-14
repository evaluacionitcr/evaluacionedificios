import { headers } from "next/headers";
import { Webhook } from "svix";
import { db } from "~/server/db";
import { clerkUsers } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import type { WebhookEvent } from "@clerk/nextjs/server"; // Tipos de Clerk

const WEBHOOK_SECRET = process.env.SIGNING_SECRET;

export async function POST(req: Request) {
  try {
    const payload = await req.text();
    const headersList = await headers();

    // Verificar que el secreto del webhook esté definido
    if (!WEBHOOK_SECRET) {
      throw new Error("CLERK_WEBHOOK_SECRET is not set");
    }

    // Obtener los encabezados necesarios
    const svixId = headersList.get("svix-id");
    const svixTimestamp = headersList.get("svix-timestamp");
    const svixSignature = headersList.get("svix-signature");

    // Verificar que los encabezados no sean null
    if (!svixId || !svixTimestamp || !svixSignature) {
      return new Response("Missing required headers", { status: 400 });
    }

    // Crear el objeto de encabezados
    const svixHeaders = {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    };

    const wh = new Webhook(WEBHOOK_SECRET);
    let event: WebhookEvent;

    try {
      event = wh.verify(payload, svixHeaders) as WebhookEvent;
    } catch (error) {
      console.error("Invalid webhook signature:", error);
      return new Response("Invalid signature", { status: 401 });
    }

    // Manejar el evento
    switch (event.type) {
      case "user.created":
      case "user.updated": {
        const { id, first_name, last_name, email_addresses } = event.data;

        // Validar que email_addresses esté definido y no esté vacío
        if (!email_addresses || email_addresses.length === 0) {
          console.error("No email addresses found for user:", id);
          return new Response("No email found", { status: 400 });
        }

        // Acceder al primer email (seguro porque ya validamos que email_addresses no está vacío)
        const email = email_addresses[0]!.email_address;

        // Insertar o actualizar el usuario en Supabase usando Drizzle
        await db
          .insert(clerkUsers)
          .values({
            id,
            first_name,
            last_name,
            email,
            updated_at: new Date(),
          })
          .onConflictDoUpdate({
            target: clerkUsers.id,
            set: {
              first_name,
              last_name,
              email,
              updated_at: new Date(),
            },
          });
        break;
      }

      case "user.deleted": {
        const userId = event.data.id;

        // Eliminar el usuario de Supabase usando Drizzle
        await db.delete(clerkUsers).where(eq(clerkUsers.id, userId!));
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response("Webhook received", { status: 200 });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
