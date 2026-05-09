import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const concept = db.prepare(
    `SELECT c.*, cat.name as category_name,
      (SELECT COUNT(*) FROM concept_products cp WHERE cp.concept_id = c.id) as product_count
     FROM concepts c
     LEFT JOIN categories cat ON c.category_id = cat.id
     WHERE c.id = ? OR c.slug = ?`
  ).get(id, id) as Record<string, unknown> | undefined;
  if (!concept) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  concept.products = db.prepare(
    `SELECT p.*, pi2.image as first_gallery_image, cp.sort_order as concept_order
     FROM concept_products cp
     JOIN products p ON cp.product_id = p.id
     LEFT JOIN (SELECT product_id, MIN(id) as min_id FROM product_images GROUP BY product_id) pmin ON p.id = pmin.product_id
     LEFT JOIN product_images pi2 ON pmin.min_id = pi2.id
     WHERE cp.concept_id = ?
     ORDER BY cp.sort_order ASC`
  ).all(concept.id as number);
  return NextResponse.json(concept);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Yetkisiz" }, { status: 401 }); }
  const { id } = await params;
  const data = await request.json();
  const db = getDb();
  const slug = data.slug || slugify(data.name);
  db.prepare(
    "UPDATE concepts SET name=?, slug=?, description=?, cover_image=?, category_id=?, is_active=?, sort_order=? WHERE id=?"
  ).run(data.name, slug, data.description || "", data.cover_image || "", data.category_id || null, data.is_active ?? 1, data.sort_order ?? 0, id);

  if (data.product_ids !== undefined) {
    db.prepare("DELETE FROM concept_products WHERE concept_id = ?").run(id);
    if (data.product_ids?.length) {
      const insertProd = db.prepare("INSERT INTO concept_products (concept_id, product_id, sort_order) VALUES (?, ?, ?)");
      data.product_ids.forEach((pid: number, i: number) => insertProd.run(id, pid, i));
    }
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Yetkisiz" }, { status: 401 }); }
  const { id } = await params;
  const db = getDb();
  db.prepare("DELETE FROM concepts WHERE id=?").run(id);
  return NextResponse.json({ success: true });
}
