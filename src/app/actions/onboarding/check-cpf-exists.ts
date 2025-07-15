"use server";

import { db } from "#/lib/db";
import { personUserTable } from "#/lib/db/schema/users";
import { eq } from "drizzle-orm";

/**
 * Check if a CPF already exists in the database
 * @param cpf - The CPF to check (will be cleaned of any formatting)
 * @returns Promise<{ exists: boolean; error?: string }>
 */
export async function checkCPFExists(cpf: string) {
  try {
    const cleanCPF = cpf.replace(/\D/g, "");

    // Validate that CPF has 11 digits
    if (cleanCPF.length !== 11) {
      return {
        exists: false,
        error: "CPF deve conter 11 dígitos",
      };
    }

    const existingUser = await db
      .select({ id: personUserTable.id })
      .from(personUserTable)
      .where(eq(personUserTable.cpf, cleanCPF))
      .limit(1);

    return {
      exists: existingUser.length > 0,
    };
  } catch (error) {
    console.error("Error checking CPF:", error);
    return {
      exists: false,
      error: "Erro ao verificar CPF. Tente novamente.",
    };
  }
}
