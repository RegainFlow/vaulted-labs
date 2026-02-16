import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { BossFight, Rarity, RarityBreakdown } from "../../types/game";
import { RARITY_CONFIG, pickRarity } from "../../data/vaults";
import { BOSS_PLAYER_ODDS, getScaledBossOdds } from "../../data/gamification";
import { BossIcon } from "../../assets/boss-icons";

type Phase = "intro" | "battle" | "result";

const RARITY_RANK: Record<Rarity, number> = {
  common: 0,
  uncommon: 1,
  rare: 2,
  legendary: 3
};

interface ReelItem {
  rarity: Rarity;
  color: string;
  label: string;
}

function generateReelStrip(odds: RarityBreakdown, landOn: Rarity): ReelItem[] {
  const rarities: Rarity[] = ["common", "uncommon", "rare", "legendary"];

  function weightedRandom(): Rarity {
    const total = Object.values(odds).reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (const rarity of rarities) {
      r -= odds[rarity];
      if (r <= 0) return rarity;
    }
    return "common";
  }

  const items: ReelItem[] = [];
  for (let i = 0; i < 10; i++) {
    const r = weightedRandom();
    items.push({
      rarity: r,
      color: RARITY_CONFIG[r].color,
      label: r.charAt(0).toUpperCase() + r.slice(1)
    });
  }
  // Position 10: the landing result
  items.push({
    rarity: landOn,
    color: RARITY_CONFIG[landOn].color,
    label: landOn.charAt(0).toUpperCase() + landOn.slice(1)
  });
  // Position 11: tail buffer
  const tail = weightedRandom();
  items.push({
    rarity: tail,
    color: RARITY_CONFIG[tail].color,
    label: tail.charAt(0).toUpperCase() + tail.slice(1)
  });

  return items;
}

interface BossFightOverlayProps {
  boss: BossFight;
  prestigeLevel: number;
  onWin: (boss: BossFight) => void;
  onClose: () => void;
}

