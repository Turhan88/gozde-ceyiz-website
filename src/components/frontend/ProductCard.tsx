import Link from "next/link";
import Image from "next/image";
import { Eye } from "lucide-react";

interface Product {
  id: number;
  name: string;
  slug: string;
  short_description?: string;
  main_image?: string;
  is_featured?: number;
  is_new?: number;
  category_name?: string;
  category_slug?: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="product-card group bg-white">
      {/* Image */}
      <div className="img-zoom relative aspect-square overflow-hidden bg-[#F8F4EE]">
        {product.main_image ? (
          <Image
            src={product.main_image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl text-[#C9A84C] mb-2">✦</div>
              <p className="text-xs text-gray-400" style={{ fontFamily: "'Lato', sans-serif" }}>Görsel Yok</p>
            </div>
          </div>
        )}
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.is_new === 1 && <span className="badge-new">Yeni</span>}
          {product.is_featured === 1 && <span className="badge-featured">Öne Çıkan</span>}
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <Link
            href={`/urunler/${product.slug}`}
            className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 bg-white text-[#2C2C2C] p-3 shadow-lg hover:bg-[#C9A84C] hover:text-white"
          >
            <Eye size={18} />
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        {product.category_name && (
          <Link
            href={`/kategoriler/${product.category_slug}`}
            className="text-xs text-[#C9A84C] uppercase tracking-wider hover:underline"
            style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "1.5px" }}
          >
            {product.category_name}
          </Link>
        )}
        <h3
          className="text-base font-medium text-[#2C2C2C] mt-1 mb-2 leading-snug group-hover:text-[#C9A84C] transition-colors"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {product.name}
        </h3>
        {product.short_description && (
          <p
            className="text-xs text-gray-500 mb-3 line-clamp-2"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            {product.short_description}
          </p>
        )}
        <Link
          href={`/urunler/${product.slug}`}
          className="btn-outline-gold text-xs py-2 px-4 w-full text-center block"
        >
          Detayı İncele
        </Link>
      </div>
    </div>
  );
}
