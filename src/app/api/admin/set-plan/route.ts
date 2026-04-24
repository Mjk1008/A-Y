/**
 * POST /api/admin/set-plan
 *
 * Upgrades or downgrades a user's plan. Protected by a secret header.
 * Only callable server-to-server or by the admin with the secret.
 *
 * Body: { phone: string; plan: "free" | "pro" | "max"; is_admin?: boolean }
 * Header: x-admin-secret: <ADMIN_SECRET env var>
 */

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  /* Auth check */
  const secret = req.headers.get("x-admin-secret");
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { phone?: string; plan?: string; is_admin?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { phone, plan, is_admin } = body;

  if (!phone || !plan) {
    return NextResponse.json({ error: "phone and plan are required" }, { status: 400 });
  }

  if (!["free", "pro", "max"].includes(plan)) {
    return NextResponse.json({ error: "plan must be free | pro | max" }, { status: 400 });
  }

  /* Normalize phone */
  const normalizedPhone = phone.replace(/\D/g, "").replace(/^98/, "0");

  const result = await pool.query(
    `INSERT INTO users (phone, plan_type, is_admin, created_at)
     VALUES ($1, $2, $3, now())
     ON CONFLICT (phone)
     DO UPDATE SET
       plan_type = $2,
       is_admin  = COALESCE($3, users.is_admin)
     RETURNING id, phone, plan_type, is_admin`,
    [normalizedPhone, plan, is_admin ?? false]
  );

  const user = result.rows[0];
  return NextResponse.json({
    success: true,
    user: { id: user.id, phone: user.phone, plan: user.plan_type, is_admin: user.is_admin },
  });
}
