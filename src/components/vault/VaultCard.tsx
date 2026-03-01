import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { VaultCardProps } from "../../types/vault";
import {
  RARITY_CONFIG,
  PREMIUM_BONUS_CHANCE,
  VALUE_RANGE_REDUCTION,
  getPrestigeOdds,
} from "../../data/vaults";
import { CYBER_TRANSITIONS } from "../../lib/motion-presets";
import { VaultContentsModal } from "./VaultContentsModal";
import type { VaultTierName } from "../../types/vault";

const PRESTIGE_COLORS: Record<number, string> = {
  1: "#ff8c00",
  2: "#9945ff",
  3: "#ff2d95",
};

const VAULT_HEADER_IMAGES: Record<VaultTierName, string> = {
  Bronze: "/images/vaults/headers/bronze_vl_header.png",
  Silver: "/images/vaults/headers/silver_vl_header.png",
  Gold: "/images/vaults/headers/gold_vl_header.png",
  Platinum: "/images/vaults/headers/platium_vl_header.png",
  Obsidian: "/images/vaults/headers/obsidian_vl_header.png",
  Diamond: "/images/vaults/headers/diamond_vl_header.png",
};

function getRailSegmentStyle(active: boolean) {
  return active
    ? {
        borderColor: "rgba(255,45,149,0.42)",
        background:
          "linear-gradient(180deg, rgba(255,45,149,0.2) 0%, rgba(19,11,20,0.92) 100%)",
        color: "#ff2d95",
        boxShadow:
          "0 0 18px rgba(255,45,149,0.16), inset 0 0 18px rgba(255,45,149,0.1)",
      }
    : {
        borderColor: "rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.02)",
        color: "rgba(238,244,251,0.88)",
      };
}

