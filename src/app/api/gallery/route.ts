import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const active = searchParams.get("active");
  let query = "SELECT * FROM gallery WHERE 1=1";
  const args: string[] = [];
  if (active !== "all") query += " AND is_active = 1";
  if (category) { query += " AND category = ?"; args.push(category); }
  query += " ORDER BY sort_order ASC, id DESC";
  return NextResponse.json(db.prepare(query).all(...args));
}

export async function POST(request: NextRequest) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Yetkisiz" }, { status: 401 }); }
  const data = await request.json();
  const db = getDb();
  const result = db.prepare(
    "INSERT INTO gallery (title, image, category, is_active, sort_order) VALUES (?, ?, ?, ?, ?)"
  ).run(data.title || "", data.image, data.category || "Genel", data.is_active ?? 1, data.sort_order ?? 0);
  return NextResponse.json({ id: result.lastInsertRowid, success: true });
}
