import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { CURATED_TOOLS } from "@/lib/crawlers/tools";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q          = searchParams.get("q")?.trim() || "";
  const category   = searchParams.get("category")?.trim() || "";
  const difficulty = searchParams.get("difficulty")?.trim() || "";
  const pricing    = searchParams.get("pricing")?.trim() || "";    // free|freemium|paid
  const iran       = searchParams.get("iran");                       // "true" = Iran accessible only
  const limit      = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
  const offset     = parseInt(searchParams.get("offset") || "0");

  try {
    // Check if DB has tools
    const countRes = await pool.query("SELECT COUNT(*) FROM crawled_tools");
    const dbCount = parseInt(countRes.rows[0].count);

    if (dbCount === 0) {
      // Fall back to curated list (in-memory)
      let tools = CURATED_TOOLS;
      if (q) tools = tools.filter(t =>
        t.name.toLowerCase().includes(q.toLowerCase()) ||
        t.description.toLowerCase().includes(q.toLowerCase()) ||
        t.tagline.toLowerCase().includes(q.toLowerCase())
      );
      if (category) tools = tools.filter(t => t.categories.some(c => c.includes(category)));
      if (difficulty) tools = tools.filter(t => t.difficulty === difficulty);
      if (pricing) tools = tools.filter(t => t.pricing_model === pricing);
      if (iran === "true") tools = tools.filter(t => t.is_iran_accessible);

      const paginated = tools.slice(offset, offset + limit);
      return NextResponse.json({ tools: paginated, total: tools.length, source: "curated" });
    }

    // Build DB query
    const conditions: string[] = [];
    const params: unknown[]    = [];
    let p = 1;

    if (q) {
      conditions.push(`(name ILIKE $${p} OR tagline ILIKE $${p} OR description ILIKE $${p})`);
      params.push(`%${q}%`); p++;
    }
    if (category) {
      conditions.push(`$${p} = ANY(categories)`);
      params.push(category); p++;
    }
    if (difficulty) {
      conditions.push(`difficulty = $${p}`);
      params.push(difficulty); p++;
    }
    if (pricing) {
      conditions.push(`pricing_model = $${p}`);
      params.push(pricing); p++;
    }
    if (iran === "true") {
      conditions.push(`is_iran_accessible = TRUE`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const [dataRes, countRes2] = await Promise.all([
      pool.query(
        `SELECT * FROM crawled_tools ${where} ORDER BY name ASC LIMIT $${p} OFFSET $${p + 1}`,
        [...params, limit, offset]
      ),
      pool.query(`SELECT COUNT(*) FROM crawled_tools ${where}`, params),
    ]);

    return NextResponse.json({
      tools: dataRes.rows,
      total: parseInt(countRes2.rows[0].count),
      source: "db",
    });
  } catch (err) {
    console.error("Tools API error:", err);
    // Final fallback — return curated list
    return NextResponse.json({ tools: CURATED_TOOLS, total: CURATED_TOOLS.length, source: "fallback" });
  }
}
