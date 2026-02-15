import { FeedbackButton } from "./FeedbackButton";

export function Footer() {
  return (
    <footer className="py-12 border-t border-white/5 bg-bg text-center">
      <div className="mb-4">
        <span className="text-xl font-bold tracking-tighter text-white">
          Vaulted<span className="text-accent">Labs</span>
        </span>
      </div>
      <FeedbackButton className="text-sm text-text-muted hover:text-accent transition-colors underline underline-offset-4 mb-4 inline-block cursor-pointer" />
      <p className="text-text-dim text-sm">
        &copy; {new Date().getFullYear()} VaultedLabs. All rights reserved.
      </p>
    </footer>
  );
}
