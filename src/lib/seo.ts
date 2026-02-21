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
  "/play": {
    title: "Play Vault Opens | VaultedLabs",
    description:
      "Try the interactive vault opening demo. Reveal outcomes, compare rarity tiers, and choose hold, ship, or cashout.",
    canonicalPath: "/play",
    ogTitle: "Play Vault Opens | VaultedLabs",
    ogDescription:
      "Try the interactive demo and reveal collectible outcomes by vault tier.",
    ogImage: "/og-image.png",
    twitterTitle: "Play Vault Opens | VaultedLabs",
    twitterDescription:
      "Try the interactive vault opening demo and reveal collectible outcomes.",
    twitterImage: "/og-image.png",
    robots: "index,follow"
  },
  "/shop": {
    title: "Shop Marketplace & Auctions | VaultedLabs",
    description:
      "Browse marketplace listings and live auction bids with credits in the VaultedLabs shop experience.",
    canonicalPath: "/shop",
    ogTitle: "Shop Marketplace & Auctions | VaultedLabs",
    ogDescription:
      "Browse listings, place bids, and explore the VaultedLabs shop experience.",
    ogImage: "/og-image.png",
    twitterTitle: "VaultedLabs Shop",
    twitterDescription:
      "Browse marketplace listings and auctions in the VaultedLabs shop.",
    twitterImage: "/og-image.png",
    robots: "index,follow"
  },
  "/inventory": {
    title: "Inventory Management | VaultedLabs",
    description:
      "Manage your collected items and choose to hold, ship, or cashout outcomes in VaultedLabs.",
    canonicalPath: "/inventory",
    ogTitle: "Inventory Management | VaultedLabs",
    ogDescription:
      "Manage collected outcomes and choose hold, ship, or cashout actions.",
    ogImage: "/og-image.png",
    twitterTitle: "VaultedLabs Inventory",
    twitterDescription:
      "Manage collected outcomes and item actions in your inventory.",
    twitterImage: "/og-image.png",
    robots: "index,follow"
  },
  "/profile": {
    title: "Profile, Quests & Progression | VaultedLabs",
    description:
      "Track level progression, quests, and profile milestones in VaultedLabs.",
    canonicalPath: "/profile",
    ogTitle: "Profile, Quests & Progression | VaultedLabs",
    ogDescription:
      "Track progression, quest status, and profile milestones.",
    ogImage: "/og-image.png",
    twitterTitle: "VaultedLabs Profile",
    twitterDescription:
      "Track progression, quests, and milestones in VaultedLabs.",
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
