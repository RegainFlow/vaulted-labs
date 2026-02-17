import { useState, useEffect, useMemo, useCallback, useRef, memo } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useMotionValue
} from "motion/react";
import type { BossFight, Rarity, RarityBreakdown, AttackQuality } from "../../types/game";
import { RARITY_CONFIG, pickRarity } from "../../data/vaults";
import { BOSS_PLAYER_ODDS, getScaledBossOdds } from "../../data/gamification";
import { BOSS_FIGHT_TUTORIAL_STEPS } from "../../data/tutorial";
import { BossIcon } from "../../assets/boss-icons";
import { PageTutorial } from "../shared/PageTutorial";
import { TutorialHelpButton } from "../shared/TutorialHelpButton";

type Phase = "intro" | "battle" | "result";
type AttackPhase = "charge" | "atk-window" | "resolve" | "cooldown";
type ExchangeWinner = "player" | "boss" | "tie";

const INTRO_DURATION_MS = 1700;
const CHARGE_DURATION_MS = 1500;
const ATK_WINDOW_DURATION_MS = 1150;
const RESOLVE_DURATION_MS = 1800;
const COOLDOWN_DURATION_MS = 900;
const PLAYER_MAX_HP = 120;

const DAMAGE_BY_RARITY: Record<Rarity, number> = {
  common: 8,
  uncommon: 14,
  rare: 22,
  legendary: 34
};

const QUALITY_MODIFIER: Record<AttackQuality, number> = {
  perfect: 8,
  good: 3,
  miss: -4
};

interface ExchangeSummary {
  playerRarity: Rarity;
  bossRarity: Rarity;
  playerQuality: AttackQuality;
  bossQuality: AttackQuality;
  playerDamage: number;
  bossDamage: number;
  winner: ExchangeWinner;
}

interface ReelItem {
  rarity: Rarity;
  color: string;
  label: string;
}

interface BossFightOverlayProps {
  boss: BossFight;
  prestigeLevel: number;
  onWin: (boss: BossFight) => void;
  onClose: () => void;
  hasSeenBossFightTutorial: boolean;
  onBossFightTutorialComplete: () => void;
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
  for (let i = 0; i < 10; i += 1) {
    const rarity = weightedRandom();
    items.push({
      rarity,
      color: RARITY_CONFIG[rarity].color,
      label: rarity.charAt(0).toUpperCase() + rarity.slice(1)
    });
  }
  items.push({
    rarity: landOn,
    color: RARITY_CONFIG[landOn].color,
    label: landOn.charAt(0).toUpperCase() + landOn.slice(1)
  });
  const tail = weightedRandom();
  items.push({
    rarity: tail,
    color: RARITY_CONFIG[tail].color,
    label: tail.charAt(0).toUpperCase() + tail.slice(1)
  });
  return items;
}

function resolvePlayerQuality(elapsedMs: number, windowMs: number): AttackQuality {
  const ratio = Math.max(0, Math.min(1, elapsedMs / windowMs));
  const distanceFromCenter = Math.abs(ratio - 0.5);
  if (distanceFromCenter <= 0.12) return "perfect";
  if (distanceFromCenter <= 0.32) return "good";
  return "miss";
}

function rollBossQuality(requiredLevel: number): AttackQuality {
  const levelShift = Math.min(0.12, Math.max(0, (requiredLevel - 3) * 0.015));
  const perfectChance = 0.16 + levelShift;
  const goodChance = 0.55 - levelShift * 0.4;
  const roll = Math.random();
  if (roll <= perfectChance) return "perfect";
  if (roll <= perfectChance + goodChance) return "good";
  return "miss";
}

function computeDamage(rarity: Rarity, quality: AttackQuality): number {
  return Math.max(1, DAMAGE_BY_RARITY[rarity] + QUALITY_MODIFIER[quality]);
}

function qualityText(quality: AttackQuality): string {
  if (quality === "perfect") return "Perfect";
  if (quality === "good") return "Good";
  return "Miss";
}

function qualityColor(quality: AttackQuality): string {
  if (quality === "perfect") return "#39ff14";
  if (quality === "good") return "#00f0ff";
  return "#ff3b5c";
}

