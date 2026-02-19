import { useEffect, useState } from "react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const POLL_INTERVAL_MS = 60000;

export function useWaitlistCount() {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const incrementCount = () => setCount((prev) => prev + 1);

  useEffect(() => {
    let isCancelled = false;
    let pollId: number | null = null;

    async function fetchCount() {
      if (!SUPABASE_URL) {
        if (!isCancelled) {
          setLoading(false);
        }
        return;
      }

      try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/waitlist-count`);
        if (!res.ok) {
          throw new Error(`Failed to load waitlist count: ${res.status}`);
        }

        const data = (await res.json()) as { count?: unknown };
        if (!isCancelled && typeof data.count === "number") {
          setCount(data.count);
        }
      } catch (err) {
        console.error("Error fetching waitlist count:", err);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    fetchCount();

    if (SUPABASE_URL) {
      pollId = window.setInterval(fetchCount, POLL_INTERVAL_MS);
    }

    return () => {
      isCancelled = true;
      if (pollId !== null) {
        window.clearInterval(pollId);
      }
    };
  }, []);

  return { count, loading, incrementCount };
}
