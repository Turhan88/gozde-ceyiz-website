"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";

const navLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/kategoriler", label: "Ürün Grupları" },
  { href: "/hazir-konseptler", label: "Hazır Konseptler" },
  { href: "/galeri", label: "Galeri" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

interface HeaderProps {
  storeName?: string;
  phone?: string;
}

export default function Header({ storeName = "Gözde Çeyiz", phone = "+90 531 790 65 63" }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top bar */}
      <div className="bg-[#2C2C2C] text-white py-2 px-4 text-xs hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "1px" }}>
            ✦ Özel Günlerinize Zarafet Katıyoruz ✦
          </span>
          <div className="flex items-center gap-4">
            <a href={`tel:${phone}`} className="flex items-center gap-1 hover:text-yellow-300 transition-colors">
              <Phone size={12} />
              <span>{phone}</span>
            </a>
            <a href="https://www.instagram.com/gozdeceyiz" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-300 transition-colors">
              Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white shadow-lg py-3"
            : "bg-[#F8F4EE] py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex flex-col items-start">
            <span
              className="text-2xl leading-tight tracking-wide"
              style={{ fontFamily: "'Playfair Display', serif", color: "#2C2C2C" }}
            >
              Gözde
            </span>
            <span
              className="text-sm tracking-widest uppercase"
              style={{ fontFamily: "'Lato', sans-serif", color: "#C9A84C", letterSpacing: "4px" }}
            >
              ÇEYİZ & KINA
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-lato tracking-wider transition-colors duration-200 relative group ${
                  pathname === link.href
                    ? "text-[#C9A84C]"
                    : "text-[#2C2C2C] hover:text-[#C9A84C]"
                }`}
                style={{ fontFamily: "'Lato', sans-serif", fontSize: "13px", letterSpacing: "1px" }}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-[1px] bg-[#C9A84C] transition-all duration-300 ${
                    pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/905317906563?text=Merhaba%2C%20ürünleriniz%20hakkında%20bilgi%20almak%20istiyorum."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:block btn-gold text-xs py-2 px-5"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              WhatsApp
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-[#2C2C2C]"
              aria-label="Menü"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-sm py-2 border-b border-gray-50 ${
                  pathname === link.href ? "text-[#C9A84C]" : "text-[#2C2C2C]"
                }`}
                style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "1px" }}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2 text-sm text-[#C9A84C]"
            >
              <Phone size={14} />
              {phone}
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
