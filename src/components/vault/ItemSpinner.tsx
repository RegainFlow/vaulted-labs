import { useState, useEffect, useMemo, useRef } from "react";
import { motion, useMotionValue, useReducedMotion } from "motion/react";
import { FunkoImage } from "../shared/FunkoImage";
import { SPIN_PHASES } from "../../lib/motion-presets";
import { RARITY_CONFIG } from "../../data/vaults";
import { getVaultItems, pickFunko } from "../../data/funkos";
import type { FunkoItem } from "../../types/funko";
import type { Rarity, VaultTierName } from "../../types/vault";

interface ItemSpinnerProps {
  vaultTier: VaultTierName;
  wonFunko: FunkoItem;
  spinning: boolean;
  landed: boolean;
  accentColor: string;
}

const SLOT_HEIGHT = 96;
const VISIBLE_SLOTS = 5;
const REEL_HEIGHT = SLOT_HEIGHT * VISIBLE_SLOTS;
const LANDED_INDEX = 10;

function buildReelStrip(vaultTier: VaultTierName, wonFunko: FunkoItem): FunkoItem[] {
  const pool = getVaultItems(vaultTier);
  const rarities: Rarity[] = ["common", "uncommon", "rare", "legendary"];
  const weights = [50, 30, 15, 5];

  function weightedRandomRarity(): Rarity {
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < rarities.length; i++) {
      r -= weights[i];
      if (r <= 0) return rarities[i];
    }
    return "common";
  }

  function randomFromPool(rarity: Rarity): FunkoItem {
    const candidates = pool.filter((f) => f.rarity === rarity);
    if (candidates.length === 0) return pickFunko(vaultTier, rarity);
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  const items: FunkoItem[] = [];

  // 8 weighted-random items
  for (let i = 0; i < 8; i++) {
    items.push(randomFromPool(weightedRandomRarity()));
  }

  // 1 guaranteed legendary (near-miss)
  items.push(randomFromPool("legendary"));

  // 1 buffer
  items.push(randomFromPool(weightedRandomRarity()));

  // Won item at position 10
  items.push(wonFunko);

  // 1 tail buffer
  items.push(randomFromPool(weightedRandomRarity()));

  return items;
}

