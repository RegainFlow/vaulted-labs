import { motion, AnimatePresence } from "motion/react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FEATURE_UNLOCK_LABEL,
  getRemainingXP,
  getUnlockXP,
  type UnlockFeatureKey
} from "../../lib/unlocks";

interface LockedOverlayProps {
  isOpen: boolean;
  featureKey: UnlockFeatureKey;
  xp: number;
  onClose?: () => void;
  ctaTo?: string;
}

export function LockedOverlay({
  isOpen,
  featureKey,
  xp,
  onClose,
  ctaTo = "/vaults"
}: LockedOverlayProps) {
  const navigate = useNavigate();
  const location = useLocation();

  if (!isOpen) return null;

  const unlockXP = getUnlockXP(featureKey);
  const remainingXP = getRemainingXP(featureKey, xp);
  const label = FEATURE_UNLOCK_LABEL[featureKey];

  const handleOpenVault = () => {
    if (location.pathname === ctaTo) {
      onClose?.();
      return;
    }
    navigate(ctaTo);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[180] flex items-center justify-center bg-black/75 backdrop-blur-sm px-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: "spring", damping: 22 }}
          className="system-shell w-full max-w-sm px-6 py-6 pr-14 sm:pr-16"
        >
          {onClose && (
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="system-close"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
          <p className="system-kicker mb-2 text-accent">
            Locked
          </p>
          <h3 className="mb-2 text-2xl font-black uppercase tracking-tight text-white">
            Access Restricted
          </h3>
          <p className="mb-4 text-sm text-text-muted">
            Earn <span className="text-white font-bold">{remainingXP} XP</span> to unlock.
          </p>
          <p className="mb-5 text-[11px] text-text-dim">
            Next unlock: {label} ({xp}/{unlockXP})
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenVault}
              className="command-button flex-1 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest"
            >
              Open a Vault
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
