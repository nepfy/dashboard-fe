-- Migration: Create agents tables for Retool management
-- This will replace the current file-based agent configuration

-- Table for base agent configurations
CREATE TABLE IF NOT EXISTS agents (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sector VARCHAR(100) NOT NULL,
  service_type VARCHAR(50) NOT NULL,
  system_prompt TEXT NOT NULL,
  expertise JSON NOT NULL DEFAULT '[]',
  common_services JSON NOT NULL DEFAULT '[]',
  pricing_model VARCHAR(50) NOT NULL,
  proposal_structure JSON NOT NULL DEFAULT '[]',
  key_terms JSON NOT NULL DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for template-specific configurations
CREATE TABLE IF NOT EXISTS agent_templates (
  id VARCHAR(50) PRIMARY KEY,
  agent_id VARCHAR(50) NOT NULL,
  template_type VARCHAR(20) NOT NULL, -- 'prime', 'flash', 'minimal'
  introduction_style TEXT,
  about_us_focus TEXT,
  specialties_approach TEXT,
  process_emphasis TEXT,
  investment_strategy TEXT,
  additional_prompt TEXT, -- For template-specific prompt additions
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE,
  UNIQUE KEY unique_agent_template (agent_id, template_type)
);

-- Table for service types (for reference and validation)
CREATE TABLE IF NOT EXISTS service_types (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for template types (for reference and validation)
CREATE TABLE IF NOT EXISTS template_types (
  id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default service types
INSERT INTO service_types (id, name, description) VALUES
('marketing', 'Marketing', 'Marketing tradicional e estratégico'),
('marketing-digital', 'Marketing Digital', 'Marketing digital e online'),
('design', 'Design', 'Design gráfico e digital'),
('development', 'Desenvolvimento', 'Desenvolvimento de software'),
('architecture', 'Arquitetura', 'Arquitetura e design de espaços'),
('photography', 'Fotografia', 'Fotografia profissional'),
('medical', 'Médico', 'Serviços médicos e de saúde')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Insert default template types
INSERT INTO template_types (id, name, description) VALUES
('prime', 'Prime', 'Template premium com foco em qualidade'),
('flash', 'Flash', 'Template rápido e eficiente'),
('minimal', 'Minimal', 'Template minimalista com design limpo (em desenvolvimento)')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Create indexes for better performance
CREATE INDEX idx_agents_service_type ON agents(service_type);
CREATE INDEX idx_agents_active ON agents(is_active);
CREATE INDEX idx_agent_templates_agent_id ON agent_templates(agent_id);
CREATE INDEX idx_agent_templates_template_type ON agent_templates(template_type);
CREATE INDEX idx_agent_templates_active ON agent_templates(is_active);
