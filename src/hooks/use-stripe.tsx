import { useUser } from "@clerk/nextjs";

export function useStripeCustom() {
  const { user, isLoaded } = useUser();
  
  // Get user's Stripe subscription data from Clerk metadata
  const userPlan = user?.unsafeMetadata?.stripe?.subscriptionId || null;
  const subscriptionStatus = user?.unsafeMetadata?.stripe?.status || null;
  const subscriptionActive = user?.unsafeMetadata?.stripe?.subscriptionActive || false;
  const customerId = user?.unsafeMetadata?.stripe?.customerId || null;

  const fetchPlans = async () => {
    try {
      const response = await fetch("/api/stripe/plans");
      if (!response.ok) {
        throw new Error("Failed to fetch plans");
      }
      const { plans } = await response.json();

      return plans;
    } catch (err) {
      console.error("Failed to load pricing plans:", err);
    }
  };

  const fetchSubscription = async () => {
    try {
      const response = await fetch("/api/stripe/subscription", {
        method: "POST",
        body: JSON.stringify({
          subscriptionId: userPlan,
          customerId: customerId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch plans");
      }
      return response.json();
    } catch (err) {
      console.error("Failed to load pricing plans:", err);
    }
  };

  return {
    userPlan,
    subscriptionStatus,
    subscriptionActive,
    customerId,
    isLoaded,
    fetchPlans,
    fetchSubscription,
  };
}
