import { motion } from "motion/react";

export interface SegmentedTabOption {
  key: string;
  label: string;
  mobileLabel?: string;
  tutorialId?: string;
  badgeText?: string;
}

interface SegmentedTabsProps {
  tabs: SegmentedTabOption[];
  activeKey: string;
  onChange: (key: string) => void;
  containerTutorialId?: string;
  layoutId?: string;
  className?: string;
  mode?: "fill" | "scroll";
}

export function SegmentedTabs({
  tabs,
  activeKey,
  onChange,
  containerTutorialId,
  layoutId = "segmented-tabs-indicator",
  className = "",
  mode = "fill"
}: SegmentedTabsProps) {
  const isScroll = mode === "scroll";

  return (
    <div
      className={`mb-6 sm:mb-8 bg-surface/50 rounded-xl sm:rounded-2xl p-1 sm:p-1.5 border border-white/5 ${isScroll ? "overflow-x-auto" : ""} ${className}`.trim()}
      {...(containerTutorialId ? { "data-tutorial": containerTutorialId } : {})}
    >
      <div className={`${isScroll ? "flex w-max min-w-full justify-center gap-1" : "flex w-full gap-0.5 sm:gap-1"}`}>
        {tabs.map((tab) => {
          const isActive = activeKey === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              {...(tab.tutorialId ? { "data-tutorial": tab.tutorialId } : {})}
              className={`relative ${isScroll ? "shrink-0 px-4 sm:px-5" : "flex-1 px-2 sm:px-6"} py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-[9px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? "text-white bg-surface-elevated border border-white/10 shadow-lg"
                  : "text-text-muted hover:text-white border border-transparent"
              }`}
            >
              <span className="sm:hidden">{tab.mobileLabel ?? tab.label}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.badgeText && (
                <span className="ml-2 text-[9px] tracking-normal normal-case font-semibold text-text-dim">
                  ({tab.badgeText})
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId={layoutId}
                  className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-accent"
                  style={{ boxShadow: "0 0 10px rgba(255,45,149,0.5)" }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
