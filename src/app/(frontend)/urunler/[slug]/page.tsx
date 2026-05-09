"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import WhatsAppButton from "@/components/frontend/WhatsAppButton";
import ProductCard from "@/components/frontend/ProductCard";
import { ChevronLeft } from "lucide-react";

interface Product {
  id: number; name: string; slug: string;
  short_description?: string; description?: string;
  category_id?: number; category_name?: string; category_slug?: string;
  main_image?: string; is_featured?: number; is_new?: number;
  images?: { id: number; image: string }[];
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [activeImg, setActiveImg] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setProduct(data);
        setActiveImg(data.main_image || data.images?.[0]?.image || "");
        if (data.category_id) {
          fetch(`/api/products?category_id=${data.category_id}&limit=5`)
            .then((r) => r.json())
            .then((rel) => setRelated((rel as Product[]).filter((p) => p.id !== data.id).slice(0, 4)));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F4EE]">
        <div className="text-center">
          <div className="text-4xl text-[#C9A84C] animate-pulse mb-4">✦</div>
          <p style={{ fontFamily: "'Lato', sans-serif" }} className="text-gray-500">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F4EE]">
        <div className="text-center">
          <h2 className="text-2xl text-[#2C2C2C] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Ürün Bulunamadı</h2>
          <Link href="/kategoriler" className="btn-gold">Ürünlere Geri Dön</Link>
        </div>
      </div>
    );
  }

  const allImages = [
    ...(product.main_image ? [{ id: 0, image: product.main_image }] : []),
    ...(product.images || []).filter((img) => img.image !== product.main_image),
  ];

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-gray-500" style={{ fontFamily: "'Lato', sans-serif" }}>
          <Link href="/" className="hover:text-[#C9A84C] transition-colors">Ana Sayfa</Link>
          <span>/</span>
          <Link href="/kategoriler" className="hover:text-[#C9A84C] transition-colors">Kategoriler</Link>
          {product.category_name && (
            <>
              <span>/</span>
              <Link href={`/kategoriler/${product.category_slug}`} className="hover:text-[#C9A84C] transition-colors">{product.category_name}</Link>
            </>
          )}
          <span>/</span>
          <span className="text-[#C9A84C]">{product.name}</span>
        </div>
      </div>

      <section className="py-12 px-4 bg-[#F8F4EE]">
        <div className="max-w-7xl mx-auto">
          <Link href={product.category_slug ? `/kategoriler/${product.category_slug}` : "/kategoriler"} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#C9A84C] transition-colors mb-8" style={{ fontFamily: "'Lato', sans-serif" }}>
            <ChevronLeft size={16} /> Kategoriye Geri Dön
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              <div className="img-zoom relative aspect-square bg-white overflow-hidden mb-4 shadow-sm">
                {activeImg ? (
                  <Image src={activeImg} alt={product.name} fill className="object-contain p-4" sizes="(max-width: 1024px) 100vw, 50vw" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#C9A84C] text-6xl">✦</div>
                )}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  {product.is_new === 1 && <span className="badge-new">Yeni</span>}
                  {product.is_featured === 1 && <span className="badge-featured">Öne Çıkan</span>}
                </div>
              </div>
              {allImages.length > 1 && (
                <div className="flex gap-3 flex-wrap">
                  {allImages.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImg(img.image)}
                      className={`relative w-20 h-20 overflow-hidden border-2 transition-all ${activeImg === img.image ? "border-[#C9A84C]" : "border-transparent hover:border-gray-300"}`}
                    >
                      <Image src={img.image} alt={product.name} fill className="object-cover" sizes="80px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              {product.category_name && (
                <Link href={`/kategoriler/${product.category_slug}`} className="text-xs text-[#C9A84C] uppercase tracking-wider hover:underline" style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "2px" }}>
                  {product.category_name}
                </Link>
              )}
              <h1 className="text-3xl md:text-4xl text-[#2C2C2C] mt-2 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                {product.name}
              </h1>
              <div className="w-12 h-[2px] bg-[#C9A84C] mb-6" />

              {product.short_description && (
                <p className="text-gray-600 text-base leading-relaxed mb-6" style={{ fontFamily: "'Lato', sans-serif" }}>
                  {product.short_description}
                </p>
              )}

              {product.description && (
                <div className="prose prose-sm max-w-none mb-8">
                  <p className="text-gray-600 leading-relaxed" style={{ fontFamily: "'Lato', sans-serif" }}>
                    {product.description}
                  </p>
                </div>
              )}

              {/* WhatsApp */}
              <div className="space-y-3">
                <WhatsAppButton variant="product" productName={product.name} />
                <p className="text-xs text-center text-gray-400" style={{ fontFamily: "'Lato', sans-serif" }}>
                  Fiyat bilgisi ve sipariş için WhatsApp üzerinden iletişime geçin
                </p>
              </div>

              {/* Info box */}
              <div className="mt-8 p-4 bg-[#F8F4EE] border-l-2 border-[#C9A84C]">
                <p className="text-xs text-gray-500" style={{ fontFamily: "'Lato', sans-serif" }}>
                  ✦ Bu ürün hakkında daha fazla bilgi almak için WhatsApp hattımıza yazabilirsiniz.<br />
                  ✦ Ürünlerimiz premium kalitede üretilmektedir.<br />
                  ✦ Özel organizasyonlar için toplu sipariş imkânı mevcuttur.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <p className="section-subtitle">Benzer Ürünler</p>
            <h2 className="section-title text-2xl">Bunları Da İnceleyebilirsiniz</h2>
            <div className="gold-divider mt-3 mb-10" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
