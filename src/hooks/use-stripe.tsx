import { useUser } from "@clerk/nextjs";

// Define the structure of Stripe metadata in Clerk user metadata
interface StripeMetadata {
  subscriptionId?: string;
  subscriptionType?: string;
  subscriptionActive?: boolean;
  subscriptionDate?: string;
  customerId?: string;
  status?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  canceledAt?: string | null;
  trialStart?: string | null;
  trialEnd?: string | null;
}

interface UserMetadata {
  stripe?: StripeMetadata;
}

export function useStripeCustom() {
  const { user, isLoaded } = useUser();

  // Helper function to parse stripe metadata (handles both object and JSON string)
  const getStripeMetadata = (): StripeMetadata | null => {
    if (!user?.unsafeMetadata) return null;
    
    const metadata = user.unsafeMetadata as UserMetadata;
    const stripeData = metadata?.stripe;
    
    if (!stripeData) return null;
    
    // If it's already an object, return it
    if (typeof stripeData === "object" && stripeData !== null) {
      return stripeData as StripeMetadata;
    }
    
    // If it's a string, try to parse it as JSON
    if (typeof stripeData === "string") {
      try {
        return JSON.parse(stripeData) as StripeMetadata;
      } catch (error) {
        console.error("Error parsing stripe metadata:", error);
        return null;
      }
    }
    
    return null;
  };

  const stripeMetadata = getStripeMetadata();

  // Get user's Stripe subscription data from Clerk metadata
  const userPlan = stripeMetadata?.subscriptionId || null;
  const subscriptionStatus = stripeMetadata?.status || null;
  const subscriptionActive = stripeMetadata?.subscriptionActive || false;
  const customerId = stripeMetadata?.customerId || null;

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
