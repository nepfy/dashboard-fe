import { db } from "#/lib/db";
import {
  BaseAgentConfig,
  ServiceType,
  TemplateType,
  PrimeAgentConfig,
  FlashAgentConfig,
} from "./base/types";
import {
  agentsTable,
  agentTemplatesTable,
  serviceTypesTable,
  templateTypesTable,
} from "#/lib/db/schema/agents";
import { eq, and } from "drizzle-orm";

// Database-based agent management
// This replaces the file-based agent configuration

export interface DatabaseAgentConfig extends BaseAgentConfig {
  primeSpecific?: {
    introductionStyle: string;
    aboutUsFocus: string;
    specialtiesApproach: string;
    processEmphasis: string;
    investmentStrategy: string;
  };
  flashSpecific?: {
    introductionStyle: string;
    aboutUsFocus: string;
    specialtiesApproach: string;
    processEmphasis: string;
    investmentStrategy: string;
  };
}

/**
 * Get agent by service type and template from database
 */
export async function getAgentByServiceAndTemplate(
  service: ServiceType,
  template: TemplateType
): Promise<DatabaseAgentConfig | null> {
  try {
    console.log("Debug - getAgentByServiceAndTemplate called with:", {
      service,
      template,
    });

    // Build agent ID based on service and template
    let agentId: string;
    if (template === "flash") {
      agentId = `${service}-flash-agent`;
    } else if (template === "prime") {
      agentId = `${service}-prime-agent`;
    } else {
      agentId = `${service}-base-agent`;
    }

    // Get base agent data
    const agentResult = await db
      .select()
      .from(agentsTable)
      .where(and(eq(agentsTable.id, agentId), eq(agentsTable.isActive, true)))
      .limit(1);

    if (!agentResult || agentResult.length === 0) {
      console.log("Debug - No agent found for ID:", agentId);
      return null;
    }

    const agentData = agentResult[0];

    // Parse JSON fields
    const agent: DatabaseAgentConfig = {
      id: agentData.id,
      name: agentData.name,
      sector: agentData.sector,
      systemPrompt: agentData.systemPrompt,
      expertise: agentData.expertise as string[],
      commonServices: agentData.commonServices as string[],
      pricingModel: agentData.pricingModel,
      proposalStructure: agentData.proposalStructure as string[],
      keyTerms: agentData.keyTerms as string[],
    };

    // Get template-specific data if template is not default
    if (template !== "base") {
      const templateResult = await db
        .select()
        .from(agentTemplatesTable)
        .where(
          and(
            eq(agentTemplatesTable.agentId, agentId),
            eq(agentTemplatesTable.templateType, template),
            eq(agentTemplatesTable.isActive, true)
          )
        )
        .limit(1);

      if (templateResult && templateResult.length > 0) {
        const templateData = templateResult[0];

        const templateSpecific = {
          introductionStyle: templateData.introductionStyle,
          aboutUsFocus: templateData.aboutUsFocus,
          specialtiesApproach: templateData.specialtiesApproach,
          processEmphasis: templateData.processEmphasis,
          investmentStrategy: templateData.investmentStrategy,
        };

        if (template === "flash") {
          agent.flashSpecific = templateSpecific;
        } else if (template === "prime") {
          agent.primeSpecific = templateSpecific;
        }
      }
    }

    console.log("Debug - Agent found:", agent.name);
    return agent;
  } catch (error) {
    console.error("Error getting agent from database:", error);
    return null;
  }
}

/**
 * Get all available agents for a specific template from database
 */
export async function getAgentsByTemplate(
  template: TemplateType
): Promise<Record<string, DatabaseAgentConfig>> {
  try {
    const agents: Record<string, DatabaseAgentConfig> = {};

    // Get all agents for the template
    const agentIds =
      template === "base"
        ? await getBaseAgentIds()
        : await getTemplateAgentIds(template);

    for (const agentId of agentIds) {
      const serviceType = extractServiceTypeFromId(agentId);
      const agent = await getAgentByServiceAndTemplate(
        serviceType as ServiceType,
        template
      );

      if (agent) {
        agents[serviceType] = agent;
      }
    }

    return agents;
  } catch (error) {
    console.error("Error getting agents by template from database:", error);
    return {};
  }
}

/**
 * Get all available service types from database
 */
export async function getAvailableServices(): Promise<ServiceType[]> {
  try {
    const result = await db.execute(`
      SELECT DISTINCT service_type FROM agents 
      WHERE is_active = true
      ORDER BY service_type
    `);

    return result.rows?.map((row: any) => row.service_type) || [];
  } catch (error) {
    console.error("Error getting available services from database:", error);
    return [];
  }
}

