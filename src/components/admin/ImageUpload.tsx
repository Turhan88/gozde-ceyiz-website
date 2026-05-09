"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader } from "lucide-react";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  hint?: string;
  className?: string;
}

export default function ImageUpload({
  value, onChange, folder = "general", label = "Görsel Yükle", hint, className = "",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) {
      onChange(data.url);
    } else {
      setError(data.error || "Yükleme başarısız");
    }
    setUploading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2" style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "1.5px" }}>
          {label}
        </label>
      )}
      <div
        className="border-2 border-dashed border-gray-200 hover:border-[#C9A84C] transition-colors cursor-pointer relative"
        style={{ minHeight: "120px" }}
        onClick={() => ref.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {value ? (
          <div className="relative w-full" style={{ minHeight: "120px" }}>
            <Image src={value} alt="Yüklenen görsel" fill className="object-contain p-2" />
            <button
              type="button"
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full z-10 hover:bg-red-600"
              onClick={(e) => { e.stopPropagation(); onChange(""); }}
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-8 text-gray-400">
            {uploading ? (
              <Loader size={24} className="animate-spin mb-2 text-[#C9A84C]" />
            ) : (
              <Upload size={24} className="mb-2" />
            )}
            <p className="text-xs" style={{ fontFamily: "'Lato', sans-serif" }}>
              {uploading ? "Yükleniyor..." : "Tıklayın veya sürükleyip bırakın"}
            </p>
          </div>
        )}
      </div>
      {hint && <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: "'Lato', sans-serif" }}>{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-1" style={{ fontFamily: "'Lato', sans-serif" }}>{error}</p>}
      <input type="file" ref={ref} className="hidden" accept="image/*" onChange={handleChange} />
    </div>
  );
}
