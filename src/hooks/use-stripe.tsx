import { UserResource } from "@clerk/types";

export function useStripeCustom(user?: UserResource) {
  const { publicMetadata } = user || {};

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
          subscriptionId: (
            publicMetadata?.stripe as { subscriptionId?: string }
          )?.subscriptionId,
          customerId: (publicMetadata?.stripe as { customerId?: string })
            ?.customerId,
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

  const userPlan = user && user.unsafeMetadata.priceId;

  return {
    userPlan,
    fetchPlans,
    fetchSubscription,
  };
}
