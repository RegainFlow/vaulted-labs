import { useState } from "react";
import { motion } from "motion/react";
import { InventoryGrid } from "./InventoryGrid";
import { ListingGrid } from "./ListingGrid";
import { AuctionGrid } from "./AuctionGrid";
import { ProfilePanel } from "./ProfilePanel";

const TABS = [
  { id: "inventory", label: "Inventory", mobileLabel: "Items" },
  { id: "marketplace", label: "Marketplace", mobileLabel: "Shop" },
  { id: "auctions", label: "Auctions", mobileLabel: "Bids" },
  { id: "profile", label: "Profile", mobileLabel: "Profile" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function MarketplaceTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("inventory");

  return (
    <div>
      {/* Tab navigation */}
      <div className="flex gap-0.5 sm:gap-1 mb-6 sm:mb-8 bg-surface/50 rounded-xl sm:rounded-2xl p-1 sm:p-1.5 border border-white/5">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 px-2 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-[9px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? "text-white bg-surface-elevated border border-white/10 shadow-lg"
                  : "text-text-muted hover:text-white border border-transparent"
              }`}
            >
              <span className="sm:hidden">{tab.mobileLabel}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-accent"
                  style={{ boxShadow: "0 0 10px rgba(255,45,149,0.5)" }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === "inventory" && <InventoryGrid />}
        {activeTab === "marketplace" && <ListingGrid />}
        {activeTab === "auctions" && <AuctionGrid />}
        {activeTab === "profile" && <ProfilePanel />}
      </motion.div>
    </div>
  );
}
