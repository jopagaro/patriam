import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { EB_Garamond } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: '--font-eb-garamond',
});

export const metadata: Metadata = {
  title: "Patriam",
  description: "A platform for writers and readers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${ebGaramond.variable} font-sans`}>
        <Providers>
          <Navbar />
          <main className="min-h-screen bg-dark-900 text-gray-100">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
