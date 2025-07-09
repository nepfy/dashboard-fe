import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/login(.*)",
  "/criar-conta(.*)",
  "/recuperar-conta(.*)",
  "/termos-de-uso(.*)",
  "/projects(.*)",
]);

function isMainDomain(hostname: string): boolean {
  // Handle localhost cases (both with and without port)
  const isLocalhost =
    hostname === "localhost" || hostname.startsWith("localhost:");

  return (
    hostname === "app.nepfy.com" ||
    hostname === "nepfy.com" ||
    hostname === "www.nepfy.com" ||
    isLocalhost
  );
}

function parseSubdomain(
  hostname: string
): { userName: string; projectUrl: string } | null {
  // First check if it's a main domain
  if (isMainDomain(hostname)) {
    return null;
  }

  // Extract subdomain from hostname
  const parts = hostname.split(".");
  if (parts.length < 3) {
    return null; // Not a valid subdomain
  }

  const subdomain = parts[0];
  const domainParts = subdomain.split("-");

  if (domainParts.length < 2) {
    return null;
  }

  const userName = domainParts[0];
  const projectUrl = domainParts.slice(1).join("-");

  return { userName, projectUrl };
}

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  console.log("Middleware - hostname:", hostname);
  console.log("Middleware - pathname:", url.pathname);

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

    console.log("Subdomain detected:", { userName, projectUrl });

    // Rewrite to the project page
    const newUrl = new URL(`/project/${userName}/${projectUrl}`, req.url);

    console.log("Rewriting to:", newUrl.pathname);

    // Pass original hostname and subdomain data as headers
    const response = NextResponse.rewrite(newUrl);
    response.headers.set("x-subdomain", hostname.split(".")[0]);
    response.headers.set("x-username", userName);
    response.headers.set("x-project-url", projectUrl);

    return response;
  }

  // This is the main app domain - apply Clerk authentication
  console.log("Main domain detected, applying Clerk auth");

  const { userId, redirectToSignIn } = await auth();

  // For the root path ("/"), let the page component handle authentication
  if (url.pathname === "/") {
    console.log("Root path - letting page component handle auth");
    return NextResponse.next();
  }

  // Allow public routes without authentication
  if (isPublicRoute(req)) {
    console.log("Public route - allowing access");
    return NextResponse.next();
  }

  // Require authentication for protected routes
  if (!userId) {
    console.log("No user ID - redirecting to sign in");
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // Allow authenticated users to access protected routes
  console.log("Authenticated user - allowing access");
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
