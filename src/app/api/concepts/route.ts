import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const active = searchParams.get("active");
    const limit = searchParams.get("limit");

    let query = `
      SELECT c.*, cat.name as category_name,
        (SELECT COUNT(*) FROM concept_products cp WHERE cp.concept_id = c.id) as product_count
      FROM concepts c
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE 1=1
    `;
    if (active !== "all") query += " AND c.is_active = 1";
    query += " ORDER BY c.sort_order ASC, c.id DESC";
    if (limit) query += ` LIMIT ${parseInt(limit)}`;

    const concepts = db.prepare(query).all() as Record<string, unknown>[];
    for (const concept of concepts) {
      concept.products = db.prepare(
        `SELECT p.*, cp.sort_order as concept_order
         FROM concept_products cp
         JOIN products p ON cp.product_id = p.id
         WHERE cp.concept_id = ?
         ORDER BY cp.sort_order ASC`
      ).all(concept.id as number);
    }
    return NextResponse.json(concepts);
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
      "INSERT INTO concepts (name, slug, description, cover_image, category_id, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).run(data.name, slug, data.description || "", data.cover_image || "", data.category_id || null, data.is_active ?? 1, data.sort_order ?? 0);

    const conceptId = result.lastInsertRowid as number;
    if (data.product_ids?.length) {
      const insertProd = db.prepare("INSERT INTO concept_products (concept_id, product_id, sort_order) VALUES (?, ?, ?)");
      data.product_ids.forEach((pid: number, i: number) => insertProd.run(conceptId, pid, i));
    }
    return NextResponse.json({ id: conceptId, success: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Hata";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
