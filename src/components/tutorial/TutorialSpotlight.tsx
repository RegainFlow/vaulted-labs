import { motion } from "motion/react";
import type { TargetRect } from "../../types/tutorial";

interface TutorialSpotlightProps {
  rect: TargetRect | null;
  radius?: number;
  accentColor?: string;
  showMask?: boolean;
}

export function TutorialSpotlight({
  rect,
  radius = 18,
  accentColor = "#ff2d95",
  showMask = true,
}: TutorialSpotlightProps) {
  const svgWidth = typeof window !== "undefined" ? window.innerWidth : 1440;
  const svgHeight = typeof window !== "undefined" ? window.innerHeight : 900;
  const maskId = `tutorial-mask-${Math.round((rect?.left ?? 0) + (rect?.top ?? 0))}`;

  return (
    <>
      {showMask && (
        <svg width={svgWidth} height={svgHeight} className="absolute inset-0">
          <defs>
            <mask id={maskId}>
              <rect
                x="0"
                y="0"
                width={svgWidth}
                height={svgHeight}
                fill="white"
              />
              {rect && (
                <rect
                  x={rect.left}
                  y={rect.top}
                  width={rect.width}
                  height={rect.height}
                  rx={radius}
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width={svgWidth}
            height={svgHeight}
            fill="rgba(2,7,12,0.58)"
            mask={`url(#${maskId})`}
          />
        </svg>
      )}

      {rect && (
        <>
          <motion.div
            className="absolute border-2 pointer-events-none"
            style={{
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
              borderRadius: radius,
              borderColor: `${accentColor}cc`,
              boxShadow: `0 0 24px ${accentColor}36, inset 0 0 18px ${accentColor}18`,
            }}
            animate={{ opacity: [0.72, 1, 0.78] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              top: rect.top - 4,
              left: rect.left - 4,
              width: rect.width + 8,
              height: rect.height + 8,
            }}
          >
            {[
              { top: 0, left: 0, rotate: "0deg" },
              { top: 0, right: 0, rotate: "45deg" },
              { bottom: 0, right: 0, rotate: "90deg" },
              { bottom: 0, left: 0, rotate: "135deg" },
            ].map((corner, index) => (
              <div
                key={index}
                className="absolute h-7 w-7"
                style={{
                  ...corner,
                  transform: `rotate(${corner.rotate})`,
                }}
              >
                <div
                  className="absolute left-0 top-0 h-[2px] w-5 rounded-full"
                  style={{ backgroundColor: accentColor }}
                />
                <div
                  className="absolute left-0 top-0 h-5 w-[2px] rounded-full"
                  style={{ backgroundColor: accentColor }}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
