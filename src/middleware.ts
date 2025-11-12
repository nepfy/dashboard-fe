import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import {
  getProjectBaseDomain,
  isMainDomain,
  parseProjectLocation,
} from "#/lib/subdomain";

const isPublicRoute = createRouteMatcher([
  "/login(.*)",
  "/criar-conta(.*)",
  "/recuperar-conta(.*)",
  "/proposta-com-ia(.*)",
  "/termos-de-uso(.*)",
  "/project(.*)",
  "/sso-callback(.*)",
  "/admin(.*)", // Temporário para desenvolvimento
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const url = req.nextUrl;
  const hostname = req.nextUrl.hostname;

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
    const projectLocation = parseProjectLocation(hostname, url.pathname);

    if (!projectLocation) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const { userName, projectUrl, isLegacy } = projectLocation;

    if (isLegacy) {
      const projectBaseDomain = getProjectBaseDomain();
      const redirectUrl = new URL(req.url);
      redirectUrl.hostname = `${userName}.${projectBaseDomain}`;
      redirectUrl.pathname = `/${projectUrl}`;

      return NextResponse.redirect(redirectUrl, 308);
    }

    if (!url.pathname.startsWith("/project/")) {
      const newUrl = new URL(`/project/${userName}/${projectUrl}`, req.url);

      const response = NextResponse.rewrite(newUrl);
      response.headers.set("x-subdomain", userName);
      response.headers.set("x-username", userName);
      response.headers.set("x-project-url", projectUrl);
      response.headers.set("x-is-subdomain", "true");

      return response;
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
