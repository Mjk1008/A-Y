import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { pool } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

    const body = await req.json();
    const {
      full_name,
      age,
      job_title,
      industry,
      years_experience,
      skills,
      bio,
      resume_parsed_text,
    } = body;

    // Upsert profile
    await pool.query(
      `INSERT INTO profiles (user_id, full_name, age, job_title, industry, years_experience, skills, bio, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, now())
       ON CONFLICT (user_id) DO UPDATE SET
         full_name = EXCLUDED.full_name,
         age = EXCLUDED.age,
         job_title = EXCLUDED.job_title,
         industry = EXCLUDED.industry,
         years_experience = EXCLUDED.years_experience,
         skills = EXCLUDED.skills,
         bio = EXCLUDED.bio,
         updated_at = now()`,
      [session.id, full_name, age ?? null, job_title, industry, years_experience ?? 0, skills ?? [], bio ?? null]
    );

    // Also update full_name in users table
    if (full_name) {
      await pool.query("UPDATE users SET full_name=$1 WHERE id=$2", [full_name, session.id]);
    }

    // If resume parsed text provided, store it
    if (resume_parsed_text) {
      await pool.query(
        "INSERT INTO resumes (user_id, parsed_text) VALUES ($1, $2)",
        [session.id, resume_parsed_text]
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
