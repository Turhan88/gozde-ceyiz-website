"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Slide {
  id: number;
  title: string;
  description: string;
  button_text: string;
  button_link: string;
  desktop_image: string;
  mobile_image: string;
}

interface HeroSliderProps {
  slides: Slide[];
}

export default function HeroSlider({ slides }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      goTo((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  function goTo(indexOrFn: number | ((prev: number) => number)) {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrent(typeof indexOrFn === "function" ? indexOrFn(current) : indexOrFn);
      setIsAnimating(false);
    }, 300);
  }

  if (!slides.length) {
    return (
      <div className="h-[80vh] bg-[#F8F4EE] flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-xs tracking-widest uppercase text-[#C9A84C] mb-4" style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "4px" }}>
            Gözde Çeyiz Aksesuar ve Kına Evi
          </p>
          <h1 className="text-5xl md:text-7xl text-[#2C2C2C] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Özel Günlerinize<br /><em>Zarafet</em> Katıyoruz
          </h1>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto" style={{ fontFamily: "'Lato', sans-serif" }}>
            Düğün, Kına, Nişan ve Söz Törenleriniz için Premium Aksesuar Koleksiyonu
          </p>
          <Link href="/kategoriler" className="btn-gold">
            Ürünleri Keşfet
          </Link>
        </div>
      </div>
    );
  }

  const slide = slides[current];

  return (
    <section className="relative overflow-hidden" style={{ height: "85vh", minHeight: "500px" }}>
      {/* Background */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${isAnimating ? "opacity-0" : "opacity-100"}`}
        style={{ background: "linear-gradient(135deg, #1C1C1C 0%, #2C2C2C 100%)" }}
      >
        {slide.desktop_image && (
          <Image
            src={slide.desktop_image}
            alt={slide.title}
            fill
            className="object-cover opacity-50"
            priority
          />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div
        className={`relative h-full flex items-center transition-all duration-500 ${
          isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-2xl">
            <p
              className="text-[#C9A84C] text-xs uppercase tracking-widest mb-4"
              style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "4px" }}
            >
              Gözde Çeyiz Aksesuar ve Kına Evi
            </p>
            <h1
              className="text-4xl md:text-6xl lg:text-7xl text-white leading-tight mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {slide.title}
            </h1>
            {slide.description && (
              <p
                className="text-gray-300 text-lg mb-8 leading-relaxed max-w-xl"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                {slide.description}
              </p>
            )}
            {slide.button_text && (
              <Link
                href={slide.button_link || "/kategoriler"}
                className="btn-gold inline-block"
              >
                {slide.button_text}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? "w-8 bg-[#C9A84C]" : "w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}

      {/* Arrow buttons */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => goTo((current - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-sm transition-all"
            aria-label="Önceki"
          >
            ‹
          </button>
          <button
            onClick={() => goTo((current + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-sm transition-all"
            aria-label="Sonraki"
          >
            ›
          </button>
        </>
      )}

      {/* Slider size info (overlay for admins - can be removed in production) */}
      <div className="absolute top-4 right-4 bg-black/40 text-white text-xs px-3 py-1 backdrop-blur-sm hidden">
        Masaüstü: 1920×800px | Mobil: 1080×1350px
      </div>
    </section>
  );
}
