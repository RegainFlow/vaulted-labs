import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { RARITY_CONFIG, VAULTS } from "../../data/vaults";
import type { FunkoItem } from "../../types/funko";
import type { Rarity, VaultTierName } from "../../types/vault";

const CARD_ASSETS: Record<Rarity, string> = {
  common: "/images/spinner/common_card.jpeg",
  uncommon: "/images/spinner/uncommon_card.jpeg",
  rare: "/images/spinner/rare_card.jpeg",
  legendary: "/images/spinner/legendary_card.jpeg",
};

interface VaultOverrideTrackProps {
  vaultTier: VaultTierName;
  wonFunko: FunkoItem;
  extracting: boolean;
  locked: boolean;
  spinDurationMs: number;
  chargeProgress?: number;
}

interface RarityCapsuleProps {
  rarity: Rarity;
  width: number;
  height: number;
  locked?: boolean;
  highlightColor?: string;
}

interface TrackTile {
  id: string;
  rarity: Rarity;
}

interface TrackTileCardProps {
  tile: TrackTile;
  index: number;
  itemSpan: number;
  tileWidth: number;
  tileHeight: number;
  containerWidth: number;
  x: MotionValue<number>;
  landedIndex: number;
  locked: boolean;
  prefersReducedMotion: boolean | null;
}

const TRACK_ITEM_COUNT = 14;
const TRACK_REPEAT_COUNT = 7;
const LAND_REPEAT_INDEX = 3;
const ENTRY_REPEAT_INDEX = 6;
const WINNING_INDEX = 10;
const PREVIEW_INDEX = 5;
const CENTER_CARD_LIFT = -8;
const LOCK_FRAME_PAD_X = 14;
const LOCK_FRAME_PAD_Y = 10;
const LOCK_SETTLE_CARD_RATIO = 0.34;
const LOCK_SETTLE_START = 0.91;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

