/**
 * GET /api/ping?url=https://example.com
 * HEAD-pings the target URL from the server (running in Iran/Liara).
 * Returns: { ms: number, ok: boolean }
 * ms = -1 means unreachable / timeout
 */

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
// No caching — always fresh ping
export const revalidate = 0;

const TIMEOUT_MS = 5000;

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ ms: -1, ok: false, error: "no_url" }, { status: 400 });
  }

  // Validate URL
  let target: URL;
  try {
    target = new URL(url);
    if (!["http:", "https:"].includes(target.protocol)) {
      return NextResponse.json({ ms: -1, ok: false, error: "invalid_url" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ ms: -1, ok: false, error: "invalid_url" }, { status: 400 });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const t0 = Date.now();

  try {
    const res = await fetch(target.href, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
      // Don't send referrer or cookies
      headers: { "User-Agent": "Mozilla/5.0 (compatible; AY-PingBot/1.0)" },
    });
    const ms = Date.now() - t0;
    clearTimeout(timer);
    return NextResponse.json({ ms, ok: res.ok || res.status < 500 });
  } catch (e: unknown) {
    clearTimeout(timer);
    const isTimeout = e instanceof Error && e.name === "AbortError";
    return NextResponse.json({ ms: -1, ok: false, error: isTimeout ? "timeout" : "unreachable" });
  }
}
