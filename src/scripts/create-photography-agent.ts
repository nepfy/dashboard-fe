import { db } from "#/lib/db";
import { agentsTable, agentTemplatesTable } from "#/lib/db/schema/agents";

async function createPhotographyAgent() {
  try {
    console.log("🎯 Creating photography agent for flash template...");

    // Create base agent
    const baseAgentId = "photography-base-agent";
    const flashAgentId = "photography-flash-agent";
    const primeAgentId = "photography-prime-agent";

    // Insert base agent
    await db.execute(`
      INSERT INTO agents (
        id, name, sector, service_type, system_prompt, 
        expertise, common_services, pricing_model, 
        proposal_structure, key_terms, is_active
      ) VALUES (
        '${baseAgentId}', 
        'Fotógrafo Profissional', 
        'Fotografia', 
        'photography', 
        'Você é um fotógrafo profissional especializado em capturar momentos únicos e criar imagens impactantes. Sua expertise abrange diversos tipos de fotografia, desde retratos e eventos até campanhas publicitárias e moda. Você entende profundamente sobre composição, iluminação, equipamentos e técnicas fotográficas. Sua abordagem é criativa, técnica e focada em resultados excepcionais que superam as expectativas dos clientes. Sempre demonstre conhecimento técnico específico sobre fotografia e ofereça soluções personalizadas para cada projeto.', 
        '["Fotografia de Retrato", "Fotografia de Eventos", "Fotografia de Moda", "Fotografia Publicitária", "Fotografia de Produto", "Fotografia de Casamento", "Fotografia Corporativa", "Fotografia de Estúdio", "Fotografia Exterior", "Pós-processamento Digital"]', 
        '["Sessão de Fotos", "Cobertura de Eventos", "Campanhas Publicitárias", "Fotografia de Produto", "Retratos Profissionais", "Fotografia de Moda", "Fotografia de Casamento", "Fotografia Corporativa"]', 
        'project', 
        '["Consultoria Inicial", "Planejamento da Sessão", "Execução Fotográfica", "Pós-processamento", "Entrega Final"]', 
        '["Composição", "Iluminação", "Equipamentos", "Técnicas", "Criatividade", "Qualidade", "Profissionalismo", "Resultados"]',
        true
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        sector = EXCLUDED.sector,
        system_prompt = EXCLUDED.system_prompt,
        expertise = EXCLUDED.expertise,
        common_services = EXCLUDED.common_services,
        pricing_model = EXCLUDED.pricing_model,
        proposal_structure = EXCLUDED.proposal_structure,
        key_terms = EXCLUDED.key_terms,
        updated_at = CURRENT_TIMESTAMP
    `);

    // Insert flash agent
    await db.execute(`
      INSERT INTO agents (
        id, name, sector, service_type, system_prompt, 
        expertise, common_services, pricing_model, 
        proposal_structure, key_terms, is_active
      ) VALUES (
        '${flashAgentId}', 
        'Fotógrafo Flash', 
        'Fotografia', 
        'photography', 
        'Você é um fotógrafo profissional especializado em capturar momentos únicos e criar imagens impactantes. Sua expertise abrange diversos tipos de fotografia, desde retratos e eventos até campanhas publicitárias e moda. Você entende profundamente sobre composição, iluminação, equipamentos e técnicas fotográficas. Sua abordagem é criativa, técnica e focada em resultados excepcionais que superam as expectativas dos clientes. Sempre demonstre conhecimento técnico específico sobre fotografia e ofereça soluções personalizadas para cada projeto.', 
        '["Fotografia de Retrato", "Fotografia de Eventos", "Fotografia de Moda", "Fotografia Publicitária", "Fotografia de Produto", "Fotografia de Casamento", "Fotografia Corporativa", "Fotografia de Estúdio", "Fotografia Exterior", "Pós-processamento Digital"]', 
        '["Sessão de Fotos", "Cobertura de Eventos", "Campanhas Publicitárias", "Fotografia de Produto", "Retratos Profissionais", "Fotografia de Moda", "Fotografia de Casamento", "Fotografia Corporativa"]', 
        'project', 
        '["Consultoria Inicial", "Planejamento da Sessão", "Execução Fotográfica", "Pós-processamento", "Entrega Final"]', 
        '["Composição", "Iluminação", "Equipamentos", "Técnicas", "Criatividade", "Qualidade", "Profissionalismo", "Resultados"]',
        true
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        sector = EXCLUDED.sector,
        system_prompt = EXCLUDED.system_prompt,
        expertise = EXCLUDED.expertise,
        common_services = EXCLUDED.common_services,
        pricing_model = EXCLUDED.pricing_model,
        proposal_structure = EXCLUDED.proposal_structure,
        key_terms = EXCLUDED.key_terms,
        updated_at = CURRENT_TIMESTAMP
    `);

    // Insert prime agent
    await db.execute(`
      INSERT INTO agents (
        id, name, sector, service_type, system_prompt, 
        expertise, common_services, pricing_model, 
        proposal_structure, key_terms, is_active
      ) VALUES (
        '${primeAgentId}', 
        'Fotógrafo Premium', 
        'Fotografia', 
        'photography', 
        'Você é um fotógrafo profissional especializado em capturar momentos únicos e criar imagens impactantes. Sua expertise abrange diversos tipos de fotografia, desde retratos e eventos até campanhas publicitárias e moda. Você entende profundamente sobre composição, iluminação, equipamentos e técnicas fotográficas. Sua abordagem é criativa, técnica e focada em resultados excepcionais que superam as expectativas dos clientes. Sempre demonstre conhecimento técnico específico sobre fotografia e ofereça soluções personalizadas para cada projeto.', 
        '["Fotografia de Retrato", "Fotografia de Eventos", "Fotografia de Moda", "Fotografia Publicitária", "Fotografia de Produto", "Fotografia de Casamento", "Fotografia Corporativa", "Fotografia de Estúdio", "Fotografia Exterior", "Pós-processamento Digital"]', 
        '["Sessão de Fotos", "Cobertura de Eventos", "Campanhas Publicitárias", "Fotografia de Produto", "Retratos Profissionais", "Fotografia de Moda", "Fotografia de Casamento", "Fotografia Corporativa"]', 
        'project', 
        '["Consultoria Inicial", "Planejamento da Sessão", "Execução Fotográfica", "Pós-processamento", "Entrega Final"]', 
        '["Composição", "Iluminação", "Equipamentos", "Técnicas", "Criatividade", "Qualidade", "Profissionalismo", "Resultados"]',
        true
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        sector = EXCLUDED.sector,
        system_prompt = EXCLUDED.system_prompt,
        expertise = EXCLUDED.expertise,
        common_services = EXCLUDED.common_services,
        pricing_model = EXCLUDED.pricing_model,
        proposal_structure = EXCLUDED.proposal_structure,
        key_terms = EXCLUDED.key_terms,
        updated_at = CURRENT_TIMESTAMP
    `);

    // Create flash template configuration
    await db.execute(`
      INSERT INTO agent_templates (
        id, agent_id, template_type, introduction_style,
        about_us_focus, specialties_approach, process_emphasis,
        investment_strategy, is_active
      ) VALUES (
        '${flashAgentId}-flash', 
        '${flashAgentId}', 
        'flash', 
        'Abordagem dinâmica e criativa, destacando versatilidade e rapidez na entrega', 
        'Foco na experiência e resultados rápidos, mostrando portfólio diversificado', 
        'Destacar especialidades técnicas e criativas de forma objetiva', 
        'Processo otimizado e eficiente para entrega rápida', 
        'Pacotes claros e acessíveis com foco em valor',
        true
      )
      ON CONFLICT (id) DO UPDATE SET
        introduction_style = EXCLUDED.introduction_style,
        about_us_focus = EXCLUDED.about_us_focus,
        specialties_approach = EXCLUDED.specialties_approach,
        process_emphasis = EXCLUDED.process_emphasis,
        investment_strategy = EXCLUDED.investment_strategy,
        updated_at = CURRENT_TIMESTAMP
    `);

    // Create prime template configuration
    await db.execute(`
      INSERT INTO agent_templates (
        id, agent_id, template_type, introduction_style,
        about_us_focus, specialties_approach, process_emphasis,
        investment_strategy, is_active
      ) VALUES (
        '${primeAgentId}-prime', 
        '${primeAgentId}', 
        'prime', 
        'Abordagem premium e sofisticada, destacando excelência e exclusividade', 
        'Foco na qualidade excepcional e experiência personalizada', 
        'Destacar especialidades com foco em qualidade premium', 
        'Processo detalhado e personalizado para resultados excepcionais', 
        'Investimento premium com foco em qualidade e exclusividade',
        true
      )
      ON CONFLICT (id) DO UPDATE SET
        introduction_style = EXCLUDED.introduction_style,
        about_us_focus = EXCLUDED.about_us_focus,
        specialties_approach = EXCLUDED.specialties_approach,
        process_emphasis = EXCLUDED.process_emphasis,
        investment_strategy = EXCLUDED.investment_strategy,
        updated_at = CURRENT_TIMESTAMP
    `);

    console.log("✅ Photography agents created successfully!");
    console.log("📋 Created agents:");
    console.log(`   - ${baseAgentId}`);
    console.log(`   - ${flashAgentId}`);
    console.log(`   - ${primeAgentId}`);
    console.log("🎨 Created template configurations:");
    console.log(`   - ${flashAgentId}-flash`);
    console.log(`   - ${primeAgentId}-prime`);
  } catch (error) {
    console.error("❌ Error creating photography agent:", error);
    throw error;
  }
}

// Run the script
createPhotographyAgent()
  .then(() => {
    console.log("🎉 Script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Script failed:", error);
    process.exit(1);
  });
