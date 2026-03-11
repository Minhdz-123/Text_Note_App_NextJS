import "@/src/lib/fontawesome";
import "./globals.css";
import type { Metadata } from "next";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
  title: "Keep Clone",
  description: "Google Keep clone built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-white dark:bg-[#202124] transition-colors duration-200">
        suppressHydrationWarning
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
