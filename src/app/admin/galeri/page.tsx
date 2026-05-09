"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Save, Edit2 } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

interface GalleryItem {
  id?: number; title: string; image: string; category: string; is_active: number; sort_order: number;
}

const CATS = ["Genel", "Mağaza", "Vitrin", "Organizasyon", "Ürün Çekimleri", "Konsept Çekimleri"];
const EMPTY: GalleryItem = { title: "", image: "", category: "Genel", is_active: 1, sort_order: 0 };

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filterCat, setFilterCat] = useState("Tümü");

  useEffect(() => { load(); }, []);

  async function load() {
    const data = await fetch("/api/gallery?active=all").then((r) => r.json());
    setItems(data);
  }

  async function save() {
    if (!editing) return;
    const method = editing.id ? "PUT" : "POST";
    const url = editing.id ? `/api/gallery/${editing.id}` : "/api/gallery";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    setEditing(null); setShowForm(false); load();
  }

  async function del(id: number) {
    if (!confirm("Görsel silinsin mi?")) return;
    await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    load();
  }

  const filtered = filterCat === "Tümü" ? items : items.filter((i) => i.category === filterCat);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>Galeri</h1>
        <button onClick={() => { setEditing({ ...EMPTY }); setShowForm(true); }} className="flex items-center gap-2 bg-[#C9A84C] text-white px-4 py-2 hover:bg-[#A07C2A] text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>
          <Plus size={16} /> Yeni Görsel
        </button>
      </div>

      {showForm && editing && (
        <div className="bg-white p-6 shadow-sm mb-6">
          <h2 className="font-semibold text-gray-700 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>{editing.id ? "Görsel Düzenle" : "Yeni Görsel"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1" style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "1.5px" }}>Başlık</label>
              <input type="text" value={editing.title} onChange={(e) => setEditing((p) => p ? { ...p, title: e.target.value } : p)}
                className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]" style={{ fontFamily: "'Lato', sans-serif" }} />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1" style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "1.5px" }}>Kategori</label>
              <select value={editing.category} onChange={(e) => setEditing((p) => p ? { ...p, category: e.target.value } : p)}
                className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]" style={{ fontFamily: "'Lato', sans-serif" }}>
                {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1" style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "1.5px" }}>Sıralama</label>
                <input type="number" value={editing.sort_order} onChange={(e) => setEditing((p) => p ? { ...p, sort_order: +e.target.value } : p)}
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]" />
              </div>
              <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer" style={{ fontFamily: "'Lato', sans-serif" }}>
                <input type="checkbox" checked={editing.is_active === 1} onChange={(e) => setEditing((p) => p ? { ...p, is_active: e.target.checked ? 1 : 0 } : p)} className="w-4 h-4" />
                Aktif
              </label>
            </div>
          </div>
          <div className="mt-4">
            <ImageUpload label="Görsel" value={editing.image} onChange={(url) => setEditing((p) => p ? { ...p, image: url } : p)} folder="gallery" hint="Herhangi bir boyut kabul edilir" />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={save} className="flex items-center gap-2 bg-[#C9A84C] text-white px-4 py-2 text-sm hover:bg-[#A07C2A]" style={{ fontFamily: "'Lato', sans-serif" }}><Save size={14} /> Kaydet</button>
            <button onClick={() => { setEditing(null); setShowForm(false); }} className="border border-gray-200 px-4 py-2 text-sm text-gray-600" style={{ fontFamily: "'Lato', sans-serif" }}>İptal</button>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {["Tümü", ...CATS].map((cat) => (
          <button key={cat} onClick={() => setFilterCat(cat)}
            className={`text-xs px-3 py-1 border transition-all ${filterCat === cat ? "bg-[#C9A84C] text-white border-[#C9A84C]" : "border-gray-200 text-gray-600 hover:border-[#C9A84C]"}`}
            style={{ fontFamily: "'Lato', sans-serif" }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-3">
        {filtered.map((item) => (
          <div key={item.id} className="relative group bg-gray-100 aspect-square overflow-hidden">
            {item.image && <img src={item.image} alt={item.title || ""} className="w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button onClick={() => { setEditing({ ...item }); setShowForm(true); }} className="p-1.5 bg-white text-blue-500 rounded-full hover:bg-blue-50"><Edit2 size={14} /></button>
              <button onClick={() => del(item.id!)} className="p-1.5 bg-white text-red-400 rounded-full hover:bg-red-50"><Trash2 size={14} /></button>
            </div>
            {!item.is_active && <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-400" />}
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="bg-white p-12 text-center shadow-sm mt-4">
          <p className="text-gray-400 text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>Görsel bulunamadı.</p>
        </div>
      )}
    </div>
  );
}
