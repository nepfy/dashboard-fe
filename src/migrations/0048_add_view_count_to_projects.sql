-- Migration: Add view_count to projects table
-- Date: 2025-01-XX
-- This adds support for tracking the number of times a proposal has been viewed

-- Add the view_count column
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0 NOT NULL;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_view_count 
ON projects(view_count);

-- Add comment for documentation
COMMENT ON COLUMN projects.view_count IS 
'Number of times the proposal has been viewed by clients. Incremented each time proposal_viewed event is received.';

-- Initialize existing projects with view_count based on whether they have been viewed
UPDATE projects 
SET view_count = CASE 
  WHEN project_visualization_date IS NOT NULL THEN 1 
  ELSE 0 
END;

