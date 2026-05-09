"use client";

import { useEffect, useState } from "react";
import { Save, CheckCircle } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

type Settings = Record<string, string>;

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>({});
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then((data) => { setSettings(data); setLoading(false); });
  }, []);

  function set(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) return <div className="text-gray-400 text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>Yükleniyor...</div>;

  const field = (label: string, key: string, type: "text" | "textarea" = "text") => (
    <div>
      <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2" style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "1.5px" }}>{label}</label>
      {type === "textarea" ? (
        <textarea
          rows={3}
          value={settings[key] || ""}
          onChange={(e) => set(key, e.target.value)}
          className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C] resize-none"
          style={{ fontFamily: "'Lato', sans-serif" }}
        />
      ) : (
        <input
          type="text"
          value={settings[key] || ""}
          onChange={(e) => set(key, e.target.value)}
          className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]"
          style={{ fontFamily: "'Lato', sans-serif" }}
        />
      )}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>Site Ayarları</h1>
        <button
          onClick={save}
          className="flex items-center gap-2 bg-[#C9A84C] text-white px-5 py-2 hover:bg-[#A07C2A] text-sm transition-colors"
          style={{ fontFamily: "'Lato', sans-serif" }}
        >
          {saved ? <CheckCircle size={16} /> : <Save size={16} />}
          {saved ? "Kaydedildi!" : "Kaydet"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-700 border-b pb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Mağaza Bilgileri</h2>
          {field("Mağaza Adı", "store_name")}
          {field("Telefon", "phone")}
          {field("WhatsApp (başında 90)", "whatsapp")}
          {field("Adres", "address")}
          {field("Çalışma Saatleri", "working_hours", "textarea")}
        </div>

        <div className="bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-700 border-b pb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Sosyal Medya</h2>
          {field("Instagram URL", "instagram")}
          {field("Facebook URL", "facebook")}
          {field("Google Maps Embed URL", "google_maps")}
        </div>

        <div className="bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-700 border-b pb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Hakkımızda Metni</h2>
          {field("Hakkımızda Açıklaması", "about_text", "textarea")}
        </div>

        <div className="bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-700 border-b pb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Logo & Favicon</h2>
          <ImageUpload
            label="Logo"
            value={settings.logo}
            onChange={(url) => set("logo", url)}
            folder="general"
            hint="Önerilen: PNG formatında, şeffaf arka plan"
          />
          <ImageUpload
            label="Favicon"
            value={settings.favicon}
            onChange={(url) => set("favicon", url)}
            folder="general"
            hint="Önerilen: 32×32 px veya 64×64 px"
          />
        </div>
      </div>
    </div>
  );
}
