"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Image, Grid, Package, Layers, GalleryHorizontal,
  Settings, LogOut, Menu, X, ChevronRight
} from "lucide-react";

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/slider", label: "Slider Yönetimi", icon: Image },
  { href: "/admin/kategoriler", label: "Kategoriler", icon: Grid },
  { href: "/admin/urunler", label: "Ürünler", icon: Package },
  { href: "/admin/konseptler", label: "Konseptler", icon: Layers },
  { href: "/admin/galeri", label: "Galeri", icon: GalleryHorizontal },
  { href: "/admin/instagram", label: "Instagram", icon: InstagramIcon },
  { href: "/admin/ayarlar", label: "Site Ayarları", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  function isActive(item: typeof NAV[0]) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  const Sidebar = (
    <aside className="admin-sidebar w-64 flex flex-col">
      <div className="p-6 border-b border-white/10">
        <div className="text-white text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>Gözde Çeyiz</div>
        <div className="text-[#C9A84C] text-xs tracking-widest mt-1" style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "3px" }}>
          ADMIN PANEL
        </div>
      </div>
      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`admin-nav-item flex items-center gap-3 px-6 py-3 text-sm transition-all ${
                active ? "active text-[#C9A84C]" : "text-gray-400 hover:text-white"
              }`}
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              <Icon size={18} />
              {item.label}
              {active && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/10">
        <button
          onClick={logout}
          className="flex items-center gap-3 text-gray-400 hover:text-red-400 text-sm w-full px-2 py-2 transition-colors"
          style={{ fontFamily: "'Lato', sans-serif" }}
        >
          <LogOut size={18} />
          Çıkış Yap
        </button>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 text-gray-500 hover:text-[#C9A84C] text-xs mt-2 px-2 py-1 transition-colors"
          style={{ fontFamily: "'Lato', sans-serif" }}
        >
          ↗ Siteyi Görüntüle
        </Link>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">{Sidebar}</div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative h-full w-64">{Sidebar}</div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b h-14 flex items-center px-6 gap-4 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu size={22} />
          </button>
          <h1 className="text-sm font-medium text-gray-700 flex-1" style={{ fontFamily: "'Lato', sans-serif" }}>
            {NAV.find((n) => isActive(n))?.label || "Admin"}
          </h1>
          <span className="text-xs text-gray-400" style={{ fontFamily: "'Lato', sans-serif" }}>Gözde Çeyiz Admin</span>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
