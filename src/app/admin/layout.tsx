import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Skip auth check for login page
  return (
    <AdminAuthWrapper>{children}</AdminAuthWrapper>
  );
}

async function AdminAuthWrapper({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
