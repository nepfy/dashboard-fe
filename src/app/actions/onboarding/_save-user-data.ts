"use server";

import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { db } from "#/lib/db";
import { personUserTable } from "#/lib/db/schema/users";

const truncate = (str: string, maxLength = 254) => {
  if (!str) return "";
  return str.substring(0, maxLength);
};

export async function saveUserData(formData: FormData) {
  try {
    const user = await currentUser();

    const userEmail = user?.emailAddresses[0]?.emailAddress || "";

    const fullName = formData.get("fullName") as string;
    const cpf = formData.get("cpf") as string;
    const phone = formData.get("phone") as string;
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

    const existingUser = await db
      .select()
      .from(personUserTable)
      .where(eq(personUserTable.cpf, cpf))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error("CPF já cadastrado");
    }

    const insertResult = await db
      .insert(personUserTable)
      .values({
        firstName: truncate(firstName),
        lastName: truncate(lastName),
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

    return {
      success: true,
      userId: insertResult[0]?.id,
      message: "Dados salvos com sucesso",
    };
  } catch (error) {
    return {
      success: false,
      error: `Ocorreu um erro ao salvar os dados. ${error}`,
    };
  }
}
