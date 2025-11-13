"use server";

import { currentUser } from "@clerk/nextjs/server";
import { eq, or } from "drizzle-orm";

import { db } from "#/lib/db";
import { personUserTable } from "#/lib/db/schema/users";

const truncate = (str: string, maxLength = 254) => {
  if (!str) return "";
  return str.substring(0, maxLength);
};

export async function saveUserData(formData: FormData) {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    const userEmail = user.emailAddresses[0]?.emailAddress || "";
    const clerkUserId = user.id;

    const fullName = formData.get("fullName") as string;
    const userName = formData.get("userName") as string;
    const cpf = (formData.get("cpf") as string).replace(/\D/g, "");
    const phone = (formData.get("phone") as string).replace(/\D/g, "");
    const jobTypeStr = formData.get("jobType") as string;
    const discoverySourceStr = formData.get("discoverySource") as string;
    const usedBeforeStr = formData.get("usedBefore") as string;

    const nameParts = fullName.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    const jobTypeId = parseInt(jobTypeStr.split(",")[0]) || null;
    const discoverySourceId =
      parseInt(discoverySourceStr.split(",")[0]) || null;
    const usedBeforeId = parseInt(usedBeforeStr) || null;

    // Check if CPF or userName are already in use by OTHER users
    const existingUser = await db
      .select()
      .from(personUserTable)
      .where(
        or(eq(personUserTable.cpf, cpf), eq(personUserTable.userName, userName))
      )
      .limit(1);

    if (existingUser.length > 0 && existingUser[0].clerkUserId !== clerkUserId) {
      if (existingUser[0].cpf === cpf) {
        throw new Error("CPF já cadastrado");
      }
      if (existingUser[0].userName === userName) {
        throw new Error("Nome de usuário já está em uso");
      }
    }

    // Check if user already exists in our database (created by webhook)
    const currentUserInDb = await db
      .select()
      .from(personUserTable)
      .where(eq(personUserTable.clerkUserId, clerkUserId))
      .limit(1);

    let userId: string;

    if (currentUserInDb.length > 0) {
      // Update existing user with onboarding data
      const updateResult = await db
        .update(personUserTable)
        .set({
          firstName: truncate(firstName),
          lastName: truncate(lastName),
          userName: truncate(userName),
          cpf: truncate(cpf),
          phone: truncate(phone),
          updated_at: new Date(),
          userJobType: jobTypeId,
          userDiscovery: discoverySourceId,
          userUsedBefore: usedBeforeId,
        })
        .where(eq(personUserTable.clerkUserId, clerkUserId))
        .returning({ id: personUserTable.id });

      userId = updateResult[0]?.id;
    } else {
      // Fallback: Create user if webhook didn't create it yet
      const insertResult = await db
        .insert(personUserTable)
        .values({
          clerkUserId,
          firstName: truncate(firstName),
          lastName: truncate(lastName),
          userName: truncate(userName),
          cpf: truncate(cpf),
          phone: truncate(phone),
          email: truncate(userEmail),
          created_at: new Date(),
          updated_at: new Date(),
          userJobType: jobTypeId,
          userDiscovery: discoverySourceId,
          userUsedBefore: usedBeforeId,
        })
        .returning({ id: personUserTable.id });

      userId = insertResult[0]?.id;
    }

    return {
      success: true,
      userId,
      message: "Dados salvos com sucesso",
    };
  } catch (error) {
    return {
      success: false,
      error: `Ocorreu um erro ao salvar os dados. ${error}`,
    };
  }
}
