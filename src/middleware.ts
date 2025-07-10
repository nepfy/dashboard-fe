import { NextRequest, NextResponse } from "next/server";

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

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  const hostname =
    req.headers.get("x-forwarded-host") || req.headers.get("host") || "";

  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_next/") ||
    url.pathname.startsWith("/static/") ||
    url.pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (!isMainDomain(hostname)) {
    try {
      const subdomainData = parseSubdomain(hostname);

      if (subdomainData) {
        const { userName, projectUrl } = subdomainData;

        if (process.env.NODE_ENV === "development") {
          console.log(
            `[Middleware] Valid subdomain: ${userName}-${projectUrl}`
          );
        }

        const newUrl = new URL(`/project/${userName}/${projectUrl}`, req.url);

        const response = NextResponse.rewrite(newUrl);
        response.headers.set("x-subdomain", hostname.split(".")[0]);
        response.headers.set("x-username", userName);
        response.headers.set("x-project-url", projectUrl);

        return response;
      }
    } catch (error) {
      console.error("Subdomain parsing error:", error);
      return new NextResponse(null, { status: 404 });
    }
  }

  if (process.env.NODE_ENV === "development") {
    console.log(`[Middleware] Main domain, continuing to Next.js routing`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
