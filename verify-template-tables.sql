-- ============================================
-- VERIFICAR TABELAS DE TEMPLATES
-- Execute ANTES e DEPOIS do drop
-- ============================================

-- Ver todas as tabelas de templates que existem
SELECT 
  table_name,
  pg_size_pretty(pg_total_relation_size(quote_ident(table_name)::regclass)) as size
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND (
  table_name LIKE 'flash_template_%' 
  OR table_name LIKE 'prime_template_%'
  OR table_name LIKE 'minimal_template_%'
  OR table_name LIKE 'new_template_%'
)
ORDER BY table_name;

-- Contar total de tabelas antigas
SELECT 
  COUNT(*) as total_old_tables,
  pg_size_pretty(SUM(pg_total_relation_size(quote_ident(table_name)::regclass))) as total_size
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND (
  table_name LIKE 'flash_template_%' 
  OR table_name LIKE 'prime_template_%'
  OR table_name LIKE 'minimal_template_%'
  OR table_name LIKE 'new_template_%'
);