export function ItemSpinner({
  vaultTier,
  wonFunko,
  spinning,
  landed,
  accentColor,
}: ItemSpinnerProps) {
  const prefersReducedMotion = useReducedMotion();
  const stripItems = useMemo(() => buildReelStrip(vaultTier, wonFunko), [vaultTier, wonFunko]);
  const displayItems = useMemo(() => [...stripItems, ...stripItems, ...stripItems], [stripItems]);
  const landedRowIndex = stripItems.length + LANDED_INDEX;
  const landedOffset = REEL_HEIGHT / 2 - (landedRowIndex + 0.5) * SLOT_HEIGHT;
  const y = useMotionValue(0);

  const landedColor = landed
    ? RARITY_CONFIG[displayItems[landedRowIndex]?.rarity]?.color ?? accentColor
    : accentColor;

  // Spin phase tracking
  const [spinPhase, setSpinPhase] = useState(1);
  const [nearMissFlash, setNearMissFlash] = useState(false);
  const nearMissFiredRef = useRef(false);

  useEffect(() => {
    nearMissFiredRef.current = false;
    if (!spinning || prefersReducedMotion) {
      const resetTimer = window.setTimeout(() => setSpinPhase(1), 0);
      return () => window.clearTimeout(resetTimer);
    }
    const resetTimer = window.setTimeout(() => setSpinPhase(1), 0);
    const t1 = window.setTimeout(() => setSpinPhase(2), 1500);
    const t2 = window.setTimeout(() => setSpinPhase(3), 3500);
    return () => {
      window.clearTimeout(resetTimer);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [spinning, prefersReducedMotion]);

  // Near-miss detection: legendary crossing center during phase 3
  useEffect(() => {
    if (!spinning || spinPhase !== 3 || prefersReducedMotion) return;
    const unsubscribe = y.on("change", (currentY: number) => {
      if (nearMissFiredRef.current) return;
      const centerWorldY = -currentY + REEL_HEIGHT / 2;
      for (let copy = 0; copy < 3; copy++) {
        const legendaryIdx = copy * stripItems.length + 8;
        const rowCenter = legendaryIdx * SLOT_HEIGHT + SLOT_HEIGHT / 2;
        if (Math.abs(centerWorldY - rowCenter) < SLOT_HEIGHT * 0.6) {
          nearMissFiredRef.current = true;
          setNearMissFlash(true);
          setTimeout(() => setNearMissFlash(false), 300);
          break;
        }
      }
    });
    return () => unsubscribe();
  }, [spinning, spinPhase, y, stripItems.length, prefersReducedMotion]);

  const spinDuration = spinPhase === 1
    ? SPIN_PHASES.blitz.duration
    : spinPhase === 2
      ? SPIN_PHASES.cruise.duration
      : SPIN_PHASES.tension.duration;

  // Blur intensity based on phase
  const blurClass = spinning && !prefersReducedMotion
    ? spinPhase === 1
      ? "[&_*]:blur-[1px]"
      : spinPhase === 2
        ? "[&_*]:blur-[0.5px]"
        : ""
    : "";

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto">
      <div
        className="relative w-full overflow-hidden rounded-2xl border-2 bg-surface/40 backdrop-blur-md transition-all duration-700"
        style={{
          height: `${REEL_HEIGHT}px`,
          borderColor: landed ? `${landedColor}80` : nearMissFlash ? "#FFD700" : `${accentColor}40`,
          boxShadow: landed
            ? `0 0 50px ${landedColor}30, inset 0 0 25px ${landedColor}10`
            : nearMissFlash
              ? "0 0 60px rgba(255,215,0,0.4)"
              : spinning
                ? `0 0 60px ${accentColor}25`
                : `0 0 20px ${accentColor}10`
        }}
      >
        {/* CRT scanline overlay */}
        <div
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, ${accentColor} 0px, transparent 1px, transparent 4px)`,
            backgroundSize: "100% 4px"
          }}
        />

        {/* Top/bottom gradient fade */}
        <div className="absolute inset-0 z-20 pointer-events-none bg-linear-to-b from-bg via-transparent to-bg" />

        {/* Center indicator */}
        <div
          className="absolute left-0 right-0 top-1/2 -translate-y-1/2 z-30 pointer-events-none flex items-center"
          style={{ height: `${SLOT_HEIGHT}px` }}
        >
          {/* Left arrow */}
          <div className="w-3 h-8 -ml-0.5" style={{ borderRight: `3px solid ${landed ? landedColor : accentColor}`, borderTop: "3px solid transparent", borderBottom: "3px solid transparent", opacity: 0.7 }} />
          {/* Glow frame */}
          <div
            className="flex-1 h-full border-y-2 transition-all duration-300"
            style={{
              borderColor: `${landed ? landedColor : accentColor}60`,
              boxShadow: `inset 0 0 20px ${landed ? landedColor : accentColor}15`
            }}
          />
          {/* Right arrow */}
          <div className="w-3 h-8 -mr-0.5" style={{ borderLeft: `3px solid ${landed ? landedColor : accentColor}`, borderTop: "3px solid transparent", borderBottom: "3px solid transparent", opacity: 0.7 }} />
        </div>

        {/* Reel content */}
        <motion.div
          initial={{ y: 0 }}
          style={{ y }}
          animate={
            landed
              ? { y: landedOffset }
              : spinning
                ? prefersReducedMotion
                  ? { y: landedOffset }
                  : { y: [0, -(stripItems.length * SLOT_HEIGHT)] }
                : { y: 0 }
          }
          transition={
            landed
              ? { duration: SPIN_PHASES.land.duration, ease: SPIN_PHASES.land.ease }
              : spinning
                ? prefersReducedMotion
                  ? { duration: 1, ease: "easeOut" }
                  : { duration: spinDuration, repeat: Infinity, ease: "linear" }
                : undefined
          }
          className={`flex flex-col relative z-10 ${blurClass}`}
        >
          {displayItems.map((funko, i) => {
            const isLandedItem = landed && i === landedRowIndex;
            const isNearCenter = landed && Math.abs(i - landedRowIndex) <= 2;
            const distFromCenter = landed ? Math.abs(i - landedRowIndex) : 0;
            const scale = isLandedItem ? 1 : isNearCenter ? 1 - distFromCenter * 0.08 : 0.85;
            const opacity = isLandedItem ? 1 : landed ? (isNearCenter ? 0.4 - distFromCenter * 0.1 : 0.15) : 0.7;

            return (
              <div
                key={i}
                className="flex items-center gap-3 px-4 shrink-0 transition-all duration-300"
                style={{
                  height: `${SLOT_HEIGHT}px`,
                  opacity,
                  transform: `scale(${scale})`
                }}
              >
                <FunkoImage
                  name={funko.name}
                  rarity={funko.rarity}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-bold truncate"
                    style={{
                      color: isLandedItem
                        ? RARITY_CONFIG[funko.rarity].color
                        : `${RARITY_CONFIG[funko.rarity].color}80`
                    }}
                  >
                    {funko.name}
                  </p>
                  <p
                    className="text-[10px] font-black uppercase tracking-wider"
                    style={{
                      color: isLandedItem
                        ? RARITY_CONFIG[funko.rarity].color
                        : `${RARITY_CONFIG[funko.rarity].color}40`
                    }}
                  >
                    {funko.rarity}
                  </p>
                </div>
                {isLandedItem && funko.rarity === "legendary" && (
                  <span className="text-lg animate-pulse" style={{ color: RARITY_CONFIG.legendary.color }}>&#9733;</span>
                )}
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
