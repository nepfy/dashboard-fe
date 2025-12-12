# 🎨 Guia Rápido: Validação Visual do Template Minimal

## 🚀 Início Rápido

### 1. Gerar uma proposta para testar

```bash
# Inicie o servidor dev
npm run dev

# Em outro terminal, gere uma proposta de teste
npm run test-minimal:designer
```

Isso criará um arquivo JSON em `test-output/` com a proposta gerada.

### 2. Abrir a proposta no editor

Depois de gerar a proposta, você verá no output algo como:

```
✅ Minimal proposal generated successfully
📝 Project ID: 0a0a367d-a7d8-4a69-8749-cd2dd32a8a69
```

Use esse ID para abrir no navegador:

```bash
# Com o servidor rodando, navegue para:
http://localhost:3000/editar?projectId=0a0a367d-a7d8-4a69-8749-cd2dd32a8a69&templateType=minimal
```

**Formato da URL:**
```
http://localhost:3000/editar?projectId={PROJECT_ID}&templateType=minimal
```

### 3. Comparar visualmente

**Opção A: Comparação Manual**

1. Abra dois navegadores/abas lado a lado:
   - **Esquerda**: https://empty-studio.webflow.io/
   - **Direita**: http://localhost:3000/editar?projectId={YOUR_PROJECT_ID}&templateType=minimal

2. Use o checklist em `e2e/VISUAL_COMPARISON_CHECKLIST.md`

3. Vá seção por seção verificando:
   - ✅ Layout correto
   - ✅ Espaçamento adequado
   - ✅ Tipografia consistente
   - ✅ Grid alinhado

**Opção B: Testes Automatizados**

```bash
# Executar testes visuais automatizados
npm run test:e2e:visual:headed
```

Isso abrirá o navegador e executará validações automáticas.

---

## 🎯 Pontos Críticos de Validação

### 1. Hero Section ✨

**O que verificar:**
- [ ] Título grande e impactante (48px+)
- [ ] Nome do cliente com avatar
- [ ] Linha horizontal separadora
- [ ] Data da proposta bem posicionada
- [ ] Botão de CTA visível

**Exemplo Empty Studio:**
```
Hello, Jesse —
━━━━━━━━━━━━━━━━

Focus on the Aurore product growing while we cover 
the brand design and web development services.

Proposal — June 22, 2025
```

### 2. Clients Section Header 🤝 **[MAIS IMPORTANTE]**

**Layout esperado:**
```
┌────────────────────────────────┬──────────────────┐
│ TÍTULO LONGO                   │                  │
│ We recognized a gap in the     │                  │
│ creative industry—small        │ PARÁGRAFOS       │
│ businesses often struggle...   │ (alinhados em    │
│                                │  baixo)          │
└────────────────────────────────┴──────────────────┘
```

**O que verificar:**
- [ ] Grid 2x2 assimétrico
- [ ] Coluna esquerda mais larga (60%)
- [ ] Título com 3-4 linhas (150+ chars)
- [ ] 2 parágrafos na direita, alinhados em baixo
- [ ] 12 logos de clientes abaixo

**Como inspecionar:**
```javascript
// No console do navegador:
const grid = document.querySelector('.partners-header-grid');
console.log(window.getComputedStyle(grid).gridTemplateColumns);
// Esperado: "1.6fr 1fr" ou similar
```

### 3. About Us Images 🖼️

**O que verificar:**
- [ ] 2 imagens lado a lado
- [ ] Primeira: mais larga (16:9)
- [ ] Segunda: mais alta (9:16, altura ~10% menor)
- [ ] Captions abaixo das imagens
- [ ] Grid simétrico (1fr 1fr)

### 4. Expertise Grid 💎

**O que verificar:**
- [ ] 3 colunas no desktop
- [ ] Cada tópico: ícone + título + descrição (120+ chars)
- [ ] Espaçamento generoso (32-48px gap)
- [ ] Descrições completas e profissionais

---

## 🔍 Ferramentas Úteis

