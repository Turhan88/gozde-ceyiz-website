import getDb from "@/lib/db";
import ConceptCard from "@/components/frontend/ConceptCard";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hazır Konseptler",
  description: "Düğün, kına, nişan ve sünnet törenleriniz için özel hazırlanmış komple konsept setlerimizi keşfedin.",
};

function getConcepts() {
  try {
    const db = getDb();
    return db.prepare(`
      SELECT c.*, cat.name as category_name,
        (SELECT COUNT(*) FROM concept_products cp WHERE cp.concept_id = c.id) as product_count
      FROM concepts c LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE c.is_active=1 ORDER BY c.sort_order ASC
    `).all() as Parameters<typeof ConceptCard>[0]["concept"][];
  } catch { return []; }
}

export default function ConceptsPage() {
  const concepts = getConcepts();

  return (
    <>
      <div className="bg-[#2C2C2C] py-16 text-center text-white">
        <p className="section-subtitle" style={{ color: "#C9A84C" }}>Komple Çözümler</p>
        <h1 className="text-4xl md:text-5xl" style={{ fontFamily: "'Playfair Display', serif" }}>Hazır Konseptler</h1>
        <div className="gold-divider mt-4 mb-4" />
        <nav className="text-sm text-gray-400 flex items-center justify-center gap-2" style={{ fontFamily: "'Lato', sans-serif" }}>
          <Link href="/" className="hover:text-[#C9A84C]">Ana Sayfa</Link>
          <span>/</span>
          <span className="text-[#C9A84C]">Hazır Konseptler</span>
        </nav>
      </div>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="text-gray-600 leading-relaxed" style={{ fontFamily: "'Lato', sans-serif" }}>
              Özel günleriniz için tek tek ürün aramak yerine, uzman ekibimizin hazırladığı komple konsept setlerinden birini seçin.
              Her konsept birbirine uyumlu ürünlerden oluşmakta ve organizasyonunuzu mükemmel kılmaktadır.
            </p>
          </div>
          {concepts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl text-[#C9A84C] mb-4">✦</div>
              <p className="text-gray-500" style={{ fontFamily: "'Lato', sans-serif" }}>Konsept bulunamadı.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {concepts.map((concept) => (
                <ConceptCard key={concept.id} concept={concept} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-[#F8F4EE] text-center">
        <h2 className="text-2xl text-[#2C2C2C] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          Özel Konsept İstiyorum
        </h2>
        <p className="text-gray-500 mb-6 max-w-lg mx-auto" style={{ fontFamily: "'Lato', sans-serif" }}>
          İhtiyaçlarınıza özel konsept hazırlamamızı ister misiniz? WhatsApp üzerinden bize ulaşın.
        </p>
        <a
          href="https://wa.me/905317906563?text=Merhaba%2C%20özel%20konsept%20hakkında%20bilgi%20almak%20istiyorum."
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold"
        >
          Özel Konsept Talep Et
        </a>
      </section>
    </>
  );
}