/**
 * Get all available template types from database
 */
export async function getAvailableTemplates(): Promise<TemplateType[]> {
  try {
    const result = await db.execute(`
      SELECT id FROM template_types 
      WHERE is_active = true
      ORDER BY id
    `);

    return result.rows?.map((row: any) => row.id) || [];
  } catch (error) {
    console.error("Error getting available templates from database:", error);
    return ["prime", "flash", "novo"];
  }
}

/**
 * Check if a template is available in database
 */
export async function isTemplateAvailable(template: TemplateType): boolean {
  try {
    const result = await db.execute(
      `
      SELECT id FROM template_types 
      WHERE id = ? AND is_active = true
    `,
      [template]
    );

    return result.rows && result.rows.length > 0;
  } catch (error) {
    console.error("Error checking template availability:", error);
    return false;
  }
}

/**
 * Check if a service is available in database
 */
export async function isServiceAvailable(service: ServiceType): boolean {
  try {
    const result = await db.execute(
      `
      SELECT id FROM agents 
      WHERE service_type = ? AND is_active = true
      LIMIT 1
    `,
      [service]
    );

    return result.rows && result.rows.length > 0;
  } catch (error) {
    console.error("Error checking service availability:", error);
    return false;
  }
}

/**
 * Create or update an agent in the database
 */
export async function upsertAgent(
  agent: Omit<DatabaseAgentConfig, "id"> & { serviceType: ServiceType }
): Promise<string> {
  try {
    const agentId = `${agent.serviceType}-base-agent`;

    await db.execute(
      `
      INSERT INTO agents (
        id, name, sector, service_type, system_prompt, 
        expertise, common_services, pricing_model, 
        proposal_structure, key_terms
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        sector = VALUES(sector),
        system_prompt = VALUES(system_prompt),
        expertise = VALUES(expertise),
        common_services = VALUES(common_services),
        pricing_model = VALUES(pricing_model),
        proposal_structure = VALUES(proposal_structure),
        key_terms = VALUES(key_terms),
        updated_at = CURRENT_TIMESTAMP
    `,
      [
        agentId,
        agent.name,
        agent.sector,
        agent.serviceType,
        agent.systemPrompt,
        JSON.stringify(agent.expertise),
        JSON.stringify(agent.commonServices),
        agent.pricingModel,
        JSON.stringify(agent.proposalStructure),
        JSON.stringify(agent.keyTerms),
      ]
    );

    return agentId;
  } catch (error) {
    console.error("Error upserting agent:", error);
    throw error;
  }
}

/**
 * Create or update template-specific configuration
 */
export async function upsertAgentTemplate(
  agentId: string,
  templateType: TemplateType,
  templateConfig: {
    introductionStyle?: string;
    aboutUsFocus?: string;
    specialtiesApproach?: string;
    processEmphasis?: string;
    investmentStrategy?: string;
  }
): Promise<void> {
  try {
    const templateId = `${agentId}-${templateType}`;

    await db.execute(
      `
      INSERT INTO agent_templates (
        id, agent_id, template_type, introduction_style,
        about_us_focus, specialties_approach, process_emphasis,
        investment_strategy
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        introduction_style = VALUES(introduction_style),
        about_us_focus = VALUES(about_us_focus),
        specialties_approach = VALUES(specialties_approach),
        process_emphasis = VALUES(process_emphasis),
        investment_strategy = VALUES(investment_strategy),
        updated_at = CURRENT_TIMESTAMP
    `,
      [
        templateId,
        agentId,
        templateType,
        templateConfig.introductionStyle || null,
        templateConfig.aboutUsFocus || null,
        templateConfig.specialtiesApproach || null,
        templateConfig.processEmphasis || null,
        templateConfig.investmentStrategy || null,
      ]
    );
  } catch (error) {
    console.error("Error upserting agent template:", error);
    throw error;
  }
}

// Helper functions
async function getBaseAgentIds(): Promise<string[]> {
  const result = await db.execute(`
    SELECT id FROM agents 
    WHERE id LIKE '%-base-agent' AND is_active = true
  `);
  return result.rows?.map((row: any) => row.id) || [];
}

async function getTemplateAgentIds(template: TemplateType): Promise<string[]> {
  const result = await db.execute(
    `
    SELECT id FROM agents 
    WHERE id LIKE ? AND is_active = true
  `,
    [`%-${template}-agent`]
  );
  return result.rows?.map((row: any) => row.id) || [];
}

function extractServiceTypeFromId(agentId: string): string {
  return agentId
    .replace(/-base-agent$/, "")
    .replace(/-flash-agent$/, "")
    .replace(/-prime-agent$/, "");
}
