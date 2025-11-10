"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { saveUserData } from "./_save-user-data";

export const completeOnboarding = async (formData: FormData) => {
  const { userId } = await auth();

  if (!userId) {
    return { message: "Usuário não logado" };
  }

  const client = await clerkClient();

  try {
    const dbResult = await saveUserData(formData);

    if (!dbResult.success) {
      return { error: dbResult.error };
    }

    const res = await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
        applicationName: formData.get("applicationName"),
        applicationType: formData.get("applicationType"),
        onboardingProgress: null,
      },
    });
    return { message: res.publicMetadata };
  } catch (err) {
    return {
      error: `Ocorreu um erro ao tentar salvar as informações: ${err}`,
    };
  }
};
