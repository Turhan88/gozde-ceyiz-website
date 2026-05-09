import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { slugify } from "@/lib/utils";
import { copyFile, mkdir, readdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

const RESIMLER_PATH = path.join(process.cwd(), "..", "resimler");
const UPLOADS_PATH = path.join(process.cwd(), "public", "uploads");

async function copyProductImages(): Promise<string[]> {
  const copiedImages: string[] = [];
  const destDir = path.join(UPLOADS_PATH, "products");
  await mkdir(destDir, { recursive: true });

  for (let i = 1; i <= 10; i++) {
    const srcFolders = [
      path.join(RESIMLER_PATH, `${i}_files`),
      path.join(RESIMLER_PATH, `${i}`),
    ];

    for (const srcFolder of srcFolders) {
      if (!existsSync(srcFolder)) continue;
      try {
        const files = await readdir(srcFolder);
        const images = files.filter((f) =>
          /\.(jpg|jpeg|png)$/i.test(f) && !/next|prev|slide_|normal/i.test(f)
        );
        for (const imgFile of images) {
          const ext = path.extname(imgFile).toLowerCase();
          const destName = `catalog_${i}_${imgFile.replace(/[^a-z0-9.]/gi, "_")}`;
          const destPath = path.join(destDir, destName);
          if (!existsSync(destPath)) {
            await copyFile(path.join(srcFolder, imgFile), destPath);
          }
          copiedImages.push(`/uploads/products/${destName}`);
        }
      } catch {}
    }
  }
  return copiedImages;
}

export async function POST() {
  try {
    const db = getDb();

    // Check if already seeded
    const existing = db.prepare("SELECT COUNT(*) as cnt FROM products").get() as { cnt: number };
    if (existing.cnt > 0) {
      return NextResponse.json({ message: "Veriler zaten yüklü", skipped: true });
    }

    // Copy images
    const images = await copyProductImages();
    const getImg = (idx: number) => images[idx % images.length] || "/uploads/products/placeholder.jpg";

    // Categories
    const categories = [
      { name: "Düğün Grubu Ürünler", slug: "dugun-grubu-urunler", desc: "Düğün töreniniz için özel tasarım aksesuar ve süsleme ürünleri", sort: 1 },
      { name: "Kına Grubu Ürünler", slug: "kina-grubu-urunler", desc: "Kına gecenizi unutulmaz kılacak aksesuar ve organizasyon ürünleri", sort: 2 },
      { name: "Nişan Grubu Ürünler", slug: "nishan-grubu-urunler", desc: "Nişan töreniniz için şık ve zarif aksesuar seçenekleri", sort: 3 },
      { name: "Söz Grubu Ürünler", slug: "soz-grubu-urunler", desc: "Söz merasimleriniz için özel organizasyon ürünleri", sort: 4 },
      { name: "Sünnet Grubu Ürünler", slug: "sunnet-grubu-urunler", desc: "Sünnet törenleri için özel tasarım ürün ve aksesuarlar", sort: 5 },
      { name: "Tekstil Grubu Ürünler", slug: "tekstil-grubu-urunler", desc: "Ev tekstili ve çeyiz ürünleri koleksiyonu", sort: 6 },
    ];

    const catIds: number[] = [];
    for (const cat of categories) {
      const result = db.prepare(
        "INSERT OR IGNORE INTO categories (name, slug, description, is_active, sort_order) VALUES (?, ?, ?, 1, ?)"
      ).run(cat.name, cat.slug, cat.desc, cat.sort);
      const row = db.prepare("SELECT id FROM categories WHERE slug = ?").get(cat.slug) as { id: number };
      catIds.push(row.id);
    }

    // Products data
    const productsData = [
      // Düğün (catIds[0])
      { name: "Gelin Tacı - Doğa Serisi", short: "El yapımı çiçekli gelin tacı, doğal görünüm", desc: "Özel tasarım çiçek detaylı gelin tacı. Düğün töreninize zarif ve doğal bir hava katacak bu taç, elle işlenmiş çiçek motifleriyle süslenmiştir.", cat: 0, feat: 1, isNew: 1, img: 0 },
      { name: "Kristal Gelin Tacı", short: "Swarovski kristalli zarif gelin tacı", desc: "Swarovski kristalleriyle süslü, parlak ve zarif gelin tacı. Her açıdan ışıl ışıl parıldayan bu taç, düğün günü fotoğraflarınıza ihtişam katacak.", cat: 0, feat: 1, isNew: 0, img: 1 },
      { name: "Altın Varak Gelin Tacı", short: "Altın kaplama premium gelin tacı", desc: "22 ayar altın kaplama işçiliği ile üretilmiş premium gelin tacı. Özel günlerinizde kraliçe gibi hissetmenizi sağlayacak.", cat: 0, feat: 0, isNew: 1, img: 2 },
      { name: "Düğün Bardak Seti", short: "Çifte mutluluk bardak takımı", desc: "Çiftlerin ismine özel yazı ve süsleme seçeneği bulunan düğün bardak seti. 2'li set olarak sunulmaktadır.", cat: 0, feat: 0, isNew: 0, img: 3 },
      { name: "Gelin Çiçeği Buketi", short: "İpek çiçek gelin buketi", desc: "Asla solmayan ipek çiçeklerden hazırlanmış özel gelin buketi. Beyaz ve krem tonlarında zarif tasarım.", cat: 0, feat: 1, isNew: 0, img: 4 },
      { name: "Düğün Masası Süsü", short: "Lüks çiçek aranjmanı masa süsü", desc: "Düğün masaları için özel tasarım çiçek aranjmanları. Kristal vazo ile birlikte sunulmaktadır.", cat: 0, feat: 0, isNew: 0, img: 5 },
      { name: "Gelin Saç Tokası Seti", short: "Kristalli saç aksesuarı seti", desc: "Düğün günü için özel hazırlanmış saç aksesuarları seti. Kristal taşlı tokalar ve iğneler içermektedir.", cat: 0, feat: 0, isNew: 1, img: 6 },
      { name: "Beyaz Düğün Şemsiyesi", short: "Dantel detaylı gelin şemsiyesi", desc: "El yapımı dantel detaylı, romantik düğün şemsiyesi. Düğün fotoğraf çekimleriniz için mükemmel bir aksesuar.", cat: 0, feat: 0, isNew: 0, img: 7 },

      // Kına (catIds[1])
      { name: "Kına Tacı - Gold Seri", short: "Altın rengi kına gecesi tacı", desc: "Kına geceniz için özel tasarlanmış altın rengi taç. Gold tonlarda taşlar ve boncuklarla süslenmiş, göz alıcı bir tasarım.", cat: 1, feat: 1, isNew: 1, img: 8 },
      { name: "Kına Bohçası Seti", short: "Özel tasarım kına bohçası takımı", desc: "Geleneksel desenlerle süslü kına bohçası seti. Kırmızı ve gold renk uyumuyla şık bir görünüm sunar.", cat: 1, feat: 1, isNew: 0, img: 9 },
      { name: "Kına Mumları Seti", short: "Süslü kına gecesi mum takımı", desc: "El işi süslemeli kına gecesi mumları. 6'lı set halinde, farklı boyutlarda sunulmaktadır.", cat: 1, feat: 0, isNew: 0, img: 10 },
      { name: "Kına Tepsi Seti", short: "Bordo kadife kına tepsisi", desc: "Kadife kaplı, altın rengi kenarlıklı özel kına tepsisi. Kına koyma, el süsleme ve bohça için üçlü set.", cat: 1, feat: 0, isNew: 1, img: 11 },
      { name: "Kına Gece Elbisesi Süsü", short: "Gelinlik/kına elbisesi takı seti", desc: "Kına gecesi kıyafetinizi tamamlayacak özel takı seti. Kolyesi, küpesi ve bilekliği bir arada.", cat: 1, feat: 1, isNew: 0, img: 12 },
      { name: "Altın Kına Süslemesi", short: "Gold tema kına dekorasyonu", desc: "Kına masası ve mekânı için özel altın rengi dekorasyon ürünleri. Masa süsü, perde aksesuarı ve tablo içerir.", cat: 1, feat: 0, isNew: 0, img: 13 },
      { name: "Kına Yağlığı Seti", short: "El işlemeli kına yağlığı", desc: "Geleneksel el işlemeli, özel nakışlı kına yağlıkları. 12'li set halinde sunulmaktadır.", cat: 1, feat: 0, isNew: 1, img: 14 },
      { name: "Kına Çantası - Bordo", short: "Bordo kadife kına el çantası", desc: "Bordo kadife kumaştan yapılmış, altın işlemeli özel kına çantası.", cat: 1, feat: 0, isNew: 0, img: 15 },

      // Nişan (catIds[2])
      { name: "Nişan Yüzüklük Tepsisi", short: "Kristalli nişan yüzük tepsisi", desc: "Kristal ve ayna detaylı nişan yüzüklük tepsisi. Kişiselleştirme seçeneği mevcuttur.", cat: 2, feat: 1, isNew: 1, img: 16 },
      { name: "Nişan Tacı - Pembe Altın", short: "Rose gold nişan tacı", desc: "Rose gold rengi taşlarla süslü, zarif nişan tacı. Pudra pembe ve altın renk tonlarının mükemmel uyumu.", cat: 2, feat: 1, isNew: 0, img: 17 },
      { name: "Nişan Şekeri Standı", short: "Akrilik şeker standı seti", desc: "Nişan şekerlerinizi şık sunan akrilik stand seti. Farklı yükseklik seçenekleri ile sunulmaktadır.", cat: 2, feat: 0, isNew: 0, img: 18 },
      { name: "Nişan Mumları Çifti", short: "İsme özel nişan mumu", desc: "İsme özel yazı ve tarih seçeneği bulunan nişan mumları. Pembe ve altın rengi çift kutu.", cat: 2, feat: 0, isNew: 1, img: 19 },
      { name: "Nişan Bohçası", short: "İpek nişan bohça seti", desc: "İpek kumaştan yapılmış, mono gram nakışlı nişan bohçası. 3'lü set halinde sunulmaktadır.", cat: 2, feat: 0, isNew: 0, img: 20 },
      { name: "Nişan Masa Süsü Seti", short: "Çiçek aranjmanlı masa dekoru", desc: "Nişan masası için özel hazırlanmış çiçek aranjmanı ve aksesuar seti.", cat: 2, feat: 1, isNew: 1, img: 21 },
      { name: "Nişan Aynası - Gold", short: "Altın çerçeveli büyük ayna", desc: "Nişan fotoğraf köşeniz için özel altın rengi çerçeveli dekoratif ayna.", cat: 2, feat: 0, isNew: 0, img: 22 },

      // Söz (catIds[3])
      { name: "Söz Tepsisi Seti", short: "Zarif söz merasimi tepsi takımı", desc: "Söz merasimi için özel hazırlanmış, kadife kaplı dekoratif tepsi seti. Gold ve gümüş renk seçenekleri.", cat: 3, feat: 0, isNew: 1, img: 23 },
      { name: "Söz Mumları", short: "Özel söz mumu seti", desc: "Söz töreniniz için özel tasarım mumlar. İsme özel kişiselleştirme seçeneği mevcuttur.", cat: 3, feat: 0, isNew: 0, img: 24 },
      { name: "Söz Çiçeği", short: "İpek çiçek söz çiçeği", desc: "Söz günü için özel hazırlanmış butik ipek çiçek aranjmanı.", cat: 3, feat: 1, isNew: 0, img: 25 },
      { name: "Söz Şeker Kutusu", short: "Özel söz şeker kutu seti", desc: "Söz şekerlerinizi şık sunmak için tasarlanmış özel kutular. 12'li set halinde.", cat: 3, feat: 0, isNew: 0, img: 26 },

      // Sünnet (catIds[4])
      { name: "Sünnet Tacı - Mavi", short: "Mavi altın sünnet tacı", desc: "Prens hissettiren mavi ve altın rengi sünnet tacı. Özel el işçiliği ile üretilmiştir.", cat: 4, feat: 1, isNew: 1, img: 27 },
      { name: "Sünnet Tepsisi", short: "Mavi kadife sünnet tepsisi", desc: "Sünnet töreniniz için özel hazırlanmış mavi kadife tepsi. Altın işlemeli kenarları ile şık görünüm.", cat: 4, feat: 0, isNew: 0, img: 28 },
      { name: "Sünnet Mumu Seti", short: "Prens temalı sünnet mumu", desc: "Prens temalı özel sünnet mumları. 6'lı set halinde sunulmaktadır.", cat: 4, feat: 0, isNew: 0, img: 29 },
      { name: "Sünnet Kıyafeti Aksesuarı", short: "Sünnet kıyafeti tamamlayıcı set", desc: "Sünnet kıyafetini tamamlayacak aksesuar seti. Taç, kemer ve rozet içerir.", cat: 4, feat: 1, isNew: 0, img: 30 },
      { name: "Sünnet Dekorasyonu", short: "Mavi beyaz sünnet mekân süsü", desc: "Sünnet mekânı dekorasyonu için balon, banner ve masa süsleri.", cat: 4, feat: 0, isNew: 1, img: 31 },

      // Tekstil (catIds[5])
      { name: "Çeyiz Nevresim Takımı", short: "Saten lüks nevresim takımı", desc: "Çeyiz için özel 6 parça saten nevresim takımı. Beyaz, krem ve pudra pembe renk seçenekleri.", cat: 5, feat: 0, isNew: 1, img: 32 },
      { name: "Bornoz Seti", short: "Çift kişilik lüks bornoz seti", desc: "Çeyiz için çift kişilik kişiselleştirilebilir bornoz seti. Pamuklu ve kadife seçenekleri.", cat: 5, feat: 1, isNew: 0, img: 33 },
      { name: "Havlu Takımı", short: "Nakışlı çeyiz havlu seti", desc: "El nakışlı çeyizlik havlu takımı. 6'lı set halinde sunulmaktadır.", cat: 5, feat: 0, isNew: 0, img: 34 },
      { name: "Masa Örtüsü Seti", short: "İşlemeli masa örtüsü takımı", desc: "El işlemeli, özel dantel kenarlıklı masa örtüsü seti.", cat: 5, feat: 0, isNew: 0, img: 35 },
      { name: "Perde Takımı", short: "Tül ve fon perde seti", desc: "Çeyizlik özel tasarım tül ve fon perde seti. Farklı renk seçenekleri mevcuttur.", cat: 5, feat: 0, isNew: 1, img: 36 },

      // Daha fazla ürün - tüm kategoriler
      { name: "Taç - Güneş Serisi", short: "Güneş motifli altın taç", desc: "Güneş ışınları motifli özel tasarım altın taç.", cat: 0, feat: 0, isNew: 1, img: 0 },
      { name: "Taç - Yaprak Serisi", short: "Yaprak detaylı gelin tacı", desc: "Doğadan ilham alan yaprak motifli zarif gelin tacı.", cat: 0, feat: 0, isNew: 0, img: 1 },
      { name: "Kına Tacı - Bordo", short: "Bordo kristalli kına tacı", desc: "Bordo ve altın rengi kristallerle süslü kına gecesi tacı.", cat: 1, feat: 0, isNew: 0, img: 2 },
      { name: "Nişan Takı Kutusu", short: "Kadife nişan takı kutusu", desc: "Nişan takılarınız için özel kadife kaplı mücevher kutusu.", cat: 2, feat: 0, isNew: 0, img: 3 },
      { name: "Sünnet Altın Kemer", short: "Altın işlemeli sünnet kemeri", desc: "Sünnet kıyafetini tamamlayan özel altın işlemeli kemer.", cat: 4, feat: 0, isNew: 0, img: 4 },
      { name: "Çeyiz Çantası", short: "Deri çeyiz çantası", desc: "Çeyiz eşyaları için özel tasarım deri çanta.", cat: 5, feat: 0, isNew: 0, img: 5 },
      { name: "Gelin Eldiveni", short: "Dantel gelin eldiveni", desc: "İnce dantel işlemeli şık gelin eldiveni.", cat: 0, feat: 0, isNew: 1, img: 6 },
      { name: "Kına Bohçası - Nakışlı", short: "El nakışlı kına bohçası", desc: "Geleneksel el nakışı ile süslenmiş premium kına bohçası.", cat: 1, feat: 0, isNew: 0, img: 7 },
      { name: "Nişan Balonları", short: "Özel nişan balon seti", desc: "İsme özel baskılı şeffaf ve altın rengi balon seti.", cat: 2, feat: 0, isNew: 0, img: 8 },
      { name: "Söz Çiçek Buketi", short: "Özel söz çiçeği aranjmanı", desc: "Söz günü için butik çiçek aranjmanı.", cat: 3, feat: 0, isNew: 1, img: 9 },
      { name: "Sünnet Koltuğu Süsü", short: "Prens koltuğu dekorasyonu", desc: "Sünnet koltuğu için özel dekorasyon aksesuarları.", cat: 4, feat: 0, isNew: 0, img: 10 },
      { name: "Çeyiz Yorganı", short: "El yapımı çeyizlik yorgan", desc: "Geleneksel el yapımı özel çeyizlik yorgan.", cat: 5, feat: 0, isNew: 0, img: 11 },
      { name: "Taç - Vintage Seri", short: "Vintage stil gelin tacı", desc: "Antik altın kaplama vintage stil gelin tacı.", cat: 0, feat: 1, isNew: 1, img: 12 },
      { name: "Kına El Süsleme Seti", short: "Kına deseni el süsleme kiti", desc: "Hazır kına deseni şablonları ve kına tozu seti.", cat: 1, feat: 0, isNew: 0, img: 13 },
    ];

    const insertProduct = db.prepare(
      "INSERT INTO products (name, slug, short_description, description, category_id, main_image, is_featured, is_new, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)"
    );

    const productIds: number[] = [];
    productsData.forEach((p, i) => {
      const slug = slugify(p.name);
      const result = insertProduct.run(p.name, `${slug}-${i + 1}`, p.short, p.desc, catIds[p.cat], getImg(p.img), p.feat, p.isNew, i);
      productIds.push(result.lastInsertRowid as number);
    });

    // Sliders
    const slidersData = [
      { title: "Özel Günlerinize Zarafet Katıyoruz", desc: "Düğün, Kına, Nişan ve Söz Törenleri için Premium Aksesuar Koleksiyonu", btn: "Ürünleri Keşfet", link: "/kategoriler", desktopImg: getImg(0), mobileImg: getImg(1) },
      { title: "Hazır Konsept Setlerimiz", desc: "Tek sipariş, eksiksiz organizasyon. Hazır konsept setlerimizi inceleyin.", btn: "Konseptlere Bak", link: "/hazir-konseptler", desktopImg: getImg(2), mobileImg: getImg(3) },
      { title: "Kına Gecenizi Unutulmaz Yapın", desc: "En şık kına aksesuarları ve süslemeleri Gözde Çeyiz'de", btn: "Kına Ürünleri", link: "/kategoriler/kina-grubu-urunler", desktopImg: getImg(4), mobileImg: getImg(5) },
    ];

    for (let i = 0; i < slidersData.length; i++) {
      const s = slidersData[i];
      db.prepare(
        "INSERT INTO sliders (title, description, button_text, button_link, desktop_image, mobile_image, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, 1, ?)"
      ).run(s.title, s.desc, s.btn, s.link, s.desktopImg, s.mobileImg, i);
    }

    // Concepts
    const conceptsData = [
      {
        name: "Gold Kına Konsepti",
        desc: "Altın rengi tonlarıyla hazırlanmış muhteşem kına gecesi seti. Taç, bohça, tepsi ve mumları bir arada sunan komple konsept.",
        cover: getImg(8),
        catIdx: 1,
        products: [8, 9, 10, 11, 12],
      },
      {
        name: "Beyaz Düğün Konsepti",
        desc: "Saf beyaz ve krem tonlarında zarif düğün aksesuar seti. Gelin tacı, çiçek buketi, şemsiye ve masa süsü dahil.",
        cover: getImg(0),
        catIdx: 0,
        products: [0, 1, 4, 5, 6, 7],
      },
      {
        name: "Bordo Kına Seti",
        desc: "Bordo ve altın rengi kombinasyonuyla hazırlanan özel kına gecesi paketi. 5 temel ürünü bir arada sunar.",
        cover: getImg(15),
        catIdx: 1,
        products: [8, 9, 12, 13, 14],
      },
      {
        name: "Sade Nişan Seti",
        desc: "Minimalist ve şık nişan aksesuarları. Yüzüklük, mum, bohça ve masa süsü dahil.",
        cover: getImg(16),
        catIdx: 2,
        products: [16, 17, 19, 20, 21],
      },
      {
        name: "Mavi Sünnet Konsepti",
        desc: "Prens temalı mavi ve altın rengi sünnet töreni seti. Taç, tepsi, mum ve kıyafet aksesuarları dahil.",
        cover: getImg(27),
        catIdx: 4,
        products: [27, 28, 29, 30],
      },
    ];

    for (let i = 0; i < conceptsData.length; i++) {
      const c = conceptsData[i];
      const slug = `${slugify(c.name)}-${i + 1}`;
      const result = db.prepare(
        "INSERT INTO concepts (name, slug, description, cover_image, category_id, is_active, sort_order) VALUES (?, ?, ?, ?, ?, 1, ?)"
      ).run(c.name, slug, c.desc, c.cover, catIds[c.catIdx], i);

      const conceptId = result.lastInsertRowid as number;
      const insertCP = db.prepare("INSERT INTO concept_products (concept_id, product_id, sort_order) VALUES (?, ?, ?)");
      c.products.forEach((pidIdx, j) => {
        if (productIds[pidIdx]) {
          insertCP.run(conceptId, productIds[pidIdx], j);
        }
      });
    }

    // Gallery
    const galleryCategories = ["Mağaza", "Vitrin", "Organizasyon", "Ürün Çekimleri", "Konsept Çekimleri"];
    for (let i = 0; i < 20; i++) {
      const cat = galleryCategories[i % galleryCategories.length];
      db.prepare(
        "INSERT INTO gallery (title, image, category, is_active, sort_order) VALUES (?, ?, ?, 1, ?)"
      ).run(`${cat} - ${i + 1}`, getImg(i), cat, i);
    }

    // Instagram posts
    for (let i = 0; i < 9; i++) {
      db.prepare(
        "INSERT INTO instagram_posts (image, caption, link, is_active, sort_order) VALUES (?, ?, ?, 1, ?)"
      ).run(getImg(i + 5), `Gözde Çeyiz koleksiyonundan yeni ürünler ✨ #çeyiz #düğün #kına #nişan #aksesuar`, "https://www.instagram.com/gozdeceyiz", i);
    }

    return NextResponse.json({ success: true, message: "Demo veriler başarıyla eklendi", products: productIds.length });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
