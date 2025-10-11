import { NextRequest, NextResponse } from "next/server";
import { isValidTemplate } from "#/lib/db/helpers/template-tables";

/**
 * ROTA TEMPORÁRIA
 * As rotas de finish ainda estão sendo refatoradas.
 * Por favor, use as rotas legadas por enquanto:
 * - /api/flash/finish
 * - /api/prime/finish
 * - /api/minimal/finish
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ template: string }> }
) {
  const { template } = await params;

  if (!isValidTemplate(template)) {
    return NextResponse.json(
      {
        success: false,
        error: `Template inválido. Templates válidos: flash, prime, minimal`,
      },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      success: false,
      error: `A rota /api/[template]/finish está em refatoração. Use /api/${template}/finish por enquanto.`,
    },
    { status: 501 } // 501 = Not Implemented
  );
}