export function BossFightOverlay({ boss, prestigeLevel, onWin, onClose, hasSeenBossFightTutorial, onBossFightTutorialComplete }: BossFightOverlayProps) {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("intro");
  const [attackPhase, setAttackPhase] = useState<AttackPhase>("charge");
  const [tutorialActive, setTutorialActive] = useState(false);
  const [tutorialPreviewMode, setTutorialPreviewMode] = useState(false);
  const [exchange, setExchange] = useState(1);
  const [exchangeKey, setExchangeKey] = useState(0);
  const [playerHp, setPlayerHp] = useState(PLAYER_MAX_HP);
  const [bossHp, setBossHp] = useState(PLAYER_MAX_HP);
  const [playerReel, setPlayerReel] = useState<ReelItem[]>(() => generateReelStrip(BOSS_PLAYER_ODDS, "common"));
  const [bossReel, setBossReel] = useState<ReelItem[]>(() => generateReelStrip(boss.odds, "common"));
  const [playerLanded, setPlayerLanded] = useState(false);
  const [bossLanded, setBossLanded] = useState(false);
  const [playerQuality, setPlayerQuality] = useState<AttackQuality | null>(null);
  const [bossQuality, setBossQuality] = useState<AttackQuality | null>(null);
  const [summary, setSummary] = useState<ExchangeSummary | null>(null);
  const [windowPulseKey, setWindowPulseKey] = useState(0);
  const [won, setWon] = useState<boolean | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const [shakeClass, setShakeClass] = useState("");
  const [playerJustHit, setPlayerJustHit] = useState(false);
  const [bossJustHit, setBossJustHit] = useState(false);

  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const windowStartRef = useRef(0);
  const playerActionRef = useRef(false);
  const playerQualityRef = useRef<AttackQuality>("miss");
  const playerHpRef = useRef(PLAYER_MAX_HP);
  const bossHpRef = useRef(PLAYER_MAX_HP);

  const scaledBossOdds = useMemo(
    () => getScaledBossOdds(boss.odds, prestigeLevel),
    [boss.odds, prestigeLevel]
  );
  const bossMaxHp = useMemo(
    () => PLAYER_MAX_HP + Math.max(0, boss.requiredLevel - 3) * 8,
    [boss.requiredLevel]
  );

  const clearTimers = useCallback(() => {
    for (const timer of timersRef.current) clearTimeout(timer);
    timersRef.current = [];
  }, []);

  const schedule = useCallback((action: () => void, delayMs: number) => {
    const timer = setTimeout(action, delayMs);
    timersRef.current.push(timer);
  }, []);

  const beginExchange = useCallback(() => {
    clearTimers();
    const playerRarity = pickRarity(BOSS_PLAYER_ODDS);
    const bossRarity = pickRarity(scaledBossOdds);

    playerActionRef.current = false;
    playerQualityRef.current = "miss";
    setPlayerQuality(null);
    setBossQuality(null);
    setSummary(null);
    setAttackPhase("charge");
    setPlayerLanded(false);
    setBossLanded(false);
    setPlayerReel(generateReelStrip(BOSS_PLAYER_ODDS, playerRarity));
    setBossReel(generateReelStrip(scaledBossOdds, bossRarity));

    schedule(() => {
      windowStartRef.current = performance.now();
      setAttackPhase("atk-window");
      setWindowPulseKey((value) => value + 1);
    }, CHARGE_DURATION_MS);

    schedule(() => {
      const resolvedPlayerQuality = playerActionRef.current ? playerQualityRef.current : "miss";
      const resolvedBossQuality = rollBossQuality(boss.requiredLevel);
      const playerDamage = computeDamage(playerRarity, resolvedPlayerQuality);
      const bossDamage = computeDamage(bossRarity, resolvedBossQuality);
      const nextBossHp = Math.max(0, bossHpRef.current - playerDamage);
      const nextPlayerHp = Math.max(0, playerHpRef.current - bossDamage);
      const winner: ExchangeWinner = playerDamage === bossDamage
        ? "tie"
        : playerDamage > bossDamage
          ? "player"
          : "boss";

      setAttackPhase("resolve");
      setPlayerLanded(true);
      setBossLanded(true);
      setPlayerQuality(resolvedPlayerQuality);
      setBossQuality(resolvedBossQuality);
      setSummary({
        playerRarity,
        bossRarity,
        playerQuality: resolvedPlayerQuality,
        bossQuality: resolvedBossQuality,
        playerDamage,
        bossDamage,
        winner
      });
      setBossHp(nextBossHp);
      setPlayerHp(nextPlayerHp);

      // Screen shake based on total damage
      const totalDamage = playerDamage + bossDamage;
      if (totalDamage >= 40) {
        setShakeClass("shake-heavy");
        setTimeout(() => setShakeClass(""), 500);
      } else if (totalDamage >= 20) {
        setShakeClass("shake-light");
        setTimeout(() => setShakeClass(""), 300);
      }

      // HP bar damage flash
      if (bossDamage > 0) {
        setPlayerJustHit(true);
        setTimeout(() => setPlayerJustHit(false), 400);
      }
      if (playerDamage > 0) {
        setBossJustHit(true);
        setTimeout(() => setBossJustHit(false), 400);
      }

      if (nextBossHp <= 0 || nextPlayerHp <= 0) {
        schedule(() => {
          const playerWon = nextBossHp <= 0 && nextPlayerHp <= 0 ? true : nextBossHp <= 0;
          setWon(playerWon);
          setPhase("result");
        }, RESOLVE_DURATION_MS);
        return;
      }

      schedule(() => {
        setAttackPhase("cooldown");
      }, Math.round(RESOLVE_DURATION_MS * 0.6));

      schedule(() => {
        setExchange((value) => value + 1);
        setExchangeKey((value) => value + 1);
      }, RESOLVE_DURATION_MS + COOLDOWN_DURATION_MS);
    }, CHARGE_DURATION_MS + ATK_WINDOW_DURATION_MS);
  }, [boss.requiredLevel, clearTimers, scaledBossOdds, schedule]);

  useEffect(() => {
    playerHpRef.current = playerHp;
  }, [playerHp]);

  useEffect(() => {
    bossHpRef.current = bossHp;
  }, [bossHp]);

  useEffect(() => {
    setPlayerHp(PLAYER_MAX_HP);
    setBossHp(bossMaxHp);
    playerHpRef.current = PLAYER_MAX_HP;
    bossHpRef.current = bossMaxHp;
  }, [bossMaxHp, retryKey]);

  useEffect(() => {
    if (phase !== "intro") return undefined;
    clearTimers();
    const timer = setTimeout(() => {
      if (!hasSeenBossFightTutorial) {
        setTutorialPreviewMode(true);
        setPhase("battle");
        setAttackPhase("charge");
        setExchange(1);
        // Don't increment exchangeKey — prevent beginExchange from running
        // Activate tutorial after a brief delay
        const tutorialTimer = setTimeout(() => setTutorialActive(true), 400);
        timersRef.current.push(tutorialTimer);
      } else {
        setPhase("battle");
        setAttackPhase("charge");
        setExchange(1);
        setExchangeKey((value) => value + 1);
      }
    }, INTRO_DURATION_MS);
    timersRef.current.push(timer);
    return () => clearTimeout(timer);
  }, [clearTimers, phase, retryKey, hasSeenBossFightTutorial]);

  useEffect(() => {
    if (phase !== "battle" || tutorialPreviewMode) return undefined;
    beginExchange();
    return () => clearTimers();
  }, [beginExchange, clearTimers, exchangeKey, phase, tutorialPreviewMode]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const handleAttackNow = useCallback(() => {
    if (phase !== "battle" || attackPhase !== "atk-window" || playerActionRef.current) return;
    playerActionRef.current = true;
    const elapsed = performance.now() - windowStartRef.current;
    const quality = resolvePlayerQuality(elapsed, ATK_WINDOW_DURATION_MS);
    playerQualityRef.current = quality;
    setPlayerQuality(quality);
  }, [attackPhase, phase]);

  const handleTutorialComplete = () => {
    setTutorialActive(false);
    setTutorialPreviewMode(false);
    onBossFightTutorialComplete();
    setExchange(1);
    setExchangeKey((value) => value + 1);
  };

  const handleClaimRewards = () => {
    onWin(boss);
    onClose();
  };

  const handleRetry = () => {
    clearTimers();
    setPhase("intro");
    setAttackPhase("charge");
    setExchange(1);
    setSummary(null);
    setWon(null);
    setPlayerLanded(false);
    setBossLanded(false);
    setPlayerQuality(null);
    setBossQuality(null);
    setRetryKey((value) => value + 1);
  };

  const playerHpPercent = Math.max(0, (playerHp / PLAYER_MAX_HP) * 100);
  const bossHpPercent = Math.max(0, (bossHp / bossMaxHp) * 100);
  const windowOpen = phase === "battle" && attackPhase === "atk-window";
  const canAttack = windowOpen && !playerActionRef.current;

  const attackButtonLabel = useMemo(() => {
    if (windowOpen && !playerActionRef.current) return "ATK NOW!";
    if (windowOpen && playerQuality) return qualityText(playerQuality).toUpperCase();
    if (attackPhase === "charge") return "Charging";
    if (attackPhase === "resolve") return "Impact";
    if (attackPhase === "cooldown") return "Recalibrating";
    return "Standby";
  }, [attackPhase, playerQuality, windowOpen]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[60] overflow-hidden bg-bg/95 backdrop-blur-xl ${shakeClass}`}
    >
      <div className="h-full flex items-center justify-center p-4 relative z-10">
        <AnimatePresence mode="wait">
          {phase === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.08, filter: "blur(8px)" }}
              transition={{ duration: 0.4 }}
              className="text-center relative"
            >
              <div className="absolute inset-0 bg-accent/10 blur-[120px] rounded-full -z-10" />
              <motion.div
                animate={
                  prefersReducedMotion
                    ? undefined
                    : {
                        scale: [1, 1.04, 1],
                        filter: ["brightness(1)", "brightness(1.12)", "brightness(1)"]
                      }
                }
                transition={prefersReducedMotion ? undefined : { duration: 2.4, repeat: Infinity }}
                className="mb-8"
              >
                <BossIcon bossId={boss.id} size={140} color="#ff2d95" />
              </motion.div>
              <h2 className="text-5xl sm:text-8xl font-black uppercase tracking-tighter mb-4 italic text-white drop-shadow-[0_0_30px_#ff2d95]">
                {boss.name}
              </h2>
              <p className="text-text-muted text-lg max-w-sm mx-auto font-medium italic opacity-80">
                "{boss.description}"
              </p>
            </motion.div>
          )}

          {phase === "battle" && (
            <motion.div
              key="battle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-[96rem] space-y-4 md:space-y-5 relative"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div
                  data-tutorial="boss-player-hp"
                  className="rounded-2xl border bg-surface/70 px-4 py-3 transition-all duration-200"
                  style={{
                    borderColor: playerJustHit ? "rgba(255,59,92,0.8)" : "rgba(0,240,255,0.3)",
                    backgroundColor: playerJustHit ? "rgba(255,59,92,0.1)" : undefined
                  }}
                >
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] font-black text-neon-cyan">
                    <span>Challenger</span>
                    <span>{Math.max(0, Math.round(playerHp))}/{PLAYER_MAX_HP}</span>
                  </div>
                  <div className="mt-2 h-2.5 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-neon-cyan"
                      animate={{ width: `${playerHpPercent}%` }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    />
                  </div>
                </div>
                <div
                  data-tutorial="boss-enemy-hp"
                  className="rounded-2xl border bg-surface/70 px-4 py-3 transition-all duration-200"
                  style={{
                    borderColor: bossJustHit ? "rgba(0,240,255,0.8)" : "rgba(255,45,149,0.3)",
                    backgroundColor: bossJustHit ? "rgba(0,240,255,0.1)" : undefined
                  }}
                >
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] font-black text-accent">
                    <span>{boss.name}</span>
                    <span>{Math.max(0, Math.round(bossHp))}/{bossMaxHp}</span>
                  </div>
                  <div className="mt-2 h-2.5 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-accent"
                      animate={{ width: `${bossHpPercent}%` }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-accent mb-1">Combat Exchange</p>
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-white italic">
                  {exchange}
                </h3>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 lg:gap-8">
                <div className="flex flex-col items-center gap-3" data-tutorial="boss-player-reel">
                  <div className="text-[11px] font-black uppercase tracking-[0.22em] text-neon-cyan">Challenger Spin</div>
                  <SyncedBossReel
                    items={playerReel}
                    spinning={!playerLanded}
                    landed={playerLanded}
                    accentColor="#00f0ff"
                  />
                  <div className="text-xs uppercase tracking-[0.2em]" style={{ color: playerQuality ? qualityColor(playerQuality) : "#9a9ab0" }}>
                    {playerQuality ? qualityText(playerQuality) : "Pending"}
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3 min-w-[16rem]">
                  <motion.div
                    animate={
                      prefersReducedMotion
                        ? undefined
                        : windowOpen
                          ? { scale: [1, 1.07, 1], opacity: [0.75, 1, 0.75] }
                          : { opacity: [0.45, 0.85, 0.45] }
                    }
                    transition={prefersReducedMotion ? undefined : { duration: windowOpen ? 0.35 : 1.6, repeat: Infinity }}
                    className={`text-center text-2xl sm:text-3xl font-black uppercase tracking-[0.25em] ${windowOpen ? "text-error drop-shadow-[0_0_24px_rgba(255,59,92,0.6)]" : "text-white/70"}`}
                  >
                    {windowOpen ? "ATK NOW!" : "SYNC"}
                  </motion.div>

                  <div className="w-56 sm:w-64 h-2 rounded-full bg-white/10 overflow-hidden border border-white/10">
                    {windowOpen && (
                      <motion.div
                        key={windowPulseKey}
                        className="h-full bg-error origin-left"
                        initial={{ scaleX: 1 }}
                        animate={{ scaleX: 0 }}
                        transition={{ duration: ATK_WINDOW_DURATION_MS / 1000, ease: "linear" }}
                      />
                    )}
                  </div>

                  <button
                    data-tutorial="boss-atk-button"
                    onClick={handleAttackNow}
                    disabled={!canAttack}
                    className={`px-8 py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-[0.22em] border-2 transition-all ${
                      canAttack
                        ? "bg-error/20 border-error/60 text-error shadow-[0_0_28px_rgba(255,59,92,0.35)] hover:bg-error/30 cursor-pointer"
                        : "bg-white/5 border-white/15 text-text-dim"
                    }`}
                  >
                    {attackButtonLabel}
                  </button>

                  {summary && (
                    <motion.div
                      className="text-center min-h-[3.5rem]"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", damping: 18, stiffness: 180 }}
                    >
                      <motion.p
                        className="text-xl sm:text-2xl font-black uppercase tracking-tight"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                          color: summary.winner === "player" ? "#00f0ff" : summary.winner === "boss" ? "#ff3b5c" : "#9a9ab0",
                          textShadow: `0 0 20px ${summary.winner === "player" ? "rgba(0,240,255,0.5)" : summary.winner === "boss" ? "rgba(255,59,92,0.5)" : "transparent"}`
                        }}
                      >
                        {summary.winner === "player" ? "STRIKE ADVANTAGE" : summary.winner === "boss" ? "COUNTER HIT" : "EVEN TRADE"}
                      </motion.p>
                      <p className="text-[11px] sm:text-xs text-text-muted uppercase tracking-[0.2em] mt-1">
                        You dealt {summary.playerDamage} | Boss dealt {summary.bossDamage}
                      </p>
                    </motion.div>
                  )}
                </div>

                <div className="flex flex-col items-center gap-3" data-tutorial="boss-enemy-reel">
                  <div className="text-[11px] font-black uppercase tracking-[0.22em] text-accent">{boss.name} Spin</div>
                  <SyncedBossReel
                    items={bossReel}
                    spinning={!bossLanded}
                    landed={bossLanded}
                    accentColor="#ff2d95"
                  />
                  <div className="text-xs uppercase tracking-[0.2em]" style={{ color: bossQuality ? qualityColor(bossQuality) : "#9a9ab0" }}>
                    {bossQuality ? qualityText(bossQuality) : "Pending"}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {phase === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8 max-w-lg"
            >
              {won ? (
                <>
                  <ConfettiBurst color="#00f0ff" />
                  <motion.h2
                    className="text-6xl sm:text-8xl font-black uppercase tracking-tighter italic text-neon-cyan"
                    style={{ textShadow: "0 0 50px rgba(0,240,255,0.7)" }}
                    animate={prefersReducedMotion ? undefined : { opacity: [1, 0.9, 1] }}
                    transition={prefersReducedMotion ? undefined : { duration: 2.4, repeat: Infinity }}
                  >
                    Victory!
                  </motion.h2>

                  <div className="bg-surface-elevated/40 backdrop-blur-md rounded-[2.5rem] border-2 border-neon-cyan/30 p-10 space-y-6">
                    <p className="text-xs font-black uppercase tracking-[0.6em] text-white/40">Asset Recovery</p>
                    <div className="flex items-center justify-center gap-10">
                      <div className="text-center">
                        <p className="text-4xl font-black text-vault-gold">${boss.creditReward}</p>
                        <p className="text-[12px] text-text-dim uppercase tracking-widest mt-1">Credits</p>
                      </div>
                      <div className="text-center">
                        <p className="text-4xl font-black text-accent">{boss.xpReward}</p>
                        <p className="text-[12px] text-text-dim uppercase tracking-widest mt-1">XP</p>
                      </div>
                    </div>
                    {boss.specialItem && (
                      <div className="pt-6 border-t border-white/5">
                        <p className="text-xl font-black uppercase tracking-tight" style={{ color: RARITY_CONFIG[boss.specialItem.rarity].color }}>
                          {boss.specialItem.product}
                        </p>
                        <p className="text-[12px] text-text-muted mt-1 uppercase tracking-widest">
                          Special Item Drop — ${boss.specialItem.value}
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleClaimRewards}
                    className="px-12 py-4 rounded-2xl text-lg font-black uppercase tracking-[0.2em] bg-neon-cyan/10 border-2 border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/20 transition-all cursor-pointer shadow-[0_0_30px_rgba(0,240,255,0.2)]"
                  >
                    Claim Rewards
                  </button>
                </>
              ) : (
                <>
                  <h2
                    className="text-6xl sm:text-8xl font-black uppercase tracking-tighter italic text-error"
                    style={{ textShadow: "0 0 40px rgba(255,59,92,0.6)" }}
                  >
                    Defeated
                  </h2>
                  <p className="text-text-muted text-lg italic">{boss.name} has secured the sector.</p>
                  <div className="flex items-center justify-center gap-4 pt-4">
                    <button
                      onClick={handleRetry}
                      className="px-10 py-4 rounded-2xl text-sm font-black uppercase tracking-[0.2em] bg-accent/10 border-2 border-accent/30 text-accent hover:bg-accent/20 transition-all cursor-pointer"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={onClose}
                      className="px-10 py-4 rounded-2xl text-sm font-black uppercase tracking-[0.2em] bg-white/5 border border-white/10 text-text-muted hover:bg-white/10 transition-all cursor-pointer"
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
      <PageTutorial
        pageKey="boss-fight"
        steps={BOSS_FIGHT_TUTORIAL_STEPS}
        isActive={tutorialActive}
        onComplete={handleTutorialComplete}
      />
      {hasSeenBossFightTutorial && !tutorialActive && phase === "battle" && (
        <TutorialHelpButton onClick={() => setTutorialActive(true)} />
      )}
    </motion.div>
  );
}

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
  const prefersReducedMotion = useReducedMotion();
  const rowHeight = 40;
  const visibleRows = 4;
  const reelHeight = rowHeight * visibleRows;
  const landedIndex = 10;
  const displayItems = [...items, ...items, ...items];
  const landedRowIndex = items.length + landedIndex;
  const landedOffset = reelHeight / 2 - (landedRowIndex + 0.5) * rowHeight;
  const landedColor = landed ? displayItems[landedRowIndex]?.color ?? accentColor : accentColor;
  const y = useMotionValue(0);

  // 3-phase spin for boss reels (compressed timings)
  const [spinPhase, setSpinPhase] = useState(1);
  useEffect(() => {
    if (!spinning || prefersReducedMotion) {
      setSpinPhase(1);
      return;
    }
    setSpinPhase(1);
    const t1 = setTimeout(() => setSpinPhase(2), 800);
    const t2 = setTimeout(() => setSpinPhase(3), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [spinning, prefersReducedMotion]);

  const spinDuration = spinPhase === 1 ? 0.18 : spinPhase === 2 ? 0.3 : 0.48;

  return (
    <div className="relative w-full max-w-64 sm:max-w-72 md:max-w-80 lg:max-w-96 overflow-hidden rounded-[2rem] border-2 bg-surface/40 backdrop-blur-md"
      style={{
        height: `${reelHeight}px`,
        borderColor: landed ? `${landedColor}80` : "rgba(255,255,255,0.06)",
        boxShadow: landed
          ? `0 0 40px ${landedColor}30, inset 0 0 20px ${landedColor}10`
          : spinning
            ? `0 0 60px ${accentColor}25, 0 0 120px ${accentColor}10`
            : "none"
      }}
    >
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, ${accentColor} 0px, transparent 1px, transparent 4px)`,
          backgroundSize: "100% 4px"
        }}
      />
      <div className="absolute inset-0 z-20 pointer-events-none bg-linear-to-b from-bg via-transparent to-bg" />

      <motion.div
        className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[3px] z-30 pointer-events-none"
        animate={
          prefersReducedMotion
            ? undefined
            : {
                opacity: landed ? 1 : [0.3, 0.7, 0.3],
                scaleX: landed ? 1 : [0.95, 1, 0.95]
              }
        }
        transition={prefersReducedMotion ? undefined : { duration: 1.8, repeat: Infinity }}
        style={{
          backgroundColor: landed ? landedColor : "rgba(255,255,255,0.45)",
          boxShadow: `0 0 15px ${landed ? landedColor : "#ffffff"}`
        }}
      />

      <motion.div
        style={{ y }}
        animate={
          landed
            ? { y: landedOffset }
            : spinning
              ? prefersReducedMotion
                ? { y: landedOffset }
                : { y: [0, -(items.length * rowHeight)] }
              : { y: 0 }
        }
        transition={
          landed
            ? { duration: 1.1, ease: [0.12, 0.85, 0.2, 1.01] }
            : spinning
              ? prefersReducedMotion
                ? { duration: 0.6, ease: "easeOut" }
                : { duration: spinDuration, repeat: Infinity, ease: "linear" }
              : undefined
        }
        className="flex flex-col relative z-10"
      >
        {displayItems.map((item, i) => (
          <div
            key={i}
            className="h-10 flex items-center gap-3 px-6 shrink-0"
            style={{
              background: item.rarity === "legendary"
                ? `linear-gradient(90deg, transparent, ${item.color}12, transparent)`
                : undefined
            }}
          >
            <motion.div
              className="w-2 h-7 rounded-full shrink-0"
              animate={landed && i === landedRowIndex ? { scale: [1, 1.22, 1] } : undefined}
              style={{
                backgroundColor: item.color,
                boxShadow: `0 0 10px ${item.color}`
              }}
            />
            <span
              className="text-[13px] font-black uppercase tracking-widest italic"
              style={{
                color: item.color,
                textShadow: landed && i === landedRowIndex ? `0 0 10px ${item.color}` : "none"
              }}
            >
              {item.label}
            </span>
            {item.rarity === "legendary" && (
              <span className="text-[12px] animate-pulse" style={{ color: item.color }}>&#9733;</span>
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

const SyncedBossReel = memo(Reel);

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
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
          animate={{
            opacity: 0,
            x: particle.x,
            y: particle.y,
            rotate: Math.random() * 720,
            scale: particle.scale
          }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute w-2 h-2 rounded-sm"
          style={{ backgroundColor: particle.color }}
        />
      ))}
    </div>
  );
}
