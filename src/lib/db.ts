import { Pool } from "pg";

/**
 * Connection pool tuned for Liara's managed PostgreSQL.
 *
 * Liara free/starter plans allow ~20 simultaneous connections.
 * Next.js serverless functions can spin up many instances — cap the pool
 * so we never exceed the DB limit even under burst traffic.
 *
 * Rule of thumb:  max = floor(db_max_connections / expected_instances)
 * Safe default for Liara starter: max=5 per instance, 4 idle at most.
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  // Maximum connections this pool will hold open
  max: parseInt(process.env.PG_POOL_MAX ?? "5", 10),

  // Release idle connections after 30 s (prevents "too many clients" on Liara)
  idleTimeoutMillis: 30_000,

  // Fail fast if we can't get a connection within 5 s (surface errors clearly)
  connectionTimeoutMillis: 5_000,

  // Keep the connection alive on the server side (prevents Liara TCP resets)
  keepAlive: true,
  keepAliveInitialDelayMillis: 10_000,
});

// Log pool errors so they surface in Liara logs rather than silently hanging
pool.on("error", (err) => {
  console.error("[pg-pool] idle client error:", err.message);
});

export default pool;
export { pool };

/** Convenience wrapper — identical to pool.query but importable as a named export */
export const query = (text: string, params?: unknown[]) => pool.query(text, params);
