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
        setMessage("ACCESS GRANTED. YOU'RE ON THE SECURE LIST.");
        setEmail("");
        return;
      }

      const { error } = await supabase
        .from('waitlist')
        .insert([{ email }]);

      if (error) {
        if (error.code === '23505') { // Unique violation
          throw new Error("THIS CREDENTIAL IS ALREADY REGISTERED.");
        }
        throw error;
      }

      setStatus("success");
      setMessage("ACCESS GRANTED. YOU'RE ON THE SECURE LIST.");
      setEmail("");
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setMessage(err.message || "SYSTEM ERROR. PLEASE TRY AGAIN.");
    }
  };

  return (
    <section id="waitlist" className="py-32 px-6 relative bg-bg">
      <div className="max-w-xl mx-auto text-center space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-block px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            Terminal Access
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-4">Secure Your <span className="text-accent">Beta Slot</span></h2>
          <p className="text-text-muted text-lg">
            Founding member registration is currently limited. Provide your credentials to secure priority vault access.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="relative max-w-md mx-auto">
          <div className="relative group">
            <div className="absolute -inset-2 blur-2xl bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ENTER EMAIL ADDRESS"
              disabled={status === "loading" || status === "success"}
              className="relative w-full bg-[#0d0d12] border-2 border-white/10 rounded-2xl py-6 pl-8 pr-16 text-white font-mono placeholder:text-text-dim focus:outline-none focus:border-accent/50 focus:ring-8 focus:ring-accent/5 transition-all disabled:opacity-50 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            />
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="absolute right-3 top-3 bottom-3 bg-accent text-white rounded-xl px-6 flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer shadow-lg overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform" />
              {status === "loading" ? (
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span className="relative z-10 font-black text-xs uppercase tracking-widest">Submit</span>
              )}
            </button>
          </div>
        </form>

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`p-6 rounded-xl text-xs font-black tracking-widest ${status === "success"
                ? "bg-accent/10 text-accent border-2 border-accent/20 shadow-[0_0_30px_rgba(255,45,149,0.1)]"
                : "bg-error/10 text-error border-2 border-error/20"
                }`}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="pt-8 flex items-center justify-center gap-8 opacity-30 grayscale">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white">Encrypted</div>
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white">Vaulted-SSL</div>
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white">No Spam</div>
        </div>
      </div>
    </section>
  );
}
