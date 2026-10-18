import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ERP + CRM Platform",
  description: "Multi-tenant ERP and CRM platform for small and medium businesses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
