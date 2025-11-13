import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("❌ DATABASE_URL não está definida");
  process.exit(1);
}

const sql = neon(databaseUrl);

async function checkColumn() {
  try {
    const result = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'projects' 
      AND column_name = 'button_config'
    `;
    
    console.log("✅ Verificação da coluna button_config:");
    console.log("Coluna existe:", result.length > 0);
    
    if (result.length > 0) {
      console.log("Detalhes:", JSON.stringify(result[0], null, 2));
    } else {
      console.log("❌ Coluna button_config NÃO existe no banco!");
      console.log("\n🔍 Listando todas as colunas da tabela projects:");
      
      const allColumns = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'projects'
        ORDER BY ordinal_position
      `;
      
      console.log(`\nTotal de colunas: ${allColumns.length}`);
      allColumns.forEach((col: any) => {
        console.log(`  - ${col.column_name} (${col.data_type})`);
      });
    }
  } catch (error) {
    console.error("❌ Erro:", error);
    process.exit(1);
  }
}

checkColumn();

