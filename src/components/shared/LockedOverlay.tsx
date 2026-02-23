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
          className="w-full max-w-sm rounded-2xl border border-white/10 bg-surface-elevated p-6 shadow-[0_0_45px_rgba(255,45,149,0.18)]"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-2">
            Locked
          </p>
          <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-2">
            Locked
          </h3>
          <p className="text-sm text-text-muted mb-4">
            Earn <span className="text-white font-bold">{remainingXP} XP</span> to unlock.
          </p>
          <p className="text-[11px] text-text-dim mb-5">
            Next unlock: {label} ({xp}/{unlockXP})
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenVault}
              className="flex-1 px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-accent text-white hover:bg-accent-hover transition-colors cursor-pointer"
            >
              Open a Vault
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-surface border border-white/15 text-text-muted hover:text-white hover:border-white/30 transition-colors cursor-pointer"
              >
                Close
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
