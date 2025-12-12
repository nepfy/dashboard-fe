# E2E Testing with Playwright

Este diretório contém os testes end-to-end (E2E) para a aplicação Nepfy usando Playwright.

## 📋 Pré-requisitos

### 1. Instalar dependências

```bash
npm install
```

### 2. Criar usuário de teste no Clerk

Você precisa criar um usuário de teste no Clerk Dashboard:

1. Acesse [Clerk Dashboard](https://dashboard.clerk.com/)
2. Selecione seu aplicativo
3. Navegue para **Users** no menu lateral
4. Clique em **Create User**
5. Preencha os dados:
   - **Email**: `teste.e2e@nepfy.com`
   - **Password**: `TestPassword123!`
   - **First Name**: `Teste`
   - **Last Name**: `E2E`
6. Clique em **Create**

**⚠️ Importante**: Anote o `User ID` gerado pelo Clerk (começa com `user_...`).

### 3. Configurar variáveis de ambiente (Opcional)

Se quiser usar credenciais diferentes, crie um arquivo `.env.test`:

```env
TEST_USER_EMAIL=teste.e2e@nepfy.com
TEST_USER_PASSWORD=TestPassword123!
TEST_USER_ID=user_xxxxxxxxxxxxx
PLAYWRIGHT_BASE_URL=http://localhost:3000
```

**Nota**: O arquivo `.env.test` não é commitado no git por segurança.

## 🚀 Executar testes

### Executar todos os testes (headless)

```bash
npm run test:e2e
```

### Executar testes com UI interativa

```bash
npm run test:e2e:ui
```

### Executar testes em modo debug

```bash
npm run test:e2e:debug
```

### Executar testes com navegador visível

```bash
npm run test:e2e:headed
```

### Executar um teste específico

```bash
npx playwright test minimal-template.spec.ts
```

### Executar um teste específico em modo debug

```bash
npx playwright test minimal-template.spec.ts --debug
```

## 📁 Estrutura

```
e2e/
├── fixtures/
│   └── auth.fixture.ts          # Fixture de autenticação
├── minimal-template.spec.ts     # Testes de geração do template Minimal
├── minimal-content-quality.spec.ts  # Testes de qualidade do conteúdo
└── README.md                    # Este arquivo
```

## 🧪 Testes disponíveis

### `minimal-template.spec.ts`
Testa a geração de propostas com o template Minimal para diferentes serviços:
- Designer
- Arquitetura
- Fotografia

### `minimal-content-quality.spec.ts`
Testa a qualidade do conteúdo gerado pela IA:
- Seção de Clientes: título longo e descritivo, parágrafos completos, 12 logos
- Seção de Expertise: tópicos com descrições completas (mínimo 120 caracteres)

### `minimal-visual-validation.spec.ts`
Valida o layout visual comparando com a referência Empty Studio:
- Hero section: navbar, título, cliente, data
- About Us: grid de imagens com aspect ratios diferentes
- Clients: header em grid 2x2 assimétrico (CRÍTICO)
- Expertise: grid de tópicos com ícones e descrições
- Typography e spacing corretos

### `VISUAL_COMPARISON_CHECKLIST.md`
Checklist manual detalhado para comparação visual:
- Análise seção por seção
- Medidas específicas (font sizes, spacing, grid columns)
- Comparação lado a lado com Empty Studio
- Critérios de sucesso claros

## 🐛 Debug

Se um teste falhar, você pode:

1. Ver os screenshots na pasta `test-results/`
2. Ver o relatório HTML:
   ```bash
   npx playwright show-report
   ```
3. Executar em modo debug:
   ```bash
   npm run test:e2e:debug
   ```

## ⚡ Dicas

- Os testes são executados sequencialmente (`fullyParallel: false`) para evitar conflitos
- O servidor de desenvolvimento é iniciado automaticamente pelo Playwright
- Screenshots são tirados apenas em caso de falha
- Traces são gravados apenas na primeira tentativa de retry

## 🔒 Segurança

- **Nunca commite** credenciais reais no código
- Use um usuário de teste dedicado
- Considere usar o [Clerk Testing Tokens](https://clerk.com/docs/testing/overview) para CI/CD

