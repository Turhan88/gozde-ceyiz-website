import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("category_id");
    const featured = searchParams.get("featured");
    const isNew = searchParams.get("is_new");
    const active = searchParams.get("active");
    const limit = searchParams.get("limit");
    const search = searchParams.get("search");

    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const args: (string | number)[] = [];

    if (active !== "all") {
      query += " AND p.is_active = 1";
    }
    if (categoryId) {
      query += " AND p.category_id = ?";
      args.push(categoryId);
    }
    if (featured === "1") {
      query += " AND p.is_featured = 1";
    }
    if (isNew === "1") {
      query += " AND p.is_new = 1";
    }
    if (search) {
      query += " AND (p.name LIKE ? OR p.short_description LIKE ?)";
      args.push(`%${search}%`, `%${search}%`);
    }

    query += " ORDER BY p.sort_order ASC, p.id DESC";

    if (limit) {
      query += ` LIMIT ${parseInt(limit)}`;
    }

    const products = db.prepare(query).all(...args);

    for (const product of products as Record<string, unknown>[]) {
      const images = db
        .prepare("SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC")
        .all(product.id as number);
      product.images = images;
    }

    return NextResponse.json(products);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Yetkisiz" }, { status: 401 }); }
  try {
    const data = await request.json();
    const db = getDb();
    const slug = data.slug || slugify(data.name);
    const result = db.prepare(
      "INSERT INTO products (name, slug, short_description, description, category_id, main_image, is_featured, is_new, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).run(data.name, slug, data.short_description || "", data.description || "", data.category_id || null, data.main_image || "", data.is_featured ?? 0, data.is_new ?? 0, data.is_active ?? 1, data.sort_order ?? 0);

    const productId = result.lastInsertRowid as number;
    if (data.images?.length) {
      const insertImg = db.prepare("INSERT INTO product_images (product_id, image, sort_order) VALUES (?, ?, ?)");
      data.images.forEach((img: string, i: number) => insertImg.run(productId, img, i));
    }

    return NextResponse.json({ id: productId, success: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Hata";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
