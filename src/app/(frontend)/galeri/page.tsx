"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

interface GalleryItem {
  id: number; image: string; title?: string; category?: string;
}

const CATEGORIES = ["Tümü", "Mağaza", "Vitrin", "Organizasyon", "Ürün Çekimleri", "Konsept Çekimleri"];

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filtered, setFiltered] = useState<GalleryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetch("/api/gallery").then((r) => r.json()).then((data) => {
      setItems(data);
      setFiltered(data);
    });
  }, []);

  function filterBy(cat: string) {
    setActiveCategory(cat);
    setFiltered(cat === "Tümü" ? items : items.filter((i) => i.category === cat));
  }

  return (
    <>
      <div className="bg-[#2C2C2C] py-16 text-center text-white">
        <p className="section-subtitle" style={{ color: "#C9A84C" }}>Fotoğraflar</p>
        <h1 className="text-4xl md:text-5xl" style={{ fontFamily: "'Playfair Display', serif" }}>Galeri</h1>
        <div className="gold-divider mt-4 mb-4" />
        <nav className="text-sm text-gray-400 flex items-center justify-center gap-2" style={{ fontFamily: "'Lato', sans-serif" }}>
          <Link href="/" className="hover:text-[#C9A84C]">Ana Sayfa</Link>
          <span>/</span>
          <span className="text-[#C9A84C]">Galeri</span>
        </nav>
      </div>

      <section className="py-16 px-4 bg-[#F8F4EE]">
        <div className="max-w-7xl mx-auto">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => filterBy(cat)}
                className={`px-5 py-2 text-xs uppercase tracking-widest transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-[#C9A84C] text-white"
                    : "border border-gray-300 text-gray-600 hover:border-[#C9A84C] hover:text-[#C9A84C]"
                }`}
                style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "1.5px" }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Masonry grid */}
          <div className="masonry-grid">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="img-zoom relative overflow-hidden cursor-pointer bg-[#E0D8CC]"
                onClick={() => setLightbox(item)}
              >
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.title || "Galeri"}
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover hover:opacity-90 transition-opacity"
                    sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
                  />
                )}
                {item.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs" style={{ fontFamily: "'Lato', sans-serif" }}>{item.title}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl text-[#C9A84C] mb-4">✦</div>
              <p className="text-gray-500" style={{ fontFamily: "'Lato', sans-serif" }}>Bu kategoride görsel bulunamadı.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-[#C9A84C] transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X size={32} />
          </button>
          {lightbox.image && (
            <div className="relative max-w-5xl max-h-[90vh] w-full h-full" onClick={(e) => e.stopPropagation()}>
              <Image src={lightbox.image} alt={lightbox.title || "Galeri"} fill className="object-contain" sizes="90vw" />
            </div>
          )}
          {lightbox.title && (
            <p className="absolute bottom-8 text-white text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>
              {lightbox.title}
            </p>
          )}
        </div>
      )}
    </>
  );
}
