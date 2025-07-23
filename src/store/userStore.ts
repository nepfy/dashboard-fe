import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { UserAccount, UserState } from "#/types/userAccount";

const STORAGE_KEY = "user-storage";
const LAST_ACTIVITY_KEY = "last-activity-timestamp";
const EXPIRY_TIME = 24 * 60 * 60 * 1000;

const isStorageExpired = () => {
  const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
  if (!lastActivity) return false;

  const lastActivityTime = parseInt(lastActivity, 10);
  const currentTime = Date.now();

  return currentTime - lastActivityTime > EXPIRY_TIME;
};

const updateLastActivity = () => {
  localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
};

const customStorage = {
  getItem: (name: string) => {
    if (isStorageExpired()) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LAST_ACTIVITY_KEY);
      return null;
    }

    updateLastActivity();
    const value = localStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name: string, value: unknown) => {
    updateLastActivity();
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
    localStorage.removeItem(LAST_ACTIVITY_KEY);
  },
};

async function fetchUserDataFromServer() {
  try {
    const response = await fetch("/api/user-account", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.json();
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

    return response.json();
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
            updateLastActivity();
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
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(LAST_ACTIVITY_KEY);
      },

      updateUserData: async (data: Partial<UserAccount>) => {
        try {
          set({ isLoading: true, error: null });
          const result = await updateUserDataOnServer(data);

          if (result.success) {
            set((state: UserState) => ({
              userData: state.userData
                ? { ...state.userData, ...result.data }
                : null,
              isLoading: false,
            }));
            updateLastActivity();
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

      logout: () => {
        set({ userData: null, error: null });
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(LAST_ACTIVITY_KEY);
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => customStorage),
      partialize: (state: UserState) => ({ userData: state.userData }),
    }
  )
);
