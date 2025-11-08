#!/bin/bash
# Script para sincronizar usuários do Clerk para o banco de dados

echo "🔄 Sincronizando usuários do Clerk..."
curl -X POST https://staging-app.nepfy.com/api/sync/clerk-users

echo -e "\n\n✅ Sincronização completa!"
echo "Agora teste o dashboard: https://staging-app.nepfy.com/dashboard"

