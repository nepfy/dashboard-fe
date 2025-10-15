import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

async function testProposalData() {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    console.log("🧪 Testando sistema de proposal_data...\n");

    // Verificar se a coluna existe
    console.log("1️⃣ Verificando se a coluna proposal_data existe...");
    const columns = await sql`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'projects' AND column_name = 'proposal_data'
    `;

    if (columns.length > 0) {
      console.log("   ✅ Coluna proposal_data encontrada!");
      console.log(`   📝 Tipo: ${columns[0].data_type}`);
      console.log(`   📝 Nullable: ${columns[0].is_nullable}`);
    } else {
      console.log("   ❌ Coluna proposal_data NÃO encontrada!");
      return;
    }

    // Verificar se o índice existe
    console.log("\n2️⃣ Verificando se o índice GIN existe...");
    const indexes = await sql`
      SELECT indexname, indexdef 
      FROM pg_indexes 
      WHERE tablename = 'projects' AND indexname = 'idx_projects_proposal_data'
    `;

    if (indexes.length > 0) {
      console.log("   ✅ Índice GIN encontrado!");
      console.log(`   📝 ${indexes[0].indexdef}`);
    } else {
      console.log("   ⚠️  Índice GIN não encontrado (mas não é crítico)");
    }

    // Verificar projetos existentes
    console.log("\n3️⃣ Verificando projetos existentes...");
    const projects = await sql`
      SELECT id, project_name, proposal_data 
      FROM projects 
      LIMIT 3
    `;

    console.log(`   📊 Total de projetos (sample): ${projects.length}`);
    projects.forEach((project, index) => {
      console.log(
        `   ${index + 1}. ${project.project_name} - proposal_data: ${
          project.proposal_data
            ? Object.keys(project.proposal_data).length + " seções"
            : "vazio"
        }`
      );
    });

    console.log("\n✅ Teste concluído com sucesso!");
    console.log("\n🚀 Sistema pronto para uso:");
    console.log("   - Gere uma nova proposta pela UI");
    console.log("   - Os dados serão salvos em proposal_data automaticamente");
    console.log("   - Use os novos endpoints da API:");
    console.log("     • GET /api/projects/:id/proposal");
    console.log("     • PUT /api/projects/:id/proposal");
    console.log("     • PATCH /api/projects/:id/proposal");
  } catch (error) {
    console.error("❌ Erro ao testar:", error);
    process.exit(1);
  }
}

testProposalData();
