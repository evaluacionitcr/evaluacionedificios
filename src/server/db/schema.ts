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
  text,
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
export const Construcciones = createTable(
  "construcciones",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    codigoEdificio: varchar("codigo_edificio", { length: 50 })
      .notNull()
      .unique(),
    sede: integer("sede").references(() => Sedes.id),
    esRenovacion: boolean("es_renovacion"),
    nombre: varchar("nombre", { length: 256 }).notNull(),
    fechaConstruccion: integer("fecha_construccion"), // Año como entero
    noFinca: integer("no_finca").references(() => NumeroFincas.id),
    m2Construccion: real("m2_construccion"), // Área en metros cuadrados
    valorDolarPorM2: decimal("valor_dolar_por_m2", { precision: 12, scale: 2 }),
    valorColonPorM2: decimal("valor_colon_por_m2", { precision: 12, scale: 2 }),
    edad: integer("edad"),
    vidaUtilHacienda: integer("vida_util_hacienda"),
    vidaUtilExperto: integer("vida_util_experto"),
    valorReposicion: decimal("valor_reposicion", { precision: 14, scale: 2 }),
    depreciacionLinealAnual: decimal("depreciacion_lineal_anual", {
      precision: 14,
      scale: 2,
    }),
    valorActualRevaluado: decimal("valor_actual_revaluado", {
      precision: 14,
      scale: 2,
    }),
    valorPorcionTerreno: decimal("valor_porcion_terreno", {
      precision: 14,
      scale: 2,
    }),
    anoDeRevaluacion: integer("ano_de_revaluacion"), // Año como entero
    usoActual: integer("uso_actual").references(() => UsosActuales.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
    activo: boolean("activo").default(true),
  },
  (construcciones) => ({
    codigoEdificioIndex: index("codigo_edificio_idx").on(
      construcciones.codigoEdificio,
    ),
  }),
);

