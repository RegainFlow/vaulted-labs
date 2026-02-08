import { motion } from "motion/react";

export function Navbar() {
  const scrollToWaitlist = () => {
    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <span className="text-xl font-bold tracking-tight text-glow-magenta">
          <span className="text-accent">Vaulted</span>Labs
        </span>
        <button
          onClick={scrollToWaitlist}
          className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg transition-colors hover:bg-accent-hover"
        >
          Join the Waitlist
        </button>
      </div>
    </motion.nav>
  );
}
