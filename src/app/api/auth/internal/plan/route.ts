import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-internal-secret");
  const expected = process.env.INTERNAL_SECRET;
  // Require a non-empty INTERNAL_SECRET — fail-closed if env var not set
  if (!expected || !secret || secret !== expected) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });
  try {
    const res = await pool.query("SELECT plan_type FROM users WHERE id=$1", [id]);
    if (!res.rows[0]) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json({ plan: res.rows[0].plan_type });
  } catch {
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
