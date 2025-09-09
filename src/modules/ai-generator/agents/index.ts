// Database-only agent management system
// This file now uses only database for agent management

export * from "./base/types";
export * from "./database-agents";

import { BaseAgentConfig, ServiceType, TemplateType } from "./base/types";
import {
  getAgentByServiceAndTemplate as dbGetAgentByServiceAndTemplate,
  getAgentsByTemplate as dbGetAgentsByTemplate,
  getAvailableServices as dbGetAvailableServices,
  getAvailableTemplates as dbGetAvailableTemplates,
  isTemplateAvailable as dbIsTemplateAvailable,
  isServiceAvailable as dbIsServiceAvailable,
} from "./database-agents";

// Main API functions - Database only
export async function getAgentByServiceAndTemplate(
  service: ServiceType,
  template: TemplateType
): Promise<BaseAgentConfig | null> {
  console.log("Debug - getAgentByServiceAndTemplate called with:", {
    service,
    template,
  });

  try {
    const dbAgent = await dbGetAgentByServiceAndTemplate(service, template);
    if (dbAgent) {
      console.log("Debug - Database agent found:", dbAgent.name);
      return dbAgent;
    }

    console.log("Debug - No agent found in database");
    return null;
  } catch (error) {
    console.error("Database lookup failed:", error);
    throw new Error(
      `Failed to get agent for service: ${service}, template: ${template}`
    );
  }
}

// Get all available agents for a specific template
export async function getAgentsByTemplate(
  template: TemplateType
): Promise<Record<string, BaseAgentConfig>> {
  try {
    return await dbGetAgentsByTemplate(template);
  } catch (error) {
    console.error("Database lookup failed:", error);
    throw new Error(`Failed to get agents for template: ${template}`);
  }
}

// Get all available templates
export async function getAvailableTemplates(): Promise<TemplateType[]> {
  try {
    return await dbGetAvailableTemplates();
  } catch (error) {
    console.error("Database lookup failed:", error);
    throw new Error("Failed to get available templates");
  }
}

// Get all available services
export async function getAvailableServices(): Promise<ServiceType[]> {
  try {
    return await dbGetAvailableServices();
  } catch (error) {
    console.error("Database lookup failed:", error);
    throw new Error("Failed to get available services");
  }
}

// Check if a template is available
export async function isTemplateAvailable(
  template: TemplateType
): Promise<boolean> {
  try {
    return await dbIsTemplateAvailable(template);
  } catch (error) {
    console.error("Database lookup failed:", error);
    throw new Error(`Failed to check template availability: ${template}`);
  }
}

// Check if a service is available
export async function isServiceAvailable(
  service: ServiceType
): Promise<boolean> {
  try {
    return await dbIsServiceAvailable(service);
  } catch (error) {
    console.error("Database lookup failed:", error);
    throw new Error(`Failed to check service availability: ${service}`);
  }
}

// Legacy function for backward compatibility
export async function getAgentByService(
  service: ServiceType
): Promise<BaseAgentConfig | null> {
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
