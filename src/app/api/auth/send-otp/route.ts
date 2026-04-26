import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();
    if (!phone || !/^(\+98|0)?9\d{9}$/.test(phone.replace(/\s/g, ""))) {
      return NextResponse.json({ error: "شماره موبایل معتبر نیست" }, { status: 400 });
    }
    return NextResponse.json({ success: true, dev: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
