import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isEvaluacionesRoute = createRouteMatcher(["/evaluaciones(.*)"]);
const isEdificiosRoute = createRouteMatcher(["/edificios(.*)"]);
const isPriorizacionRoute = createRouteMatcher(["/priorizacion(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims } = await auth();
  const userRole = sessionClaims?.metadata?.role;

  // Protect admin routes
  if (isAdminRoute(req) && userRole !== "admin") {
    const url = new URL("/", req.url);
    return NextResponse.redirect(url);
  }

  // Protect evaluaciones and edificios routes
  if (
    (isEvaluacionesRoute(req) || isEdificiosRoute(req)) &&
    !["evaluadorCondiciones", "evaluadorGeneral", "admin"].includes(userRole as string)
  ) {
    const url = new URL("/", req.url);
    return NextResponse.redirect(url);
  }

  // Protect priorizacion routes
  if (
    isPriorizacionRoute(req) &&
    !["evaluadorProyecto", "evaluadorGeneral", "admin"].includes(userRole as string)
  ) {
    const url = new URL("/", req.url);
    return NextResponse.redirect(url);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
