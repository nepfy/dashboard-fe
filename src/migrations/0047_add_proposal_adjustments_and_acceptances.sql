-- Migration: Add proposal_adjustments and proposal_acceptances tables
-- Date: 2025-01-XX
-- This adds support for tracking client-requested adjustments and proposal acceptances

-- Create proposal_adjustments table
CREATE TABLE IF NOT EXISTS proposal_adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  client_name VARCHAR(255),
  requested_by VARCHAR(255),
  metadata JSONB,
  resolved_at TIMESTAMP,
  resolved_by UUID,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create proposal_acceptances table
CREATE TABLE IF NOT EXISTS proposal_acceptances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  chosen_plan VARCHAR(255),
  chosen_plan_value VARCHAR(100),
  client_name VARCHAR(255),
  accepted_by VARCHAR(255),
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_proposal_adjustments_project_id 
ON proposal_adjustments(project_id);

CREATE INDEX IF NOT EXISTS idx_proposal_adjustments_status 
ON proposal_adjustments(status);

CREATE INDEX IF NOT EXISTS idx_proposal_acceptances_project_id 
ON proposal_acceptances(project_id);

-- Add unique constraint to ensure one acceptance per project
CREATE UNIQUE INDEX IF NOT EXISTS idx_proposal_acceptances_project_unique 
ON proposal_acceptances(project_id);

-- Add comments for documentation
COMMENT ON TABLE proposal_adjustments IS 
'Stores client-requested adjustments for proposals. Tracks adjustment requests, their status, and resolution.';

COMMENT ON TABLE proposal_acceptances IS 
'Stores information about proposal acceptances, including chosen plan and who accepted it.';

