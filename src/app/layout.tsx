import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
import localFont from "next/font/local";
import { headers } from "next/headers";
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

// Função para verificar se deve aplicar autenticação Clerk
async function shouldApplyClerkAuth() {
  const headersList = await headers();
  const host = headersList.get("host") || "";

  // Só aplica Clerk para domínios principais
  return (
    host === "app.nepfy.com" ||
    host === "localhost:3000" ||
    host === "nepfy.com" ||
    host === "www.nepfy.com" ||
    host === "localhost"
  );
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const applyAuth = await shouldApplyClerkAuth();

  if (!applyAuth) {
    // Para subdomínios, não aplica o ClerkProvider
    return (
      <html lang="pt-BR">
        <body className={`${satoshi.variable} antialiased`}>{children}</body>
      </html>
    );
  }

  // Para domínios principais, aplica o ClerkProvider normalmente
  return (
    <ClerkProvider dynamic localization={ptBR}>
      <html lang="pt-BR">
        <body className={`${satoshi.variable} antialiased`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
