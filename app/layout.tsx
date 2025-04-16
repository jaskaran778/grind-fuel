import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import localFont from "next/font/local";
import Toast from "@/components/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Load local custom fonts
const customFont1 = localFont({
  src: "../public/fonts/AlphaLyrae-Medium.woff2", // Update with your actual font filename
  variable: "--font-custom-1",
  display: "swap",
});

const customFont2 = localFont({
  src: "../public/fonts/AlphaLyrae-Medium.woff2", // Update with your actual font filename
  variable: "--font-custom-2",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Grind Fuel",
  description:
    "High-Performance Nutrition Brand designed for Gamers and Athletes",
  icons: {
    icon: "/logo/logo2.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${customFont1.variable} ${customFont2.variable} antialiased`}
      >
        {children}
        <Toast />
      </body>
    </html>
  );
}