function lerp(start: number, end: number, amount: number) {
  return start + (end - start) * amount;
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

function easeOutQuart(value: number) {
  return 1 - Math.pow(1 - value, 4);
}

function getTrackTravelPosition(
  progress: number,
  from: number,
  to: number,
  itemSpan: number
) {
  const direction = Math.sign(to - from) || 1;
  const settleTarget = to + itemSpan * LOCK_SETTLE_CARD_RATIO * direction;

  if (progress <= LOCK_SETTLE_START) {
    return lerp(
      from,
      settleTarget,
      easeOutCubic(progress / LOCK_SETTLE_START)
    );
  }

  return lerp(
    settleTarget,
    to,
    easeOutQuart((progress - LOCK_SETTLE_START) / (1 - LOCK_SETTLE_START))
  );
}

function seedFromString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function seededUnit(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function pickWeightedRarity(
  weights: Record<Rarity, number>,
  seed: number
): Rarity {
  const rarities: Rarity[] = ["common", "uncommon", "rare", "legendary"];
  const total = rarities.reduce((sum, rarity) => sum + weights[rarity], 0);
  let cursor = seededUnit(seed) * total;

  for (const rarity of rarities) {
    cursor -= weights[rarity];
    if (cursor <= 0) return rarity;
  }

  return "common";
}

function getCapsuleShadow(
  rarity: Rarity,
  intensity: "soft" | "strong" = "soft"
) {
  if (rarity === "legendary") {
    return intensity === "strong"
      ? "0 0 36px rgba(255,215,0,0.38), 0 0 80px rgba(255,215,0,0.18)"
      : "0 0 24px rgba(255,215,0,0.22)";
  }
  if (rarity === "rare") {
    return intensity === "strong"
      ? "0 0 28px rgba(168,85,247,0.32), 0 0 52px rgba(168,85,247,0.14)"
      : "0 0 18px rgba(168,85,247,0.2)";
  }
  if (rarity === "uncommon") {
    return intensity === "strong"
      ? "0 0 24px rgba(59,130,246,0.28), 0 0 42px rgba(59,130,246,0.1)"
      : "0 0 16px rgba(59,130,246,0.18)";
  }
  return intensity === "strong"
    ? "0 0 20px rgba(255,255,255,0.12)"
    : "0 0 12px rgba(255,255,255,0.08)";
}

function getDistanceUnits(
  currentX: number,
  containerWidth: number,
  tileCenter: number,
  itemSpan: number
) {
  const centerWorldX = -currentX + containerWidth / 2;
  return Math.abs(centerWorldX - tileCenter) / itemSpan;
}

function getScaleForDistance(distanceUnits: number) {
  if (distanceUnits <= 1) {
    return lerp(1, 0.92, distanceUnits);
  }
  if (distanceUnits <= 2) {
    return lerp(0.92, 0.84, distanceUnits - 1);
  }
  return clamp(0.84 - (distanceUnits - 2) * 0.04, 0.8, 0.84);
}

function getOpacityForDistance(distanceUnits: number) {
  if (distanceUnits <= 1) {
    return lerp(1, 0.86, distanceUnits);
  }
  if (distanceUnits <= 2) {
    return lerp(0.86, 0.7, distanceUnits - 1);
  }
  return clamp(0.7 - (distanceUnits - 2) * 0.06, 0.6, 0.7);
}

function getLiftForDistance(distanceUnits: number) {
  if (distanceUnits <= 1) {
    return lerp(CENTER_CARD_LIFT, -4, distanceUnits);
  }
  if (distanceUnits <= 2) {
    return lerp(-4, -1.5, distanceUnits - 1);
  }
  return 0;
}

function buildTrackStrip(
  vaultTier: VaultTierName,
  wonFunko: FunkoItem
): TrackTile[] {
  const seed = seedFromString(`${vaultTier}:${wonFunko.id}:${wonFunko.rarity}`);
  const vaultConfig = VAULTS.find((vault) => vault.name === vaultTier)
    ?.rarities ?? {
    common: 50,
    uncommon: 30,
    rare: 15,
    legendary: 5,
  };

  return Array.from({ length: TRACK_ITEM_COUNT }).map((_, index) => {
    if (index === WINNING_INDEX) {
      return {
        id: `winning-${wonFunko.id}`,
        rarity: wonFunko.rarity,
      };
    }

    const rarity = pickWeightedRarity(vaultConfig, seed + index * 17.13);
    return {
      id: `tile-${index}-${rarity}`,
      rarity,
    };
  });
}

export function RarityCapsule({
  rarity,
  width,
  height,
  locked = false,
  highlightColor,
}: RarityCapsuleProps) {
  const rarityColor = RARITY_CONFIG[rarity].color;
  const frameColor = highlightColor ?? rarityColor;

  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-[24px] border bg-black/70"
      style={{
        width,
        height,
        borderColor: locked ? `${frameColor}aa` : "rgba(255,255,255,0.12)",
        boxShadow: locked
          ? `${getCapsuleShadow(rarity, "strong")}, inset 0 0 24px ${frameColor}20`
          : `${getCapsuleShadow(rarity, "soft")}, inset 0 0 16px rgba(255,255,255,0.04)`,
      }}
    >
      <div className="absolute inset-[3px] overflow-hidden rounded-[21px]">
        <img
          src={CARD_ASSETS[rarity]}
          alt={`${rarity} vault capsule`}
          className="h-full w-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/14 via-transparent to-black/74" />
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background:
              "linear-gradient(118deg, rgba(255,255,255,0.16) 0%, transparent 22%, transparent 68%, rgba(255,255,255,0.1) 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 top-0 h-14"
          style={{
            background: `linear-gradient(180deg, ${rarityColor}24 0%, transparent 100%)`,
          }}
        />
        <div className="absolute inset-0 opacity-[0.13] mix-blend-screen">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "repeating-linear-gradient(180deg, rgba(255,255,255,0.7) 0px, transparent 2px, transparent 6px)",
            }}
          />
        </div>
        <div
          className="absolute inset-x-[10%] top-3 h-px"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${frameColor}88 50%, transparent 100%)`,
            opacity: locked ? 0.92 : 0.52,
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-16"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(3,6,12,0.08) 40%, rgba(3,6,12,0.7) 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-10"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${frameColor}10 100%)`,
            opacity: locked ? 0.94 : 0.68,
          }}
        />
      </div>
    </div>
  );
}

