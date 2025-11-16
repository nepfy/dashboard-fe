# Como Testar Propostas Localmente com Subdomínios

## Problema

Quando você gera uma proposta em localhost, as URLs estão apontando para staging (`staging-app.nepfy.com`) ao invés de localhost.

## Solução Implementada

O código agora detecta automaticamente quando está rodando em localhost e usa `localhost:3000` como domínio base.

## Configuração Necessária

Para que subdomínios funcionem em localhost, você precisa configurar seu sistema:

### Opção 1: Configurar `/etc/hosts` (Recomendado)

1. Abra o arquivo `/etc/hosts` com permissões de administrador:

```bash
sudo nano /etc/hosts
```

2. Adicione estas linhas:

```
127.0.0.1       localhost
127.0.0.1       clucasalcantara.localhost
127.0.0.1       *.localhost
```

3. Salve o arquivo

4. Reinicie o servidor Next.js:

```bash
npm run dev
```

5. Agora você pode acessar propostas usando URLs como:
   - `http://clucasalcantara.localhost:3000/chas-calmomila`

### Opção 2: Usar `localtest.me` (Mais Simples)

1. Não precisa configurar nada!

2. Use o domínio `localtest.me` que já funciona com wildcards:
   - Acesse: `http://clucasalcantara.localtest.me:3000/chas-calmomila`

3. Para isso funcionar, você precisa ajustar a variável de ambiente:

```env
NEXT_PUBLIC_PROJECT_BASE_DOMAIN=localtest.me:3000
```

### Opção 3: Usar Pathname ao Invés de Subdomínio (Temporário)

Se você não quiser configurar subdomínios, podemos modificar o código para usar pathname em desenvolvimento:

```
http://localhost:3000/project/clucasalcantara/chas-calmomila
```

## Verificação

Após configurar, quando você gerar uma proposta em localhost:

1. A URL gerada deve ser algo como:
   - `http://seu-usuario.localhost:3000/slug-da-proposta`
   - ou `http://seu-usuario.localtest.me:3000/slug-da-proposta`

2. Você deve conseguir acessar a proposta usando essa URL

## Notas Importantes

- **Subdomínios em localhost**: Por padrão, navegadores não resolvem `*.localhost` automaticamente. Você precisa configurar `/etc/hosts` ou usar `localtest.me`.

- **Protocolo HTTP**: Em localhost, o sistema usa `http://` ao invés de `https://` automaticamente.

- **Porta**: Certifique-se de que o servidor está rodando na porta 3000 (ou ajuste conforme necessário).

## Troubleshooting

### Subdomínio não resolve

Se o subdomínio não funcionar:

1. Verifique se `/etc/hosts` está configurado corretamente
2. Limpe o cache do DNS:
   ```bash
   sudo dscacheutil -flushcache  # macOS
   ```
3. Reinicie o navegador completamente

### URL ainda aponta para staging

1. Verifique se `NEXT_PUBLIC_VERCEL_ENV=development` está no `.env.local`
2. Reinicie o servidor Next.js
3. Limpe o cache do navegador
