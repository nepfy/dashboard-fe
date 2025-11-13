const DEFAULT_PROJECT_BASE_DOMAIN = "nepfy.com";

function normalizeHostname(hostname: string): string {
  return hostname.split(":")[0]?.toLowerCase() ?? hostname.toLowerCase();
}

export function getProjectBaseDomain(): string {
  const envValue = process.env.NEXT_PUBLIC_PROJECT_BASE_DOMAIN?.trim();

  if (!envValue) {
    return DEFAULT_PROJECT_BASE_DOMAIN;
  }

  return envValue
    .replace(/^https?:\/\//i, "")
    .replace(/\/$/, "")
    .toLowerCase();
}

export function generateSubdomainUrl(
  userName: string,
  projectUrl: string
): string {
  const projectBaseDomain = getProjectBaseDomain();
  const normalizedUserName = userName.trim().toLowerCase();
  const normalizedProjectUrl = projectUrl.trim().replace(/^\/+/, "");
  const slugSegment = normalizedProjectUrl
    ? encodeURIComponent(normalizedProjectUrl)
    : "";
  const baseUrl = `https://${normalizedUserName}.${projectBaseDomain}`;

  return slugSegment ? `${baseUrl}/${slugSegment}` : baseUrl;
}

export function isMainDomain(hostname: string): boolean {
  const normalized = normalizeHostname(hostname);
  const projectBaseDomain = getProjectBaseDomain();

  return (
    normalized === "staging-app.nepfy.com" ||
    normalized === "app.nepfy.com" ||
    normalized === "nepfy.com" ||
    normalized === "www.nepfy.com" ||
    normalized === "localhost" ||
    normalized === "localhost:3000" ||
    normalized === projectBaseDomain ||
    normalized === `www.${projectBaseDomain}`
  );
}

function stripBaseDomain(hostname: string): string | null {
  const normalizedHost = normalizeHostname(hostname);
  const projectBaseDomain = getProjectBaseDomain();

  if (normalizedHost === projectBaseDomain) {
    return "";
  }

  if (normalizedHost.endsWith(`.${projectBaseDomain}`)) {
    return normalizedHost.slice(0, -(projectBaseDomain.length + 1));
  }

  return null;
}

function extractSlugFromPath(pathname: string): string | null {
  console.log("[extractSlugFromPath] Input pathname:", pathname);

  if (!pathname) {
    console.log("[extractSlugFromPath] FAILED: empty pathname");
    return null;
  }

  const trimmedPath = pathname.replace(/\/+$/, "");
  console.log("[extractSlugFromPath] Trimmed path:", trimmedPath);

  if (trimmedPath === "" || trimmedPath === "/") {
    console.log("[extractSlugFromPath] FAILED: empty or root path");
    return null;
  }

  const segments = trimmedPath.split("/").filter(Boolean);
  console.log("[extractSlugFromPath] Segments:", segments, "length:", segments.length);

  if (segments.length !== 1) {
    console.log("[extractSlugFromPath] FAILED: segments.length is not 1");
    return null;
  }

  console.log("[extractSlugFromPath] SUCCESS:", segments[0]);
  return segments[0];
}

export interface ParsedProjectLocation {
  userName: string;
  projectUrl: string;
  isLegacy: boolean;
}

function parseLegacyProjectSubdomain(
  hostname: string
): ParsedProjectLocation | null {
  const remainder = stripBaseDomain(hostname);

  if (!remainder || !remainder.includes("-")) {
    return null;
  }

  const [userName, ...slugParts] = remainder.split("-");
  const projectUrl = slugParts.join("-");

  if (!userName || !projectUrl) {
    return null;
  }

  return {
    userName,
    projectUrl,
    isLegacy: true,
  };
}

function parseModernProjectSubdomain(
  hostname: string,
  pathname: string
): ParsedProjectLocation | null {
  console.log("[parseModernProjectSubdomain] Input:", { hostname, pathname });

  const remainder = stripBaseDomain(hostname);
  console.log("[parseModernProjectSubdomain] stripBaseDomain result:", remainder);

  if (remainder === null || remainder.includes(".")) {
    console.log("[parseModernProjectSubdomain] FAILED: remainder is null or contains dot");
    return null;
  }

  const userName = remainder.trim();
  const projectUrl = extractSlugFromPath(pathname);

  console.log("[parseModernProjectSubdomain] Extracted:", { userName, projectUrl });

  if (!userName || !projectUrl) {
    console.log("[parseModernProjectSubdomain] FAILED: missing userName or projectUrl");
    return null;
  }

  console.log("[parseModernProjectSubdomain] SUCCESS");
  return {
    userName,
    projectUrl,
    isLegacy: false,
  };
}

export function parseProjectLocation(
  hostname: string,
  pathname: string
): ParsedProjectLocation | null {
  if (isMainDomain(hostname)) {
    return null;
  }

  const legacy = parseLegacyProjectSubdomain(hostname);
  if (legacy) {
    return legacy;
  }

  return parseModernProjectSubdomain(hostname, pathname);
}

export function isValidProjectSubdomain(
  hostname: string,
  pathname = "/"
): boolean {
  return parseProjectLocation(hostname, pathname) !== null;
}

export function parseSubdomain(
  hostname: string,
  pathname = "/"
): ParsedProjectLocation | null {
  return parseProjectLocation(hostname, pathname);
}

export function isValidSubdomain(hostname: string, pathname = "/"): boolean {
  return parseProjectLocation(hostname, pathname) !== null;
}
