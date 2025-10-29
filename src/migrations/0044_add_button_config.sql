-- Migration: Add button_config JSONB field to projects table
-- Date: 2025-01-27
-- This adds shared button configuration for intro and footer buttons

-- Add the button_config column
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS button_config JSONB DEFAULT '{}'::jsonb;

-- Add GIN index for better query performance on JSON fields
CREATE INDEX IF NOT EXISTS idx_projects_button_config 
ON projects USING GIN (button_config);

-- Add comment for documentation
COMMENT ON COLUMN projects.button_config IS 
'Shared button configuration for intro and footer buttons. Contains: buttonTitle, buttonWhereToOpen, buttonHref, buttonPhone';
