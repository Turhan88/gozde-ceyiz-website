import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const cat = db.prepare("SELECT * FROM categories WHERE id = ?").get(id);
  if (!cat) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  return NextResponse.json(cat);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Yetkisiz" }, { status: 401 }); }
  const { id } = await params;
  const data = await request.json();
  const db = getDb();
  const slug = data.slug || slugify(data.name);
  db.prepare(
    "UPDATE categories SET name=?, slug=?, description=?, image=?, banner_image=?, is_active=?, sort_order=? WHERE id=?"
  ).run(data.name, slug, data.description || "", data.image || "", data.banner_image || "", data.is_active ?? 1, data.sort_order ?? 0, id);
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Yetkisiz" }, { status: 401 }); }
  const { id } = await params;
  const db = getDb();
  db.prepare("DELETE FROM categories WHERE id=?").run(id);
  return NextResponse.json({ success: true });
}
