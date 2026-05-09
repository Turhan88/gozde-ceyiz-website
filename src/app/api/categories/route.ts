import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    const db = getDb();
    const categories = db.prepare(
      "SELECT * FROM categories ORDER BY sort_order ASC, id ASC"
    ).all();
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }
  try {
    const data = await request.json();
    const db = getDb();
    const slug = data.slug || slugify(data.name);
    const result = db.prepare(
      "INSERT INTO categories (name, slug, description, image, banner_image, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).run(data.name, slug, data.description || "", data.image || "", data.banner_image || "", data.is_active ?? 1, data.sort_order ?? 0);
    return NextResponse.json({ id: result.lastInsertRowid, success: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Sunucu hatası";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
