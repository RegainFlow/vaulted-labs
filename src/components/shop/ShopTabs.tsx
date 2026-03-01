import { useState } from "react";
import { motion } from "motion/react";
import { trackEvent, AnalyticsEvents } from "../../lib/analytics";
import { ListingGrid } from "./ListingGrid";
import { AuctionGrid } from "./AuctionGrid";
import { SegmentedTabs } from "../shared/SegmentedTabs";

const TABS = [
  { id: "marketplace", label: "Marketplace", mobileLabel: "Shop" },
  { id: "auctions", label: "Auctions", mobileLabel: "Bids" }
] as const;

type TabId = (typeof TABS)[number]["id"];

export function ShopTabs({ forceTab }: { forceTab?: TabId | null }) {
  const [selectedTab, setSelectedTab] = useState<TabId>("marketplace");
  const activeTab = forceTab ?? selectedTab;

  return (
    <div>
      <SegmentedTabs
        tabs={TABS.map((tab) => ({
          key: tab.id,
          label: tab.label,
          mobileLabel: tab.mobileLabel,
          tutorialId: tab.id === "auctions" ? "shop-auction-tab" : undefined,
        }))}
        activeKey={activeTab}
        onChange={(key) => {
          trackEvent(AnalyticsEvents.TAB_SWITCH, { tab: key });
          setSelectedTab(key as TabId);
        }}
        containerTutorialId="shop-tabs"
        layoutId="shop-tab-indicator"
      />

      {/* Tab content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === "marketplace" && <ListingGrid />}
        {activeTab === "auctions" && <AuctionGrid />}
      </motion.div>
    </div>
  );
}
