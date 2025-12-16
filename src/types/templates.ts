import { TemplateData } from "#/types/template-data";
import { TemplateType } from "#/types/project";

export interface SavedTemplate {
  id: string;
  name: string;
  description?: string | null;
  templateType?: TemplateType | null;
  mainColor?: string | null;
  templateData: TemplateData;
  createdAt: string;
  updatedAt: string;
}

