import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "../lib/supabase";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      if (!supabase) {
        // Mock success
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStatus("success");
        setMessage("Welcome to the vault. You're on the list.");
        setEmail("");
        return;
      }

      const { error } = await supabase
        .from('waitlist')
        .insert([{ email }]);

      if (error) {
        if (error.code === '23505') { // Unique violation
          throw new Error("This email is already registered.");
        }
        throw error;
      }

      setStatus("success");
      setMessage("Welcome to the vault. You're on the list.");
      setEmail("");
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setMessage(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <section id="waitlist" className="py-24 px-6 relative">
      <div className="max-w-xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4">Secure Your Access</h2>
          <p className="text-text-muted">
            Be among the first to experience the future of digital collecting.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="relative max-w-sm mx-auto">
          <div className="relative group">
            <div className="absolute -inset-1 blur-md bg-gradient-to-r from-accent to-purple-600 opacity-25 group-hover:opacity-50 transition-opacity" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={status === "loading" || status === "success"}
              className="relative w-full bg-bg border border-white/10 rounded-full py-4 pl-6 pr-14 text-white placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="absolute right-2 top-2 bottom-2 bg-white/5 hover:bg-accent text-white rounded-full w-10 h-10 flex items-center justify-center transition-all disabled:opacity-50 cursor-pointer border border-white/5"
            >
              {status === "loading" ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </div>
        </form>

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-lg text-sm font-medium ${status === "success"
                ? "bg-accent/10 text-accent border border-accent/20"
                : "bg-error/10 text-error border border-error/20"
                }`}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
