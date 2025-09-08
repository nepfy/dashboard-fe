// New database-based agent management
// This file replaces the file-based system with database queries

export * from "./base/types";
export * from "./database-agents";

import { ServiceType, TemplateType } from "./base/types";
import {
  getAgentByServiceAndTemplate as dbGetAgentByServiceAndTemplate,
  getAgentsByTemplate as dbGetAgentsByTemplate,
  getAvailableServices as dbGetAvailableServices,
  getAvailableTemplates as dbGetAvailableTemplates,
  isTemplateAvailable as dbIsTemplateAvailable,
  isServiceAvailable as dbIsServiceAvailable,
} from "./database-agents";

// Re-export database functions as the main API
export const getAgentByServiceAndTemplate = dbGetAgentByServiceAndTemplate;
export const getAgentsByTemplate = dbGetAgentsByTemplate;
export const getAvailableServices = dbGetAvailableServices;
export const getAvailableTemplates = dbGetAvailableTemplates;
export const isTemplateAvailable = dbIsTemplateAvailable;
export const isServiceAvailable = dbIsServiceAvailable;

// Legacy function for backward compatibility
// This will be removed after migration is complete
export async function getAgentByService(service: ServiceType) {
  console.warn(
    "⚠️ getAgentByService is deprecated. Use getAgentByServiceAndTemplate instead."
  );
  return await getAgentByServiceAndTemplate(service, "base");
}

// Migration status check
export async function checkMigrationStatus(): Promise<{
  isMigrated: boolean;
  agentCount: number;
  templateCount: number;
}> {
  try {
    const { db } = await import("#/lib/db");

    const agentResult = await db.execute(
      "SELECT COUNT(*) as count FROM agents WHERE is_active = true"
    );
    const templateResult = await db.execute(
      "SELECT COUNT(*) as count FROM agent_templates WHERE is_active = true"
    );

    const agentCount = agentResult.rows?.[0]?.count || 0;
    const templateCount = templateResult.rows?.[0]?.count || 0;

    return {
      isMigrated: agentCount > 0,
      agentCount,
      templateCount,
    };
  } catch (error) {
    console.error("Error checking migration status:", error);
    return {
      isMigrated: false,
      agentCount: 0,
      templateCount: 0,
    };
  }
}

// Fallback to file-based system if database is not available
export async function getAgentByServiceAndTemplateWithFallback(
  service: ServiceType,
  template: TemplateType
) {
  try {
    // Try database first
    const agent = await getAgentByServiceAndTemplate(service, template);
    if (agent) {
      return agent;
    }
  } catch (error) {
    console.warn("Database agent lookup failed, falling back to files:", error);
  }

  // Fallback to file-based system
  console.warn("⚠️ Falling back to file-based agent system");
  const { getAgentByServiceAndTemplate: fileGetAgent } = await import(
    "./file-agents"
  );
  return await fileGetAgent(service, template);
}
