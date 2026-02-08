import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { WAITLIST_TOTAL_SPOTS } from "../data/vaults";

export function useWaitlist() {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCount = useCallback(async () => {
    try {
      const { count: total, error: queryError } = await supabase
        .from("waitlist")
        .select("*", { count: "exact", head: true });

      if (queryError) throw queryError;
      setCount(total ?? 0);
    } catch {
      // Silently fail count fetch — page still works
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 30_000);
    return () => clearInterval(interval);
  }, [fetchCount]);

  const submit = async (email: string) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from("waitlist")
        .insert({ email: email.toLowerCase().trim() });

      if (insertError) {
        if (insertError.code === "23505") {
          setError("This email is already on the waitlist!");
        } else {
          throw insertError;
        }
        return false;
      }

      setIsSuccess(true);
      await fetchCount();
      return true;
    } catch {
      setError("Something went wrong. Please try again.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    count,
    spotsRemaining: Math.max(0, WAITLIST_TOTAL_SPOTS - count),
    isLoading,
    isSubmitting,
    isSuccess,
    error,
    submit,
    resetForm: () => {
      setIsSuccess(false);
      setError(null);
    },
  };
}
