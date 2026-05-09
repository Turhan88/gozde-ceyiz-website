import Header from "@/components/frontend/Header";
import Footer from "@/components/frontend/Footer";
import WhatsAppButton from "@/components/frontend/WhatsAppButton";
import getDb from "@/lib/db";

function getSettings(): Record<string, string> {
  try {
    const db = getDb();
    const rows = db.prepare("SELECT key, value FROM settings").all() as { key: string; value: string }[];
    const settings: Record<string, string> = {};
    for (const r of rows) settings[r.key] = r.value;
    return settings;
  } catch {
    return {};
  }
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  const settings = getSettings();

  return (
    <>
      <Header
        storeName={settings.store_name}
        phone={settings.phone}
      />
      <main className="flex-1">{children}</main>
      <Footer
        storeName={settings.store_name}
        phone={settings.phone}
        address={settings.address}
        workingHours={settings.working_hours}
        instagram={settings.instagram}
        facebook={settings.facebook}
      />
      <WhatsAppButton phone={settings.whatsapp?.replace(/[^0-9]/g, "")} variant="float" />
    </>
  );
}
