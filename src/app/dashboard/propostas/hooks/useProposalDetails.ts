import { useState, useEffect } from "react";

interface Adjustment {
  id: string;
  type: string;
  description: string;
  clientName?: string;
  requestedBy?: string;
  status: string;
  createdAt: Date | string;
}

interface Acceptance {
  id: string;
  chosenPlan?: string;
  chosenPlanValue?: string;
  clientName?: string;
  acceptedBy?: string;
  createdAt: Date | string;
}

interface UseProposalDetailsResult {
  adjustments: Adjustment[];
  acceptance: Acceptance | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProposalDetails(projectId: string | null): UseProposalDetailsResult {
  const [adjustments, setAdjustments] = useState<Adjustment[]>([]);
  const [acceptance, setAcceptance] = useState<Acceptance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = async () => {
    if (!projectId) {
      setAdjustments([]);
      setAcceptance(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch adjustments
      const adjustmentsResponse = await fetch(
        `/api/projects/${projectId}/adjustments`
      );
      if (adjustmentsResponse.ok) {
        const adjustmentsData = await adjustmentsResponse.json();
        setAdjustments(adjustmentsData.adjustments || []);
      }

      // Fetch acceptance
      const acceptanceResponse = await fetch(
        `/api/projects/${projectId}/acceptance`
      );
      if (acceptanceResponse.ok) {
        const acceptanceData = await acceptanceResponse.json();
        setAcceptance(acceptanceData.acceptance || null);
      }
    } catch (err) {
      console.error("Error fetching proposal details:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return {
    adjustments,
    acceptance,
    isLoading,
    error,
    refetch: fetchDetails,
  };
}

