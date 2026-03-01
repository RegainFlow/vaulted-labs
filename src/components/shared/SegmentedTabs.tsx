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
      className={`system-rail mb-6 sm:mb-8 p-1.5 sm:p-2 ${isScroll ? "overflow-x-auto scrollbar-none" : ""} ${className}`.trim()}
      {...(containerTutorialId ? { "data-tutorial": containerTutorialId } : {})}
    >
      <div className={`${isScroll ? "flex w-max min-w-full gap-1.5" : "flex w-full gap-1.5"}`}>
        {tabs.map((tab) => {
          const isActive = activeKey === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              {...(tab.tutorialId ? { "data-tutorial": tab.tutorialId } : {})}
              data-active={isActive ? "true" : "false"}
              className={`command-segment ${isScroll ? "shrink-0 px-4 sm:px-5" : "flex-1 px-2 sm:px-6"} py-3 sm:py-3.5 text-[9px] sm:text-xs font-black uppercase tracking-[0.22em] sm:tracking-[0.28em] whitespace-nowrap cursor-pointer`}
            >
              {isActive && (
                <motion.div
                  layoutId={layoutId}
                  className="absolute inset-0 rounded-[16px] border border-white/10"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(121,181,219,0.18) 0%, rgba(15,26,38,0.92) 100%)",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.06), 0 0 18px rgba(121,181,219,0.14)",
                  }}
                />
              )}
              <span className="relative z-10 hidden sm:inline">{tab.label}</span>
              <span className="relative z-10 sm:hidden">{tab.mobileLabel ?? tab.label}</span>
              {tab.badgeText && (
                <span className="relative z-10 ml-2 text-[9px] tracking-normal normal-case font-semibold text-text-dim">
                  ({tab.badgeText})
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
