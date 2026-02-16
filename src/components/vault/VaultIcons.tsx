import {
  bronzeIcon,
  diamondIcon,
  goldIcon,
  obsidianIcon,
  platinumIcon,
  silverIcon
} from "../../assets/vault-icons";
import type { VaultIconProps } from "../../types/vault";

export function VaultIcon({ name, color }: VaultIconProps) {
  // Ore / Mineral Themed Icons
  switch (name) {
    case "Bronze": // Nugget
      return bronzeIcon(color);
    case "Silver": // Ingot Stack - Centered
      return silverIcon(color);
    case "Gold": // Jagged Crystal - Centered
      return goldIcon(color);
    case "Platinum": // Hexagonal Prism
      return platinumIcon(color);
    case "Obsidian": // Sharp Shard
      return obsidianIcon(color);
    case "Diamond": // Classic Cut
      return diamondIcon(color);
    default:
      return null;
  }
}
