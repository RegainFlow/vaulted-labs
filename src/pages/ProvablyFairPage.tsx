import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "../components/shared/Navbar";
import { PROVABLY_FAIR_ALGORITHM_VERSION } from "../lib/provably-fair-core";

const CODE_EXCERPTS = [
  {
    title: "Server Seed Hashing",
    code: `export async function hashServerSeed(serverSeed: string): Promise<string> {
  return sha256Hex(serverSeed);
}`,
  },
  {
    title: "Digest Derivation",
    code: `const message = \`\${clientSeed}:\${nonce}:\${cursor}:\${gameType}:\${payloadHash}:pf_v1\`;
return hmacSha256Hex(serverSeed, message);`,
  },
  {
    title: "Receipt Verification",
    code: `const expectedDigest = await deriveFairDigest(
  receipt.serverSeed,
  receipt.clientSeed,
  receipt.nonce,
  trace.cursor,
  receipt.gameType,
  receipt.payloadHash,
  receipt.algorithmVersion
);`,
  },
];

export function ProvablyFairPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
      <main className="app-page-shell bg-bg px-4 sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-col gap-4">
          <button
            type="button"
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
                return;
              }
              navigate("/");
            }}
            className="app-back-button self-start"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back
          </button>
          <div className="system-shell px-6 py-8 sm:px-8 sm:py-10">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-accent">
              Legal / Transparency
            </p>
            <h1 className="mt-4 text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
              Provably Fair
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-text-muted sm:text-base">
              VaultedLabs commits to a server seed hash before outcome-affecting
              randomness is resolved. Each wallet receives receipts that include
              the committed hash, client seed, nonce, payload hash, and roll trace.
              Once a seed rotates, earlier receipts can be verified locally against
              the revealed server seed. The current fairness stack is backed by
              Supabase edge functions and service-role-only fairness tables behind
              row level security.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="module-card p-5">
                <h2 className="text-lg font-black uppercase tracking-[0.18em] text-white">
                  Covered Systems
                </h2>
                <ul className="mt-4 space-y-2 text-sm text-text-muted">
                  <li>Vault opens and bonus trigger rolls</li>
                  <li>Bonus Lock channel results</li>
                  <li>Forge outcome rolls</li>
                  <li>Battle simulations and reward variance</li>
                </ul>
              </div>
              <div className="module-card p-5">
                <h2 className="text-lg font-black uppercase tracking-[0.18em] text-white">
                  Seed Lifecycle
                </h2>
                <ul className="mt-4 space-y-2 text-sm text-text-muted">
                  <li>One active committed server hash per wallet proof ID</li>
                  <li>One monotonically increasing nonce per fair event</li>
                  <li>Automatic rotation after 25 events or 24 hours</li>
                  <li>Manual rotation available from Wallet</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="module-card p-5">
                <h2 className="text-lg font-black uppercase tracking-[0.18em] text-white">
                  Supabase Runtime
                </h2>
                <ul className="mt-4 space-y-2 text-sm text-text-muted">
                  <li>`provably-fair-session` creates or refreshes the active commit</li>
                  <li>`provably-fair-roll` resolves fair outcomes and stores receipts</li>
                  <li>`provably-fair-rotate` reveals the old seed and starts a new commit</li>
                  <li>Fairness tables are not directly readable by client roles</li>
                </ul>
              </div>
              <div className="module-card p-5">
                <h2 className="text-lg font-black uppercase tracking-[0.18em] text-white">
                  Wallet Receipts
                </h2>
                <ul className="mt-4 space-y-2 text-sm text-text-muted">
                  <li>Receipts are tied to the local wallet proof ID</li>
                  <li>Wallet, vault, forge, battle, and bonus results can open proofs</li>
                  <li>`pending_reveal` becomes locally verifiable after seed rotation</li>
                  <li>Transactions and collectibles can link back to their receipt</li>
                </ul>
              </div>
            </div>

            <div className="module-card mt-6 p-5">
              <h2 className="text-lg font-black uppercase tracking-[0.18em] text-white">
                Algorithm
              </h2>
              <p className="mt-3 text-sm text-text-muted">
                Current algorithm version:{" "}
                <span className="font-mono text-white">
                  {PROVABLY_FAIR_ALGORITHM_VERSION}
                </span>
              </p>
              <p className="mt-2 text-sm text-text-muted">
                Payload hashing uses canonical JSON. Digests are derived with
                HMAC-SHA256 over client seed, nonce, cursor, game type, payload hash,
                and the algorithm version. Units are derived from the first 52 bits.
              </p>
              <p className="mt-2 text-sm text-text-muted">
                Vault collectible selection is currently resolved by sending eligible
                candidate pools in the request payload so the edge runtime can make a
                deterministic selection without importing frontend catalog modules.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {CODE_EXCERPTS.map((block) => (
                <div key={block.title} className="module-card overflow-hidden">
                  <div className="border-b border-white/8 px-5 py-3">
                    <h3 className="text-sm font-black uppercase tracking-[0.18em] text-white">
                      {block.title}
                    </h3>
                  </div>
                  <pre className="overflow-auto px-5 py-4 text-[12px] leading-6 text-text-muted">
                    <code>{block.code}</code>
                  </pre>
                </div>
              ))}
            </div>

            <div className="module-card mt-6 p-5">
              <h2 className="text-lg font-black uppercase tracking-[0.18em] text-white">
                How To Verify
              </h2>
              <ol className="mt-4 space-y-2 text-sm text-text-muted">
                <li>Open a receipt from Wallet or a result surface.</li>
                <li>Wait for the related server seed to rotate and reveal.</li>
                <li>Run local verification from the receipt modal.</li>
                <li>Compare the verified trace to the recorded result summary.</li>
              </ol>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              <Link
                to="/terms"
                className="text-accent underline underline-offset-4 transition-colors hover:text-accent-hover"
              >
                Terms of Service
              </Link>
              <Link
                to="/privacy"
                className="text-accent underline underline-offset-4 transition-colors hover:text-accent-hover"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