### Browser DevTools

**Inspecionar grid:**
```javascript
// Cole no console do navegador
const inspect = (selector) => {
  const el = document.querySelector(selector);
  const styles = window.getComputedStyle(el);
  console.log({
    display: styles.display,
    gridTemplateColumns: styles.gridTemplateColumns,
    gap: styles.gap,
    padding: `${styles.paddingTop} ${styles.paddingBottom}`,
    fontSize: styles.fontSize,
  });
};

// Exemplos:
inspect('.partners-header-grid');
inspect('.about-content');
inspect('.expertise-grid');
```

**Medir tamanhos:**
```javascript
const measure = (selector) => {
  const el = document.querySelector(selector);
  const box = el.getBoundingBox();
  console.log({
    width: box.width,
    height: box.height,
    aspectRatio: (box.width / box.height).toFixed(2),
  });
};

measure('.about-item:nth-child(1)');
measure('.about-item:nth-child(2)');
```

### Extensões Recomendadas

- **WhatFont**: Ver fontes usadas
- **PixelSnap**: Medir distâncias
- **Page Ruler**: Medir elementos
- **ColorZilla**: Pegar cores

---

## 📝 Workflow Recomendado

### Passo 1: Geração
```bash
npm run test-minimal:designer
```

### Passo 2: Inspeção Rápida
```bash
# Pegue o projectId do output do teste
# Abra a proposta gerada
open "http://localhost:3000/editar?projectId=0a0a367d-a7d8-4a69-8749-cd2dd32a8a69&templateType=minimal"

# Verificação rápida (2 min):
✓ Todas as seções aparecem?
✓ Textos não estão vazios?
✓ Layout não está quebrado?
```

### Passo 3: Validação Detalhada
```bash
# Execute testes automatizados
npm run test:e2e:visual:headed

# OU use o checklist manual
open e2e/VISUAL_COMPARISON_CHECKLIST.md
```

### Passo 4: Ajustes
```
Se encontrar problemas:

1. Layout incorreto?
   → Editar: src/app/editar/modules/minimal/[Section]/index.tsx

2. Conteúdo muito curto?
   → Editar: src/modules/ai-generator/config/template-prompts.ts

3. Validação falhando?
   → Editar: src/modules/ai-generator/themes/minimal.ts

4. Re-testar:
   npm run test-minimal:designer
```

---

## 🎯 Critérios de Sucesso

**A proposta está pronta quando:**

✅ **Layout**: 90%+ do checklist completo  
✅ **Conteúdo**: Textos completos e profissionais (sem fallbacks)  
✅ **Tipografia**: Tamanhos e espaçamentos adequados  
✅ **Grid**: Clients header em 2x2 assimétrico correto  
✅ **Responsive**: Funciona em mobile/tablet  
✅ **Visual**: Se parece com https://empty-studio.webflow.io/

---

## 🐛 Troubleshooting

### "Proposta não carrega"
```bash
# Verifique se o projeto existe no banco
npm run list-db-agents

# Verifique se o dev server está rodando
curl http://localhost:3000
```

### "Layout quebrado"
```
1. Limpe o cache do navegador (Cmd+Shift+R)
2. Verifique o console por erros
3. Inspecione o elemento com DevTools
4. Compare CSS com Empty Studio
```

### "Conteúdo vazio ou genérico"
```bash
# Re-gere a proposta
npm run test-minimal:designer

# Verifique os logs do terminal
# Procure por "❌ VALIDATION FAILED" ou "willUseFallback: true"
```

### "Testes falhando"
```bash
# Execute em modo debug
npm run test:e2e:debug

# Ou com navegador visível
npm run test:e2e:visual:headed
```

---

## 📚 Referências

- [Empty Studio (referência)](https://empty-studio.webflow.io/)
- [Checklist detalhado](./VISUAL_COMPARISON_CHECKLIST.md)
- [Documentação E2E](./README.md)
- [Setup completo](../E2E_SETUP.md)