export const Aceras = createTable(
  "aceras",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    idConstruccion: integer("id_construccion").references(
      () => Construcciones.id,
      { onDelete: "cascade" },
    ),
    codigoEdificio: varchar("codigo_edificio", { length: 50 })
      .notNull()
      .unique(),
    nombre: varchar("nombre", { length: 256 }).notNull(),
    fechaConstruccion: integer("fecha_construccion"), // Año como entero
    noFinca: integer("no_finca").references(() => NumeroFincas.id),
    m2Construccion: real("m2_construccion"), // Área en metros cuadrados
    valorDolarPorM2: decimal("valor_dolar_por_m2", { precision: 12, scale: 2 }),
    valorColonPorM2: decimal("valor_colon_por_m2", { precision: 12, scale: 2 }),
    edadAl2021: integer("edad_al_2021"),
    vidaUtilHacienda: integer("vida_util_hacienda"),
    vidaUtilExperto: integer("vida_util_experto"),
    valorReposicion: decimal("valor_reposicion", { precision: 14, scale: 2 }),
    depreciacionLinealAnual: decimal("depreciacion_lineal_anual", {
      precision: 14,
      scale: 2,
    }),
    valorActualRevaluado: decimal("valor_actual_revaluado", {
      precision: 14,
      scale: 2,
    }),
    valorPorcionTerreno: decimal("valor_porcion_terreno", {
      precision: 14,
      scale: 2,
    }),
    anoDeRevaluacion: integer("ano_de_revaluacion"), // Año como entero
    usoActual: integer("uso_actual").references(() => UsosActuales.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (construcciones) => ({
    codigoEdificioIndex2: index("codigo_edificio_idx2").on(
      construcciones.codigoEdificio,
    ),
  }),
);

export const ZonasVerdes = createTable(
  "zonas_verdes",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    idConstruccion: integer("id_construccion").references(
      () => Construcciones.id,
      { onDelete: "cascade" },
    ),
    codigoEdificio: varchar("codigo_edificio", { length: 50 }).notNull(),
    nombre: varchar("nombre", { length: 256 }).notNull(),
    fechaConstruccion: integer("fecha_construccion"), // Año como entero
    noFinca: integer("no_finca").references(() => NumeroFincas.id),
    m2Construccion: real("m2_construccion"), // Área en metros cuadrados
    valorDolarPorM2: decimal("valor_dolar_por_m2", { precision: 12, scale: 2 }),
    valorColonPorM2: decimal("valor_colon_por_m2", { precision: 12, scale: 2 }),
    edadAl2021: integer("edad_al_2021"),
    vidaUtilHacienda: integer("vida_util_hacienda"),
    vidaUtilExperto: integer("vida_util_experto"),
    valorReposicion: decimal("valor_reposicion", { precision: 14, scale: 2 }),
    depreciacionLinealAnual: decimal("depreciacion_lineal_anual", {
      precision: 14,
      scale: 2,
    }),
    valorActualRevaluado: decimal("valor_actual_revaluado", {
      precision: 14,
      scale: 2,
    }),
    valorPorcionTerreno: decimal("valor_porcion_terreno", {
      precision: 14,
      scale: 2,
    }),
    anoDeRevaluacion: integer("ano_de_revaluacion"), // Año como entero
    usoActual: integer("uso_actual").references(() => UsosActuales.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (construcciones) => ({
    codigoEdificioIndex3: index("codigo_edificio_idx3").on(
      construcciones.codigoEdificio,
    ),
  }),
);

export const Terrenos = createTable(
  "terreno",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    idConstruccion: integer("id_construccion").references(
      () => Construcciones.id,
      { onDelete: "cascade" },
    ),
    codigoEdificio: varchar("codigo_edificio", { length: 50 })
      .notNull()
      .unique(),
    nombre: varchar("nombre", { length: 256 }).notNull(),
    fechaConstruccion: integer("fecha_construccion"), // Año como entero
    noFinca: integer("no_finca").references(() => NumeroFincas.id),
    m2Construccion: real("m2_construccion"), // Área en metros cuadrados
    valorDolarPorM2: decimal("valor_dolar_por_m2", { precision: 12, scale: 2 }),
    valorColonPorM2: decimal("valor_colon_por_m2", { precision: 12, scale: 2 }),
    valorPorcionTerreno: decimal("valor_porcion_terreno", {
      precision: 14,
      scale: 2,
    }),
    anoDeRevaluacion: integer("ano_de_revaluacion"), // Año como entero
    usoActual: integer("uso_actual").references(() => UsosActuales.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (construcciones) => ({
    codigoEdificioIndex4: index("codigo_edificio_idx4").on(
      construcciones.codigoEdificio,
    ),
  }),
);

export const Evaluaciones = createTable("evaluations", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
  buildingId: integer("building_id").references(() => Construcciones.id, {
    onDelete: "cascade",
  }),
  evaluatorId: varchar("evaluator_id").references(() => clerkUsers.id),
  score: integer("score").notNull(),
  comments: text("comments"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const images = createTable(
  "image",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }).notNull(),
    description: varchar("description", { length: 256 }).notNull(),
    url: varchar("url", { length: 1024 }).notNull(),
    buildingId: integer("building_id").references(() => Construcciones.id, {
      onDelete: "cascade",
    }),
    evaluationId: integer("evaluation_id").references(() => Evaluaciones.id),
    userId: varchar("user_id", { length: 256 }).notNull(),
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

export const Componentes = createTable("components", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  componente: varchar("componente", { length: 256 }).notNull(),
  peso: decimal("peso", { precision: 5, scale: 2 }).notNull(),
  elementos: text("elementos").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const EstadosConservacion = createTable("estado_conservacion", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  estado_conservacion: varchar("estado", { length: 256 }).notNull(),
  condiciones_fisicas: varchar("condiciones", { length: 256 }).notNull(),
  clasificacion: varchar("clasificacion", { length: 256 }).notNull(),
  coef_depreciacion: decimal("coef_depreciacion", {
    precision: 5,
    scale: 2,
  }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const Funcionalidades = createTable("funcionalidades", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  Estado: varchar("estado", { length: 256 }).notNull(),
  Puntuacion: decimal("puntuacion", {
    precision: 5,
    scale: 2,
  }).notNull(),
  Descripcion: varchar("descripcion", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const Normativas = createTable("normativa", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  Estado: varchar("estado", { length: 256 }).notNull(),
  Puntuacion: decimal("puntuacion", {
    precision: 5,
    scale: 2,
  }).notNull(),
  Descripcion: varchar("descripcion", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const EjesPriorizacion = createTable("ejes_priorizacion", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  eje: varchar("eje", { length: 256 }).notNull(),
  peso: decimal("peso", { precision: 5, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Evaluation = typeof Evaluaciones.$inferSelect;
export type NewEvaluation = typeof Evaluaciones.$inferInsert;
