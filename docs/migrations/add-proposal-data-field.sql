-- Migration: Add proposal_data JSONB field to projects table
-- This replaces 29+ separate tables with a single JSON field for better maintainability

-- Add the proposal_data column
ALTER TABLE projects 
ADD COLUMN proposal_data JSONB DEFAULT '{}'::jsonb;

-- Add index for better query performance on JSON fields
CREATE INDEX idx_projects_proposal_data ON projects USING GIN (proposal_data);

-- Add index for specific JSON paths (optional, based on your query patterns)
CREATE INDEX idx_projects_proposal_data_introduction 
ON projects USING GIN ((proposal_data -> 'introduction'));

-- Comment for documentation
COMMENT ON COLUMN projects.proposal_data IS 
'Unified proposal data storage. Contains all sections: introduction, aboutUs, team, expertise, steps, investment, deliverables, plans, results, clients, cta, testimonials, termsConditions, faq, footer';

/*
  MIGRATION STRATEGY (Optional - if you need to migrate existing data):
  
  1. For each project with existing template data, collect data from all section tables
  2. Combine into a single ProposalData JSON object
  3. Update the project with the unified data
  4. Verify the migration
  5. Drop the old tables
  
  Example migration function (pseudo-code):
  
  CREATE OR REPLACE FUNCTION migrate_flash_template_data()
  RETURNS void AS $$
  DECLARE
    project_record RECORD;
    proposal_data JSONB;
  BEGIN
    FOR project_record IN 
      SELECT id FROM projects WHERE template_type = 'flash'
    LOOP
      -- Build JSON from all related tables
      proposal_data := jsonb_build_object(
        'introduction', (
          SELECT row_to_json(t) 
          FROM flash_template_introduction t 
          WHERE project_id = project_record.id
        ),
        'aboutUs', (
          SELECT row_to_json(t)
          FROM flash_template_about_us t
          WHERE project_id = project_record.id
        )
        -- ... repeat for all sections
      );
      
      -- Update project with unified data
      UPDATE projects 
      SET proposal_data = proposal_data
      WHERE id = project_record.id;
    END LOOP;
  END;
  $$ LANGUAGE plpgsql;
  
  -- Run the migration
  -- SELECT migrate_flash_template_data();
  
  -- After verifying data, drop old tables:
  -- DROP TABLE flash_template_introduction_services CASCADE;
  -- DROP TABLE flash_template_introduction CASCADE;
  -- DROP TABLE flash_template_about_us CASCADE;
  -- ... repeat for all section tables
*/

