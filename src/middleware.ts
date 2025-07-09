import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/login(.*)",
  "/criar-conta(.*)",
  "/recuperar-conta(.*)",
  "/termos-de-uso(.*)",
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

  return { userName, projectUrl };
}

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

  // Check if this is a subdomain route (project page)
  const subdomainData = parseSubdomain(hostname);

  if (subdomainData) {
    // This is a subdomain route - bypass Clerk auth and handle subdomain routing
    const { userName, projectUrl } = subdomainData;

    // Rewrite to the project page
    const newUrl = new URL(`/project/${userName}/${projectUrl}`, req.url);

    // Pass original hostname and subdomain data as headers
    const response = NextResponse.rewrite(newUrl);
    response.headers.set("x-subdomain", hostname.split(".")[0]);
    response.headers.set("x-username", userName);
    response.headers.set("x-project-url", projectUrl);

    return response;
  }

  // This is the main app domain - apply Clerk authentication
  const { userId, redirectToSignIn } = await auth();

  // For the root path ("/"), let the page component handle authentication
  if (url.pathname === "/") {
    return NextResponse.next();
  }

  // Allow public routes without authentication
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Require authentication for protected routes
  if (!userId) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // Allow authenticated users to access protected routes
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
