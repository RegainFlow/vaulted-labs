import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type ArcadeButtonTone = "accent" | "gold" | "success" | "neutral";
type ArcadeButtonSize = "hero" | "primary" | "compact";
type ArcadeButtonFillMode = "sweep" | "center";

interface ArcadeButtonProps {
  as?: "button" | "link";
  to?: string;
  state?: unknown;
  onClick?: () => void;
  disabled?: boolean;
  tone?: ArcadeButtonTone;
  size?: ArcadeButtonSize;
  fillMode?: ArcadeButtonFillMode;
  fullWidth?: boolean;
  loading?: boolean;
  loadingLabel?: ReactNode;
  className?: string;
  children: ReactNode;
  tutorialId?: string;
}

export function ArcadeButton({
  as = "button",
  to,
  state,
  onClick,
  disabled = false,
  tone = "accent",
  size = "primary",
  fillMode = "center",
  fullWidth = false,
  loading = false,
  loadingLabel,
  className = "",
  children,
  tutorialId,
}: ArcadeButtonProps) {
  const classes = [
    "arcade-button",
    `arcade-button--${size}`,
    fullWidth ? "w-full" : "",
    disabled || loading ? "pointer-events-none opacity-60" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <span className="arcade-button__plate" aria-hidden="true" />
      <span className="arcade-button__fill" aria-hidden="true" />
      <span className="arcade-button__shine" aria-hidden="true" />
      <span className="arcade-button__edge" aria-hidden="true" />
      <span className="arcade-button__label">
        {loading ? loadingLabel ?? children : children}
      </span>
    </>
  );

  const sharedProps = {
    className: classes,
    "data-tone": tone,
    "data-fill-mode": fillMode,
    "data-loading": loading ? "true" : undefined,
    "aria-disabled": disabled || loading || undefined,
    "aria-busy": loading || undefined,
    ...(tutorialId ? { "data-tutorial": tutorialId } : {}),
  };

  if ((as === "link" || to) && to && !disabled) {
    return (
      <Link to={to} state={state} onClick={onClick} {...sharedProps}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      {...sharedProps}
    >
      {content}
    </button>
  );
}
