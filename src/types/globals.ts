export {};

// Create a type for the roles
export type Roles = "admin" | "auxiliar" | "evaluadorProyecto" | "evaluadorCondiciones" | "evaluadorGeneral";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}
