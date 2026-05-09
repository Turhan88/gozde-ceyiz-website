import Link from "next/link";
import Image from "next/image";
import getDb from "@/lib/db";
import HeroSlider from "@/components/frontend/HeroSlider";
import ProductCard from "@/components/frontend/ProductCard";
import ConceptCard from "@/components/frontend/ConceptCard";
import { ArrowRight } from "lucide-react";

function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

const CATEGORIES = [
  { slug: "dugun-grubu-urunler", name: "Düğün Grubu", emoji: "👑", color: "#C9A84C", bg: "from-yellow-900/30 to-yellow-700/10" },
  { slug: "kina-grubu-urunler", name: "Kına Grubu", emoji: "🌸", color: "#8B1A35", bg: "from-red-900/30 to-rose-700/10" },
  { slug: "nishan-grubu-urunler", name: "Nişan Grubu", emoji: "💍", color: "#9E7BBF", bg: "from-purple-900/30 to-purple-700/10" },
  { slug: "soz-grubu-urunler", name: "Söz Grubu", emoji: "🕊️", color: "#5B9BD5", bg: "from-blue-900/30 to-blue-700/10" },
  { slug: "sunnet-grubu-urunler", name: "Sünnet Grubu", emoji: "⭐", color: "#2E86AB", bg: "from-cyan-900/30 to-cyan-700/10" },
  { slug: "tekstil-grubu-urunler", name: "Tekstil Grubu", emoji: "🧵", color: "#7B9E87", bg: "from-green-900/30 to-green-700/10" },
];