function TrackTileCard({
  tile,
  index,
  itemSpan,
  tileWidth,
  tileHeight,
  containerWidth,
  x,
  landedIndex,
  locked,
  prefersReducedMotion,
}: TrackTileCardProps) {
  const rarityColor = RARITY_CONFIG[tile.rarity].color;
  const tileCenter = index * itemSpan + tileWidth / 2;
  const distanceUnits = useTransform(x, (currentX) => {
    if (!containerWidth) return 2.5;
    return getDistanceUnits(currentX, containerWidth, tileCenter, itemSpan);
  });
  const scale = useTransform(distanceUnits, getScaleForDistance);
  const translateY = useTransform(distanceUnits, (value) =>
    prefersReducedMotion
      ? getLiftForDistance(value) * 0.5
      : getLiftForDistance(value)
  );
  const opacity = useTransform(distanceUnits, getOpacityForDistance);
  const layer = useTransform(
    distanceUnits,
    (value) => 10 + Math.round((1 - clamp(value / 3, 0, 1)) * 20)
  );
  const isLockedTile = locked && index === landedIndex;
  const focusColor = isLockedTile ? "#ff2d95" : rarityColor;

  return (
    <motion.div
      className="relative shrink-0"
      style={{
        width: tileWidth,
        height: tileHeight,
        scale,
        y: translateY,
        opacity,
        zIndex: layer,
        willChange: "transform, opacity",
      }}
    >
      <motion.div
        animate={
          isLockedTile && !prefersReducedMotion
            ? { scale: [1.02, 1.05, 1.03] }
            : { scale: 1 }
        }
        transition={
          isLockedTile && !prefersReducedMotion
            ? { duration: 0.32, ease: "easeOut" }
            : { duration: 0.18, ease: "easeOut" }
        }
        className="relative h-full w-full"
        style={{
          boxShadow: isLockedTile
            ? `0 0 18px ${focusColor}26`
            : "0 12px 24px rgba(0,0,0,0.18)",
        }}
      >
        <RarityCapsule
          rarity={tile.rarity}
          width={tileWidth}
          height={tileHeight}
          locked={isLockedTile}
          highlightColor={focusColor}
        />
      </motion.div>
    </motion.div>
  );
}

