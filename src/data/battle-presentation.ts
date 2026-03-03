import type { Battle } from "../types/gamification";

export type BattleTone = "cyan" | "magenta" | "gold" | "green" | "neutral";
export type BattleAbilityIcon =
  | "slash"
  | "shield"
  | "burst"
  | "pulse"
  | "fracture"
  | "coil"
  | "core";

export interface BattleAbilityPresentation {
  id: string;
  label: string;
  icon: BattleAbilityIcon;
  tone: BattleTone;
}

export interface BattlePresentationProfile {
  bossId: Battle["id"];
  bossTitle: string;
  bossSubtitle: string;
  threatLabel: string;
  mechanicLabel?: string;
  accentPrimary: string;
  accentSecondary: string;
  ambientGradient: string;
  hudGradient: string;
  bossStatuses: string[];
  playerAbilities: BattleAbilityPresentation[];
  bossAbilities: BattleAbilityPresentation[];
}

export const BATTLE_PRESENTATION_PROFILES: Record<Battle["id"], BattlePresentationProfile> = {
  "boss-1": {
    bossId: "boss-1",
    bossTitle: "The Vault Keeper",
    bossSubtitle: "First seal guardian",
    threatLabel: "Seal Guardian",
    mechanicLabel: "Heavy opening pressure",
    accentPrimary: "#ff2bd6",
    accentSecondary: "#00eaff",
    ambientGradient:
      "radial-gradient(circle at 70% 30%, rgba(255,43,214,0.22) 0%, rgba(255,43,214,0.06) 26%, transparent 60%), radial-gradient(circle at 25% 65%, rgba(0,234,255,0.12) 0%, transparent 38%)",
    hudGradient:
      "linear-gradient(90deg, rgba(0,234,255,0.18) 0%, rgba(255,43,214,0.18) 100%)",
    bossStatuses: ["Charging Seal", "Pressure Spike", "Guard Locked"],
    playerAbilities: [
      { id: "strike", label: "Strike", icon: "slash", tone: "cyan" },
      { id: "guard", label: "Guard", icon: "shield", tone: "cyan" },
      { id: "burst", label: "Burst", icon: "burst", tone: "gold" },
    ],
    bossAbilities: [
      { id: "seal-crush", label: "Seal Crush", icon: "core", tone: "magenta" },
      { id: "ward-pulse", label: "Ward Pulse", icon: "pulse", tone: "magenta" },
      { id: "keeper-slam", label: "Keeper Slam", icon: "slash", tone: "gold" },
    ],
  },
  "boss-2": {
    bossId: "boss-2",
    bossTitle: "Chrono Shard",
    bossSubtitle: "Timeline breaker",
    threatLabel: "Temporal Fracture",
    mechanicLabel: "Distorts tempo",
    accentPrimary: "#00eaff",
    accentSecondary: "#ff2bd6",
    ambientGradient:
      "radial-gradient(circle at 68% 28%, rgba(0,234,255,0.22) 0%, rgba(0,234,255,0.08) 26%, transparent 60%), radial-gradient(circle at 28% 72%, rgba(255,43,214,0.14) 0%, transparent 42%)",
    hudGradient:
      "linear-gradient(90deg, rgba(0,234,255,0.22) 0%, rgba(255,43,214,0.16) 100%)",
    bossStatuses: ["Temporal Rift", "Time Cut", "Echo Pulse"],
    playerAbilities: [
      { id: "strike", label: "Strike", icon: "slash", tone: "cyan" },
      { id: "counter", label: "Counter", icon: "fracture", tone: "magenta" },
      { id: "burst", label: "Burst", icon: "burst", tone: "gold" },
    ],
    bossAbilities: [
      { id: "fracture", label: "Fracture", icon: "fracture", tone: "cyan" },
      { id: "time-cut", label: "Time Cut", icon: "slash", tone: "magenta" },
      { id: "echo-burst", label: "Echo Burst", icon: "pulse", tone: "gold" },
    ],
  },
  "boss-3": {
    bossId: "boss-3",
    bossTitle: "Neon Hydra",
    bossSubtitle: "Reactive construct",
    threatLabel: "Regeneration Engine",
    mechanicLabel: "Restores health each round",
    accentPrimary: "#00eaff",
    accentSecondary: "#39ff14",
    ambientGradient:
      "radial-gradient(circle at 72% 30%, rgba(57,255,20,0.18) 0%, rgba(57,255,20,0.06) 28%, transparent 60%), radial-gradient(circle at 25% 75%, rgba(0,234,255,0.16) 0%, transparent 40%)",
    hudGradient:
      "linear-gradient(90deg, rgba(0,234,255,0.18) 0%, rgba(57,255,20,0.18) 100%)",
    bossStatuses: ["Regenerating", "Head Split", "Coil Rush"],
    playerAbilities: [
      { id: "strike", label: "Strike", icon: "slash", tone: "cyan" },
      { id: "guard", label: "Guard", icon: "shield", tone: "cyan" },
      { id: "finisher", label: "Finisher", icon: "burst", tone: "gold" },
    ],
    bossAbilities: [
      { id: "hydra-bite", label: "Hydra Bite", icon: "slash", tone: "green" },
      { id: "regen-pulse", label: "Regen Pulse", icon: "pulse", tone: "green" },
      { id: "toxic-coil", label: "Toxic Coil", icon: "coil", tone: "magenta" },
    ],
  },
  "boss-4": {
    bossId: "boss-4",
    bossTitle: "Diamond Golem",
    bossSubtitle: "Compressed titan",
    threatLabel: "Core Bastion",
    mechanicLabel: "High defense shell",
    accentPrimary: "#ff2bd6",
    accentSecondary: "#00eaff",
    ambientGradient:
      "radial-gradient(circle at 75% 30%, rgba(185,242,255,0.2) 0%, rgba(185,242,255,0.08) 28%, transparent 62%), radial-gradient(circle at 28% 70%, rgba(255,43,214,0.12) 0%, transparent 40%)",
    hudGradient:
      "linear-gradient(90deg, rgba(0,234,255,0.18) 0%, rgba(255,43,214,0.16) 100%)",
    bossStatuses: ["Diamond Shell", "Core Spike", "Pressure Charge"],
    playerAbilities: [
      { id: "fracture", label: "Fracture", icon: "fracture", tone: "magenta" },
      { id: "guard", label: "Guard", icon: "shield", tone: "cyan" },
      { id: "burst", label: "Burst", icon: "burst", tone: "gold" },
    ],
    bossAbilities: [
      { id: "diamond-shell", label: "Diamond Shell", icon: "shield", tone: "cyan" },
      { id: "core-spike", label: "Core Spike", icon: "core", tone: "gold" },
      { id: "crush-step", label: "Crush Step", icon: "slash", tone: "magenta" },
    ],
  },
};
