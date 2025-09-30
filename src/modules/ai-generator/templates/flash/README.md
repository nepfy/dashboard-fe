# Flash AI Agents

This module contains specialized AI agents for the Flash template type, each designed for specific service categories with optimized prompts and configurations.

## Available Agents

### 1. Flash - Arquiteto (Architect)

- **ID**: `flash-architect-agent`
- **Focus**: Rapid architectural projects with superior quality
- **Specialties**: Flash architectural projects, quick interior design, sustainability, approvals
- **Pricing**: Project-based percentage

### 2. Flash - Desenvolvedor (Developer)

- **ID**: `flash-developer-agent`
- **Focus**: Agile software development with MVP focus
- **Specialties**: Web development, mobile apps, APIs, e-commerce, custom systems
- **Pricing**: Hourly or project-based

### 3. Flash - Designer

- **ID**: `flash-designer-agent`
- **Focus**: Creative and impactful design with express delivery
- **Specialties**: Visual identity, branding, graphic design, UI/UX, editorial design
- **Pricing**: Project-based

### 4. Flash - Fotógrafo (Photographer)

- **ID**: `flash-photographer-agent`
- **Focus**: Professional photography with express delivery
- **Specialties**: Corporate photography, product photography, events, portraits, advertising
- **Pricing**: Session-based

### 5. Flash - Marketing Digital

- **ID**: `flash-marketing-agent`
- **Focus**: Digital marketing with quick results and immediate ROI
- **Specialties**: SEO/SEM, social media, email marketing, content marketing, analytics
- **Pricing**: Monthly retainer

### 6. Flash - Agências / Consultoria

- **ID**: `flash-agencias-consultoria-agent`
- **Focus**: Consultoria integrada com entregas ágeis e foco em crescimento escalável
- **Specialties**: Estratégia, campanhas multicanal, branding, tecnologia, analytics
- **Pricing**: Retainer mensal ou project-based

## Usage

### Basic Usage

```typescript
import { getFlashAgentByService, generateFlashAgentPrompt } from "./agent";

// Get a specific flash agent
const agent = getFlashAgentByService("Flash - Arquiteto");

// Generate a prompt for the agent
const prompt = generateFlashAgentPrompt(
  agent,
  companyInfo,
  clientInfo,
  projectDescription
);
```

### Using Constants

```typescript
import { FLASH_SERVICE_TYPES, FLASH_SERVICE_DESCRIPTIONS } from "./constants";

// Access service types
const architectService = FLASH_SERVICE_TYPES.ARCHITECT;
const description = FLASH_SERVICE_DESCRIPTIONS[architectService];
```

### Integration with Main Agents

```typescript
import { getAnyAgentByService } from "../../agents";

// This will automatically try flash agents first, then fall back to generic agents
const agent = getAnyAgentByService("Flash - Arquiteto");
```

## Flash-Specific Features

Each flash agent includes:

- **`flashSpecific`** object with specialized configurations:
  - `introductionStyle`: How to present the service
  - `aboutUsFocus`: Company presentation focus
  - `specialtiesApproach`: How to approach specialties
  - `processEmphasis`: Process description emphasis
  - `investmentStrategy`: Investment presentation strategy

## Benefits of Flash Agents

1. **Specialized Prompts**: Each agent has domain-specific knowledge and terminology
2. **Flash Methodology**: Emphasizes speed, efficiency, and quality
3. **Consistent Structure**: All agents follow the same proposal structure
4. **Fallback Support**: Can fall back to generic agents if needed
5. **Easy Integration**: Seamlessly integrates with existing AI generator system

## Adding New Flash Agents

To add a new flash agent:

1. Add the agent configuration to `flashServiceAgents` in `agent.ts`
2. Include the `flashSpecific` object with all required properties
3. Add the service type to `constants.ts`
4. Update the constants with description and icon

## Example Agent Configuration

```typescript
"Flash - New Service": {
  id: "flash-new-service-agent",
  name: "Especialista em Novo Serviço Flash",
  sector: "Novo Setor",
  systemPrompt: `...`,
  expertise: [...],
  commonServices: [...],
  pricingModel: "project-based",
  proposalStructure: [...],
  keyTerms: [...],
  flashSpecific: {
    introductionStyle: "Foco em...",
    aboutUsFocus: "Especialistas em...",
    specialtiesApproach: "Metodologia ágil para...",
    processEmphasis: "Processo otimizado para...",
    investmentStrategy: "Investimento em...",
  },
}
```
