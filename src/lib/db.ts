import { Pool } from "pg";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export default pool;
export { pool };

/** Convenience wrapper — identical to pool.query but importable as a named export */
export const query = (text: string, params?: unknown[]) => pool.query(text, params);
