const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugify(value: string | null | undefined): string {
  if (!value) {
    return "";
  }

  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isValidSlug(value: string): boolean {
  if (!value) {
    return false;
  }

  return SLUG_REGEX.test(value);
}

export function truncateSlug(slug: string, maxLength: number): string {
  if (slug.length <= maxLength) {
    return slug;
  }

  const sliced = slug.slice(0, maxLength);
  const trimmed = sliced.replace(/-+$/, "");

  return trimmed || sliced;
}

