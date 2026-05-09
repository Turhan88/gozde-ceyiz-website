"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, MapPin, Clock, Send } from "lucide-react";

function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const msg = `Merhaba, ben ${form.name}.\n\nMesajım: ${form.message}\n\nTelefonum: ${form.phone}`;
    window.open(`https://wa.me/905317906563?text=${encodeURIComponent(msg)}`, "_blank");
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <>
      <div className="bg-[#2C2C2C] py-16 text-center text-white">
        <p className="section-subtitle" style={{ color: "#C9A84C" }}>Bize Ulaşın</p>
        <h1 className="text-4xl md:text-5xl" style={{ fontFamily: "'Playfair Display', serif" }}>İletişim</h1>
        <div className="gold-divider mt-4 mb-4" />
        <nav className="text-sm text-gray-400 flex items-center justify-center gap-2" style={{ fontFamily: "'Lato', sans-serif" }}>
          <Link href="/" className="hover:text-[#C9A84C]">Ana Sayfa</Link>
          <span>/</span>
          <span className="text-[#C9A84C]">İletişim</span>
        </nav>
      </div>

      <section className="py-20 px-4 bg-[#F8F4EE]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact info */}
            <div>
              <p className="section-subtitle text-left" style={{ textAlign: "left" }}>Bilgilerimiz</p>
              <h2 className="text-3xl text-[#2C2C2C] mb-3" style={{ fontFamily: "'Playfair Display', serif", textAlign: "left" }}>
                Bize Ulaşın
              </h2>
              <div className="w-12 h-[2px] bg-[#C9A84C] mb-8" />

              <div className="space-y-8">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-[#C9A84C]/10 rounded-full flex items-center justify-center shrink-0">
                    <Phone className="text-[#C9A84C]" size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm uppercase tracking-widest text-gray-500 mb-1" style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "2px" }}>Telefon & WhatsApp</h4>
                    <a href="tel:+905317906563" className="text-[#2C2C2C] text-lg hover:text-[#C9A84C] transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
                      +90 531 790 65 63
                    </a>
                    <br />
                    <a
                      href="https://wa.me/905317906563"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 text-sm hover:underline"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      WhatsApp ile yazın →
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-[#C9A84C]/10 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="text-[#C9A84C]" size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm uppercase tracking-widest text-gray-500 mb-1" style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "2px" }}>Adres</h4>
                    <p className="text-[#2C2C2C]" style={{ fontFamily: "'Lato', sans-serif" }}>İstanbul, Türkiye</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-[#C9A84C]/10 rounded-full flex items-center justify-center shrink-0">
                    <Clock className="text-[#C9A84C]" size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm uppercase tracking-widest text-gray-500 mb-1" style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "2px" }}>Çalışma Saatleri</h4>
                    <p className="text-[#2C2C2C] text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>Pazartesi - Cumartesi: 09:00 - 20:00</p>
                    <p className="text-[#2C2C2C] text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>Pazar: 10:00 - 18:00</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-[#C9A84C]/10 rounded-full flex items-center justify-center shrink-0">
                    <div className="text-[#C9A84C]"><InstagramIcon size={20} /></div>
                  </div>
                  <div>
                    <h4 className="text-sm uppercase tracking-widest text-gray-500 mb-1" style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "2px" }}>Instagram</h4>
                    <a
                      href="https://www.instagram.com/gozdeceyiz"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#C9A84C] hover:underline"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      @gozdeceyiz
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="bg-white p-8 shadow-sm">
              <h3 className="text-2xl text-[#2C2C2C] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Mesaj Gönderin
              </h3>
              <p className="text-gray-500 text-sm mb-6" style={{ fontFamily: "'Lato', sans-serif" }}>
                Formu doldurun, WhatsApp üzerinden size ulaşalım.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2" style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "1.5px" }}>
                    Adınız Soyadınız *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C] transition-colors"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                    placeholder="Adınız Soyadınız"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2" style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "1.5px" }}>
                    Telefon Numaranız
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C] transition-colors"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                    placeholder="+90 5XX XXX XX XX"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2" style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "1.5px" }}>
                    Mesajınız *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C] transition-colors resize-none"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                    placeholder="Mesajınızı yazın..."
                  />
                </div>
                <button
                  type="submit"
                  className="btn-gold w-full flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  {sent ? "WhatsApp Açıldı!" : "WhatsApp ile Gönder"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <div className="bg-[#2C2C2C] h-64 flex items-center justify-center">
        <div className="text-center text-white">
          <MapPin size={32} className="text-[#C9A84C] mx-auto mb-3" />
          <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl">Gözde Çeyiz Aksesuar ve Kına Evi</p>
          <p style={{ fontFamily: "'Lato', sans-serif" }} className="text-gray-400 text-sm mt-1">İstanbul, Türkiye</p>
          <a
            href="https://wa.me/905317906563?text=Merhaba%2C%20adresinizi%20öğrenebilir%20miyim%3F"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-[#C9A84C] text-sm hover:underline"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            Adres için WhatsApp'tan sorun →
          </a>
        </div>
      </div>
    </>
  );
}
