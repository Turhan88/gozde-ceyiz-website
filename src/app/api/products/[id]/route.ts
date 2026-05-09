import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const product = db.prepare(
    "SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ? OR p.slug = ?"
  ).get(id, id) as Record<string, unknown> | undefined;
  if (!product) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  product.images = db.prepare("SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC").all(product.id as number);
  return NextResponse.json(product);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Yetkisiz" }, { status: 401 }); }
  const { id } = await params;
  const data = await request.json();
  const db = getDb();
  const slug = data.slug || slugify(data.name);
  db.prepare(
    "UPDATE products SET name=?, slug=?, short_description=?, description=?, category_id=?, main_image=?, is_featured=?, is_new=?, is_active=?, sort_order=? WHERE id=?"
  ).run(data.name, slug, data.short_description || "", data.description || "", data.category_id || null, data.main_image || "", data.is_featured ?? 0, data.is_new ?? 0, data.is_active ?? 1, data.sort_order ?? 0, id);

  if (data.images !== undefined) {
    db.prepare("DELETE FROM product_images WHERE product_id = ?").run(id);
    if (data.images?.length) {
      const insertImg = db.prepare("INSERT INTO product_images (product_id, image, sort_order) VALUES (?, ?, ?)");
      data.images.forEach((img: string, i: number) => insertImg.run(id, img, i));
    }
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Yetkisiz" }, { status: 401 }); }
  const { id } = await params;
  const db = getDb();
  db.prepare("DELETE FROM products WHERE id=?").run(id);
  return NextResponse.json({ success: true });
}
