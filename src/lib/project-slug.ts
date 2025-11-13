import { and, eq, ne } from "drizzle-orm";
import { db } from "#/lib/db";
import { projectsTable } from "#/lib/db/schema/projects";
import { PROJECT_SLUG_MAX_LENGTH } from "#/constants/project";
import { slugify, truncateSlug } from "#/lib/slug";

const MAX_SLUG_ATTEMPTS = 100;

async function projectSlugExists(
  userId: string,
  slug: string,
  projectIdToExclude?: string
) {
  let whereClause = and(
    eq(projectsTable.personId, userId),
    eq(projectsTable.projectUrl, slug)
  );

  if (projectIdToExclude) {
    whereClause = and(whereClause, ne(projectsTable.id, projectIdToExclude));
  }

  const existingProject = await db
    .select({ id: projectsTable.id })
    .from(projectsTable)
    .where(whereClause)
    .limit(1);

  return existingProject.length > 0;
}

function buildSlugWithSuffix(baseSlug: string, attempt: number): string {
  const suffix = `-${attempt}`;
  const maxBaseLength = Math.max(PROJECT_SLUG_MAX_LENGTH - suffix.length, 1);
  const truncatedBase = truncateSlug(baseSlug, maxBaseLength).replace(
    /-+$/,
    ""
  );
  const sanitizedBase =
    truncatedBase ||
    baseSlug.slice(0, Math.max(maxBaseLength, 1)).replace(/-+$/, "") ||
    "projeto";

  return `${sanitizedBase}${suffix}`;
}

interface EnsureUniqueProjectSlugOptions {
  userId: string;
  baseSlug: string;
  projectIdToExclude?: string;
}

export async function ensureUniqueProjectSlug({
  userId,
  baseSlug,
  projectIdToExclude,
}: EnsureUniqueProjectSlugOptions): Promise<string> {
  let candidate = truncateSlug(baseSlug, PROJECT_SLUG_MAX_LENGTH);
  let attempt = 1;

  while (
    candidate &&
    (await projectSlugExists(userId, candidate, projectIdToExclude))
  ) {
    attempt += 1;

    if (attempt > MAX_SLUG_ATTEMPTS) {
      throw new Error("Não foi possível gerar uma URL única para o projeto");
    }

    candidate = buildSlugWithSuffix(baseSlug, attempt);
  }

  return candidate;
}

interface PrepareProjectSlugOptions {
  userId: string;
  desiredSlug?: string | null;
  fallbackValue?: string | null;
  projectIdToExclude?: string;
}

export async function prepareProjectSlug({
  userId,
  desiredSlug,
  fallbackValue,
  projectIdToExclude,
}: PrepareProjectSlugOptions): Promise<string | null> {
  const desired = truncateSlug(
    slugify(desiredSlug),
    PROJECT_SLUG_MAX_LENGTH
  );
  const fallback = truncateSlug(
    slugify(fallbackValue),
    PROJECT_SLUG_MAX_LENGTH
  );

  const baseSlug = desired || fallback;

  if (!baseSlug) {
    return null;
  }

  return ensureUniqueProjectSlug({
    userId,
    baseSlug,
    projectIdToExclude,
  });
}

