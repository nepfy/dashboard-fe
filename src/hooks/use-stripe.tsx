export function useStripeCustom() {
  // For now, return null as userPlan until Stripe integration is complete
  // This will be replaced with real user data from webhooks
  const userPlan = null;

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
          subscriptionId: null,
          customerId: null,
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
    fetchPlans,
    fetchSubscription,
  };
}
