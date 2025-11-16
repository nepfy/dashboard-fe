export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Removed server-side redirect to prevent infinite loop
  // The onboarding page handles redirects client-side using the API
  // which checks both onboardingComplete and hasPersonRecord
  return <>{children}</>;
}
