import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Gözde Çeyiz Aksesuar ve Kına Evi",
    template: "%s | Gözde Çeyiz Aksesuar ve Kına Evi",
  },
  description: "Düğün, kına, nişan, söz ve sünnet törenleriniz için premium aksesuar ve çeyiz ürünleri. Gözde Çeyiz'de en şık koleksiyonları keşfedin.",
  keywords: "çeyiz, kına, düğün, nişan, söz, sünnet, aksesuar, gelin tacı, kına gecesi",
  openGraph: {
    type: "website",
    siteName: "Gözde Çeyiz Aksesuar ve Kına Evi",
    locale: "tr_TR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
