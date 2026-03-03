import type { ReactNode } from "react";

type InlineStatusTone = "accent" | "gold" | "success" | "danger" | "muted";

const TONE_STYLES: Record<
  InlineStatusTone,
  { border: string; background: string; text: string }
> = {
  accent: {
    border: "rgba(255,45,149,0.28)",
    background: "rgba(255,45,149,0.08)",
    text: "text-accent",
  },
  gold: {
    border: "rgba(255,215,0,0.26)",
    background: "rgba(255,215,0,0.08)",
    text: "text-vault-gold",
  },
  success: {
    border: "rgba(57,255,20,0.28)",
    background: "rgba(57,255,20,0.08)",
    text: "text-neon-green",
  },
  danger: {
    border: "rgba(255,59,92,0.28)",
    background: "rgba(255,59,92,0.08)",
    text: "text-error",
  },
  muted: {
    border: "rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    text: "text-text-muted",
  },
};

interface InlineStatusNoticeProps {
  title: string;
  body?: ReactNode;
  tone?: InlineStatusTone;
  className?: string;
}

export function InlineStatusNotice({
  title,
  body,
  tone = "muted",
  className = "",
}: InlineStatusNoticeProps) {
  const styles = TONE_STYLES[tone];

  return (
    <div
      className={`rounded-[16px] border px-3 py-3 ${className}`}
      style={{
        borderColor: styles.border,
        backgroundColor: styles.background,
      }}
    >
      <p className={`text-[9px] font-black uppercase tracking-[0.22em] ${styles.text}`}>
        {title}
      </p>
      {body && (
        <div className="mt-1 text-[11px] leading-relaxed text-text-muted">{body}</div>
      )}
    </div>
  );
}
