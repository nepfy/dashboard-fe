"use client";

import ErrorMessage from "#/components/ErrorMessage";
import { useUserAccount } from "#/hooks/useUserAccount";

export default function Dashboard() {
  const { userData, isLoading, error } = useUserAccount();

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h1>Dashboard</h1>
          {userData && (
            <div>
              <p>
                Welcome, {userData.firstName} {userData.lastName}!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
