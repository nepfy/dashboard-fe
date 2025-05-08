import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserAccount, UserState } from "#/types/userAccount";

async function fetchUserDataFromServer() {
  try {
    const response = await fetch("/api/user-account", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

async function updateUserDataOnServer(data: Partial<UserAccount>) {
  try {
    const response = await fetch("/api/user-account", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error;
  }
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userData: null,
      isLoading: false,
      error: null,

      fetchUserData: async () => {
        try {
          set({ isLoading: true, error: null });
          const result = await fetchUserDataFromServer();

          if (result.success) {
            set({ userData: result.data, isLoading: false });
          } else {
            set({ error: result.error, isLoading: false });
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : String(error),
            isLoading: false,
          });
        }
      },

      clearUserData: () => {
        set({ userData: null, error: null });
      },

      updateUserData: async (data: Partial<UserAccount>) => {
        try {
          set({ isLoading: true, error: null });
          const result = await updateUserDataOnServer(data);

          if (result.success) {
            set((state: UserState) => ({
              userData: state.userData ? { ...state.userData, ...data } : null,
              isLoading: false,
            }));
          } else {
            set({ error: result.error, isLoading: false });
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : String(error),
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "user-storage",
      partialize: (state: UserState) => ({ userData: state.userData }),
    }
  )
);
