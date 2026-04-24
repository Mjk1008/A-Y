import pg from "./node_modules/pg/lib/index.js";
import { readFileSync } from "fs";

const { Pool } = pg;
const pool = new Pool({
  connectionString: "postgresql://root:gXIoL5or06aOUo9P9nKcM6AW@cho-oyu.liara.cloud:34647/postgres",
});

const sql = readFileSync("./src/lib/db/migrations/004_chat_history.sql", "utf8");

try {
  await pool.query(sql);
  console.log("✅ Migration 004 applied successfully.");
} catch (e) {
  console.error("❌ Migration failed:", e.message);
} finally {
  await pool.end();
}