function getData() {
  try {
    const db = getDb();
    const sliders = db.prepare("SELECT * FROM sliders WHERE is_active=1 ORDER BY sort_order ASC").all();
    const featured = db.prepare(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_featured=1 AND p.is_active=1
      ORDER BY p.sort_order ASC LIMIT 8
    `).all();
    const concepts = db.prepare(`
      SELECT c.*, cat.name as category_name,
        (SELECT COUNT(*) FROM concept_products cp WHERE cp.concept_id = c.id) as product_count
      FROM concepts c LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE c.is_active=1 ORDER BY c.sort_order ASC LIMIT 6
    `).all();
    const gallery = db.prepare("SELECT * FROM gallery WHERE is_active=1 ORDER BY sort_order ASC LIMIT 8").all();
    const instagram = db.prepare("SELECT * FROM instagram_posts WHERE is_active=1 ORDER BY sort_order ASC LIMIT 9").all();
    const settings = db.prepare("SELECT key, value FROM settings").all() as { key: string; value: string }[];
    const s: Record<string, string> = {};
    for (const r of settings) s[r.key] = r.value;
    return { sliders, featured, concepts, gallery, instagram, settings: s };
  } catch {
    return { sliders: [], featured: [], concepts: [], gallery: [], instagram: [], settings: {} };
  }
}

export default function HomePage() {
  const { sliders, featured, concepts, gallery, instagram, settings } = getData();

  return (
    <>
      {/* Hero Slider */}
      <HeroSlider slides={sliders as Parameters<typeof HeroSlider>[0]["slides"]} />

      {/* Categories */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <p className="section-subtitle">Koleksiyonlarımız</p>
          <h2 className="section-title">Ürün Grupları</h2>
          <div className="gold-divider mt-3 mb-12" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/kategoriler/${cat.slug}`}
                className="group relative overflow-hidden bg-[#F8F4EE] hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div
                  className={`h-40 bg-gradient-to-br ${cat.bg} flex flex-col items-center justify-center gap-3 p-4`}
                >
                  <span className="text-4xl">{cat.emoji}</span>
                  <div
                    className="w-8 h-[1px] transition-all duration-300 group-hover:w-12"
                    style={{ background: cat.color }}
                  />
                </div>
                <div className="p-3 text-center">
                  <span
                    className="text-xs font-bold uppercase tracking-wider text-[#2C2C2C] group-hover:text-[#C9A84C] transition-colors"
                    style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "1px", fontSize: "11px" }}
                  >
                    {cat.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/kategoriler" className="btn-outline-gold">
              Tüm Kategoriler
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {(featured as unknown[]).length > 0 && (
        <section className="py-20 px-4 bg-[#F8F4EE]">
          <div className="max-w-7xl mx-auto">
            <p className="section-subtitle">Seçkin Ürünler</p>
            <h2 className="section-title">Öne Çıkan Ürünler</h2>
            <div className="gold-divider mt-3 mb-12" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {(featured as Parameters<typeof ProductCard>[0]["product"][]).map((product) => (
                <ProductCard key={(product as { id: number }).id} product={product as Parameters<typeof ProductCard>[0]["product"]} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/kategoriler" className="btn-gold">
                Tüm Ürünlere Bak
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* About Banner */}
      <section className="py-20 px-4 bg-[#2C2C2C] text-white text-center">
        <div className="max-w-3xl mx-auto">
          <p
            className="text-[#C9A84C] text-xs uppercase tracking-widest mb-4"
            style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "4px" }}
          >
            Gözde Çeyiz Aksesuar ve Kına Evi
          </p>
          <h2
            className="text-4xl md:text-5xl text-white mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {settings.about_text ? (
              <>Özel Günlerinize<br /><em>Zarafet</em> Katıyoruz</>
            ) : (
              <>Özel Günlerinize<br /><em>Zarafet</em> Katıyoruz</>
            )}
          </h2>
          <div className="gold-divider mb-6" />
          <p
            className="text-gray-300 text-lg leading-relaxed mb-8"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            {settings.about_text || "Düğün, kına, nişan, söz ve sünnet organizasyonlarınız için en güzel aksesuarları sunuyoruz."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/hakkimizda" className="btn-gold">
              Hakkımızda
            </Link>
            <Link href="/iletisim" className="btn-outline-gold" style={{ borderColor: "rgba(201,168,76,0.6)", color: "#C9A84C" }}>
              İletişime Geç
            </Link>
          </div>
        </div>
      </section>

      {/* Concepts */}
      {(concepts as unknown[]).length > 0 && (
        <section className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <p className="section-subtitle">Komple Çözümler</p>
            <h2 className="section-title">Hazır Konseptler</h2>
            <div className="gold-divider mt-3 mb-4" />
            <p
              className="text-center text-gray-500 mb-12 max-w-2xl mx-auto"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Özel günleriniz için hazırladığımız komple konsept setlerini keşfedin. Her şey düşünüldü, siz sadece keyif alın.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(concepts as Parameters<typeof ConceptCard>[0]["concept"][]).map((concept) => (
                <ConceptCard key={(concept as { id: number }).id} concept={concept as Parameters<typeof ConceptCard>[0]["concept"]} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/hazir-konseptler" className="btn-gold">
                Tüm Konseptleri Gör
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Gallery Preview */}
      {(gallery as unknown[]).length > 0 && (
        <section className="py-20 px-4 bg-[#F8F4EE]">
          <div className="max-w-7xl mx-auto">
            <p className="section-subtitle">Galerimiz</p>
            <h2 className="section-title">Fotoğraf Galerisi</h2>
            <div className="gold-divider mt-3 mb-12" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(gallery as { id: number; image: string; title?: string }[]).slice(0, 8).map((item, i) => (
                <div
                  key={item.id}
                  className={`img-zoom relative overflow-hidden bg-[#E0D8CC] ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
                  style={{ aspectRatio: i === 0 ? "1" : "1" }}
                >
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.title || "Galeri"}
                      fill
                      className="object-cover hover:opacity-90 transition-opacity"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/galeri" className="btn-outline-gold">
                Tüm Galeriyi Gör <ArrowRight size={14} className="inline ml-1" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Instagram */}
      {(instagram as unknown[]).length > 0 && (
        <section className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="text-[#C9A84C]"><InstagramIcon size={20} /></div>
              <p className="section-subtitle" style={{ marginBottom: 0 }}>Instagram</p>
            </div>
            <h2 className="section-title">Bizi Takip Edin</h2>
            <div className="gold-divider mt-3 mb-4" />
            <p
              className="text-center text-gray-500 mb-10"
              style={{ fontFamily: "'Lato', sans-serif", fontSize: "13px" }}
            >
              <a
                href="https://www.instagram.com/gozdeceyiz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C9A84C] hover:underline"
              >
                @gozdeceyiz
              </a>
              {" "}hesabımızı takip edin, en yeni ürün ve konseptleri kaçırmayın.
            </p>
            <div className="grid grid-cols-3 md:grid-cols-9 gap-2">
              {(instagram as { id: number; image: string; link?: string }[]).slice(0, 9).map((post) => (
                <a
                  key={post.id}
                  href={post.link || "https://www.instagram.com/gozdeceyiz"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="img-zoom relative aspect-square overflow-hidden bg-[#F8F4EE] block"
                >
                  {post.image && (
                    <Image
                      src={post.image}
                      alt="Instagram"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 33vw, 11vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/0 hover:bg-[#C9A84C]/30 transition-all flex items-center justify-center">
                    <div className="text-white opacity-0 group-hover:opacity-100"><InstagramIcon size={24} /></div>
                  </div>
                </a>
              ))}
            </div>
            <div className="text-center mt-8">
              <a
                href="https://www.instagram.com/gozdeceyiz"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold inline-flex items-center gap-2"
              >
                <InstagramIcon size={16} />
                Instagram'da Takip Et
              </a>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 px-4" style={{ background: "linear-gradient(135deg, #C9A84C, #A07C2A)" }}>
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2
            className="text-3xl md:text-4xl mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Hayalinizdeki Organizasyonu Planlamaya Hazır Mısınız?
          </h2>
          <p
            className="text-yellow-100 mb-8"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            WhatsApp üzerinden bize ulaşın, size özel teklif hazırlayalım.
          </p>
          <a
            href={`https://wa.me/905317906563?text=${encodeURIComponent("Merhaba, organizasyonum için bilgi almak istiyorum.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-[#C9A84C] font-bold py-4 px-8 hover:bg-gray-100 transition-all duration-300 text-sm uppercase tracking-widest"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp ile İletişim
          </a>
        </div>
      </section>
    </>
  );
}
