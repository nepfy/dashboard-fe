import { useEffect } from "react";
import { useUserStore } from "#/store/userStore";

export function useUserAccount() {
  const {
    userData,
    isLoading,
    error,
    fetchUserData,
    updateUserData,
    clearUserData,
  } = useUserStore();

  useEffect(() => {
    if (!userData && !isLoading && !error) {
      fetchUserData();
    }
  }, [userData, isLoading, error, fetchUserData]);

  return {
    userData,
    isLoading,
    error,
    fetchUserData,
    updateUserData,
    clearUserData,
  };
}
