"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import WhatsAppButton from "@/components/frontend/WhatsAppButton";
import { Package, ChevronLeft } from "lucide-react";

interface ConceptProduct {
  id: number; name: string; slug: string;
  main_image?: string; short_description?: string;
  category_name?: string;
}

interface Concept {
  id: number; name: string; slug: string;
  description?: string; cover_image?: string;
  category_name?: string; product_count?: number;
  products?: ConceptProduct[];
}

export default function ConceptDetailPage() {
  const { slug } = useParams();
  const [concept, setConcept] = useState<Concept | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/concepts/${slug}`)
      .then((r) => r.json())
      .then((data) => { setConcept(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F4EE]">
        <div className="text-4xl text-[#C9A84C] animate-pulse">✦</div>
      </div>
    );
  }

  if (!concept) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F4EE]">
        <div className="text-center">
          <h2 className="text-2xl text-[#2C2C2C] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Konsept Bulunamadı</h2>
          <Link href="/hazir-konseptler" className="btn-gold">Konseptlere Geri Dön</Link>
        </div>
      </div>
    );
  }

  const products = concept.products || [];

  return (
    <>
      {/* Hero */}
      <div className="relative h-72 md:h-96 bg-[#2C2C2C] overflow-hidden">
        {concept.cover_image && (
          <Image src={concept.cover_image} alt={concept.name} fill className="object-cover opacity-50" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="max-w-7xl mx-auto">
            <p className="text-[#C9A84C] text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "3px" }}>
              {concept.category_name || "Hazır Konsept"}
            </p>
            <h1 className="text-3xl md:text-5xl text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              {concept.name}
            </h1>
            <div className="flex items-center gap-2 text-[#C9A84C]">
              <Package size={16} />
              <span className="text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>{products.length} Ürün</span>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-gray-500" style={{ fontFamily: "'Lato', sans-serif" }}>
          <Link href="/" className="hover:text-[#C9A84C]">Ana Sayfa</Link>
          <span>/</span>
          <Link href="/hazir-konseptler" className="hover:text-[#C9A84C]">Hazır Konseptler</Link>
          <span>/</span>
          <span className="text-[#C9A84C]">{concept.name}</span>
        </div>
      </div>

      <section className="py-16 px-4 bg-[#F8F4EE]">
        <div className="max-w-7xl mx-auto">
          <Link href="/hazir-konseptler" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#C9A84C] transition-colors mb-10" style={{ fontFamily: "'Lato', sans-serif" }}>
            <ChevronLeft size={16} /> Tüm Konseptler
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Products grid */}
            <div className="lg:col-span-2">
              <h2 className="text-xl text-[#2C2C2C] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Konsept İçeriği ({products.length} Ürün)
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((product, i) => (
                  <Link
                    key={product.id}
                    href={`/urunler/${product.slug}`}
                    className="group bg-white overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative aspect-square bg-[#F8F4EE] overflow-hidden">
                      {product.main_image ? (
                        <Image src={product.main_image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="200px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#C9A84C] text-3xl">✦</div>
                      )}
                      <div className="absolute top-2 left-2 w-6 h-6 bg-[#C9A84C] rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {i + 1}
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="text-sm text-[#2C2C2C] group-hover:text-[#C9A84C] transition-colors font-medium leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {product.name}
                      </h4>
                      {product.short_description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2" style={{ fontFamily: "'Lato', sans-serif" }}>
                          {product.short_description}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 shadow-sm sticky top-24">
                <h3 className="text-xl text-[#2C2C2C] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {concept.name}
                </h3>
                <div className="w-8 h-[2px] bg-[#C9A84C] mb-4" />
                {concept.description && (
                  <p className="text-gray-600 text-sm leading-relaxed mb-6" style={{ fontFamily: "'Lato', sans-serif" }}>
                    {concept.description}
                  </p>
                )}
                <div className="flex items-center gap-2 text-[#C9A84C] mb-6 text-sm">
                  <Package size={16} />
                  <span style={{ fontFamily: "'Lato', sans-serif" }}>{products.length} adet ürün içermektedir</span>
                </div>
                <WhatsAppButton variant="concept" conceptName={concept.name} />
                <div className="mt-4 p-4 bg-[#F8F4EE] border-l-2 border-[#C9A84C]">
                  <p className="text-xs text-gray-500" style={{ fontFamily: "'Lato', sans-serif" }}>
                    ✦ Konsett ürünleri değiştirilip özelleştirilebilir<br />
                    ✦ Toplu sipariş indirimi mevcuttur<br />
                    ✦ Detaylar için WhatsApp'tan iletişime geçin
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
