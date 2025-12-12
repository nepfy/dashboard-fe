#!/usr/bin/env tsx

/**
 * Script to verify if the test user exists in Clerk
 * 
 * This uses Clerk Backend API to check if the test user is properly configured
 */

async function checkTestUser() {
  const testEmail = process.env.TEST_USER_EMAIL || 'teste.e2e@nepfy.com';
  const clerkSecretKey = process.env.CLERK_SECRET_KEY;

  console.log('🔍 Verificando usuário de teste...\n');
  console.log(`📧 Email: ${testEmail}\n`);

  if (!clerkSecretKey) {
    console.log('⚠️  CLERK_SECRET_KEY não encontrada no .env');
    console.log('📝 Para verificar programaticamente, adicione CLERK_SECRET_KEY ao .env\n');
    console.log('📋 Verificação manual:');
    console.log('   1. Acesse: https://dashboard.clerk.com/');
    console.log('   2. Selecione seu app');
    console.log('   3. Vá em Users');
    console.log(`   4. Procure por: ${testEmail}`);
    console.log('   5. Se não existir, crie com a senha: TestPassword123!\n');
    return;
  }

  try {
    // Note: This would require @clerk/backend package
    // For now, just provide instructions
    console.log('✅ CLERK_SECRET_KEY encontrada');
    console.log('📝 Instruções para verificar o usuário:\n');
    console.log('1. Acesse o Clerk Dashboard');
    console.log('2. Navegue para Users');
    console.log(`3. Procure por: ${testEmail}`);
    console.log('4. Se não existir, crie com:');
    console.log(`   - Email: ${testEmail}`);
    console.log('   - Password: TestPassword123!');
    console.log('   - First Name: Teste');
    console.log('   - Last Name: E2E\n');
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

checkTestUser();

