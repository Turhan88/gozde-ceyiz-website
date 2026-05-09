"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Layers, Image, Grid, RefreshCw } from "lucide-react";

interface Stats {
  products: number; concepts: number; sliders: number; categories: number;
  recentProducts: { id: number; name: string; created_at: string }[];
  recentConcepts: { id: number; name: string; created_at: string }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    const [products, concepts, sliders, categories] = await Promise.all([
      fetch("/api/products?active=all").then((r) => r.json()),
      fetch("/api/concepts?active=all").then((r) => r.json()),
      fetch("/api/sliders?active=all").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]);
    setStats({
      products: products.length,
      concepts: concepts.length,
      sliders: sliders.length,
      categories: categories.length,
      recentProducts: products.slice(0, 5),
      recentConcepts: concepts.slice(0, 5),
    });
  }

  async function runSeed() {
    setSeeding(true);
    setSeedMsg("");
    const res = await fetch("/api/seed", { method: "POST" });
    const data = await res.json();
    setSeedMsg(data.message || (data.error ? `Hata: ${data.error}` : "Tamamlandı"));
    setSeeding(false);
    fetchStats();
  }

  const cards = [
    { label: "Toplam Ürün", value: stats?.products ?? "...", icon: Package, href: "/admin/urunler", color: "#C9A84C" },
    { label: "Konseptler", value: stats?.concepts ?? "...", icon: Layers, href: "/admin/konseptler", color: "#8B1A35" },
    { label: "Sliderlar", value: stats?.sliders ?? "...", icon: Image, href: "/admin/slider", color: "#2E86AB" },
    { label: "Kategoriler", value: stats?.categories ?? "...", icon: Grid, href: "/admin/kategoriler", color: "#7B9E87" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: "'Lato', sans-serif" }}>Gözde Çeyiz Yönetim Paneli</p>
        </div>
        <button
          onClick={runSeed}
          disabled={seeding}
          className="flex items-center gap-2 bg-[#C9A84C] hover:bg-[#A07C2A] text-white text-xs px-4 py-2 transition-colors disabled:opacity-50"
          style={{ fontFamily: "'Lato', sans-serif" }}
        >
          <RefreshCw size={14} className={seeding ? "animate-spin" : ""} />
          {seeding ? "Demo Yükleniyor..." : "Demo Veri Yükle"}
        </button>
      </div>

      {seedMsg && (
        <div className={`mb-6 p-3 text-sm rounded ${seedMsg.includes("Hata") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}
          style={{ fontFamily: "'Lato', sans-serif" }}>
          {seedMsg}
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="bg-white p-6 shadow-sm hover:shadow-md transition-shadow block"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider" style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "1px" }}>
                    {card.label}
                  </p>
                  <p className="text-3xl font-bold mt-1" style={{ color: card.color, fontFamily: "'Playfair Display', serif" }}>
                    {card.value}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${card.color}20` }}>
                  <Icon size={20} style={{ color: card.color }} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-700 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Son Ürünler
          </h2>
          {stats?.recentProducts.length === 0 ? (
            <p className="text-sm text-gray-400" style={{ fontFamily: "'Lato', sans-serif" }}>Henüz ürün yok</p>
          ) : (
            <ul className="space-y-2">
              {stats?.recentProducts.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-700 truncate" style={{ fontFamily: "'Lato', sans-serif" }}>{p.name}</span>
                  <Link href={`/admin/urunler`} className="text-xs text-[#C9A84C] hover:underline ml-2 shrink-0" style={{ fontFamily: "'Lato', sans-serif" }}>
                    Düzenle
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link href="/admin/urunler" className="inline-block mt-4 text-xs text-[#C9A84C] hover:underline" style={{ fontFamily: "'Lato', sans-serif" }}>
            Tüm ürünleri gör →
          </Link>
        </div>

        <div className="bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-700 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Son Konseptler
          </h2>
          {stats?.recentConcepts.length === 0 ? (
            <p className="text-sm text-gray-400" style={{ fontFamily: "'Lato', sans-serif" }}>Henüz konsept yok</p>
          ) : (
            <ul className="space-y-2">
              {stats?.recentConcepts.map((c) => (
                <li key={c.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-700 truncate" style={{ fontFamily: "'Lato', sans-serif" }}>{c.name}</span>
                  <Link href="/admin/konseptler" className="text-xs text-[#C9A84C] hover:underline ml-2 shrink-0" style={{ fontFamily: "'Lato', sans-serif" }}>
                    Düzenle
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link href="/admin/konseptler" className="inline-block mt-4 text-xs text-[#C9A84C] hover:underline" style={{ fontFamily: "'Lato', sans-serif" }}>
            Tüm konseptleri gör →
          </Link>
        </div>
      </div>

      {/* Quick links */}
      <div className="bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-700 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Hızlı İşlemler</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { href: "/admin/urunler", label: "+ Yeni Ürün Ekle" },
            { href: "/admin/konseptler", label: "+ Yeni Konsept Ekle" },
            { href: "/admin/slider", label: "+ Slider Ekle" },
            { href: "/admin/galeri", label: "+ Galeri Görseli Ekle" },
            { href: "/admin/ayarlar", label: "⚙ Site Ayarları" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2 bg-gray-50 hover:bg-[#C9A84C] hover:text-white text-gray-700 text-xs border border-gray-200 hover:border-[#C9A84C] transition-all"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Image size reference */}
      <div className="mt-6 bg-blue-50 border border-blue-100 p-4 rounded">
        <h3 className="text-sm font-semibold text-blue-700 mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>📐 Görsel Boyutları Referansı</h3>
        <ul className="text-xs text-blue-600 space-y-1" style={{ fontFamily: "'Lato', sans-serif" }}>
          <li>• Slider (Masaüstü): <strong>1920 × 800 px</strong></li>
          <li>• Slider (Mobil): <strong>1080 × 1350 px</strong></li>
          <li>• Ürün Ana Görseli: <strong>1000 × 1000 px</strong></li>
          <li>• Ürün Galeri Görselleri: <strong>1200 × 1600 px</strong></li>
          <li>• Konsept Kapak Görseli: <strong>1600 × 1000 px</strong></li>
          <li>• Konsept İçi Ürün Görselleri: <strong>1000 × 1000 px</strong></li>
          <li>• Kategori Görseli: <strong>800 × 600 px</strong></li>
        </ul>
      </div>
    </div>
  );
}
