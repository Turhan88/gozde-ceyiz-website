import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const active = searchParams.get("active");
  const limit = searchParams.get("limit");
  let query = "SELECT * FROM instagram_posts WHERE 1=1";
  if (active !== "all") query += " AND is_active = 1";
  query += " ORDER BY sort_order ASC, id DESC";
  if (limit) query += ` LIMIT ${parseInt(limit)}`;
  return NextResponse.json(db.prepare(query).all());
}

export async function POST(request: NextRequest) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Yetkisiz" }, { status: 401 }); }
  const data = await request.json();
  const db = getDb();
  const result = db.prepare(
    "INSERT INTO instagram_posts (image, caption, link, is_active, sort_order) VALUES (?, ?, ?, ?, ?)"
  ).run(data.image, data.caption || "", data.link || "", data.is_active ?? 1, data.sort_order ?? 0);
  return NextResponse.json({ id: result.lastInsertRowid, success: true });
}
