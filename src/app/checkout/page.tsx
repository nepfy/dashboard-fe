"use client";

import { useAuth } from "@clerk/nextjs";

export default function Checkout() {
  const { userId, sessionId, isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <div>Sign in to view this page</div>;
  }

  return (
    <h1>
      {userId}, your current {sessionId}{" "}
    </h1>
  );
}
