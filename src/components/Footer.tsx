export function Footer() {
  return (
    <footer className="py-12 border-t border-white/5 bg-bg text-center">
      <div className="mb-4">
        <span className="text-xl font-bold tracking-tighter text-white">
          Vaulted<span className="text-accent">Labs</span>
        </span>
      </div>
      <p className="text-text-dim text-sm">
        &copy; {new Date().getFullYear()} VaultedLabs. All rights reserved.
      </p>
    </footer>
  );
}
