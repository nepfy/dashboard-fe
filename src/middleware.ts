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

// ALWAYS run clerkMiddleware - handle routing logic inside
export default clerkMiddleware(async (auth, req: NextRequest) => {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // Skip for API routes, static files, and _next on ALL domains
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_next/") ||
    url.pathname.startsWith("/static/") ||
    url.pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Handle subdomain routing FIRST - but still within clerkMiddleware
  if (!isMainDomain(hostname)) {
    const subdomainData = parseSubdomain(hostname);

    if (subdomainData) {
      // Valid project subdomain - rewrite to project page
      const { userName, projectUrl } = subdomainData;

      console.log(`[Middleware] Valid subdomain: ${userName}-${projectUrl}`);

      const newUrl = new URL(`/project/${userName}/${projectUrl}`, req.url);

      const response = NextResponse.rewrite(newUrl);
      response.headers.set("x-subdomain", hostname.split(".")[0]);
      response.headers.set("x-username", userName);
      response.headers.set("x-project-url", projectUrl);

      // Since /project routes are public, Clerk won't require auth
      return response;
    } else {
      // Invalid subdomain format - return 404
      console.log(`[Middleware] Invalid subdomain: ${hostname}`);
      return new NextResponse(null, { status: 404 });
    }
  }

  // Main domain - apply Clerk authentication
  console.log(
    `[Middleware] Main domain, applying Clerk auth for: ${url.pathname}`
  );

  const { userId, redirectToSignIn } = await auth();

  // Allow public routes without authentication
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Require authentication for protected routes
  if (!userId) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
