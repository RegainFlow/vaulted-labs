import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  isAudioMuted,
  subscribeAudioPreference,
  toggleAudioMuted,
} from "../../lib/audio";

interface TutorialHelpButtonProps {
  onClick: () => void;
}

export function TutorialHelpButton({ onClick }: TutorialHelpButtonProps) {
  const [audioMuted, setAudioMuted] = useState(() => isAudioMuted());

  useEffect(() => subscribeAudioPreference(setAudioMuted), []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="fixed bottom-24 right-5 z-[100] md:bottom-6 md:right-6"
    >
      <div className="system-rail flex items-center gap-1.5 rounded-full px-1.5 py-1.5 shadow-[0_0_22px_rgba(255,45,149,0.12)]">
        <button
          type="button"
          aria-label={audioMuted ? "Enable sound" : "Mute sound"}
          onClick={() => setAudioMuted(toggleAudioMuted())}
          className="command-segment flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-accent hover:border-accent/35"
        >
          {audioMuted ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 5L6 9H3v6h3l5 4V5z" />
              <path d="M19 9L15 15" />
              <path d="M15 9L19 15" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 5L6 9H3v6h3l5 4V5z" />
              <path d="M15.5 8.5a5 5 0 010 7" />
              <path d="M18.5 5.5a9 9 0 010 13" />
            </svg>
          )}
        </button>
        <button
          type="button"
          onClick={onClick}
          className="command-segment flex h-10 w-10 items-center justify-center rounded-full border border-accent/30 bg-accent/8 text-accent hover:border-accent/50 hover:bg-accent/12"
          aria-label="Replay tutorial"
        >
          <span className="text-lg font-black leading-none">?</span>
        </button>
      </div>
    </motion.div>
  );
}
