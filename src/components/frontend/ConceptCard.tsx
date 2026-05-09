import Link from "next/link";
import Image from "next/image";
import { Package } from "lucide-react";

interface Concept {
  id: number;
  name: string;
  slug: string;
  description?: string;
  cover_image?: string;
  product_count?: number;
  category_name?: string;
}

export default function ConceptCard({ concept }: { concept: Concept }) {
  return (
    <div className="group relative overflow-hidden bg-[#1C1C1C] cursor-pointer">
      {/* Image */}
      <div className="img-zoom relative h-80 overflow-hidden">
        {concept.cover_image ? (
          <Image
            src={concept.cover_image}
            alt={concept.name}
            fill
            className="object-cover opacity-70 group-hover:opacity-80"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#2C2C2C] to-[#C9A84C]/30 flex items-center justify-center">
            <div className="text-6xl text-[#C9A84C]/50">✦</div>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        {concept.category_name && (
          <p
            className="text-[#C9A84C] text-xs uppercase tracking-widest mb-2"
            style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "2px" }}
          >
            {concept.category_name}
          </p>
        )}
        <h3
          className="text-2xl text-white mb-2 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {concept.name}
        </h3>
        {concept.description && (
          <p
            className="text-gray-300 text-sm mb-3 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            {concept.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          {concept.product_count !== undefined && (
            <div className="flex items-center gap-2 text-[#C9A84C] text-sm">
              <Package size={14} />
              <span style={{ fontFamily: "'Lato', sans-serif" }}>
                {concept.product_count} Ürün
              </span>
            </div>
          )}
          <Link
            href={`/hazir-konseptler/${concept.slug}`}
            className="text-white border border-[#C9A84C] hover:bg-[#C9A84C] text-xs px-4 py-2 transition-all duration-300"
            style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "1px", textTransform: "uppercase" }}
          >
            Konsepti İncele
          </Link>
        </div>
      </div>
    </div>
  );
}
