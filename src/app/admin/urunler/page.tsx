"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Save, Edit2, Star, Sparkles } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

interface Category { id: number; name: string; slug: string; }
interface Product {
  id?: number; name: string; slug: string; short_description: string;
  description: string; category_id: number | null; main_image: string;
  is_featured: number; is_new: number; is_active: number; sort_order: number;
  images?: { id: number; image: string }[];
  gallery_images?: string[];
}

const EMPTY: Product = { name: "", slug: "", short_description: "", description: "", category_id: null, main_image: "", is_featured: 0, is_new: 0, is_active: 1, sort_order: 0, gallery_images: [] };

function toSlug(text: string) {
  return text.toLowerCase().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim();
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    const [prods, cats] = await Promise.all([
      fetch("/api/products?active=all").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]);
    setProducts(prods);
    setCategories(cats);
  }

  async function save() {
    if (!editing) return;
    const payload = { ...editing, images: editing.gallery_images || [] };
    const method = editing.id ? "PUT" : "POST";
    const url = editing.id ? `/api/products/${editing.id}` : "/api/products";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setEditing(null); setShowForm(false); load();
  }

  async function del(id: number) {
    if (!confirm("Ürün silinsin mi?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    load();
  }

  function openEdit(p: Product) {
    const galleryImages = (p.images || []).map((img) => img.image);
    setEditing({ ...p, gallery_images: galleryImages });
    setShowForm(true);
  }

  const filtered = products.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>Ürünler</h1>
        <button onClick={() => { setEditing({ ...EMPTY, gallery_images: [] }); setShowForm(true); }} className="flex items-center gap-2 bg-[#C9A84C] text-white px-4 py-2 hover:bg-[#A07C2A] text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>
          <Plus size={16} /> Yeni Ürün
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-3 mb-4 text-xs text-blue-600 rounded" style={{ fontFamily: "'Lato', sans-serif" }}>
        📐 Ürün ana görseli: <strong>1000 × 1000 px</strong> | Galeri görselleri: <strong>1200 × 1600 px</strong>
      </div>

      {/* Form */}
      {showForm && editing && (
        <div className="bg-white p-6 shadow-sm mb-6">
          <h2 className="font-semibold text-gray-700 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>{editing.id ? "Ürün Düzenle" : "Yeni Ürün"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1" style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "1.5px" }}>Ürün Adı *</label>
              <input type="text" value={editing.name} onChange={(e) => setEditing((p) => p ? { ...p, name: e.target.value, slug: p.id ? p.slug : toSlug(e.target.value) } : p)}
                className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]" style={{ fontFamily: "'Lato', sans-serif" }} />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1" style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "1.5px" }}>Kategori</label>
              <select value={editing.category_id || ""} onChange={(e) => setEditing((p) => p ? { ...p, category_id: e.target.value ? +e.target.value : null } : p)}
                className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]" style={{ fontFamily: "'Lato', sans-serif" }}>
                <option value="">Kategori Seçin</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1" style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "1.5px" }}>Kısa Açıklama</label>
              <input type="text" value={editing.short_description} onChange={(e) => setEditing((p) => p ? { ...p, short_description: e.target.value } : p)}
                className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]" style={{ fontFamily: "'Lato', sans-serif" }} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1" style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "1.5px" }}>Uzun Açıklama</label>
              <textarea rows={4} value={editing.description} onChange={(e) => setEditing((p) => p ? { ...p, description: e.target.value } : p)}
                className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C] resize-none" style={{ fontFamily: "'Lato', sans-serif" }} />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1" style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "1.5px" }}>Sıralama</label>
              <input type="number" value={editing.sort_order} onChange={(e) => setEditing((p) => p ? { ...p, sort_order: +e.target.value } : p)}
                className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]" />
            </div>
            <div className="flex gap-6 items-center">
              {[["is_active", "Aktif"], ["is_featured", "Öne Çıkan"], ["is_new", "Yeni"]].map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer" style={{ fontFamily: "'Lato', sans-serif" }}>
                  <input type="checkbox" checked={(editing[key as keyof Product] as number) === 1}
                    onChange={(e) => setEditing((p) => p ? { ...p, [key]: e.target.checked ? 1 : 0 } : p)} className="w-4 h-4" />
                  {label}
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <ImageUpload label="Ana Görsel (1000×1000px)" value={editing.main_image} onChange={(url) => setEditing((p) => p ? { ...p, main_image: url } : p)} folder="products" hint="Önerilen: 1000 × 1000 px" />
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2" style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "1.5px" }}>Galeri Görselleri (1200×1600px)</label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {(editing.gallery_images || []).map((img, i) => (
                  <div key={i} className="relative">
                    <img src={img} alt="" className="w-full h-16 object-cover" />
                    <button type="button" className="absolute top-0 right-0 bg-red-500 text-white text-xs p-0.5"
                      onClick={() => setEditing((p) => p ? { ...p, gallery_images: (p.gallery_images || []).filter((_, j) => j !== i) } : p)}>✕</button>
                  </div>
                ))}
              </div>
              <ImageUpload label="" value="" onChange={(url) => setEditing((p) => p ? { ...p, gallery_images: [...(p.gallery_images || []), url] } : p)} folder="products" hint="Eklemek için görsel yükleyin (1200×1600px)" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={save} className="flex items-center gap-2 bg-[#C9A84C] text-white px-4 py-2 text-sm hover:bg-[#A07C2A]" style={{ fontFamily: "'Lato', sans-serif" }}><Save size={14} /> Kaydet</button>
            <button onClick={() => { setEditing(null); setShowForm(false); }} className="border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-gray-400" style={{ fontFamily: "'Lato', sans-serif" }}>İptal</button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="mb-4">
        <input type="search" placeholder="Ürün ara..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-[#C9A84C] w-full md:w-64" style={{ fontFamily: "'Lato', sans-serif" }} />
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white p-4 shadow-sm flex items-center gap-4">
            {p.main_image && <img src={p.main_image} alt={p.name} className="w-12 h-12 object-cover shrink-0 bg-gray-100" />}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-800 text-sm truncate" style={{ fontFamily: "'Lato', sans-serif" }}>{p.name}</p>
                {(p as { is_featured?: number }).is_featured === 1 && <Star size={12} className="text-[#C9A84C] shrink-0" />}
                {(p as { is_new?: number }).is_new === 1 && <Sparkles size={12} className="text-[#8B1A35] shrink-0" />}
              </div>
              <p className="text-xs text-gray-400 truncate" style={{ fontFamily: "'Lato', sans-serif" }}>{p.short_description}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 shrink-0 ${p.is_active ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`} style={{ fontFamily: "'Lato', sans-serif" }}>
              {p.is_active ? "Aktif" : "Pasif"}
            </span>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => openEdit(p)} className="p-2 text-blue-500 hover:bg-blue-50"><Edit2 size={16} /></button>
              <button onClick={() => del(p.id!)} className="p-2 text-red-400 hover:bg-red-50"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="bg-white p-12 text-center shadow-sm">
            <p className="text-gray-400 text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>Ürün bulunamadı.</p>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-4" style={{ fontFamily: "'Lato', sans-serif" }}>Toplam: {filtered.length} ürün</p>
    </div>
  );
}
