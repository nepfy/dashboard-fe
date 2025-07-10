import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/login(.*)",
  "/criar-conta(.*)",
  "/recuperar-conta(.*)",
  "/termos-de-uso(.*)",
  "/project(.*)", // This makes project routes public
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

  console.log(`[Middleware] Processing: ${hostname}${url.pathname}`);

  // Skip for static files and API routes on ALL domains
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_next/") ||
    url.pathname.startsWith("/static/") ||
    url.pathname.match(
      /\.(ico|png|svg|jpg|jpeg|gif|webp|js|css|woff|woff2|ttf)$/
    )
  ) {
    return NextResponse.next();
  }

  // Handle subdomain routing FIRST
  if (!isMainDomain(hostname)) {
    const subdomainData = parseSubdomain(hostname);

    if (subdomainData) {
      // Valid project subdomain - rewrite to project page
      const { userName, projectUrl } = subdomainData;

      console.log(`[Middleware] Valid subdomain: ${userName}-${projectUrl}`);
      console.log(`[Middleware] Original URL: ${url.pathname}`);

      // Only rewrite if we're on the root path or project path
      if (url.pathname === "/" || url.pathname.startsWith("/project/")) {
        const newUrl = new URL(`/project/${userName}/${projectUrl}`, req.url);
        console.log(`[Middleware] Rewriting to: ${newUrl.pathname}`);

        const response = NextResponse.rewrite(newUrl);
        response.headers.set("x-subdomain", hostname.split(".")[0]);
        response.headers.set("x-username", userName);
        response.headers.set("x-project-url", projectUrl);
        response.headers.set("x-is-subdomain", "true");

        return response;
      }
    } else {
      // Invalid subdomain format - return 404
      console.log(`[Middleware] Invalid subdomain: ${hostname}`);
      return new NextResponse("Not Found", { status: 404 });
    }
  }

  // Main domain - apply Clerk authentication
  console.log(
    `[Middleware] Main domain, applying Clerk auth for: ${url.pathname}`
  );

  // For API routes on main domain, still check auth
  if (url.pathname.startsWith("/api/")) {
    const { userId } = await auth();

    // Skip auth for public API routes if any
    const publicApiRoutes = ["/api/public", "/api/health"];
    const isPublicApi = publicApiRoutes.some((route) =>
      url.pathname.startsWith(route)
    );

    if (!isPublicApi && !userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    return NextResponse.next();
  }

  // Allow public routes without authentication
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Require authentication for protected routes
  const { userId, redirectToSignIn } = await auth();
  if (!userId) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Match all routes except static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf)$).*)",
    // Include API routes
    "/api/(.*)",
  ],
};
