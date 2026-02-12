import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { VAULTS, RARITY_CONFIG, PRODUCT_TYPES, pickRarity, pickValue, pickProduct } from "../data/vaults";
import type { Vault } from "../data/vaults";
import { VaultCard } from "./VaultCard";
import { VaultIcon } from "./VaultIcons";
import { useGame } from "../context/GameContext";
import type { VaultTierName, Rarity } from "../types/game";

export function VaultGrid() {
  const { balance, purchaseVault, claimCreditsFromReveal, addItem, shipItem } = useGame();
  const navigate = useNavigate();
  const [selectedVault, setSelectedVault] = useState<Vault | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>("Funko Pop!");

  const handleSelect = (vault: Vault) => {
    if (!purchaseVault(vault.name, vault.price)) return;
    setSelectedVault(vault);
  };

  const handleClaim = (amount: number) => {
    claimCreditsFromReveal(amount);
    setSelectedVault(null);
  };

  const handleStore = (product: string, vaultTier: VaultTierName, rarity: Rarity, value: number) => {
    addItem(product, vaultTier, rarity, value);
    setSelectedVault(null);
  };

  const handleShip = (product: string, vaultTier: VaultTierName, rarity: Rarity, value: number) => {
    const item = addItem(product, vaultTier, rarity, value);
    shipItem(item.id);
    setSelectedVault(null);
  };

  const minPrice = Math.min(...VAULTS.map(v => v.price));
  const isBroke = balance < minPrice && !selectedVault;

  return (
    <section className="relative overflow-hidden bg-bg px-4 sm:px-6 py-12 md:py-24 pt-24 md:pt-28 min-h-screen">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "40px 40px"
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">
            Vault <span className="text-accent">Protocol</span>
          </h2>
          <p className="mx-auto max-w-2xl text-text-muted">
            Select a category, then choose your containment tier.
          </p>
        </motion.div>

        {/* Category Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {PRODUCT_TYPES.map((cat) => {
            const isEnabled = cat === "Funko Pop!";
            return (
              <button
                key={cat}
                onClick={() => isEnabled && setSelectedCategory(selectedCategory === cat ? null : cat)}
                disabled={!isEnabled}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider border transition-all duration-300 ${
                  !isEnabled
                    ? "bg-surface/50 border-white/5 text-text-dim cursor-not-allowed opacity-50"
                    : selectedCategory === cat
                      ? "bg-accent/20 border-accent text-accent shadow-[0_0_15px_rgba(255,45,149,0.2)] cursor-pointer"
                      : "bg-surface border-white/10 text-text-muted hover:border-white/20 hover:text-white cursor-pointer"
                }`}
              >
                {cat}{!isEnabled && <span className="ml-2 text-[9px] tracking-normal normal-case font-normal">(Soon)</span>}
              </button>
            );
          })}
        </div>

        {/* Vault Cards Grid */}
        <AnimatePresence>
          {selectedCategory && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`relative transition-all duration-500 ${isBroke ? 'blur-xl grayscale pointer-events-none scale-[0.97] opacity-20' : ''}`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 gap-y-6 sm:gap-y-8 max-w-6xl mx-auto">
                {VAULTS.map((vault, index) => (
                  <VaultCard
                    key={vault.name}
                    vault={vault}
                    index={index}
                    balance={balance}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Credits Depleted Overlay */}
        {isBroke && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center w-full max-w-md px-4"
          >
            <div className="bg-surface/80 backdrop-blur-xl border-2 border-error/20 p-12 rounded-3xl shadow-[0_0_100px_rgba(255,59,92,0.1)]">
              <div className="w-20 h-20 bg-error/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-error/20">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-error">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M16 8l-8 8M8 8l8 8" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Credits Depleted</h3>
              <p className="text-error font-mono text-sm font-bold mb-4">${balance.toFixed(2)} remaining</p>
              <p className="text-text-muted text-sm leading-relaxed mb-6">
                You need at least ${minPrice} to open a vault.
              </p>
              <button
                onClick={() => {
                  navigate("/");
                  setTimeout(() => {
                    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
                className="inline-block px-8 py-3 bg-accent text-white text-sm font-black uppercase tracking-widest rounded-xl border-b-[4px] border-[#a01d5e] shadow-[0_6px_16px_rgba(255,45,149,0.3)] hover:shadow-[0_4px_12px_rgba(255,45,149,0.4)] active:border-b-[2px] transition-all duration-100 cursor-pointer"
              >
                Add Credits
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Full-screen Vault Overlay */}
      <AnimatePresence>
        {selectedVault && (
          <VaultOverlay
            tier={selectedVault}
            balance={balance}
            category={selectedCategory}
            onClose={() => setSelectedVault(null)}
            onClaim={handleClaim}
            onStore={handleStore}
            onShip={handleShip}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ─── Full-screen overlay with 4-stage flow ─── */

type Stage = "paying" | "picking" | "revealing" | "result";

interface VaultOverlayProps {
  tier: Vault;
  balance: number;
  category: string | null;
  onClose: () => void;
  onClaim: (amount: number) => void;
  onStore: (product: string, vaultTier: VaultTierName, rarity: Rarity, value: number) => void;
  onShip: (product: string, vaultTier: VaultTierName, rarity: Rarity, value: number) => void;
}

function VaultOverlay({ tier, balance, category, onClaim, onStore, onShip }: VaultOverlayProps) {
  const [stage, setStage] = useState<Stage>("paying");
  const [boxState, setBoxState] = useState<"closed" | "opening" | "open">("closed");

  const wonRarity = useMemo(() => pickRarity(tier.rarities), [tier]);
  const product = useMemo(() => category || pickProduct(), [tier, category]);
  const rarityConfig = RARITY_CONFIG[wonRarity];
  const resultValue = useMemo(() => pickValue(tier.price, rarityConfig), [tier, rarityConfig]);
  const isLoss = resultValue < tier.price;
  const net = resultValue - tier.price;
  const preBalance = balance + tier.price;
  const postBalance = balance + resultValue;

  // Auto-advance payment stage
  useEffect(() => {
    if (stage === "paying") {
      const timer = setTimeout(() => setStage("picking"), 2000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const pickBox = () => {
    setStage("revealing");
    setTimeout(() => setBoxState("opening"), 1200);
    setTimeout(() => setBoxState("open"), 1500);
    setTimeout(() => setStage("result"), 2500);
  };

  const handleClaim = () => {
    onClaim(resultValue);
  };

  const handleStore = () => {
    onStore(product, tier.name as VaultTierName, wonRarity as Rarity, resultValue);
  };

  const handleShip = () => {
    onShip(product, tier.name as VaultTierName, wonRarity as Rarity, resultValue);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-bg/95 backdrop-blur-xl"
    >
      <div className="min-h-full flex items-center justify-center p-2 md:p-4 py-6">
        <AnimatePresence mode="wait">

          {/* STAGE 1: PAYING / AUTHENTICATING */}
          {stage === "paying" && (
            <motion.div
              key="paying"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              className="flex flex-col items-center gap-8"
            >
              <div className="relative w-48 h-48">
                <motion.div
                  animate={{ rotate: [0, 90, -45, 180, 360] }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  className="w-full h-full rounded-full border-8 border-white/10 flex items-center justify-center bg-surface-elevated shadow-2xl relative"
                  style={{ borderColor: `${tier.color}20` }}
                >
                  <div className="absolute inset-2 border-4 border-dashed border-white/20 rounded-full" />
                  <div className="w-4 h-full bg-white/10 absolute rounded-full" />
                  <div className="h-4 w-full bg-white/10 absolute rounded-full" />
                  <div className="w-8 h-8 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)] z-10" style={{ backgroundColor: tier.color }} />
                </motion.div>
              </div>
              <div className="space-y-2 text-center">
                <h2 className="text-3xl font-black text-white uppercase tracking-widest">Authenticating</h2>
                <p className="text-text-muted font-mono text-sm">Verifying on-chain credentials...</p>
              </div>
            </motion.div>
          )}

          {/* STAGE 2: PICKING — 3x3 Grid */}
          {stage === "picking" && (
            <motion.div
              key="picking"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="space-y-12 w-full max-w-lg"
            >
              <div className="space-y-4 text-center">
                <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">Initialize Retrieval</h2>
                <p className="text-text-muted max-w-lg mx-auto text-sm md:text-base">
                  Scanning sector 7. Select a containment unit to unseal.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 md:gap-6 perspective-[1000px]">
                {Array.from({ length: 9 }).map((_, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05, translateZ: 20, borderColor: tier.color, boxShadow: `0 0 20px ${tier.color}30` }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => pickBox()}
                    className="aspect-square relative rounded-xl border flex items-center justify-center shadow-lg group overflow-hidden cursor-pointer transition-all duration-300"
                    style={{
                      borderColor: `${tier.color}40`,
                      backgroundColor: `${tier.color}08`,
                      boxShadow: `0 0 10px ${tier.color}10`,
                    }}
                  >
                    <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white filter drop-shadow-md group-hover:text-white transition-colors md:w-8 md:h-8">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                      <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                    <div className="absolute bottom-1 right-1 text-[6px] md:text-[8px] font-mono group-hover:opacity-80" style={{ color: `${tier.color}60` }}>
                      UNIT-0{i + 1}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STAGE 3: REVEALING */}
          {stage === "revealing" && (
            <motion.div
              key="revealing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center"
            >
              <div className="relative mb-12">
                <AnimatePresence mode="wait">
                  {boxState === "closed" && (
                    <motion.div
                      key="closed"
                      animate={{
                        rotate: [0, -5, 5, -5, 5, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 0.1 }}
                      className="filter drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]"
                    >
                      <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-white md:w-32 md:h-32">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                        <line x1="12" y1="22.08" x2="12" y2="12" />
                      </svg>
                    </motion.div>
                  )}

                  {(boxState === "opening" || boxState === "open") && (
                    <motion.div
                      key="open"
                      initial={{ scale: 0.8, opacity: 0, y: 20 }}
                      animate={{ scale: 1.2, opacity: 1, y: 0 }}
                      transition={{ type: "spring", damping: 12 }}
                      className="filter drop-shadow-[0_0_80px_rgba(255,255,255,0.6)]"
                    >
                      <div className="relative w-32 h-32 flex items-center justify-center">
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.2, type: "spring" }}
                        >
                          <VaultIcon name={tier.name} color={tier.color} />
                        </motion.div>
                        <div className="absolute inset-0 animate-spin-slow">
                          <svg width="100%" height="100%" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" stroke={tier.color} strokeWidth="1" strokeDasharray="4 8" opacity="0.5" />
                          </svg>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="text-xl md:text-3xl font-black tracking-[0.3em] uppercase animate-pulse text-center break-words max-w-xs" style={{ color: tier.color }}>
                {boxState === "closed" ? "Decompressing..." : "Sequence Complete"}
              </div>
            </motion.div>
          )}

          {/* STAGE 4: RESULT & OPTIONS */}
          {stage === "result" && (
            <motion.div
              key="result"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 20 }}
              className="space-y-3 md:space-y-4 relative w-full max-w-4xl flex flex-col items-center"
            >
              {/* Confetti */}
              <ConfettiParticles color={rarityConfig.color} count={isLoss ? 12 : 40} />

              {/* Prominent product category badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="z-10"
              >
                <span
                  className="inline-block px-5 py-2 rounded-lg border-2 text-sm md:text-base font-black uppercase tracking-widest"
                  style={{
                    borderColor: `${rarityConfig.color}60`,
                    backgroundColor: `${rarityConfig.color}15`,
                    color: rarityConfig.color,
                    textShadow: `0 0 12px ${rarityConfig.color}40`,
                  }}
                >
                  {product}
                </span>
              </motion.div>

              <div className="relative inline-block group z-10">
                <div className="absolute inset-0 blur-[100px] animate-pulse transition-colors opacity-40" style={{ backgroundColor: rarityConfig.color }} />
                <div className="relative flex items-center justify-center bg-surface-elevated rounded-3xl border-2 shadow-[0_0_60px_rgba(0,0,0,0.5)] w-36 h-36 md:w-48 md:h-48 mx-auto" style={{ borderColor: rarityConfig.color }}>
                  <div className="transform scale-110 filter drop-shadow-2xl">
                    <VaultIcon name={tier.name} color={rarityConfig.color} />
                  </div>
                  <div className="absolute bottom-3 left-0 w-full text-center">
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border" style={{ backgroundColor: `${rarityConfig.color}10`, borderColor: `${rarityConfig.color}40`, color: rarityConfig.color }}>
                      Mint Condition
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1 z-10 relative text-center">
                <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter">
                  {rarityConfig.label}{rarityConfig.exclaim}
                </h3>
                <p className="text-sm md:text-base text-text-muted">Estimated Market Value: <span className="font-black" style={{ color: rarityConfig.color }}>${resultValue}.00</span></p>
              </div>

              {/* Balance Breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="z-10 w-full max-w-sm px-4"
              >
                <div className="bg-surface/80 backdrop-blur-xl rounded-xl border border-white/10 p-3 font-mono text-xs">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-text-dim text-[10px] uppercase tracking-wider">Credits</span>
                    <span className="text-white font-bold">${preBalance.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-text-dim text-[10px] uppercase tracking-wider">{tier.name} Vault</span>
                    <span className="text-error font-bold">-${tier.price.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-text-dim text-[10px] uppercase tracking-wider">Item Value</span>
                    <span className="font-bold" style={{ color: rarityConfig.color }}>+${resultValue.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-white/10 mt-1 pt-2 flex items-center justify-between">
                    <span className="text-text-muted text-[10px] uppercase tracking-wider font-bold">New Balance</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${isLoss ? "bg-error/10 text-error" : "bg-neon-green/10 text-neon-green"}`}>
                        {net >= 0 ? "+" : ""}{net.toFixed(2)}
                      </span>
                      <span className="text-white font-black text-sm">${postBalance.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full px-4 z-10 relative">
                <OptionCard
                  title="Store to Vault"
                  desc="Keep it secure in your digital portfolio."
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    </svg>
                  }
                  action="Build Collection"
                  onClick={handleStore}
                />
                <OptionCard
                  title="Ship to Home"
                  desc="We'll mail the physical item to you globally."
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="3" width="15" height="13" />
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                  }
                  action="Get It Shipped"
                  onClick={handleShip}
                  highlight
                  tierColor={tier.color}
                />
                <OptionCard
                  title="Claim Credits"
                  desc="Instant sellback for platform credits."
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                  }
                  action={`Get $${resultValue} Credits`}
                  onClick={handleClaim}
                />
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─── Supporting components ─── */

interface OptionCardProps {
  title: string;
  desc: string;
  icon: React.ReactNode;
  action: string;
  onClick: () => void;
  highlight?: boolean;
  tierColor?: string;
}

function OptionCard({ title, desc, icon, action, onClick, highlight = false, tierColor }: OptionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`p-3 md:p-5 rounded-2xl border text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col h-full bg-surface-elevated/50 backdrop-blur-sm group ${highlight ? "" : "border-white/5 hover:border-white/20"}`}
      style={highlight ? { borderColor: tierColor, boxShadow: `0 0 20px ${tierColor}10` } : {}}
    >
      <div className="text-xl md:text-2xl mb-2 md:mb-3 text-white group-hover:scale-110 transition-transform origin-left">{icon}</div>
      <h4 className="text-sm md:text-base font-black text-white mb-1 uppercase tracking-wide">{title}</h4>
      <p className="text-text-muted text-[10px] leading-relaxed mb-3 flex-1">{desc}</p>
      <div className="mt-auto pt-2 md:pt-3 border-t border-white/5 w-full">
        <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2" style={highlight ? { color: tierColor } : { color: 'white' }}>
          {action} <span>&rarr;</span>
        </span>
      </div>
    </button>
  );
}

function ConfettiParticles({ color, count = 40 }: { color: string; count?: number }) {
  const particles = useMemo(() =>
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 400 - 200,
      y: Math.random() * 400 - 200,
      color: Math.random() > 0.5 ? color : "#ffffff",
      scale: Math.random() * 0.8 + 0.2,
    })),
    [color, count]
  );

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
          animate={{ opacity: 0, x: p.x, y: p.y, rotate: Math.random() * 720, scale: p.scale }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute w-2 h-2 rounded-sm"
          style={{ backgroundColor: p.color }}
        />
      ))}
    </div>
  );
}
