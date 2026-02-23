export const SEO_SITE_URL = "https://vaulted-labs.com";

export interface RouteSeoConfig {
  title: string;
  description: string;
  canonicalPath: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  robots?: string;
}

export const ROUTE_SEO: Record<string, RouteSeoConfig> = {
  "/": {
    title: "VaultedLabs | Mystery Vault Opens & Collectibles Marketplace",
    description:
      "Open digital vaults, reveal collectible outcomes, and choose to hold, ship, or cashout. Explore the VaultedLabs demo and join the waitlist.",
    canonicalPath: "/",
    ogTitle: "VaultedLabs | Mystery Vault Opens & Collectibles Marketplace",
    ogDescription:
      "Open digital vaults, reveal outcomes, and choose hold, ship, or cashout.",
    ogImage: "/og-image.png",
    twitterTitle: "VaultedLabs | Mystery Vault Opens",
    twitterDescription:
      "Reveal collectible outcomes and explore the VaultedLabs experience.",
    twitterImage: "/og-image.png",
    robots: "index,follow"
  },
  "/vaults": {
    title: "Vaults | Open & Reveal | VaultedLabs",
    description:
      "Try the interactive vault opening demo. Reveal outcomes, compare rarity tiers, and choose hold, ship, or cashout.",
    canonicalPath: "/vaults",
    ogTitle: "Vaults | Open & Reveal | VaultedLabs",
    ogDescription:
      "Try the interactive demo and reveal collectible outcomes by vault tier.",
    ogImage: "/og-image.png",
    twitterTitle: "Vaults | Open & Reveal | VaultedLabs",
    twitterDescription:
      "Try the interactive vault opening demo and reveal collectible outcomes.",
    twitterImage: "/og-image.png",
    robots: "index,follow"
  },
  "/locker/inventory": {
    title: "Locker Inventory | VaultedLabs",
    description:
      "Manage held collectibles and choose to cashout, ship, or list items from your Locker.",
    canonicalPath: "/locker/inventory",
    ogTitle: "Locker Inventory | VaultedLabs",
    ogDescription:
      "Manage your held collectibles in the Locker inventory.",
    ogImage: "/og-image.png",
    twitterTitle: "VaultedLabs Locker Inventory",
    twitterDescription:
      "Manage your held collectibles in the Locker inventory.",
    twitterImage: "/og-image.png",
    robots: "index,follow"
  },
  "/locker/market": {
    title: "Locker Market & Auctions | VaultedLabs",
    description:
      "Browse listings and auctions inside Locker Market with one streamlined flow.",
    canonicalPath: "/locker/market",
    ogTitle: "Locker Market & Auctions | VaultedLabs",
    ogDescription:
      "Buy listings and place bids in Locker Market.",
    ogImage: "/og-image.png",
    twitterTitle: "VaultedLabs Locker Market",
    twitterDescription:
      "Buy listings and place bids in Locker Market.",
    twitterImage: "/og-image.png",
    robots: "index,follow"
  },
  "/locker/arena": {
    title: "Locker Arena Home | VaultedLabs",
    description:
      "Choose Battles, Forge, or Quests from Arena Home as systems unlock by XP.",
    canonicalPath: "/locker/arena",
    ogTitle: "Locker Arena Home | VaultedLabs",
    ogDescription:
      "Choose Battles, Forge, or Quests from Arena Home.",
    ogImage: "/og-image.png",
    twitterTitle: "VaultedLabs Arena Home",
    twitterDescription:
      "Choose Battles, Forge, or Quests from Arena Home.",
    twitterImage: "/og-image.png",
    robots: "index,follow"
  },
  "/arena/battles": {
    title: "Arena Battles | VaultedLabs",
    description:
      "Challenge bosses in Arena Battles and push progression with squad combat.",
    canonicalPath: "/arena/battles",
    ogTitle: "Arena Battles | VaultedLabs",
    ogDescription:
      "Challenge bosses in Arena Battles and push progression.",
    ogImage: "/og-image.png",
    twitterTitle: "Arena Battles | VaultedLabs",
    twitterDescription:
      "Challenge bosses in Arena Battles and push progression.",
    twitterImage: "/og-image.png",
    robots: "index,follow"
  },
  "/arena/forge": {
    title: "Arena Forge | VaultedLabs",
    description:
      "Use Forge to combine collectibles and hunt stronger outcomes.",
    canonicalPath: "/arena/forge",
    ogTitle: "Arena Forge | VaultedLabs",
    ogDescription:
      "Combine collectibles in Forge for stronger outcomes.",
    ogImage: "/og-image.png",
    twitterTitle: "Arena Forge | VaultedLabs",
    twitterDescription:
      "Combine collectibles in Forge for stronger outcomes.",
    twitterImage: "/og-image.png",
    robots: "index,follow"
  },
  "/arena/quests": {
    title: "Arena Quests | VaultedLabs",
    description:
      "Track and complete quests to keep XP progression moving.",
    canonicalPath: "/arena/quests",
    ogTitle: "Arena Quests | VaultedLabs",
    ogDescription:
      "Track and complete quests to keep progression moving.",
    ogImage: "/og-image.png",
    twitterTitle: "Arena Quests | VaultedLabs",
    twitterDescription:
      "Track and complete quests to keep progression moving.",
    twitterImage: "/og-image.png",
    robots: "index,follow"
  },
  "/wallet": {
    title: "Wallet & Credits | VaultedLabs",
    description:
      "Review credits and transaction history in the VaultedLabs wallet view.",
    canonicalPath: "/wallet",
    ogTitle: "Wallet & Credits | VaultedLabs",
    ogDescription:
      "Track credits and transaction history in the VaultedLabs wallet.",
    ogImage: "/og-image.png",
    twitterTitle: "VaultedLabs Wallet",
    twitterDescription: "Track credits and wallet activity in VaultedLabs.",
    twitterImage: "/og-image.png",
    robots: "index,follow"
  },
  "/privacy": {
    title: "Privacy Policy | VaultedLabs",
    description:
      "Read how VaultedLabs collects, uses, and protects data across analytics, replay, and platform operations.",
    canonicalPath: "/privacy",
    ogTitle: "Privacy Policy | VaultedLabs",
    ogDescription:
      "Review VaultedLabs privacy practices and data handling disclosures.",
    ogImage: "/og-image.png",
    twitterTitle: "VaultedLabs Privacy Policy",
    twitterDescription:
      "Review how VaultedLabs handles data, analytics, and privacy.",
    twitterImage: "/og-image.png",
    robots: "index,follow"
  },
  "/terms": {
    title: "Terms of Service | VaultedLabs",
    description:
      "Read the VaultedLabs Terms of Service, including eligibility, acceptable use, and legal terms.",
    canonicalPath: "/terms",
    ogTitle: "Terms of Service | VaultedLabs",
    ogDescription:
      "Review VaultedLabs service terms, acceptable use, and legal conditions.",
    ogImage: "/og-image.png",
    twitterTitle: "VaultedLabs Terms of Service",
    twitterDescription:
      "Read VaultedLabs terms, eligibility requirements, and legal conditions.",
    twitterImage: "/og-image.png",
    robots: "index,follow"
  }
};

export function getRouteSeo(pathname: string): RouteSeoConfig {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return ROUTE_SEO[normalizedPath] ?? ROUTE_SEO["/"];
}
