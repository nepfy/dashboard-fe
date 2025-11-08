# 🗄️ Database Migrations Guide

Este guia explica como rodar migrations no banco de dados, especialmente para ambientes de Preview no Vercel.

---

## 📋 Sobre o Erro

Se você está vendo este erro:
```json
{"success":false,"error":"NeonDbError: column \"button_config\" does not exist"}
```

Significa que a migration `0044_add_button_config.sql` não foi executada no banco de dados do ambiente de Preview.

---

## 🚀 Como Rodar Migrations Localmente

### 1. Configure o DATABASE_URL

Certifique-se de que você tem o `DATABASE_URL` configurado no seu `.env.local`:

```bash
DATABASE_URL=postgresql://...
```

### 2. Execute o Script de Migration

```bash
npm run migrate
```

Isso irá executar **todas** as migrations SQL em ordem alfabética da pasta `src/migrations/`.

### 3. Resultado Esperado

```
🚀 Starting migration process...

📁 Found 59 migration files

⏳ Running: 0001_initial_schema.sql
✅ Success: 0001_initial_schema.sql

⏳ Running: 0044_add_button_config.sql
✅ Success: 0044_add_button_config.sql

...

==================================================
📊 Migration Summary:
✅ Successful: 45
⏭️  Skipped: 14 (already applied)
❌ Errors: 0
==================================================

🎉 All migrations completed successfully!
```

---

## 🌐 Como Configurar Migrations no Vercel (Preview)

### Opção 1: Build Command (Recomendado)

No **Vercel Dashboard**, configure o Build Command para incluir migrations:

1. Vá em **Settings** → **General** → **Build & Development Settings**
2. Modifique o **Build Command** para:

```bash
npm run migrate && npm run build
```

Isso irá rodar as migrations **antes** de cada build no Preview.

### Opção 2: Script Personalizado

Crie um script `scripts/vercel-build.sh`:

```bash
#!/bin/bash
set -e

echo "🗄️ Running database migrations..."
npm run migrate

echo "📦 Building application..."
npm run build

echo "✅ Build complete!"
```

E configure no Vercel:
```bash
bash scripts/vercel-build.sh
```

### Opção 3: Middleware de Migração

Se preferir migrations automáticas no runtime (não recomendado para produção), você pode criar um middleware que executa migrations na primeira request.

---

## 🔍 Verificar Migrations Pendentes

Para ver quais migrations ainda não foram aplicadas, você pode executar:

```bash
npm run migrate -- --dry-run
```

(Nota: Isso requer adicionar suporte para `--dry-run` no script)

---

## 📝 Criar Novas Migrations

### 1. Gerar Migration com Drizzle

```bash
npm run migrations
```

Isso gera uma nova migration baseada nas mudanças no schema.

### 2. Criar Migration Manual

Crie um arquivo SQL em `src/migrations/`:

```sql
-- Migration: Add new column
-- Date: YYYY-MM-DD

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS new_field TEXT;

-- Add index if needed
CREATE INDEX IF NOT EXISTS idx_projects_new_field 
ON projects (new_field);
```

**Importante**: Use `IF NOT EXISTS` para evitar erros ao re-executar migrations.

---

## 🐛 Troubleshooting

### Erro: "column already exists"

✅ **Isso é esperado!** O script detecta automaticamente e pula migrations já aplicadas.

### Erro: "DATABASE_URL not set"

Configure a variável de ambiente:
```bash
export DATABASE_URL="postgresql://..."
```

### Erro: "permission denied"

Verifique se o usuário do banco tem permissões para executar `ALTER TABLE`.

### Preview Environments Usam Banco Separado?

**Sim!** Cada Preview Environment no Vercel pode usar:
- Um banco de dados compartilhado (mesma URL)
- Um banco de dados por branch (URLs diferentes)

Verifique as configurações em **Vercel Dashboard** → **Storage**.

---

## 📊 Estrutura de Migrations

```
src/migrations/
├── 0001_initial_schema.sql
├── 0002_add_user_fields.sql
├── ...
└── 0044_add_button_config.sql  ← Migration atual
```

As migrations são executadas em **ordem alfabética/numérica**.

---

## 🔐 Segurança

- ✅ Use `IF NOT EXISTS` para evitar erros de re-execução
- ✅ Sempre faça backup antes de rodar migrations em produção
- ✅ Teste migrations em ambientes de staging primeiro
- ❌ Nunca execute migrations SQL sem revisar primeiro

---

## 📚 Recursos Adicionais

- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Neon Database Docs](https://neon.tech/docs)
- [Vercel Build Configuration](https://vercel.com/docs/build-configuration)

---

## 🎯 Resumo Rápido

**Para rodar migrations localmente:**
```bash
npm run migrate
```

**Para configurar no Vercel Preview:**
```bash
# Build Command no Vercel Dashboard:
npm run migrate && npm run build
```

**Em caso de erro "column does not exist":**
1. Execute `npm run migrate` no ambiente afetado
2. Ou configure o Build Command no Vercel para incluir migrations

