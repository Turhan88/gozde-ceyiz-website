"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Giriş başarısız");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div
            className="text-3xl text-[#2C2C2C] mb-1"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Gözde Çeyiz
          </div>
          <div
            className="text-xs tracking-widest uppercase"
            style={{ fontFamily: "'Lato', sans-serif", color: "#C9A84C", letterSpacing: "4px" }}
          >
            Admin Panel
          </div>
          <div className="w-12 h-[2px] bg-[#C9A84C] mx-auto mt-4" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-xs uppercase tracking-wider text-gray-500 mb-2"
              style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "1.5px" }}
            >
              Kullanıcı Adı
            </label>
            <input
              type="text"
              required
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full border border-gray-200 px-4 py-3 focus:outline-none focus:border-[#C9A84C] text-sm"
              style={{ fontFamily: "'Lato', sans-serif" }}
              placeholder="admin"
            />
          </div>
          <div>
            <label
              className="block text-xs uppercase tracking-wider text-gray-500 mb-2"
              style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "1.5px" }}
            >
              Şifre
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-200 px-4 py-3 focus:outline-none focus:border-[#C9A84C] text-sm"
              style={{ fontFamily: "'Lato', sans-serif" }}
              placeholder="••••••••"
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm text-center" style={{ fontFamily: "'Lato', sans-serif" }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full py-3 text-center"
          >
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6" style={{ fontFamily: "'Lato', sans-serif" }}>
          Varsayılan: admin / admin123
        </p>
      </div>
    </div>
  );
}