export function VaultCard({
  vault,
  index,
  balance,
  onSelect,
  disabled = false,
  prestigeLevel = 0,
  tutorialStepId = null,
  tutorialMode = null,
}: VaultCardProps & {
  prestigeLevel?: number;
  tutorialStepId?: string | null;
  tutorialMode?: "demo" | null;
}) {
  const [showOdds, setShowOdds] = useState(false);
  const [showContents, setShowContents] = useState(false);
  const isTutorialDemo = tutorialMode === "demo";
  const canAfford = isTutorialDemo || (!disabled && balance >= vault.price);
  const transparencyLocked =
    isTutorialDemo && tutorialStepId === "vault-transparency";
  const minPull = Math.max(
    1,
    Math.round(
      vault.price * RARITY_CONFIG.common.minMult - VALUE_RANGE_REDUCTION
    )
  );
  const maxPull = Math.round(
    vault.price * RARITY_CONFIG.legendary.maxMult - VALUE_RANGE_REDUCTION
  );
  const bonusChance = PREMIUM_BONUS_CHANCE[vault.name] ?? 0;
  const headerImage = VAULT_HEADER_IMAGES[vault.name as VaultTierName];
  const tutorialReadyToOpen = index === 0 && tutorialStepId === "vault-open";

  const handleSelect = () => {
    if (!canAfford) return;
    onSelect(vault);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={canAfford ? { y: -6, scale: 1.015 } : {}}
        animate={
          tutorialReadyToOpen
            ? {
                y: [0, -4, 0],
                scale: [1, 1.015, 1],
              }
            : undefined
        }
        transition={
          tutorialReadyToOpen
            ? {
                duration: 1.25,
                repeat: Infinity,
                ease: "easeInOut",
              }
            : { ...CYBER_TRANSITIONS.default, delay: index * 0.05 }
        }
        onClick={handleSelect}
        onKeyDown={(event) => {
          if (!canAfford) return;
          if (event.target !== event.currentTarget) return;
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          handleSelect();
        }}
        role="button"
        tabIndex={canAfford ? 0 : -1}
        aria-label={
          canAfford
            ? `Open ${vault.name} vault`
            : `${vault.name} vault requires more credits`
        }
        className={`group relative h-full ${!canAfford ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        <div
          className={`relative flex h-full flex-col overflow-hidden rounded-[20px] border bg-[#09121a] ${!canAfford ? "opacity-45 grayscale" : ""}`}
          {...(index === 0
            ? { "data-tutorial": "vault-entry" }
            : vault.name === "Diamond"
              ? { "data-tutorial": "vault-diamond" }
              : vault.name === "Bronze"
                ? { "data-tutorial": "vault-bronze" }
                : {})}
          style={{
            borderColor: `${vault.color}44`,
            boxShadow: canAfford
              ? `0 22px 56px rgba(0,0,0,0.32), 0 0 24px rgba(255,45,149,0.08), 0 0 18px ${vault.color}14, inset 0 1px 0 rgba(255,255,255,0.05)`
              : undefined,
            outline: tutorialReadyToOpen
              ? "1px solid rgba(255,45,149,0.5)"
              : undefined,
          }}
        >
          <div className="relative h-40 overflow-hidden border-b border-white/8 sm:h-44 md:h-48">
            <img
              src={headerImage}
              alt={`${vault.name} vault header`}
              className="h-full w-full object-cover object-center"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/62" />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, transparent 0%, ${vault.color}10 74%, ${vault.color}18 100%)`,
              }}
            />
          </div>

          <div className="relative z-10 flex flex-1 flex-col px-4 py-4 sm:px-4.5 sm:py-4.5">
            <div className="min-w-0">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-black uppercase tracking-[0.01em] text-white sm:text-xl">
                  {vault.name}
                </h3>
                <div className="shrink-0 rounded-[12px] border border-neon-green/30 bg-neon-green/8 px-3 py-2 text-right shadow-[0_0_18px_rgba(105,231,160,0.12)]">
                  <p className="text-base font-black uppercase tracking-[0.08em] text-neon-green text-glow-green sm:text-lg">
                    ${vault.price}
                  </p>
                </div>
              </div>
              {bonusChance > 0 && (
                <p className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-accent">
                  Bonus Lock {Math.round(bonusChance * 100)}%
                </p>
              )}
            </div>

            <div className="mt-4 text-center">
              <p className="system-label text-neon-green/80">Value Range</p>
              <p className="mt-1 text-[11px] font-black uppercase tracking-[0.22em] text-white sm:text-sm">
                ${minPull} - ${maxPull}
              </p>
              <div className="mx-auto mt-2 h-px w-full max-w-[210px] bg-gradient-to-r from-transparent via-neon-green/60 to-transparent" />
            </div>

            <div className="system-rail mt-4 p-1">
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    if (transparencyLocked) return;
                    setShowContents(true);
                  }}
                  disabled={transparencyLocked}
                  className={`command-segment rounded-[10px] border px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.18em] transition-all duration-200 ${
                    transparencyLocked
                      ? "cursor-not-allowed opacity-65"
                      : "hover:-translate-y-px"
                  }`}
                  data-tutorial="vault-contents"
                  style={getRailSegmentStyle(showContents)}
                >
                  Contents
                </button>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    if (transparencyLocked) return;
                    setShowOdds(!showOdds);
                  }}
                  disabled={transparencyLocked}
                  className={`command-segment rounded-[10px] border px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.18em] transition-all duration-200 ${
                    transparencyLocked
                      ? "cursor-not-allowed opacity-65"
                      : "hover:-translate-y-px"
                  }`}
                  data-tutorial="vault-odds"
                  style={getRailSegmentStyle(showOdds)}
                >
                  Odds
                </button>
              </div>
            </div>

            {showOdds && (
              <div className="mt-4 rounded-[18px] border border-white/8 bg-white/[0.02] px-4 py-4">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-[8px] font-mono uppercase tracking-[0.28em] text-white/42">
                    Extraction Odds
                  </p>
                  <p className="text-[8px] font-mono uppercase tracking-[0.28em] text-accent">
                    Prestige {prestigeLevel}
                  </p>
                </div>
                <div className="space-y-4">
                  {(
                    Object.entries(
                      getPrestigeOdds(vault.rarities, prestigeLevel)
                    ) as [string, number][]
                  ).map(([rarity, chance]) => {
                    const rarityColor = getRarityColor(rarity);
                    const cfg =
                      RARITY_CONFIG[rarity as keyof typeof RARITY_CONFIG];
                    const baseChance =
                      vault.rarities[rarity as keyof typeof vault.rarities];
                    const delta = +(chance - baseChance).toFixed(1);
                    return (
                      <div key={rarity} className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className="text-[11px] font-black uppercase tracking-[0.18em]"
                            style={{ color: rarityColor }}
                          >
                            {rarity}
                          </span>
                          <div className="text-right">
                            <span className="text-sm font-black text-white">
                              {baseChance}%
                            </span>
                            {prestigeLevel > 0 && delta !== 0 && (
                              <span
                                className="ml-2 text-[11px] font-black"
                                style={{
                                  color: PRESTIGE_COLORS[prestigeLevel],
                                }}
                              >
                                {delta > 0 ? "+" : ""}
                                {delta}%
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="system-kicker">
                            $
                            {Math.max(
                              1,
                              Math.round(
                                vault.price * cfg.minMult -
                                  VALUE_RANGE_REDUCTION
                              )
                            )}{" "}
                            to $
                            {Math.round(
                              vault.price * cfg.maxMult - VALUE_RANGE_REDUCTION
                            )}
                          </span>
                          <span className="system-kicker">{chance}% tuned</span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full border border-white/8 bg-black/40">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${chance}%` }}
                            transition={{ duration: 0.9, ease: "easeOut" }}
                            className="h-full"
                            style={{
                              background: `linear-gradient(90deg, ${rarityColor}66 0%, ${rarityColor} 100%)`,
                              boxShadow: `0 0 16px ${rarityColor}40`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-auto pt-5">
              <div
                className={`flex items-center justify-center text-center text-[10px] font-black uppercase tracking-[0.26em] ${
                  canAfford ? "text-accent" : "text-text-dim"
                }`}
                style={{
                  textShadow: canAfford
                    ? "0 0 16px rgba(255,45,149,0.22)"
                    : undefined,
                }}
              >
                {canAfford ? "Tap Vault to Open" : "Insufficient Credits"}
              </div>
            </div>
          </div>

          {!canAfford && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "repeating-linear-gradient(45deg, transparent, transparent 22px, rgba(255,59,92,0.06) 22px, rgba(255,59,92,0.06) 24px)",
              }}
            />
          )}
        </div>

        {canAfford && (
          <div
            className="absolute inset-0 -z-10 rounded-[24px] opacity-0 blur-[52px] transition-opacity duration-500 group-hover:opacity-30"
            style={{ backgroundColor: "#ff2d95" }}
          />
        )}
      </motion.div>

      <AnimatePresence>
        {showContents && (
          <VaultContentsModal
            vault={vault}
            prestigeLevel={prestigeLevel}
            onClose={() => setShowContents(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function getRarityColor(rarity: string) {
  switch (rarity) {
    case "common":
      return "#6B7280";
    case "uncommon":
      return "#3B82F6";
    case "rare":
      return "#a855f7";
    case "legendary":
      return "#FFD700";
    default:
      return "white";
  }
}
