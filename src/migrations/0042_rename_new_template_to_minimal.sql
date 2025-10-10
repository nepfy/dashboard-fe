-- Migration: Rename all new_template tables to minimal_template
-- This renames all database tables from new_template_* to minimal_template_*

-- 1. Rename main template tables
ALTER TABLE new_template_about_us RENAME TO minimal_template_about_us;
ALTER TABLE new_template_about_us_team RENAME TO minimal_template_about_us_team;
ALTER TABLE new_template_about_us_marquee RENAME TO minimal_template_about_us_marquee;

ALTER TABLE new_template_clients RENAME TO minimal_template_clients;
ALTER TABLE new_template_clients_list RENAME TO minimal_template_clients_list;

ALTER TABLE new_template_expertise RENAME TO minimal_template_expertise;
ALTER TABLE new_template_expertise_topics RENAME TO minimal_template_expertise_topics;

ALTER TABLE new_template_faq RENAME TO minimal_template_faq;
ALTER TABLE new_template_faq_list RENAME TO minimal_template_faq_list;

ALTER TABLE new_template_footer RENAME TO minimal_template_footer;
ALTER TABLE new_template_footer_marquee RENAME TO minimal_template_footer_marquee;

ALTER TABLE new_template_introduction RENAME TO minimal_template_introduction;
ALTER TABLE new_template_introduction_photos RENAME TO minimal_template_introduction_photos;

ALTER TABLE new_template_plans RENAME TO minimal_template_plans;
ALTER TABLE new_template_plans_list RENAME TO minimal_template_plans_list;
ALTER TABLE new_template_plans_included_items RENAME TO minimal_template_plans_included_items;

ALTER TABLE new_template_terms_conditions RENAME TO minimal_template_terms_conditions;
ALTER TABLE new_template_terms_conditions_list RENAME TO minimal_template_terms_conditions_list;

-- 2. Update foreign key constraints (they should automatically update, but let's verify)
-- The constraint names should automatically update when tables are renamed

-- 3. Verify the migration
SELECT 
  table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE 'minimal_template_%'
ORDER BY table_name;
