export function generateSubdomainUrl(
  userName: string,
  projectUrl: string
): string {
  return `https://${userName}-${projectUrl}.nepfy.com`;
}

export function isMainDomain(hostname: string): boolean {
  return (
    hostname === "app.nepfy.com" ||
    hostname === "localhost:3000" ||
    hostname === "nepfy.com" ||
    hostname === "www.nepfy.com" ||
    hostname === "localhost"
  );
}

export function isValidProjectSubdomain(hostname: string): boolean {
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

export function parseSubdomain(
  hostname: string
): { userName: string; projectUrl: string } | null {
  // Verifica se é um domínio principal
  if (isMainDomain(hostname)) {
    return null;
  }

  // Verifica se é um subdomínio de projeto válido
  if (!isValidProjectSubdomain(hostname)) {
    return null;
  }

  const subdomain = hostname.split(".")[0];
  const parts = subdomain.split("-");

  const userName = parts[0];
  const projectUrl = parts.slice(1).join("-");

  return { userName, projectUrl };
}

export function isValidSubdomain(hostname: string): boolean {
  const parsed = parseSubdomain(hostname);
  return parsed !== null;
}
