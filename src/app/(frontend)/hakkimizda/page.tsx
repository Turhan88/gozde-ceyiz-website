import getDb from "@/lib/db";
import Link from "next/link";
import { Heart, Star, Award, Users } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "Gözde Çeyiz Aksesuar ve Kına Evi hakkında bilgi edinin.",
};

function getSettings() {
  try {
    const db = getDb();
    const rows = db.prepare("SELECT key, value FROM settings").all() as { key: string; value: string }[];
    const s: Record<string, string> = {};
    for (const r of rows) s[r.key] = r.value;
    return s;
  } catch { return {}; }
}

export default function AboutPage() {
  const settings = getSettings();

  return (
    <>
      <div className="bg-[#2C2C2C] py-16 text-center text-white">
        <p className="section-subtitle" style={{ color: "#C9A84C" }}>Biz Kimiz</p>
        <h1 className="text-4xl md:text-5xl" style={{ fontFamily: "'Playfair Display', serif" }}>Hakkımızda</h1>
        <div className="gold-divider mt-4 mb-4" />
        <nav className="text-sm text-gray-400 flex items-center justify-center gap-2" style={{ fontFamily: "'Lato', sans-serif" }}>
          <Link href="/" className="hover:text-[#C9A84C]">Ana Sayfa</Link>
          <span>/</span>
          <span className="text-[#C9A84C]">Hakkımızda</span>
        </nav>
      </div>

      {/* Story */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="section-subtitle">Hikayemiz</p>
          <h2 className="section-title">Özel Günlerinize Zarafet Katıyoruz</h2>
          <div className="gold-divider mt-3 mb-8" />
          <p className="text-gray-600 text-lg leading-relaxed mb-6" style={{ fontFamily: "'Lato', sans-serif" }}>
            {settings.about_text || "Gözde Çeyiz Aksesuar ve Kına Evi olarak, özel günlerinizi unutulmaz kılmak için çalışıyoruz. Düğün, kına, nişan, söz ve sünnet törenleriniz için en özel aksesuarları, en kaliteli ürünleri sunmaktayız."}
          </p>
          <p className="text-gray-600 leading-relaxed" style={{ fontFamily: "'Lato', sans-serif" }}>
            Her ürünümüz özenle seçilmiş, her konseptimiz dikkatle tasarlanmıştır. Müşterilerimizin mutluluğu ve memnuniyeti bizim için her şeyden önce gelir.
            Premium kalite ve zarif tasarım anlayışımızla, özel günlerinizin hayallerinizdeki gibi olması için buradayız.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-[#F8F4EE]">
        <div className="max-w-7xl mx-auto">
          <p className="section-subtitle">Değerlerimiz</p>
          <h2 className="section-title">Neden Gözde Çeyiz?</h2>
          <div className="gold-divider mt-3 mb-14" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Star, title: "Premium Kalite", desc: "Her ürünümüz titizlikle seçilmiş, kalite standartlarımız en üst seviyede tutulmaktadır." },
              { icon: Heart, title: "Sevgi ile Yapılır", desc: "Her konsept ve ürün, özel günlerinize katkıda bulunmak için içtenlikle hazırlanmaktadır." },
              { icon: Award, title: "Uzman Ekip", desc: "Sektörde deneyimli ekibimiz, organizasyonunuzu mükemmel kılmak için yanınızdadır." },
              { icon: Users, title: "Müşteri Memnuniyeti", desc: "Yüzlerce mutlu müşterimiz, hizmet kalitemizin en güzel kanıtıdır." },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="text-center p-6 bg-white hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 bg-[#F8F4EE] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon size={24} className="text-[#C9A84C]" />
                  </div>
                  <h3 className="text-lg text-[#2C2C2C] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: "'Lato', sans-serif" }}>
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-4 bg-[#2C2C2C] text-white">
        <div className="max-w-7xl mx-auto">
          <p className="section-subtitle" style={{ color: "#C9A84C" }}>Hizmetlerimiz</p>
          <h2 className="section-title" style={{ color: "white" }}>Ne Sunuyoruz?</h2>
          <div className="gold-divider mt-3 mb-14" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Düğün Aksesuarları", desc: "Gelin tacından masa süslemelerine kadar her şey en şık haliyle." },
              { title: "Kına Organizasyonu", desc: "Kına gecenizi unutulmaz kılacak eksiksiz aksesuar seti." },
              { title: "Nişan & Söz", desc: "Nişan töreniniz için zarif ve şık aksesuar koleksiyonu." },
              { title: "Sünnet Töreni", desc: "Prens temalı sünnet aksesuarları ve organizasyon ürünleri." },
              { title: "Hazır Konseptler", desc: "Birbirine uyumlu ürünlerden oluşan komple konsept setler." },
              { title: "Tekstil & Çeyiz", desc: "Ev tekstili ve çeyiz ürünleri için geniş koleksiyon." },
            ].map((item, i) => (
              <div key={i} className="p-6 border border-gray-700 hover:border-[#C9A84C] transition-colors group">
                <div className="w-8 h-[2px] bg-[#C9A84C] mb-4 group-hover:w-12 transition-all duration-300" />
                <h3 className="text-lg mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{item.title}</h3>
                <p className="text-gray-400 text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-[#F8F4EE] text-center">
        <h2 className="text-2xl text-[#2C2C2C] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          Hayalinizdeki Organizasyonu Birlikte Planlayalım
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Link href="/iletisim" className="btn-gold">İletişime Geç</Link>
          <Link href="/hazir-konseptler" className="btn-outline-gold">Konseptleri İncele</Link>
        </div>
      </section>
    </>
  );
}
