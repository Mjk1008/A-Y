import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeProfile, type ProfileInput } from "@/lib/claude";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();
    if (!profile) return NextResponse.json({ error: "no_profile" }, { status: 400 });

    const { data: resume } = await supabase
      .from("resumes")
      .select("parsed_text")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const input: ProfileInput = {
      full_name: profile.full_name,
      age: profile.age ?? undefined,
      job_title: profile.job_title,
      industry: profile.industry,
      years_experience: profile.years_experience,
      skills: profile.skills ?? [],
      bio: profile.bio ?? undefined,
      resume_text: resume?.parsed_text ?? undefined,
      plan: (profile.plan_type as "free" | "pro") ?? "free",
    };

    const result = await analyzeProfile(input);

    const { data: saved, error: insErr } = await supabase
      .from("analyses")
      .insert({
        user_id: user.id,
        profile_snapshot: input,
        result_json: result,
        plan_type: input.plan,
      })
      .select()
      .single();
    if (insErr) throw insErr;

    return NextResponse.json({ id: saved.id, result });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "analyze_error";
    console.error("analyze error:", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
