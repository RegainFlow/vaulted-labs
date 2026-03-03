import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router-dom";
import { verifyReceipt } from "../../lib/provably-fair-core";
import { AnalyticsEvents, trackEvent } from "../../lib/analytics";
import type {
  ProvablyFairReceipt,
  ProvablyFairVerificationResult,
} from "../../types/provably-fair";
import { useOverlayScrollLock } from "../../hooks/useOverlayScrollLock";

function shorten(value: string, start = 10, end = 8) {
  if (value.length <= start + end + 3) return value;
  return `${value.slice(0, start)}...${value.slice(-end)}`;
}

interface ProvablyFairReceiptModalProps {
  receipt: ProvablyFairReceipt | null;
  onClose: () => void;
}

export function ProvablyFairReceiptModal({
  receipt,
  onClose,
}: ProvablyFairReceiptModalProps) {
  useOverlayScrollLock(Boolean(receipt));
  const [verification, setVerification] =
    useState<ProvablyFairVerificationResult | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "done">("idle");

  const resultSummary = useMemo(() => {
    if (!receipt) return [];
    return Object.entries(receipt.resultPayload).slice(0, 8);
  }, [receipt]);

  if (!receipt) return null;

  const handleVerify = async () => {
    const result = await verifyReceipt(receipt);
    setVerification(result);
    trackEvent(AnalyticsEvents.PROVABLY_FAIR_RECEIPT_VERIFIED, {
      receipt_id: receipt.id,
      game_type: receipt.gameType,
      valid: result.valid,
    });
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(receipt, null, 2));
    setCopyState("done");
    window.setTimeout(() => setCopyState("idle"), 1400);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[120] overflow-y-auto bg-black/80 p-4 backdrop-blur-md"
      >
        <div className="flex min-h-full items-start justify-center py-4 sm:py-6">
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            className="system-shell relative flex max-h-[calc(100dvh-2rem)] w-full max-w-4xl flex-col overflow-hidden px-5 py-5 sm:max-h-[calc(100dvh-3rem)] sm:px-6"
          >
            <button onClick={onClose} type="button" className="system-close !absolute !right-4 !top-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="relative z-10 min-h-0 flex-1 overflow-y-auto pr-1">
              <p className="system-kicker mb-2">Provably Fair Receipt</p>
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-black uppercase tracking-tight text-white">
                  {receipt.gameType.replace("_", " ")}
                </h2>
                <span
                  className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] ${
                    receipt.revealStatus === "revealed"
                      ? "border-neon-green/35 text-neon-green"
                      : "border-accent/35 text-accent"
                  }`}
                >
                  {receipt.revealStatus === "revealed" ? "Revealed" : "Pending Reveal"}
                </span>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-4">
                  <div className="module-card p-4">
                    <div className="grid gap-3 text-sm sm:grid-cols-2">
                      <div>
                        <p className="system-label">Receipt ID</p>
                        <p className="mt-1 font-mono text-xs text-white">{shorten(receipt.id)}</p>
                      </div>
                      <div>
                        <p className="system-label">Algorithm</p>
                        <p className="mt-1 font-mono text-xs text-white">{receipt.algorithmVersion}</p>
                      </div>
                      <div>
                        <p className="system-label">Server Hash</p>
                        <p className="mt-1 break-all font-mono text-xs text-white">{receipt.serverSeedHash}</p>
                      </div>
                      <div>
                        <p className="system-label">Client Seed</p>
                        <p className="mt-1 break-all font-mono text-xs text-white">{receipt.clientSeed}</p>
                      </div>
                      <div>
                        <p className="system-label">Nonce</p>
                        <p className="mt-1 font-mono text-xs text-white">{receipt.nonce}</p>
                      </div>
                      <div>
                        <p className="system-label">Payload Hash</p>
                        <p className="mt-1 break-all font-mono text-xs text-white">{receipt.payloadHash}</p>
                      </div>
                      {receipt.serverSeed ? (
                        <div className="sm:col-span-2">
                          <p className="system-label">Revealed Server Seed</p>
                          <p className="mt-1 break-all font-mono text-xs text-white">{receipt.serverSeed}</p>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="module-card overflow-hidden">
                    <div className="border-b border-white/8 px-4 py-3">
                      <p className="text-sm font-black uppercase tracking-[0.18em] text-white">
                        Roll Trace
                      </p>
                    </div>
                    <div className="max-h-[280px] overflow-auto">
                      {receipt.rollTrace.map((trace) => (
                        <div
                          key={`${trace.cursor}-${trace.label}`}
                          className="grid gap-2 border-b border-white/6 px-4 py-3 text-xs sm:grid-cols-[90px_1fr_110px]"
                        >
                          <div>
                            <p className="system-label">Cursor</p>
                            <p className="mt-1 font-mono text-white">{trace.cursor}</p>
                          </div>
                          <div>
                            <p className="system-label">{trace.label}</p>
                            <p className="mt-1 break-all font-mono text-[11px] text-text-muted">
                              {trace.digest}
                            </p>
                          </div>
                          <div>
                            <p className="system-label">Unit</p>
                            <p className="mt-1 font-mono text-white">
                              {trace.unit.toFixed(12)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="module-card p-4">
                    <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-white">
                      Result Summary
                    </p>
                    <div className="space-y-2 text-sm">
                      {resultSummary.map(([key, value]) => (
                        <div key={key} className="flex items-start justify-between gap-3">
                          <span className="system-label">{key}</span>
                          <span className="text-right font-mono text-xs text-white">
                            {typeof value === "object" ? JSON.stringify(value) : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="module-card p-4">
                    <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-white">
                      Verification
                    </p>
                    <p className="text-xs text-text-muted">
                      {verification
                        ? verification.valid
                          ? "Receipt verified locally against the revealed seed."
                          : verification.mismatches.join(" ")
                        : "Reveal the server seed, then verify locally."}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={handleVerify}
                        className="system-rail px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-white"
                      >
                        Verify Locally
                      </button>
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="system-rail px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-white"
                      >
                        {copyState === "done" ? "Copied" : "Copy Receipt JSON"}
                      </button>
                      <Link
                        to="/provably-fair"
                        onClick={() =>
                          trackEvent(AnalyticsEvents.PROVABLY_FAIR_DOC_OPENED, {
                            source: "receipt_modal",
                            receipt_id: receipt.id,
                          })
                        }
                        className="system-rail px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-white"
                      >
                        Open Fairness Doc
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
