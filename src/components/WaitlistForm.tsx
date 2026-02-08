import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useWaitlist } from "../hooks/useWaitlist";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const { isSubmitting, isSuccess, error, submit, resetForm } = useWaitlist();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    const success = await submit(email);
    if (success) setEmail("");
  };

  return (
    <section id="waitlist" className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-md text-center">
        <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
          Join the Waitlist
        </h2>
        <p className="mb-10 text-text-muted">
          Be the first to unbox. Enter your email below.
        </p>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl border border-success/30 bg-success/10 p-8"
            >
              <div className="mb-3 flex justify-center">
                <svg className="h-12 w-12 text-success" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <p className="mb-1 text-lg font-semibold text-success">
                You're on the list!
              </p>
              <p className="mb-4 text-sm text-text-muted">
                We'll be in touch when VaultedLabs launches.
              </p>
              <button
                onClick={resetForm}
                className="cursor-pointer text-sm text-text-dim underline underline-offset-2 transition-colors hover:text-text-muted"
              >
                Sign up another email
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="waitlist-email" className="sr-only">
                Email address
              </label>
              <input
                id="waitlist-email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-lg border border-border bg-surface px-4 py-3 text-text placeholder-text-dim outline-none transition-colors focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/30"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer rounded-lg bg-accent px-6 py-3 font-semibold text-bg transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Joining..." : "Join Waitlist"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 text-sm text-error"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
