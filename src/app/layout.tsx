import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
import localFont from "next/font/local";
import { headers } from "next/headers";
import "#/styles/globals.css";
import { PostHogProvider } from "#/lib/analytics/PostHogProvider";
import { isMainDomain } from "#/lib/subdomain";

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

const manrope = localFont({
  src: [
    {
      path: "../../public/fonts/manrope.ttf",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../../public/fonts/manrope.ttf",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-manrope",
  display: "swap",
});

const overused = localFont({
  src: [
    {
      path: "../../public/fonts/overused-black.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../public/fonts/overused-extrabold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/overused-bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/overused-semibold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/overused-medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/overused-roman.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/overused-book.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/overused-extralight.ttf",
      weight: "200",
      style: "normal",
    },
  ],
  variable: "--font-overused",
  display: "swap",
});

export const metadata: Metadata = {
  title: ".Nepfy",
  description: "Faça a gestão das suas propostas de forma simples e elegante.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#6A4BDE",
      },
    ],
  },
  manifest: "/site.webmanifest",
  other: {
    "msapplication-TileColor": "#6A4BDE",
    "msapplication-config": "/browserconfig.xml",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const hostname =
    headersList.get("x-forwarded-host") || headersList.get("host") || "";

  const isSubdomain = headersList.get("x-is-subdomain") === "true";
  const shouldUseClerk = isMainDomain(hostname) && !isSubdomain;

  if (shouldUseClerk) {
    return (
      <ClerkProvider dynamic localization={ptBR}>
        <PostHogProvider>
          <html lang="pt-BR">
            <head>
              <meta name="x-is-subdomain" content="false" />
            </head>
            <body
              className={`${satoshi.variable} ${manrope.variable} ${overused.variable} antialiased`}
            >
              {children}
            </body>
          </html>
        </PostHogProvider>
      </ClerkProvider>
    );
  }

  return (
    <html lang="pt-BR">
      <head>
        <meta name="x-is-subdomain" content={isSubdomain ? "true" : "false"} />
      </head>
      <body
        className={`${satoshi.variable} ${manrope.variable} ${overused.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
