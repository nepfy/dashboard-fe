-- Migration: Duplicate Flash agents to create Minimal template agents
-- This creates all Minimal template agents based on existing Flash agents

-- 1. Update template_types table to add 'minimal' and remove 'novo'
INSERT INTO template_types (id, name, description, is_active, created_at, updated_at)
VALUES (
  'minimal',
  'Minimal',
  'Template minimalista com design limpo e funcionalidades essenciais',
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = CURRENT_TIMESTAMP;

-- Remove 'novo' template type if it exists
DELETE FROM template_types WHERE id = 'novo';

-- 2. Duplicate agent_templates from Flash to Minimal
-- This will create all the Minimal template configurations based on Flash
INSERT INTO agent_templates (
  id,
  agent_id,
  template_type,
  introduction_style,
  about_us_focus,
  specialties_approach,
  process_emphasis,
  investment_strategy,
  additional_prompt,
  is_active,
  created_at,
  updated_at
)
SELECT
  CONCAT(REPLACE(id, '-flash', '-minimal')) as id,
  agent_id,
  'minimal' as template_type,
  introduction_style,
  about_us_focus,
  specialties_approach,
  process_emphasis,
  investment_strategy,
  additional_prompt,
  is_active,
  CURRENT_TIMESTAMP as created_at,
  CURRENT_TIMESTAMP as updated_at
FROM agent_templates
WHERE template_type = 'flash'
ON CONFLICT (id) DO NOTHING;

-- 3. Verify the migration
SELECT 
  at.template_type,
  a.service_type,
  a.name as agent_name,
  at.id as template_id
FROM agent_templates at
JOIN agents a ON a.id = at.agent_id
WHERE at.template_type = 'minimal'
ORDER BY a.service_type;

