import { VAULTS } from "../data/vaults";
import { VaultCard } from "./VaultCard";

export function VaultTiers() {
  return (
    <section className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-4 text-center text-3xl font-bold sm:text-4xl">
          Choose Your Vault
        </h2>
        <p className="mx-auto mb-14 max-w-lg text-center text-text-muted">
          Four tiers. Four experiences. Every one a surprise.
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VAULTS.map((vault, i) => (
            <VaultCard key={vault.name} vault={vault} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
