import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
import localFont from "next/font/local";
import "#/styles/globals.css";

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
  description: "Faça a gestão das suas propostas de forma simples e elegante.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider dynamic localization={ptBR}>
      <html lang="pt-BR">
        <body className={`${satoshi.variable} antialiased`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
