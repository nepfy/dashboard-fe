import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/login(.*)",
  "/criar-conta(.*)",
  "/recuperar-conta(.*)",
  "/termos-de-uso(.*)",
  "/project/(.*)", // Torna as rotas de projeto públicas
]);

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

export default clerkMiddleware(async (auth, req: NextRequest) => {
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

  // PRIMEIRA VERIFICAÇÃO: Se não é um domínio principal
  if (!isMainDomain(hostname)) {
    // Verifica se é um subdomínio de projeto válido
    const subdomainData = parseSubdomain(hostname);

    if (subdomainData) {
      // É um subdomínio válido - fazer rewrite para a página do projeto
      const { userName, projectUrl } = subdomainData;

      // Rewrite para a página do projeto
      const newUrl = new URL(`/project/${userName}/${projectUrl}`, req.url);

      // Passa o hostname original e dados do subdomínio como headers
      const response = NextResponse.rewrite(newUrl);
      response.headers.set("x-subdomain", hostname.split(".")[0]);
      response.headers.set("x-username", userName);
      response.headers.set("x-project-url", projectUrl);

      return response;
    } else {
      // Subdomínio inválido - retorna 404 diretamente sem chamar Clerk
      return new NextResponse(null, { status: 404 });
    }
  }

  // SEGUNDA VERIFICAÇÃO: É um domínio principal - aplicar autenticação Clerk
  const { userId, redirectToSignIn } = await auth();

  // Para o path raiz ("/"), deixa o componente da página lidar com a autenticação
  if (url.pathname === "/") {
    return NextResponse.next();
  }

  // Permite rotas públicas sem autenticação
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Requer autenticação para rotas protegidas
  if (!userId) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // Permite usuários autenticados acessarem rotas protegidas
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
