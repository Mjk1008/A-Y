import { readFileSync } from "fs";
import pkg from "./node_modules/pg/lib/index.js";
const { Pool } = pkg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const sql = readFileSync("./src/lib/db/migrations/005_ensure_admin.sql", "utf8");

try {
  await pool.query(sql);
  console.log("✅ Migration 005 applied — admin user ensured.");
} catch (e) {
  console.error("❌ Migration failed:", e.message);
} finally {
  await pool.end();
}