export function BossFightOverlay({ boss, prestigeLevel, onWin, onClose }: BossFightOverlayProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [round, setRound] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [bossScore, setBossScore] = useState(0);
  const [playerLocked, setPlayerLocked] = useState(false);
  const [bossLocked, setBossLocked] = useState(false);
  const [roundResult, setRoundResult] = useState<"win" | "lose" | "tie" | null>(null);
  const [won, setWon] = useState<boolean | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  const scaledBossOdds = useMemo(
    () => getScaledBossOdds(boss.odds, prestigeLevel),
    [boss.odds, prestigeLevel]
  );

  // Pre-generate all round rarities (20 to handle many ties)
  const roundData = useMemo(() => {
    return Array.from({ length: 20 }).map(() => ({
      playerRarity: pickRarity(BOSS_PLAYER_ODDS),
      bossRarity: pickRarity(scaledBossOdds)
    }));
  }, [scaledBossOdds, retryKey]);

  const currentRound = roundData[round];
  const playerReel = useMemo(
    () => generateReelStrip(BOSS_PLAYER_ODDS, currentRound?.playerRarity ?? "common"),
    [round, currentRound]
  );
  const bossReel = useMemo(
    () => generateReelStrip(scaledBossOdds, currentRound?.bossRarity ?? "common"),
    [round, currentRound, scaledBossOdds]
  );

  // Auto-transition from intro to battle
  useEffect(() => {
    if (phase === "intro") {
      const timer = setTimeout(() => setPhase("battle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Boss auto-lock timer per round
  useEffect(() => {
    if (phase !== "battle" || bossLocked || roundResult) return;
    const delay = 2000 + Math.random() * 1000;
    const timer = setTimeout(() => setBossLocked(true), delay);
    return () => clearTimeout(timer);
  }, [phase, round, bossLocked, roundResult]);

  // Determine round result when both locked
  useEffect(() => {
    if (!playerLocked || !bossLocked || roundResult) return;
    const pRank = RARITY_RANK[currentRound.playerRarity];
    const bRank = RARITY_RANK[currentRound.bossRarity];
    if (pRank > bRank) setRoundResult("win");
    else if (pRank < bRank) setRoundResult("lose");
    else setRoundResult("tie");
  }, [playerLocked, bossLocked, roundResult, currentRound]);

  // Advance after showing result
  useEffect(() => {
    if (!roundResult) return;
    const timer = setTimeout(() => {
      if (roundResult === "win") {
        setPlayerScore((prev) => {
          const s = prev + 1;
          if (s >= 3) { setWon(true); setPhase("result"); }
          return s;
        });
      } else if (roundResult === "lose") {
        setBossScore((prev) => {
          const s = prev + 1;
          if (s >= 3) { setWon(false); setPhase("result"); }
          return s;
        });
      }
      // Advance to next round (ties just get new data)
      setRound((r) => r + 1);
      setPlayerLocked(false);
      setBossLocked(false);
      setRoundResult(null);
    }, 1500);
    return () => clearTimeout(timer);
  }, [roundResult]);

  const handleLock = useCallback(() => {
    if (playerLocked || !bossLocked || phase !== "battle") return;
    setPlayerLocked(true);
  }, [playerLocked, bossLocked, phase]);

  const handleClaimRewards = () => {
    onWin(boss);
    onClose();
  };

  const handleRetry = () => {
    setRetryKey((k) => k + 1);
    setPhase("intro");
    setRound(0);
    setPlayerScore(0);
    setBossScore(0);
    setPlayerLocked(false);
    setBossLocked(false);
    setRoundResult(null);
    setWon(null);
  };

  const creditReward = boss.creditReward;
  const xpReward = boss.xpReward;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] overflow-y-auto bg-bg/95 backdrop-blur-xl"
    >
      <div className="min-h-full flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {/* INTRO */}
          {phase === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="mb-6"
              >
                <BossIcon bossId={boss.id} size={80} color="#ff2d95" />
              </motion.div>
              <h2
                className="text-3xl sm:text-5xl font-black uppercase tracking-tight mb-2"
                style={{ textShadow: "0 0 30px rgba(255,45,149,0.6)" }}
              >
                {boss.name}
              </h2>
              <p className="text-text-muted text-sm mb-4">{boss.description}</p>
              <p className="text-xs font-black uppercase tracking-widest text-accent">
                Best of 5 Rounds
              </p>
            </motion.div>
          )}

          {/* BATTLE */}
          {phase === "battle" && (
            <motion.div
              key="battle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-2xl space-y-6"
            >
              {/* Round heading */}
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-dim mb-1">Best of 5</p>
                <h3
                  className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white"
                  style={{ textShadow: "0 0 20px rgba(255,255,255,0.15)" }}
                >
                  Round {round + 1}
                </h3>
              </div>

              {/* Reels with scores */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                {/* Player reel + score */}
                <div className="flex flex-col items-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-neon-cyan mb-1">You</p>
                  <p
                    className="text-3xl font-black text-neon-cyan mb-2"
                    style={{ textShadow: "0 0 15px rgba(0,240,255,0.4)" }}
                  >
                    {playerScore}
                  </p>
                  <Reel
                    key={`player-${round}`}
                    items={playerReel}
                    spinning={!playerLocked}
                    landed={playerLocked}
                    accentColor="#00f0ff"
                  />
                </div>

                {/* VS */}
                <div className="text-3xl font-black text-white/20">VS</div>

                {/* Boss reel + score */}
                <div className="flex flex-col items-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-accent mb-1">{boss.name}</p>
                  <p
                    className="text-3xl font-black text-accent mb-2"
                    style={{ textShadow: "0 0 15px rgba(255,45,149,0.4)" }}
                  >
                    {bossScore}
                  </p>
                  <Reel
                    key={`boss-${round}`}
                    items={bossReel}
                    spinning={!bossLocked}
                    landed={bossLocked}
                    accentColor="#ff2d95"
                  />
                </div>
              </div>

              {/* Round result banner */}
              <AnimatePresence>
                {roundResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center"
                  >
                    <span
                      className="text-2xl font-black uppercase tracking-widest"
                      style={{
                        color:
                          roundResult === "win"
                            ? "#00f0ff"
                            : roundResult === "lose"
                              ? "#ff3b5c"
                              : "#9a9ab0"
                      }}
                    >
                      {roundResult === "win" && "You Win This Round!"}
                      {roundResult === "lose" && "Boss Wins This Round!"}
                      {roundResult === "tie" && "Tie — Re-spin!"}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Lock button */}
              <div className="flex justify-center">
                <button
                  onClick={handleLock}
                  disabled={playerLocked || !bossLocked}
                  className={`px-12 py-4 rounded-2xl text-lg font-black uppercase tracking-widest transition-all ${
                    playerLocked
                      ? "bg-white/5 border border-white/10 text-text-dim cursor-not-allowed"
                      : bossLocked
                        ? "bg-neon-cyan/10 border-2 border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/20 shadow-[0_0_30px_rgba(0,240,255,0.2)] active:scale-95 cursor-pointer"
                        : "bg-white/5 border border-white/10 text-text-dim cursor-not-allowed"
                  }`}
                >
                  {playerLocked ? "Locked" : bossLocked ? "Lock!" : "Waiting..."}
                </button>
              </div>
            </motion.div>
          )}

          {/* RESULT */}
          {phase === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6 max-w-md"
            >
              {won ? (
                <>
                  <ConfettiBurst color="#00f0ff" />
                  <motion.h2
                    className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-neon-cyan"
                    style={{ textShadow: "0 0 40px rgba(0,240,255,0.6)" }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Victory!
                  </motion.h2>

                  <div className="bg-surface-elevated/50 rounded-2xl border border-neon-cyan/20 p-6 space-y-3">
                    <p className="text-xs font-black uppercase tracking-widest text-text-dim">
                      Rewards
                    </p>
                    <div className="flex items-center justify-center gap-6">
                      <div className="text-center">
                        <p className="text-2xl font-black text-vault-gold">${creditReward}</p>
                        <p className="text-[10px] text-text-dim uppercase tracking-wider">Credits</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-black text-accent">{xpReward}</p>
                        <p className="text-[10px] text-text-dim uppercase tracking-wider">XP</p>
                      </div>
                    </div>
                    {boss.specialItem && (
                      <div className="pt-3 border-t border-white/10">
                        <p className="text-sm font-black" style={{ color: RARITY_CONFIG[boss.specialItem.rarity].color }}>
                          {boss.specialItem.product}
                        </p>
                        <p className="text-[10px] text-text-muted">Special Item — ${boss.specialItem.value}</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleClaimRewards}
                    className="px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest bg-neon-cyan/10 border-2 border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/20 transition-all cursor-pointer"
                  >
                    Claim Rewards
                  </button>
                </>
              ) : (
                <>
                  <h2
                    className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-error"
                    style={{ textShadow: "0 0 30px rgba(255,59,92,0.5)" }}
                  >
                    Defeated
                  </h2>
                  <p className="text-text-muted text-sm">
                    {boss.name} was too strong this time. Try again?
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={handleRetry}
                      className="px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 transition-all cursor-pointer"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={onClose}
                      className="px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest bg-white/5 border border-white/10 text-text-muted hover:bg-white/10 transition-all cursor-pointer"
                    >
                      Retreat
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─── Reel Component ─── */

function Reel({
  items,
  spinning,
  landed,
  accentColor
}: {
  items: ReelItem[];
  spinning: boolean;
  landed: boolean;
  accentColor: string;
}) {
  const landedColor = landed ? items[10]?.color ?? accentColor : accentColor;

  return (
    <div className="relative w-48 h-36 overflow-hidden rounded-2xl border border-white/10 bg-surface/80 backdrop-blur-xl">
      <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-bg via-transparent to-bg" />
      <div
        className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-10 z-10 pointer-events-none border-y transition-all duration-500"
        style={{
          borderColor: landed ? `${landedColor}60` : "rgba(255,255,255,0.15)",
          boxShadow: landed
            ? `0 0 20px ${landedColor}30`
            : "0 0 10px rgba(255,255,255,0.05)"
        }}
      />
      <motion.div
        initial={{ y: 0 }}
        animate={
          landed
            ? { y: -(10 * 40 + 20) + 72 }
            : spinning
              ? { y: [0, -(items.length * 40)] }
              : { y: 0 }
        }
        transition={
          landed
            ? { duration: 0.8, ease: [0.12, 0.8, 0.2, 1] }
            : spinning
              ? { duration: 0.4, repeat: Infinity, ease: "linear" }
              : undefined
        }
        className="flex flex-col"
      >
        {items.map((item, i) => (
          <div key={i} className="h-10 flex items-center gap-2 px-3 shrink-0">
            <div
              className="w-1 h-5 rounded-full shrink-0"
              style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}60` }}
            />
            <span
              className="text-xs font-black uppercase tracking-wider"
              style={{ color: item.color }}
            >
              {item.label}
            </span>
            {item.rarity === "legendary" && (
              <span className="text-[10px]" style={{ color: item.color }}>&#9733;</span>
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Confetti ─── */

function ConfettiBurst({ color }: { color: string }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 600,
        y: (Math.random() - 0.5) * 600,
        color: Math.random() > 0.5 ? color : "#ffffff",
        scale: Math.random() * 0.8 + 0.2
      })),
    [color]
  );

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
          animate={{
            opacity: 0,
            x: p.x,
            y: p.y,
            rotate: Math.random() * 720,
            scale: p.scale
          }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute w-2 h-2 rounded-sm"
          style={{ backgroundColor: p.color }}
        />
      ))}
    </div>
  );
}
