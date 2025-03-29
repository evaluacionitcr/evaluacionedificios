// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  timestamp,
  varchar,
  boolean,
  decimal,
  real,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(
  (name) => `evaluacionedificios_${name}`,
);

export const posts = createTable(
  "post",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  }),
);

export const clerkUsers = createTable("clerk_users", {
  id: varchar("id").primaryKey(),
  first_name: varchar("first_name"),
  last_name: varchar("last_name"),
  email: varchar("email").unique(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});



// Tabla Sedes
export const Sedes = createTable("sedes", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  nombre: varchar("nombre", { length: 256 }).notNull(),
});

// Tabla NumeroFincas
export const NumeroFincas = createTable("numero_fincas", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  numero: varchar("numero", { length: 50 }).notNull(),
});

// Tabla UsosActuales
export const UsosActuales = createTable("usos_actuales", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  descripcion: varchar("descripcion", { length: 256 }).notNull(),
});

// Tabla Edificaciones
export const Edificaciones = createTable(
  "edificaciones",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    codigoEdificio: varchar("codigo_edificio", { length: 50 }).notNull(),
    sede: integer("sede").references(() => Sedes.id),
    esRenovacion: boolean("es_renovacion"),
    nombre: varchar("nombre", { length: 256 }).notNull(),
    fechaConstruccion: integer("fecha_construccion"), // Año como entero
    noFinca: integer("no_finca").references(() => NumeroFincas.id),
    m2Construccion: real("m2_construccion"), // Área en metros cuadrados
    valorDolarPorM2: decimal("valor_dolar_por_m2", { precision: 12, scale: 2 }),
    valorColonPorM2: decimal("valor_colon_por_m2", { precision: 12, scale: 2 }),
    edadAl2021: integer("edad_al_2021"),
    vidaUtilHacienda: integer("vida_util_hacienda"),
    vidaUtilExperto: integer("vida_util_experto"),
    valorEdificioIR: decimal("valor_edificio_ir", { precision: 14, scale: 2 }),
    depreciacionLinealAnual: decimal("depreciacion_lineal_anual", { precision: 14, scale: 2 }),
    valorActualRevaluado: decimal("valor_actual_revaluado", { precision: 14, scale: 2 }),
    anoDeRevaluacion: integer("ano_de_revaluacion"), // Año como entero
    usoActual: integer("uso_actual").references(() => UsosActuales.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (edificaciones) => ({
    codigoEdificioIndex: index("codigo_edificio_idx").on(edificaciones.codigoEdificio),
  }),
);
