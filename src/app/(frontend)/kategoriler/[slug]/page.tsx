import Link from "next/link";
import Image from "next/image";
import getDb from "@/lib/db";
import ProductCard from "@/components/frontend/ProductCard";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface Props { params: Promise<{ slug: string }>; searchParams: Promise<{ filter?: string; search?: string }> }

function getData(slug: string) {
  try {
    const db = getDb();
    const category = db.prepare("SELECT * FROM categories WHERE slug=? AND is_active=1").get(slug) as { id: number; name: string; slug: string; description: string; banner_image: string } | undefined;
    if (!category) return null;
    const products = db.prepare(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.category_id=? AND p.is_active=1 ORDER BY p.sort_order ASC, p.id DESC
    `).all(category.id);
    return { category, products };
  } catch { return null; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = getData(slug);
  if (!data) return {};
  return { title: data.category.name, description: data.category.description };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { filter = "", search = "" } = await searchParams;
  const data = getData(slug);
  if (!data) notFound();

  const { category, products } = data;

  let filtered = products as Parameters<typeof ProductCard>[0]["product"][];
  if (filter === "featured") filtered = filtered.filter((p) => (p as { is_featured?: number }).is_featured === 1);
  if (filter === "new") filtered = filtered.filter((p) => (p as { is_new?: number }).is_new === 1);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      (p.short_description || "").toLowerCase().includes(q)
    );
  }

  return (
    <>
      {/* Banner */}
      <div className="relative bg-[#2C2C2C] py-16 text-center text-white overflow-hidden">
        {(category as { banner_image?: string }).banner_image && (
          <Image src={(category as { banner_image: string }).banner_image} alt={category.name} fill className="object-cover opacity-20" />
        )}
        <div className="relative">
          <p className="section-subtitle" style={{ color: "#C9A84C" }}>Kategoriler</p>
          <h1 className="text-4xl md:text-5xl" style={{ fontFamily: "'Playfair Display', serif" }}>{category.name}</h1>
          <div className="gold-divider mt-4 mb-4" />
          <nav className="text-sm text-gray-400 flex items-center justify-center gap-2" style={{ fontFamily: "'Lato', sans-serif" }}>
            <Link href="/" className="hover:text-[#C9A84C]">Ana Sayfa</Link>
            <span>/</span>
            <Link href="/kategoriler" className="hover:text-[#C9A84C]">Kategoriler</Link>
            <span>/</span>
            <span className="text-[#C9A84C]">{category.name}</span>
          </nav>
        </div>
      </div>

      <section className="py-16 px-4 bg-[#F8F4EE]">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <div className="bg-white p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
            <div className="flex gap-3 flex-wrap">
              {[
                { value: "", label: "Tümü" },
                { value: "featured", label: "Öne Çıkanlar" },
                { value: "new", label: "Yeni Ürünler" },
              ].map((f) => (
                <Link
                  key={f.value}
                  href={`?filter=${f.value}${search ? `&search=${search}` : ""}`}
                  className={`text-xs px-4 py-2 border transition-all ${
                    filter === f.value
                      ? "bg-[#C9A84C] text-white border-[#C9A84C]"
                      : "border-gray-200 text-gray-600 hover:border-[#C9A84C] hover:text-[#C9A84C]"
                  }`}
                  style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "1px", textTransform: "uppercase" }}
                >
                  {f.label}
                </Link>
              ))}
            </div>
            <form className="flex gap-2">
              <input
                type="search"
                name="search"
                defaultValue={search}
                placeholder="Ürün ara..."
                className="border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-[#C9A84C] w-48"
                style={{ fontFamily: "'Lato', sans-serif" }}
              />
              <button type="submit" className="btn-gold py-2 px-4 text-xs">Ara</button>
            </form>
          </div>

          {category.description && (
            <p className="text-gray-600 mb-10 text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>
              {category.description}
            </p>
          )}

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl text-[#C9A84C] mb-4">✦</div>
              <p className="text-gray-500" style={{ fontFamily: "'Lato', sans-serif" }}>Bu kategoride ürün bulunamadı.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map((product) => (
                <ProductCard key={(product as { id: number }).id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
