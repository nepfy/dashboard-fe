import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { isMainDomain, parseSubdomain } from "#/lib/subdomain";

const isPublicRoute = createRouteMatcher([
  "/login(.*)",
  "/criar-conta(.*)",
  "/recuperar-conta(.*)",
  "/termos-de-uso(.*)",
]);

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

  // Verifica se é um subdomínio de projeto válido
  const subdomainData = parseSubdomain(hostname);

  if (subdomainData) {
    // Este é um subdomínio de projeto válido - bypass Clerk auth e fazer o roteamento
    const { userName, projectUrl } = subdomainData;

    // Rewrite para a página do projeto
    const newUrl = new URL(`/project/${userName}/${projectUrl}`, req.url);

    // Passa o hostname original e dados do subdomínio como headers
    const response = NextResponse.rewrite(newUrl);
    response.headers.set("x-subdomain", hostname.split(".")[0]);
    response.headers.set("x-username", userName);
    response.headers.set("x-project-url", projectUrl);

    return response;
  }

  // Verifica se é um subdomínio inválido (não é domínio principal mas também não é válido)
  if (!isMainDomain(hostname)) {
    // Para subdomínios inválidos, retorna 404 em vez de redirecionar para login
    return new NextResponse(null, { status: 404 });
  }

  // Este é o domínio principal da aplicação - aplicar autenticação Clerk
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
