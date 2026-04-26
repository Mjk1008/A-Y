import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
    const res = await pool.query("SELECT * FROM profiles WHERE user_id=$1", [session.id]);
    return NextResponse.json({ profile: res.rows[0] ?? null });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

    // Note: ALTER TABLE removed — schema migrations belong in db-migrate.ts

    const body = await req.json();
    const {
      nickname,
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
      `INSERT INTO profiles
         (user_id, nickname, full_name, age, job_title, industry, years_experience, skills, bio, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, now())
       ON CONFLICT (user_id) DO UPDATE SET
         nickname          = COALESCE(EXCLUDED.nickname, profiles.nickname),
         full_name         = COALESCE(EXCLUDED.full_name, profiles.full_name),
         age               = COALESCE(EXCLUDED.age, profiles.age),
         job_title         = COALESCE(EXCLUDED.job_title, profiles.job_title),
         industry          = COALESCE(EXCLUDED.industry, profiles.industry),
         years_experience  = COALESCE(EXCLUDED.years_experience, profiles.years_experience),
         skills            = COALESCE(EXCLUDED.skills, profiles.skills),
         bio               = COALESCE(EXCLUDED.bio, profiles.bio),
         updated_at        = now()`,
      [
        session.id,
        nickname ?? null,
        full_name ?? null,
        age ?? null,
        job_title ?? null,
        industry ?? null,
        years_experience ?? null,
        skills ?? null,
        bio ?? null,
      ]
    );

    // Also update full_name in users table
    if (full_name) {
      await pool.query("UPDATE users SET full_name=$1 WHERE id=$2", [full_name, session.id]);
    }

    // If resume parsed text provided, replace previous text-only resumes and insert new one
    if (resume_parsed_text) {
      // Clean up old text-only resume entries (W13)
      await pool.query(
        `DELETE FROM resumes WHERE user_id=$1 AND file_path='text-paste'`,
        [session.id]
      ).catch(() => {}); // ignore if column doesn't exist

      // Insert with placeholder values for file_path/file_name (C6 fix)
      await pool.query(
        `INSERT INTO resumes (user_id, parsed_text, file_path, file_name)
         VALUES ($1, $2, 'text-paste', 'manual-entry')`,
        [session.id, resume_parsed_text]
      ).catch(async () => {
        // Fallback: try without file columns (schema may vary on Liara)
        await pool.query(
          "INSERT INTO resumes (user_id, parsed_text) VALUES ($1, $2)",
          [session.id, resume_parsed_text]
        ).catch(() => {});
      });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
