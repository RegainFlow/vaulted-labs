export function Footer() {
  return (
    <footer className="border-t border-border bg-surface px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <span className="text-sm font-semibold text-glow-magenta">
          <span className="text-accent">Vaulted</span>Labs
        </span>

        <div className="flex gap-6 text-sm text-text-dim">
          <a href="#" className="transition-colors hover:text-text-muted">
            Terms
          </a>
          <a href="#" className="transition-colors hover:text-text-muted">
            Privacy
          </a>
          <a href="#" className="transition-colors hover:text-text-muted">
            Contact
          </a>
        </div>

        <p className="text-sm text-text-dim">
          &copy; {new Date().getFullYear()} VaultedLabs. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
