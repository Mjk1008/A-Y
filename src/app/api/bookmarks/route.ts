import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { query } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const type = new URL(req.url).searchParams.get("type");
  const res = await query(
    `SELECT * FROM bookmarks WHERE user_id=$1 ${type ? "AND type=$2" : ""} ORDER BY created_at DESC`,
    type ? [session.id, type] : [session.id]
  );

  return NextResponse.json({ bookmarks: res.rows });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { type, itemId, itemData } = await req.json();
  if (!["job","course","tool"].includes(type)) {
    return NextResponse.json({ error: "invalid type" }, { status: 400 });
  }

  await query(
    `INSERT INTO bookmarks (user_id, type, item_id, item_data)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (user_id,type,item_id) DO NOTHING`,
    [session.id, type, itemId, JSON.stringify(itemData || {})]
  );

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { type, itemId } = await req.json();
  await query(
    `DELETE FROM bookmarks WHERE user_id=$1 AND type=$2 AND item_id=$3`,
    [session.id, type, itemId]
  );

  return NextResponse.json({ ok: true });
}
