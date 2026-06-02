import { Pool } from "pg";

const g = globalThis as typeof globalThis & { _pgPool?: Pool };

export const db: Pool =
  g._pgPool ??
  (g._pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  }));

export type QueryResult<T> = { rows: T[] };
