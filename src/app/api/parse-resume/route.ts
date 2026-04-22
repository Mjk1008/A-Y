import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData();
    const file = fd.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "no file" }, { status: 400 });
    if (file.size > 5 * 1024 * 1024)
      return NextResponse.json({ error: "فایل بزرگتر از ۵MB" }, { status: 400 });

    const buf = Buffer.from(await file.arrayBuffer());
    const name = file.name.toLowerCase();
    let text = "";

    if (name.endsWith(".pdf")) {
      const pdfParse = (await import("pdf-parse")).default;
      const out = await pdfParse(buf);
      text = out.text || "";
    } else if (name.endsWith(".txt")) {
      text = buf.toString("utf8");
    } else {
      // docx/doc – naive text extraction for MVP
      text = buf.toString("utf8").replace(/[^\u0600-\u06FF\u0020-\u007Ea-zA-Z0-9\s]/g, " ");
    }

    return NextResponse.json({ text: text.slice(0, 20000) });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "parse_error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
