"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export const completeOnboarding = async (formData: FormData) => {
  const { userId } = await auth();

  if (!userId) {
    return { message: "Usuário não logado" };
  }

  const client = await clerkClient();

  try {
    const res = await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
        applicationName: formData.get("applicationName"),
        applicationType: formData.get("applicationType"),
      },
    });
    return { message: res.publicMetadata };
  } catch (err) {
    return {
      error: "Ocorreu um erro ao tentar atualizar as informações do usuário:",
      err,
    };
  }
};
