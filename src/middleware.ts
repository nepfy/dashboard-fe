import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/login(.*)",
  "/criar-conta(.*)",
  "/recuperar-conta(.*)",
  "/proposta-com-ia(.*)",
  "/termos-de-uso(.*)",
  "/project(.*)",
  "/admin(.*)", // Temporário para desenvolvimento
]);

function isMainDomain(hostname: string): boolean {
  return (
    hostname === "staging-app.nepfy.com" ||
    hostname === "app.nepfy.com" ||
    hostname === "localhost:3000" ||
    hostname === "nepfy.com" ||
    hostname === "www.nepfy.com" ||
    hostname === "localhost"
  );
}

function isValidProjectSubdomain(hostname: string): boolean {
  if (isMainDomain(hostname)) {
    return false;
  }

  const subdomain = hostname.split(".")[0];
  const parts = subdomain.split("-");

  if (parts.length < 2) {
    return false;
  }

  const userName = parts[0];
  const projectUrl = parts.slice(1).join("-");

  if (!userName || !projectUrl) {
    return false;
  }

  if (userName.length < 2 || !/^[a-zA-Z0-9]+$/.test(userName)) {
    return false;
  }

  if (projectUrl.length < 2 || !/^[a-zA-Z0-9-]+$/.test(projectUrl)) {
    return false;
  }

  return true;
}

function parseSubdomain(
  hostname: string
): { userName: string; projectUrl: string } | null {
  if (isMainDomain(hostname)) {
    return null;
  }

  if (!isValidProjectSubdomain(hostname)) {
    return null;
  }

  const subdomain = hostname.split(".")[0];
  const parts = subdomain.split("-");

  const userName = parts[0];
  const projectUrl = parts.slice(1).join("-");

  return { userName, projectUrl };
}

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // Allow template-flash static files to be served without authentication
  if (url.pathname.startsWith("/template-flash/")) {
    return NextResponse.next();
  }

  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_next/") ||
    url.pathname.startsWith("/static/") ||
    url.pathname.match(
      /\.(ico|png|svg|jpg|jpeg|gif|webp|js|css|woff|woff2|ttf|html)$/
    )
  ) {
    return NextResponse.next();
  }

  if (!isMainDomain(hostname)) {
    const subdomainData = parseSubdomain(hostname);

    if (subdomainData) {
      const { userName, projectUrl } = subdomainData;

      // Only rewrite if we're on the root path or project path
      if (url.pathname === "/" || url.pathname.startsWith("/project/")) {
        const newUrl = new URL(`/project/${userName}/${projectUrl}`, req.url);

        const response = NextResponse.rewrite(newUrl);
        response.headers.set("x-subdomain", hostname.split(".")[0]);
        response.headers.set("x-username", userName);
        response.headers.set("x-project-url", projectUrl);
        response.headers.set("x-is-subdomain", "true");

        return response;
      }
    } else {
      return new NextResponse("Not Found", { status: 404 });
    }
  }

  if (url.pathname.startsWith("/api/")) {
    const { userId } = await auth();

    const publicApiRoutes = ["/api/public", "/api/health"];
    const isPublicApi = publicApiRoutes.some((route) =>
      url.pathname.startsWith(route)
    );

    if (!isPublicApi && !userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    return NextResponse.next();
  }

  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  const { userId, redirectToSignIn } = await auth();
  if (!userId) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf)$).*)",
  ],
};
