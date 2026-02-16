import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useWaitlistCount() {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCount() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        // Initial fetch
        const { count: initialCount, error } = await supabase
          .from("waitlist")
          .select("*", { count: "exact", head: true });

        if (error) throw error;

        if (initialCount !== null) {
          setCount(initialCount);
        }

        // Subscribe to changes
        const channel = supabase
          .channel("schema-db-changes")
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "waitlist"
            },
            () => {
              setCount((prev) => prev + 1);
            }
          )
          .subscribe();

        return () => {
          if (supabase) {
            supabase.removeChannel(channel);
          }
        };
      } catch (err) {
        console.error("Error fetching waitlist count:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCount();
  }, []);

  return { count, loading };
}
