import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { query } from "@/lib/db";

// Phones that have access to the exclusive bike game 🚲
const BIKE_PHONES = ["09301576943", "09366291008"];

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ features: { bikeGame: false } });
  }

  try {
    const res = await query("SELECT phone FROM users WHERE id = $1", [session.id]);
    const phone: string = res.rows[0]?.phone ?? "";
    return NextResponse.json({
      features: {
        bikeGame: BIKE_PHONES.includes(phone),
      },
    });
  } catch {
    return NextResponse.json({ features: { bikeGame: false } });
  }
}