export function VaultOverrideTrack({
  vaultTier,
  wonFunko,
  extracting,
  locked,
  spinDurationMs,
  chargeProgress = 0,
}: VaultOverrideTrackProps) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackFrameRef = useRef<number | null>(null);
  const spinStartTimeRef = useRef<number | null>(null);
  const spinFromRef = useRef(0);
  const spinTargetRef = useRef(0);
  const x = useMotionValue(0);

  const stripItems = useMemo(
    () => buildTrackStrip(vaultTier, wonFunko),
    [vaultTier, wonFunko]
  );
  const displayItems = useMemo(
    () => Array.from({ length: TRACK_REPEAT_COUNT }, () => stripItems).flat(),
    [stripItems]
  );

  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const syncWidth = () => {
      setContainerWidth(node.getBoundingClientRect().width);
    };

    syncWidth();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", syncWidth);
      return () => window.removeEventListener("resize", syncWidth);
    }

    const observer = new ResizeObserver(() => syncWidth());
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const tileWidth = useMemo(() => {
    if (!containerWidth) return 140;
    const base =
      containerWidth < 480
        ? containerWidth / 2.55
        : containerWidth < 820
          ? containerWidth / 3.75
          : containerWidth / 5.1;
    return clamp(base, 138, 292);
  }, [containerWidth]);

  const tileHeight = tileWidth * 1.44;
  const gap = clamp(tileWidth * 0.06, 10, 14);
  const itemSpan = tileWidth + gap;
  const previewIndex = ENTRY_REPEAT_INDEX * stripItems.length + PREVIEW_INDEX;
  const landedIndex = LAND_REPEAT_INDEX * stripItems.length + WINNING_INDEX;
  const idleOffset =
    containerWidth / 2 - (previewIndex * itemSpan + tileWidth / 2);
  const landedOffset =
    containerWidth / 2 - (landedIndex * itemSpan + tileWidth / 2);

  const stopTrackMotion = () => {
    if (trackFrameRef.current) {
      window.cancelAnimationFrame(trackFrameRef.current);
      trackFrameRef.current = null;
    }
    spinStartTimeRef.current = null;
  };

  const startTrackMotion = (from: number, to: number) => {
    stopTrackMotion();
    spinFromRef.current = from;
    spinTargetRef.current = to;

    const tick = (now: number) => {
      if (spinStartTimeRef.current == null) {
        spinStartTimeRef.current = now;
      }
      const progress = clamp(
        (now - spinStartTimeRef.current) / spinDurationMs,
        0,
        1
      );
      x.set(
        getTrackTravelPosition(
          progress,
          spinFromRef.current,
          spinTargetRef.current,
          itemSpan
        )
      );

      if (progress < 1) {
        trackFrameRef.current = window.requestAnimationFrame(tick);
        return;
      }

      trackFrameRef.current = null;
      spinStartTimeRef.current = null;
      x.set(spinTargetRef.current);
    };

    trackFrameRef.current = window.requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (!containerWidth) return;

    if (locked) {
      stopTrackMotion();
      x.set(landedOffset);
      return;
    }

    if (!extracting) {
      stopTrackMotion();
      x.set(idleOffset);
      return;
    }

    if (prefersReducedMotion) {
      stopTrackMotion();
      x.set(landedOffset);
      return;
    }

    startTrackMotion(x.get(), landedOffset);

    return () => stopTrackMotion();
  }, [
    containerWidth,
    extracting,
    idleOffset,
    landedOffset,
    locked,
    prefersReducedMotion,
    spinDurationMs,
    x,
  ]);

  useEffect(() => {
    return () => {
      stopTrackMotion();
    };
  }, []);

  const lockColor = "#ff2d95";
  const lockWidth = tileWidth + LOCK_FRAME_PAD_X * 2;
  const lockHeight = tileHeight + LOCK_FRAME_PAD_Y * 2;
  const bracketLength = containerWidth < 640 ? 18 : 22;
  const bracketThickness = 3;
  const lockOpacity = locked
    ? 0.94
    : extracting
      ? 0.74
      : 0.56 + chargeProgress * 0.16;

  return (
    <div className="relative w-full">
      <div
        ref={containerRef}
        className="relative mx-auto w-full overflow-hidden"
        style={{ minHeight: tileHeight + 36 }}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-12 bg-gradient-to-r from-bg via-bg/72 to-transparent sm:w-[72px]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-12 bg-gradient-to-l from-bg via-bg/72 to-transparent sm:w-[72px]" />

        <div
          className="relative py-3 sm:py-4"
          style={{ minHeight: tileHeight + 20 }}
        >
          <motion.div
            initial={false}
            style={{ x, gap }}
            className="relative z-10 flex items-center py-2"
          >
            {displayItems.map((tile, index) => (
              <TrackTileCard
                key={`${tile.id}-${index}`}
                tile={tile}
                index={index}
                itemSpan={itemSpan}
                tileWidth={tileWidth}
                tileHeight={tileHeight}
                containerWidth={containerWidth}
                x={x}
                landedIndex={landedIndex}
                locked={locked}
                prefersReducedMotion={prefersReducedMotion}
              />
            ))}
          </motion.div>

          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
            animate={{
              opacity:
                locked && !prefersReducedMotion
                  ? [lockOpacity, 1, 0.92]
                  : lockOpacity,
            }}
            transition={{
              duration: locked ? 0.26 : 0.18,
              ease: "easeOut",
            }}
            style={{
              width: lockWidth,
              height: lockHeight,
              y: prefersReducedMotion
                ? CENTER_CARD_LIFT * 0.5
                : CENTER_CARD_LIFT,
            }}
          >
            {[
              { top: 0, left: 0, horizontal: "left", vertical: "top" },
              { top: 0, right: 0, horizontal: "right", vertical: "top" },
              { bottom: 0, left: 0, horizontal: "left", vertical: "bottom" },
              { bottom: 0, right: 0, horizontal: "right", vertical: "bottom" },
            ].map((corner, index) => (
              <div
                key={index}
                className="absolute"
                style={{
                  top: "top" in corner ? corner.top : undefined,
                  right: "right" in corner ? corner.right : undefined,
                  bottom: "bottom" in corner ? corner.bottom : undefined,
                  left: "left" in corner ? corner.left : undefined,
                }}
              >
                <div
                  className="absolute rounded-full"
                  style={{
                    top: corner.vertical === "top" ? 0 : "auto",
                    bottom: corner.vertical === "bottom" ? 0 : "auto",
                    left: corner.horizontal === "left" ? 0 : "auto",
                    right: corner.horizontal === "right" ? 0 : "auto",
                    width: bracketLength,
                    height: bracketThickness,
                    backgroundColor: lockColor,
                    boxShadow: `0 0 10px ${lockColor}90`,
                  }}
                />
                <div
                  className="absolute rounded-full"
                  style={{
                    top: corner.vertical === "top" ? 0 : "auto",
                    bottom: corner.vertical === "bottom" ? 0 : "auto",
                    left: corner.horizontal === "left" ? 0 : "auto",
                    right: corner.horizontal === "right" ? 0 : "auto",
                    width: bracketThickness,
                    height: bracketLength,
                    backgroundColor: lockColor,
                    boxShadow: `0 0 10px ${lockColor}90`,
                  }}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
