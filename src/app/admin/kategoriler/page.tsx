"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Save, Edit2 } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

interface Category {
  id?: number; name: string; slug: string; description: string;
  image: string; banner_image: string; is_active: number; sort_order: number;
}

const EMPTY: Category = { name: "", slug: "", description: "", image: "", banner_image: "", is_active: 1, sort_order: 0 };

function toSlug(text: string) {
  return text.toLowerCase().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim();
}

export default function AdminCategories() {
  const [items, setItems] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    const data = await fetch("/api/categories").then((r) => r.json());
    setItems(data);
  }

  async function save() {
    if (!editing) return;
    const method = editing.id ? "PUT" : "POST";
    const url = editing.id ? `/api/categories/${editing.id}` : "/api/categories";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    setEditing(null); setShowForm(false); load();
  }

  async function del(id: number) {
    if (!confirm("Kategori silinsin mi?")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>Kategoriler</h1>
        <button onClick={() => { setEditing({ ...EMPTY }); setShowForm(true); }} className="flex items-center gap-2 bg-[#C9A84C] text-white px-4 py-2 hover:bg-[#A07C2A] text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>
          <Plus size={16} /> Yeni Kategori
        </button>
      </div>

      {showForm && editing && (
        <div className="bg-white p-6 shadow-sm mb-6">
          <h2 className="font-semibold text-gray-700 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>{editing.id ? "Kategori Düzenle" : "Yeni Kategori"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[["Kategori Adı *", "name"], ["URL Slug", "slug"], ["Açıklama", "description"]].map(([label, key]) => (
              <div key={key}>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1" style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "1.5px" }}>{label}</label>
                <input type="text" value={(editing[key as keyof Category] as string) || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (key === "name") { setEditing((p) => p ? { ...p, name: val, slug: p.id ? p.slug : toSlug(val) } : p); }
                    else setEditing((p) => p ? { ...p, [key]: val } : p);
                  }}
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]" style={{ fontFamily: "'Lato', sans-serif" }} />
              </div>
            ))}
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1" style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "1.5px" }}>Sıralama</label>
              <input type="number" value={editing.sort_order} onChange={(e) => setEditing((p) => p ? { ...p, sort_order: +e.target.value } : p)}
                className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]" />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs uppercase tracking-wider text-gray-500" style={{ fontFamily: "'Lato', sans-serif" }}>Aktif</label>
              <input type="checkbox" checked={editing.is_active === 1} onChange={(e) => setEditing((p) => p ? { ...p, is_active: e.target.checked ? 1 : 0 } : p)} className="w-4 h-4" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <ImageUpload label="Kategori Görseli (800×600px)" value={editing.image} onChange={(url) => setEditing((p) => p ? { ...p, image: url } : p)} folder="categories" hint="Önerilen: 800 × 600 px" />
            <ImageUpload label="Banner Görseli (1920×400px)" value={editing.banner_image} onChange={(url) => setEditing((p) => p ? { ...p, banner_image: url } : p)} folder="categories" hint="Önerilen: 1920 × 400 px" />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={save} className="flex items-center gap-2 bg-[#C9A84C] text-white px-4 py-2 text-sm hover:bg-[#A07C2A]" style={{ fontFamily: "'Lato', sans-serif" }}><Save size={14} /> Kaydet</button>
            <button onClick={() => { setEditing(null); setShowForm(false); }} className="border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-gray-400" style={{ fontFamily: "'Lato', sans-serif" }}>İptal</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items.map((c) => (
          <div key={c.id} className="bg-white p-4 shadow-sm flex items-center gap-4">
            {c.image && <img src={c.image} alt={c.name} className="w-12 h-12 object-cover shrink-0 bg-gray-100" />}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>{c.name}</p>
              <p className="text-xs text-gray-400" style={{ fontFamily: "'Lato', sans-serif" }}>/{c.slug}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 shrink-0 ${c.is_active ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`} style={{ fontFamily: "'Lato', sans-serif" }}>
              {c.is_active ? "Aktif" : "Pasif"}
            </span>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => { setEditing({ ...c }); setShowForm(true); }} className="p-2 text-blue-500 hover:bg-blue-50"><Edit2 size={16} /></button>
              <button onClick={() => del(c.id!)} className="p-2 text-red-400 hover:bg-red-50"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="bg-white p-12 text-center shadow-sm">
            <p className="text-gray-400 text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>Kategori bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
}
