"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Save, Edit2 } from "lucide-react";

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}
import ImageUpload from "@/components/admin/ImageUpload";

interface InstaPost {
  id?: number; image: string; caption: string; link: string; is_active: number; sort_order: number;
}

const EMPTY: InstaPost = { image: "", caption: "", link: "https://www.instagram.com/gozdeceyiz", is_active: 1, sort_order: 0 };

export default function AdminInstagram() {
  const [items, setItems] = useState<InstaPost[]>([]);
  const [editing, setEditing] = useState<InstaPost | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    const data = await fetch("/api/instagram?active=all").then((r) => r.json());
    setItems(data);
  }

  async function save() {
    if (!editing) return;
    const method = editing.id ? "PUT" : "POST";
    const url = editing.id ? `/api/instagram/${editing.id}` : "/api/instagram";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    setEditing(null); setShowForm(false); load();
  }

  async function del(id: number) {
    if (!confirm("Post silinsin mi?")) return;
    await fetch(`/api/instagram/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>Instagram Yönetimi</h1>
          <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: "'Lato', sans-serif" }}>Manuel Instagram gönderisi ekleyin</p>
        </div>
        <button onClick={() => { setEditing({ ...EMPTY }); setShowForm(true); }} className="flex items-center gap-2 bg-[#C9A84C] text-white px-4 py-2 hover:bg-[#A07C2A] text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>
          <Plus size={16} /> Yeni Post
        </button>
      </div>

      {showForm && editing && (
        <div className="bg-white p-6 shadow-sm mb-6">
          <h2 className="font-semibold text-gray-700 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>{editing.id ? "Post Düzenle" : "Yeni Post"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1" style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "1.5px" }}>Link (Instagram Post URL)</label>
              <input type="text" value={editing.link} onChange={(e) => setEditing((p) => p ? { ...p, link: e.target.value } : p)}
                className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]" style={{ fontFamily: "'Lato', sans-serif" }} />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1" style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "1.5px" }}>Sıralama</label>
              <input type="number" value={editing.sort_order} onChange={(e) => setEditing((p) => p ? { ...p, sort_order: +e.target.value } : p)}
                className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1" style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "1.5px" }}>Açıklama</label>
              <textarea rows={2} value={editing.caption} onChange={(e) => setEditing((p) => p ? { ...p, caption: e.target.value } : p)}
                className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C] resize-none" style={{ fontFamily: "'Lato', sans-serif" }} />
            </div>
          </div>
          <div className="mt-4">
            <ImageUpload label="Post Görseli (kare format önerilir)" value={editing.image} onChange={(url) => setEditing((p) => p ? { ...p, image: url } : p)} folder="instagram" hint="Önerilen: 1080 × 1080 px (kare)" />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={save} className="flex items-center gap-2 bg-[#C9A84C] text-white px-4 py-2 text-sm hover:bg-[#A07C2A]" style={{ fontFamily: "'Lato', sans-serif" }}><Save size={14} /> Kaydet</button>
            <button onClick={() => { setEditing(null); setShowForm(false); }} className="border border-gray-200 px-4 py-2 text-sm text-gray-600" style={{ fontFamily: "'Lato', sans-serif" }}>İptal</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {items.map((item) => (
          <div key={item.id} className="relative group bg-gray-100 aspect-square overflow-hidden">
            {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button onClick={() => { setEditing({ ...item }); setShowForm(true); }} className="p-1.5 bg-white text-blue-500 rounded-full"><Edit2 size={14} /></button>
              <button onClick={() => del(item.id!)} className="p-1.5 bg-white text-red-400 rounded-full"><Trash2 size={14} /></button>
            </div>
            <div className="absolute bottom-1 right-1">
              <InstagramIcon size={14} />
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && (
        <div className="bg-white p-12 text-center shadow-sm">
          <div className="text-gray-300 flex justify-center mb-3"><InstagramIcon size={32} /></div>
          <p className="text-gray-400 text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>Henüz Instagram postu eklenmedi.</p>
        </div>
      )}
    </div>
  );
}
