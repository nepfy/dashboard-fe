export function generateSubdomainUrl(
  userName: string,
  projectUrl: string
): string {
  return `https://${userName}-${projectUrl}.nepfy.com`;
}

export function parseSubdomain(
  hostname: string
): { userName: string; projectUrl: string } | null {
  const subdomain = hostname.split(".")[0];

  // Skip if it's the main app subdomain
  if (subdomain === "app" || subdomain === "www") {
    return null;
  }

  const parts = subdomain.split("-");
  if (parts.length < 2) {
    return null;
  }

  const userName = parts[0];
  const projectUrl = parts.slice(1).join("-");

  return { userName, projectUrl };
}

export function isValidSubdomain(hostname: string): boolean {
  const parsed = parseSubdomain(hostname);
  return parsed !== null;
}

export function isMainDomain(hostname: string): boolean {
  const subdomain = hostname.split(".")[0];
  return subdomain === "app" || subdomain === "www" || hostname === "nepfy.com";
}
