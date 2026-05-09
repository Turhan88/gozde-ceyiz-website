"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Save, Edit2, GripVertical, X } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

interface Category { id: number; name: string; }
interface Product { id: number; name: string; main_image?: string; category_name?: string; }
interface Concept {
  id?: number; name: string; slug: string; description: string;
  cover_image: string; category_id: number | null; is_active: number; sort_order: number;
  product_ids?: number[];
  products?: Product[];
}

const EMPTY: Concept = { name: "", slug: "", description: "", cover_image: "", category_id: null, is_active: 1, sort_order: 0, product_ids: [] };

function toSlug(text: string) {
  return text.toLowerCase().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim();
}

export default function AdminConcepts() {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Concept | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [productSearch, setProductSearch] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    const [cons, cats, prods] = await Promise.all([
      fetch("/api/concepts?active=all").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/products?active=all").then((r) => r.json()),
    ]);
    setConcepts(cons);
    setCategories(cats);
    setProducts(prods);
  }

  async function save() {
    if (!editing) return;
    const method = editing.id ? "PUT" : "POST";
    const url = editing.id ? `/api/concepts/${editing.id}` : "/api/concepts";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    setEditing(null); setShowForm(false); load();
  }

  async function del(id: number) {
    if (!confirm("Konsept silinsin mi?")) return;
    await fetch(`/api/concepts/${id}`, { method: "DELETE" });
    load();
  }

  function openEdit(c: Concept) {
    const pids = (c.products || []).map((p) => p.id);
    setEditing({ ...c, product_ids: pids });
    setShowForm(true);
  }

  function toggleProduct(pid: number) {
    setEditing((prev) => {
      if (!prev) return prev;
      const ids = prev.product_ids || [];
      const newIds = ids.includes(pid) ? ids.filter((id) => id !== pid) : [...ids, pid];
      return { ...prev, product_ids: newIds };
    });
  }

  const selectedProducts = products.filter((p) => (editing?.product_ids || []).includes(p.id));
  const filteredProducts = products.filter((p) =>
    !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>Konseptler</h1>
        <button onClick={() => { setEditing({ ...EMPTY, product_ids: [] }); setShowForm(true); }} className="flex items-center gap-2 bg-[#C9A84C] text-white px-4 py-2 hover:bg-[#A07C2A] text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>
          <Plus size={16} /> Yeni Konsept
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-3 mb-4 text-xs text-blue-600 rounded" style={{ fontFamily: "'Lato', sans-serif" }}>
        📐 Konsept kapak görseli: <strong>1600 × 1000 px</strong> | Her konsepte min. 2, max. 10 ürün eklenebilir
      </div>

      {/* Form */}
      {showForm && editing && (
        <div className="bg-white p-6 shadow-sm mb-6">
          <h2 className="font-semibold text-gray-700 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>{editing.id ? "Konsept Düzenle" : "Yeni Konsept"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1" style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "1.5px" }}>Konsept Adı *</label>
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
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1" style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "1.5px" }}>Açıklama</label>
              <textarea rows={3} value={editing.description} onChange={(e) => setEditing((p) => p ? { ...p, description: e.target.value } : p)}
                className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C] resize-none" style={{ fontFamily: "'Lato', sans-serif" }} />
            </div>
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
          <div className="mt-4">
            <ImageUpload label="Kapak Görseli (1600×1000px)" value={editing.cover_image} onChange={(url) => setEditing((p) => p ? { ...p, cover_image: url } : p)} folder="concepts" hint="Önerilen: 1600 × 1000 px" />
          </div>

          {/* Product selection */}
          <div className="mt-6">
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-3" style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "1.5px" }}>
              Konsept Ürünleri ({(editing.product_ids || []).length} seçili) — Min. 2, Max. 10
            </label>

            {/* Selected products */}
            {selectedProducts.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4 p-3 bg-[#F8F4EE] border border-[#C9A84C]/30">
                {selectedProducts.map((p) => (
                  <div key={p.id} className="flex items-center gap-2 bg-white border border-[#C9A84C]/50 px-2 py-1 text-xs" style={{ fontFamily: "'Lato', sans-serif" }}>
                    {p.main_image && <img src={p.main_image} alt={p.name} className="w-5 h-5 object-cover" />}
                    <span className="text-gray-700 max-w-24 truncate">{p.name}</span>
                    <button type="button" onClick={() => toggleProduct(p.id)} className="text-red-400 hover:text-red-600">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Search & add products */}
            <input type="search" placeholder="Ürün ara..." value={productSearch} onChange={(e) => setProductSearch(e.target.value)}
              className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C] mb-2" style={{ fontFamily: "'Lato', sans-serif" }} />

            <div className="border border-gray-200 max-h-48 overflow-y-auto">
              {filteredProducts.map((p) => {
                const selected = (editing.product_ids || []).includes(p.id);
                return (
                  <label key={p.id} className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 border-b border-gray-50 last:border-0 ${selected ? "bg-[#F8F4EE]" : ""}`}>
                    <input type="checkbox" checked={selected} onChange={() => toggleProduct(p.id)} className="w-4 h-4 shrink-0" />
                    {p.main_image && <img src={p.main_image} alt={p.name} className="w-8 h-8 object-cover shrink-0" />}
                    <span className="text-sm text-gray-700 truncate" style={{ fontFamily: "'Lato', sans-serif" }}>{p.name}</span>
                    {p.category_name && <span className="text-xs text-gray-400 ml-auto shrink-0" style={{ fontFamily: "'Lato', sans-serif" }}>{p.category_name}</span>}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button onClick={save} className="flex items-center gap-2 bg-[#C9A84C] text-white px-4 py-2 text-sm hover:bg-[#A07C2A]" style={{ fontFamily: "'Lato', sans-serif" }}><Save size={14} /> Kaydet</button>
            <button onClick={() => { setEditing(null); setShowForm(false); }} className="border border-gray-200 px-4 py-2 text-sm text-gray-600" style={{ fontFamily: "'Lato', sans-serif" }}>İptal</button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-2">
        {concepts.map((c) => (
          <div key={c.id} className="bg-white p-4 shadow-sm flex items-center gap-4">
            {c.cover_image && <img src={c.cover_image} alt={c.name} className="w-16 h-10 object-cover shrink-0 bg-gray-100" />}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>{c.name}</p>
              <p className="text-xs text-gray-400" style={{ fontFamily: "'Lato', sans-serif" }}>
                {(c as { product_count?: number }).product_count || 0} ürün
                {c.category_id && ` · ${categories.find((cat) => cat.id === c.category_id)?.name}`}
              </p>
            </div>
            <span className={`text-xs px-2 py-0.5 shrink-0 ${c.is_active ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`} style={{ fontFamily: "'Lato', sans-serif" }}>
              {c.is_active ? "Aktif" : "Pasif"}
            </span>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => openEdit(c)} className="p-2 text-blue-500 hover:bg-blue-50"><Edit2 size={16} /></button>
              <button onClick={() => del(c.id!)} className="p-2 text-red-400 hover:bg-red-50"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        {concepts.length === 0 && (
          <div className="bg-white p-12 text-center shadow-sm">
            <p className="text-gray-400 text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>Konsept bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
}
