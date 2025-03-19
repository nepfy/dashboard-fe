import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import Navbar from "#/components/Navbar";

const satoshi = localFont({
  src: [
    {
      path: "../../public/fonts/satoshi-variable.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../../public/fonts/satoshi-variable-italic.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-satoshi",
});

export const metadata: Metadata = {
  title: ".Nepfy",
  description: "Manage your proposals with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${satoshi.variable} antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
