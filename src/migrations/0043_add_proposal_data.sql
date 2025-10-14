-- Migration: Add proposal_data JSONB field to projects table
-- Date: 2025-10-14
-- This replaces 29+ separate tables with a single JSON field

-- Add the proposal_data column
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS proposal_data JSONB DEFAULT '{}'::jsonb;

-- Add GIN index for better query performance on JSON fields
CREATE INDEX IF NOT EXISTS idx_projects_proposal_data 
ON projects USING GIN (proposal_data);

-- Add comment for documentation
COMMENT ON COLUMN projects.proposal_data IS 
'Unified proposal data storage. Contains all sections: introduction, aboutUs, team, expertise, steps, investment, deliverables, plans, results, clients, cta, testimonials, termsConditions, faq, footer';

