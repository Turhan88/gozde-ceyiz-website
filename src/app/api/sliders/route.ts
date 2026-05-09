import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const active = searchParams.get("active");
  let query = "SELECT * FROM sliders";
  if (active !== "all") query += " WHERE is_active = 1";
  query += " ORDER BY sort_order ASC, id ASC";
  return NextResponse.json(db.prepare(query).all());
}

export async function POST(request: NextRequest) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Yetkisiz" }, { status: 401 }); }
  const data = await request.json();
  const db = getDb();
  const result = db.prepare(
    "INSERT INTO sliders (title, description, button_text, button_link, desktop_image, mobile_image, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(data.title, data.description || "", data.button_text || "", data.button_link || "", data.desktop_image || "", data.mobile_image || "", data.is_active ?? 1, data.sort_order ?? 0);
  return NextResponse.json({ id: result.lastInsertRowid, success: true });
}
