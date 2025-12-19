-- Migration: Create user-specific proposal templates storage

CREATE TABLE IF NOT EXISTS proposal_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id uuid NOT NULL REFERENCES person_user(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  template_type varchar(50),
  main_color varchar(7),
  template_data jsonb NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS proposal_templates_person_name_idx
  ON proposal_templates(person_id, name);

