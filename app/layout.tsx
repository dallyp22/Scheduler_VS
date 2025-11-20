import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AntdProvider from "@/components/AntdProvider";
import MainLayout from "@/components/MainLayout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AIPS - AI-Enhanced Packaging Scheduler",
  description: "Next-generation manufacturing scheduler for optimized production planning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <AntdProvider>
          <MainLayout>{children}</MainLayout>
        </AntdProvider>
      </body>
    </html>
  );
}
