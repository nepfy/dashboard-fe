import { type NextRequest, NextResponse } from "next/server";

function isMainDomain(hostname: string): boolean {
  return (
    hostname === "app.nepfy.com" ||
    hostname === "localhost:3000" ||
    hostname === "nepfy.com" ||
    hostname === "www.nepfy.com" ||
    hostname === "localhost"
  );
}

function parseSubdomain(
  hostname: string
): { userName: string; projectUrl: string } | null {
  // First check if it's a main domain
  if (isMainDomain(hostname)) {
    return null;
  }

  const subdomain = hostname.split(".")[0];
  const parts = subdomain.split("-");

  if (parts.length < 2) {
    return null;
  }

  const userName = parts[0];
  const projectUrl = parts.slice(1).join("-");

  // Validações básicas
  if (!userName || !projectUrl) {
    return null;
  }

  // userName deve ter pelo menos 2 caracteres e ser alfanumérico
  if (userName.length < 2 || !/^[a-zA-Z0-9]+$/.test(userName)) {
    return null;
  }

  // projectUrl deve ter pelo menos 2 caracteres e permitir hífens
  if (projectUrl.length < 2 || !/^[a-zA-Z0-9-]+$/.test(projectUrl)) {
    return null;
  }

  return { userName, projectUrl };
}

// Middleware completamente customizado
export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // Skip para API routes, arquivos estáticos e _next em TODOS os domínios
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_next/") ||
    url.pathname.startsWith("/static/") ||
    url.pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Se NÃO é domínio principal, processar subdomínios
  if (!isMainDomain(hostname)) {
    const subdomainData = parseSubdomain(hostname);

    if (subdomainData) {
      // Subdomínio válido - rewrite para página do projeto
      const { userName, projectUrl } = subdomainData;
      const newUrl = new URL(`/project/${userName}/${projectUrl}`, req.url);

      const response = NextResponse.rewrite(newUrl);
      response.headers.set("x-subdomain", hostname.split(".")[0]);
      response.headers.set("x-username", userName);
      response.headers.set("x-project-url", projectUrl);

      return response;
    } else {
      // Subdomínio inválido - retorna 404
      return new NextResponse(null, { status: 404 });
    }
  }

  // Se é domínio principal, deixa passar para o Clerk processar
  // O Clerk será configurado separadamente
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
