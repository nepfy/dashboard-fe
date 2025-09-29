import { TemplateType } from "./types";

export type ConstraintMode = "exact" | "max";

export interface TemplateFieldConstraint {
  id: string;
  label?: string;
  description?: string;
  limit: number;
  mode: ConstraintMode;
  optional?: boolean;
}

export interface TemplateCollectionConstraint {
  id: string;
  label?: string;
  description?: string;
  minItems?: number;
  maxItems?: number;
  exactItems?: number;
  itemType: "string" | "object";
  stringItem?: TemplateFieldConstraint;
  fields?: Record<string, TemplateFieldConstraint>;
  collections?: Record<string, TemplateCollectionConstraint>;
}

export interface TemplateSectionConfig {
  id: string;
  label: string;
  description?: string;
  fields?: Record<string, TemplateFieldConstraint>;
  collections?: Record<string, TemplateCollectionConstraint>;
}

export interface TemplateStructureItem {
  id: string;
  title: string;
  description?: string;
}

export interface TemplateConfig {
  version: string;
  templateType: TemplateType;
  structure: TemplateStructureItem[];
  sections: Record<string, TemplateSectionConfig>;
}

export function formatConstraintLimit(
  constraint: TemplateFieldConstraint
): string {
  const adjective = constraint.mode === "exact" ? "exatamente" : "até";
  return `${adjective} ${constraint.limit} caracteres`;
}

export function formatCollectionLimit(
  constraint: TemplateCollectionConstraint
): string {
  if (constraint.exactItems !== undefined) {
    return `exatamente ${constraint.exactItems} itens`;
  }

  const parts: string[] = [];

  if (constraint.minItems !== undefined) {
    parts.push(`mínimo ${constraint.minItems}`);
  }

  if (constraint.maxItems !== undefined) {
    parts.push(`máximo ${constraint.maxItems}`);
  }

  if (!parts.length) {
    return "quantidade livre";
  }

  return parts.join(" e ") + " itens";
}

export function getSectionConfig(
  config: TemplateConfig | null | undefined,
  sectionId: string
): TemplateSectionConfig | undefined {
  return config?.sections?.[sectionId];
}

export function getFieldConstraint(
  section: TemplateSectionConfig | undefined,
  fieldId: string
): TemplateFieldConstraint | undefined {
  return section?.fields?.[fieldId];
}

export function getCollectionConstraint(
  section: TemplateSectionConfig | undefined,
  collectionId: string
): TemplateCollectionConstraint | undefined {
  return section?.collections?.[collectionId];
}

export function cloneTemplateConfig(config: TemplateConfig): TemplateConfig {
  return JSON.parse(JSON.stringify(config)) as TemplateConfig;
}
