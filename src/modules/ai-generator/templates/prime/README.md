# Prime Template

This module contains specialized AI agents for the Prime template type, each designed for specific service categories with optimized prompts and configurations focused on premium quality and attention to detail.

## Overview

The Prime template emphasizes:

- **Premium Quality**: Focus on exceptional standards and superior results
- **Attention to Detail**: Meticulous care in every aspect of the proposal
- **Exceptional Results**: Outcomes that exceed client expectations
- **Professional Excellence**: High-end service positioning

## Service Types

The Prime template supports the following service categories:

### 1. Prime - Arquiteto (Architect)

- **Focus**: Premium architectural projects with exceptional attention to detail
- **Methodology**: PRIME approach emphasizing high-quality materials and superior finishes
- **Expertise**: Architectural design, interior design, sustainability, project management

### 2. Prime - Desenvolvedor (Developer)

- **Focus**: Premium software development with robust architecture and scalability
- **Methodology**: PRIME approach emphasizing clean code, comprehensive testing, and high-quality solutions
- **Expertise**: Web development, mobile apps, APIs, e-commerce, custom systems

### 3. Prime - Designer

- **Focus**: Premium design with unique creative concepts and exceptional visual quality
- **Methodology**: PRIME approach emphasizing in-depth research and attention to detail
- **Expertise**: Brand identity, graphic design, UI/UX, editorial design, packaging

### 4. Prime - Fotógrafo (Photographer)

- **Focus**: Premium photography with artistic direction and superior quality
- **Methodology**: PRIME approach emphasizing artistic excellence and exceptional delivery
- **Expertise**: Corporate photography, product photography, events, portraits, advertising

### 5. Prime - Marketing Digital

- **Focus**: Premium digital marketing with advanced strategies and sustainable ROI
- **Methodology**: PRIME approach emphasizing deep data analysis and optimized campaigns
- **Expertise**: SEO/SEM, social media, email marketing, content marketing, analytics

### 6. Prime - Agências / Consultoria

- **Focus**: Consultorias premium que integram estratégia, criatividade e tecnologia para gerar crescimento previsível
- **Methodology**: PRIME approach com discovery profundo, arquitetura de campanhas, governança de performance e relatórios executivos
- **Expertise**: Planejamento estratégico, squads multidisciplinares, branding + growth, marketing integrado, BI e analytics

## Agent Configuration

Each Prime agent includes:

- **System Prompt**: Specialized instructions for PRIME methodology
- **Expertise**: Premium-focused service areas
- **Common Services**: High-end service offerings
- **Pricing Model**: Appropriate pricing structure for premium services
- **Proposal Structure**: Detailed proposal framework
- **Key Terms**: Industry-specific terminology
- **Prime-Specific Features**: Customized elements for premium positioning

## Key Differences from Flash Template

| Aspect            | Flash Template                  | Prime Template                          |
| ----------------- | ------------------------------- | --------------------------------------- |
| **Speed**         | Fast delivery and efficiency    | Premium quality and attention to detail |
| **Focus**         | Quick results and agility       | Exceptional standards and excellence    |
| **Methodology**   | FLASH: Fast, efficient, quality | PRIME: Premium, detailed, exceptional   |
| **Positioning**   | Value-driven rapid solutions    | Premium high-end services               |
| **Target Market** | Clients seeking quick results   | Clients seeking premium quality         |

## Usage

The Prime template agents are automatically selected when:

1. The template type is set to "prime"
2. The service matches one of the Prime service types
3. The AI generation workflow is configured for Prime template

## Integration

The Prime template integrates with:

- AI generation workflow (`PrimeTemplateWorkflow`)
- Agent selection system (`getPrimeAgentByService`)
- Template preview and rendering systems
- Proposal generation API endpoints

## File Structure

```
src/modules/ai-generator/templates/prime/
├── agent.ts          # Prime template agents configuration
├── constants.ts      # Service types and descriptions
├── index.ts          # Module exports
└── README.md         # This documentation
```

## Customization

To customize Prime template agents:

1. Modify the `primeServiceAgents` configuration in `agent.ts`
2. Update service descriptions in `constants.ts`
3. Adjust system prompts for specific service requirements
4. Customize proposal structures and content generation

## Support

For questions or issues with the Prime template:

- Check the agent configuration in `agent.ts`
- Verify service type mappings in `constants.ts`
- Review the AI generation workflow integration
- Ensure proper template type selection in the UI
