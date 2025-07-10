import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/login(.*)",
  "/criar-conta(.*)",
  "/recuperar-conta(.*)",
  "/termos-de-uso(.*)",
  "/project(.*)",
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
  // Se for um domínio principal, não é um subdomínio de projeto
  if (isMainDomain(hostname)) {
    return false;
  }

  const subdomain = hostname.split(".")[0];
  const parts = subdomain.split("-");

  // Deve ter pelo menos 2 partes (userName-projectUrl)
  if (parts.length < 2) {
    return false;
  }

  // Verificações básicas de formato
  const userName = parts[0];
  const projectUrl = parts.slice(1).join("-");

  // userName e projectUrl não podem estar vazios
  if (!userName || !projectUrl) {
    return false;
  }

  // userName deve ter pelo menos 2 caracteres e ser alfanumérico
  if (userName.length < 2 || !/^[a-zA-Z0-9]+$/.test(userName)) {
    return false;
  }

  // projectUrl deve ter pelo menos 2 caracteres e permitir hífens
  if (projectUrl.length < 2 || !/^[a-zA-Z0-9-]+$/.test(projectUrl)) {
    return false;
  }

  return true;
}

function parseSubdomain(
  hostname: string
): { userName: string; projectUrl: string } | null {
  // First check if it's a main domain
  if (isMainDomain(hostname)) {
    return null;
  }

  // Check if it's a valid project subdomain format
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

  // PRODUCTION FIX 1: More robust hostname detection
  // In production, use x-forwarded-host first, then fall back to host header
  const hostname =
    req.headers.get("x-forwarded-host") || req.headers.get("host") || "";

  // PRODUCTION FIX 2: Enhanced logging for debugging (only in development)
  if (process.env.NODE_ENV === "development") {
    console.log(`[Middleware Debug] ${req.method} ${hostname}${url.pathname}`);
    console.log(
      `[Headers] host: ${req.headers.get(
        "host"
      )}, x-forwarded-host: ${req.headers.get("x-forwarded-host")}`
    );
  }

  // Skip for API routes, static files, and _next on ALL domains
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_next/") ||
    url.pathname.startsWith("/static/") ||
    url.pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // PRODUCTION FIX 3: Handle subdomain routing BEFORE Clerk authentication
  // This prevents Clerk from intercepting invalid subdomains
  if (!isMainDomain(hostname)) {
    try {
      const subdomainData = parseSubdomain(hostname);

      if (subdomainData) {
        // Valid project subdomain - bypass Clerk auth completely
        const { userName, projectUrl } = subdomainData;

        if (process.env.NODE_ENV === "development") {
          console.log(
            `[Middleware] Valid subdomain: ${userName}-${projectUrl}`
          );
        }

        // Rewrite to the project page
        const newUrl = new URL(`/project/${userName}/${projectUrl}`, req.url);

        // Pass original hostname and subdomain data as headers
        const response = NextResponse.rewrite(newUrl);
        response.headers.set("x-subdomain", hostname.split(".")[0]);
        response.headers.set("x-username", userName);
        response.headers.set("x-project-url", projectUrl);

        return response;
      } else {
        // PRODUCTION FIX 4: Invalid subdomain format - return 404 instead of redirecting to login
        if (process.env.NODE_ENV === "development") {
          console.log(`[Middleware] Invalid subdomain: ${hostname}`);
        }

        return new NextResponse(null, { status: 404 });
      }
    } catch (error) {
      // PRODUCTION FIX 5: Error handling for subdomain parsing
      console.error("Subdomain parsing error:", error);
      return new NextResponse(null, { status: 404 });
    }
  }

  // This is the main app domain - apply Clerk authentication
  if (process.env.NODE_ENV === "development") {
    console.log(`[Middleware] Main domain, applying Clerk auth`);
  }

  // PRODUCTION FIX 6: Wrap Clerk auth in try-catch for Edge Runtime compatibility
  try {
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
  } catch (error) {
    // PRODUCTION FIX 7: Fallback for Clerk auth errors in production
    console.error("Clerk auth error in middleware:", error);

    // In case of Clerk failure, allow access to continue (graceful degradation)
    // You can customize this behavior based on your security requirements
    return NextResponse.next();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
