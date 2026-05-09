"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Save, Edit2 } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

interface Slider {
  id?: number; title: string; description: string; button_text: string;
  button_link: string; desktop_image: string; mobile_image: string;
  is_active: number; sort_order: number;
}

const EMPTY: Slider = { title: "", description: "", button_text: "", button_link: "", desktop_image: "", mobile_image: "", is_active: 1, sort_order: 0 };

export default function AdminSlider() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [editing, setEditing] = useState<Slider | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    const data = await fetch("/api/sliders?active=all").then((r) => r.json());
    setSliders(data);
  }

  async function save() {
    if (!editing) return;
    const method = editing.id ? "PUT" : "POST";
    const url = editing.id ? `/api/sliders/${editing.id}` : "/api/sliders";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    setEditing(null); setShowForm(false); load();
  }

  async function del(id: number) {
    if (!confirm("Slider silinsin mi?")) return;
    await fetch(`/api/sliders/${id}`, { method: "DELETE" });
    load();
  }

  function openNew() { setEditing({ ...EMPTY }); setShowForm(true); }
  function openEdit(s: Slider) { setEditing({ ...s }); setShowForm(true); }

  const inp = (label: string, key: keyof Slider) => (
    <div>
      <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1" style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "1.5px" }}>{label}</label>
      <input type="text" value={(editing?.[key] as string) || ""} onChange={(e) => setEditing((p) => p ? { ...p, [key]: e.target.value } : p)}
        className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]" style={{ fontFamily: "'Lato', sans-serif" }} />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>Slider Yönetimi</h1>
        <button onClick={openNew} className="flex items-center gap-2 bg-[#C9A84C] text-white px-4 py-2 hover:bg-[#A07C2A] text-sm transition-colors" style={{ fontFamily: "'Lato', sans-serif" }}>
          <Plus size={16} /> Yeni Slider
        </button>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-100 p-3 mb-6 text-xs text-blue-600 rounded" style={{ fontFamily: "'Lato', sans-serif" }}>
        📐 Masaüstü slider: <strong>1920 × 800 px</strong> | Mobil slider: <strong>1080 × 1350 px</strong>
      </div>

      {/* Form */}
      {showForm && editing && (
        <div className="bg-white p-6 shadow-sm mb-6">
          <h2 className="font-semibold text-gray-700 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            {editing.id ? "Slider Düzenle" : "Yeni Slider"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inp("Başlık *", "title")}
            {inp("Açıklama", "description")}
            {inp("Buton Yazısı", "button_text")}
            {inp("Buton Linki", "button_link")}
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
            <ImageUpload label="Masaüstü Görseli (1920×800px)" value={editing.desktop_image} onChange={(url) => setEditing((p) => p ? { ...p, desktop_image: url } : p)} folder="sliders" hint="Önerilen: 1920 × 800 px" />
            <ImageUpload label="Mobil Görseli (1080×1350px)" value={editing.mobile_image} onChange={(url) => setEditing((p) => p ? { ...p, mobile_image: url } : p)} folder="sliders" hint="Önerilen: 1080 × 1350 px" />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={save} className="flex items-center gap-2 bg-[#C9A84C] text-white px-4 py-2 text-sm hover:bg-[#A07C2A]" style={{ fontFamily: "'Lato', sans-serif" }}>
              <Save size={14} /> Kaydet
            </button>
            <button onClick={() => { setEditing(null); setShowForm(false); }} className="border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-gray-400" style={{ fontFamily: "'Lato', sans-serif" }}>
              İptal
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {sliders.map((s) => (
          <div key={s.id} className="bg-white p-4 shadow-sm flex items-center gap-4">
            {s.desktop_image && (
              <div className="w-20 h-12 relative overflow-hidden shrink-0 bg-gray-100">
                <img src={s.desktop_image} alt={s.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 text-sm truncate" style={{ fontFamily: "'Lato', sans-serif" }}>{s.title}</p>
              <p className="text-xs text-gray-400" style={{ fontFamily: "'Lato', sans-serif" }}>{s.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 ${s.is_active ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`} style={{ fontFamily: "'Lato', sans-serif" }}>
                  {s.is_active ? "Aktif" : "Pasif"}
                </span>
                <span className="text-xs text-gray-400" style={{ fontFamily: "'Lato', sans-serif" }}>Sıra: {s.sort_order}</span>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => openEdit(s)} className="p-2 text-blue-500 hover:bg-blue-50 transition-colors"><Edit2 size={16} /></button>
              <button onClick={() => del(s.id!)} className="p-2 text-red-400 hover:bg-red-50 transition-colors"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        {sliders.length === 0 && (
          <div className="bg-white p-12 text-center shadow-sm">
            <p className="text-gray-400 text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>Slider bulunamadı. Yeni slider ekleyin.</p>
          </div>
        )}
      </div>
    </div>
  );
}
