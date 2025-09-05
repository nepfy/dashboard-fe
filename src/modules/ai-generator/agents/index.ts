export * from "./base/types";
export * from "./base/base-agents";
export * from "./prime/prime-agents";
export * from "./flash/flash-agents";

import { BaseAgentConfig, ServiceType, TemplateType } from "./base/types";
import { baseServiceAgents } from "./base/base-agents";
import {
  primeServiceAgents,
  getPrimeAgentByService,
} from "./prime/prime-agents";
import {
  flashServiceAgents,
  getFlashAgentByService,
} from "./flash/flash-agents";

// Legacy function for backward compatibility
export function getAgentByService(service: ServiceType): BaseAgentConfig {
  const baseAgent = baseServiceAgents[service];
  return {
    ...baseAgent,
    id: `${service}-agent`,
  };
}

// New unified function to get agents by service and template
export function getAgentByServiceAndTemplate(
  service: ServiceType,
  template: TemplateType
): BaseAgentConfig | null {
  console.log("Debug - getAgentByServiceAndTemplate called with:", { service, template });
  
  switch (template) {
    case "prime":
      const primeAgent = getPrimeAgentByService(service);
      console.log("Debug - Prime agent result:", primeAgent);
      return primeAgent;
    case "flash":
      const flashAgent = getFlashAgentByService(service);
      console.log("Debug - Flash agent result:", flashAgent);
      return flashAgent;
    case "novo":
      // TODO: Implement when novo template is ready
      return null;
    default:
      const baseAgent = getAgentByService(service);
      console.log("Debug - Base agent result:", baseAgent);
      return baseAgent;
  }
}

// Get all available agents for a specific template
export function getAgentsByTemplate(
  template: TemplateType
): Record<string, BaseAgentConfig> {
  switch (template) {
    case "prime":
      return primeServiceAgents;
    case "flash":
      return flashServiceAgents;
    case "novo":
      // TODO: Implement when novo template is ready
      return {};
    default:
      return Object.fromEntries(
        Object.entries(baseServiceAgents).map(([key, agent]) => [
          key,
          { ...agent, id: `${key}-agent` },
        ])
      );
  }
}

// Get all available templates
export function getAvailableTemplates(): TemplateType[] {
  return ["prime", "flash", "novo"];
}

// Get all available services
export function getAvailableServices(): ServiceType[] {
  return Object.keys(baseServiceAgents) as ServiceType[];
}

// Check if a template is available
export function isTemplateAvailable(template: TemplateType): boolean {
  return getAvailableTemplates().includes(template);
}

// Check if a service is available
export function isServiceAvailable(service: ServiceType): boolean {
  return service in baseServiceAgents;
}
