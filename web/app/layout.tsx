import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getSettings } from "@/lib/siteSettings";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// 获取设置
const settings = getSettings();

export const metadata: Metadata = {
  title: settings.siteName + " - 打开科技 打开财富",
  description: settings.siteDescription,
  keywords: settings.keywords,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
