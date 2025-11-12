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
  if (!pathname) {
    return null;
  }

  const trimmedPath = pathname.replace(/\/+$/, "");

  if (trimmedPath === "" || trimmedPath === "/") {
    return null;
  }

  const segments = trimmedPath.split("/").filter(Boolean);

  if (segments.length !== 1) {
    return null;
  }

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
  const remainder = stripBaseDomain(hostname);

  if (remainder === null || remainder.includes(".")) {
    return null;
  }

  const userName = remainder.trim();
  const projectUrl = extractSlugFromPath(pathname);

  if (!userName || !projectUrl) {
    return null;
  }

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
