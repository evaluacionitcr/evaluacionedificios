import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "~/env";
import * as schema from "./schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const connectionConfig = {
  max: 1,
  connection: {
    application_name: 'evaluacionedificios',
  },
  onnotice: (notice: { severity?: string; [key: string]: unknown }) => {
    if (notice.severity === 'NOTICE') {
      console.log('PostgreSQL notice:', notice);
    }
  },
};

const conn = globalForDb.conn ?? postgres(env.DATABASE_URL, connectionConfig);
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
