import Link from "next/link";
import Image from "next/image";
import getDb from "@/lib/db";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ürün Grupları",
  description: "Düğün, Kına, Nişan, Söz, Sünnet ve Tekstil ürün gruplarımızı keşfedin.",
};

function getCategories() {
  try {
    const db = getDb();
    return db.prepare(`
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id AND p.is_active = 1
      WHERE c.is_active = 1
      GROUP BY c.id
      ORDER BY c.sort_order ASC
    `).all() as { id: number; name: string; slug: string; description: string; image: string; product_count: number }[];
  } catch {
    return [];
  }
}

export default function CategoriesPage() {
  const categories = getCategories();

  return (
    <>
      {/* Banner */}
      <div className="bg-[#2C2C2C] py-16 text-center text-white">
        <p className="section-subtitle" style={{ color: "#C9A84C" }}>Koleksiyonlarımız</p>
        <h1 className="text-4xl md:text-5xl" style={{ fontFamily: "'Playfair Display', serif" }}>Ürün Grupları</h1>
        <div className="gold-divider mt-4" />
        <nav className="mt-6 text-sm text-gray-400 flex items-center justify-center gap-2" style={{ fontFamily: "'Lato', sans-serif" }}>
          <Link href="/" className="hover:text-[#C9A84C] transition-colors">Ana Sayfa</Link>
          <span>/</span>
          <span className="text-[#C9A84C]">Ürün Grupları</span>
        </nav>
      </div>

      <section className="py-20 px-4 bg-[#F8F4EE]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/kategoriler/${cat.slug}`}
                className="group block bg-white overflow-hidden hover:shadow-2xl transition-all duration-400 hover:-translate-y-2"
              >
                <div className="img-zoom relative h-56 bg-[#F8F4EE]">
                  {cat.image ? (
                    <Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#F8F4EE] to-[#EFE8DC]">
                      <span className="text-6xl opacity-30">✦</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-6">
                  <h2
                    className="text-xl text-[#2C2C2C] group-hover:text-[#C9A84C] transition-colors mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {cat.name}
                  </h2>
                  {cat.description && (
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2" style={{ fontFamily: "'Lato', sans-serif" }}>
                      {cat.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs text-[#C9A84C] uppercase tracking-wider"
                      style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "1.5px" }}
                    >
                      {cat.product_count} Ürün
                    </span>
                    <span className="text-[#C9A84C] group-hover:translate-x-1 transition-transform inline-block">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
