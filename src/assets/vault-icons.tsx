function resolveTone(color: string | undefined, fallback: string) {
  return color ?? fallback;
}

export const bronzeIcon = (color?: string) => {
  const tone = resolveTone(color, "#cd7f32");
  return (
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 8l3-3h10l3 3-3 3H7L4 8z"
        fill={tone}
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="0.6"
      />
      <path d="M4 11h16v6l-3 2H7l-3-2v-6z" fill="rgba(0,0,0,0.3)" />
      <path d="M4 8v9l3 2V11L4 8z" fill="rgba(255,255,255,0.18)" />
      <path d="M20 8v9l-3 2V11l3-3z" fill="rgba(0,0,0,0.35)" />
      <path d="M7 7.4h10" stroke="rgba(255,255,255,0.4)" strokeWidth="0.6" />
      <path d="M8 14h8" stroke="rgba(255,255,255,0.18)" strokeWidth="0.5" />
    </svg>
  );
};

export const silverIcon = (color?: string) => {
  const tone = resolveTone(color, "#cfd6df");
  return (
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 7l2-2h9l2 2-2 2H8L6 7z"
        fill={tone}
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="0.55"
      />
      <path d="M6 9h13v3l-2 1.5H8L6 12V9z" fill="rgba(0,0,0,0.28)" />
      <path d="M4.5 13l2-2h9l2 2-2 2H6.5l-2-2z" fill={tone} opacity="0.95" />
      <path d="M4.5 15h13v3l-2 1.5H6.5l-2-1.5v-3z" fill="rgba(0,0,0,0.32)" />
      <path d="M8 6.6h9" stroke="rgba(255,255,255,0.45)" strokeWidth="0.6" />
      <path d="M6.5 12.6h9" stroke="rgba(255,255,255,0.35)" strokeWidth="0.55" />
    </svg>
  );
};

export const goldIcon = (color?: string) => {
  const tone = resolveTone(color, "#ffd700");
  return (
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2.5l7 4.2v8.6L12 20l-7-4.7V6.7L12 2.5z"
        fill={tone}
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="0.6"
      />
      <path d="M12 2.5v17.5" stroke="rgba(255,255,255,0.35)" strokeWidth="0.55" />
      <path d="M5 6.7l7 4.3 7-4.3" stroke="rgba(0,0,0,0.24)" strokeWidth="0.55" />
      <path d="M5 15.3l7-4.3 7 4.3" stroke="rgba(0,0,0,0.24)" strokeWidth="0.55" />
      <path d="M12 7.4l2.3 3.6L12 14.7 9.7 11 12 7.4z" fill="rgba(255,255,255,0.24)" />
    </svg>
  );
};

export const platinumIcon = (color?: string) => {
  const tone = resolveTone(color, "#a9c2d7");
  return (
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2l8.5 5v10L12 22 3.5 17V7L12 2z"
        fill={tone}
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="0.6"
      />
      <path d="M12 2v20" stroke="rgba(255,255,255,0.28)" strokeWidth="0.5" />
      <path d="M3.5 7h17M3.5 17h17" stroke="rgba(0,0,0,0.24)" strokeWidth="0.5" />
      <path d="M7 9h10" stroke="rgba(255,255,255,0.2)" strokeWidth="0.45" />
    </svg>
  );
};

export const obsidianIcon = (color?: string) => {
  const tone = resolveTone(color, "#6c4e85");
  return (
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L8 14l4 8 4-8-4-12z"
        fill={tone}
        stroke="rgba(255,255,255,0.24)"
        strokeWidth="0.6"
      />
      <path d="M12 2l-1.8 12 1.8 8 1.8-8L12 2z" fill="rgba(255,255,255,0.14)" />
      <path d="M8 14h8" stroke="rgba(255,255,255,0.18)" strokeWidth="0.5" />
      <path d="M12 2v20" stroke="rgba(255,45,149,0.35)" strokeWidth="0.45" />
    </svg>
  );
};

export const diamondIcon = (color?: string) => {
  const tone = resolveTone(color, "#b9f2ff");
  return (
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 5h12l4 5-10 11L2 10l4-5z"
        fill={tone}
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="0.6"
      />
      <path d="M6 5l6 16 6-16" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5" />
      <path d="M2 10h20" stroke="rgba(255,255,255,0.45)" strokeWidth="0.5" />
      <path d="M9 5l3 5 3-5" stroke="rgba(255,255,255,0.38)" strokeWidth="0.45" />
      <circle cx="12" cy="7.2" r="0.7" fill="rgba(255,255,255,0.75)" />
    </svg>
  );
};
