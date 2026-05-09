import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Yetkisiz" }, { status: 401 }); }
  const { id } = await params;
  const data = await request.json();
  const db = getDb();
  db.prepare(
    "UPDATE gallery SET title=?, image=?, category=?, is_active=?, sort_order=? WHERE id=?"
  ).run(data.title || "", data.image, data.category || "Genel", data.is_active ?? 1, data.sort_order ?? 0, id);
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Yetkisiz" }, { status: 401 }); }
  const { id } = await params;
  const db = getDb();
  db.prepare("DELETE FROM gallery WHERE id=?").run(id);
  return NextResponse.json({ success: true });
}
