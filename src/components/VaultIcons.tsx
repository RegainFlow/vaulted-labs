export function VaultIcon({ name, color }: { name: string; color: string }) {
  // Ore / Mineral Themed Icons
  switch (name) {
    case 'Bronze': // Nugget
      return (
        <svg width="80" height="80" viewBox="0 0 24 24" fill={color} stroke="white" strokeWidth="0.5">
           <path d="M12 4.5c-2 0-3.5 1.5-4 3-.5 1.5-2 2-2.5 3.5-.5 1.5.5 3.5 2 4.5 1.5 1 3.5 1 5 .5 1.5-.5 2.5-1.5 4-2 1.5-.5 2.5-2.5 2-4-.5-1.5-2-2.5-3.5-3.5-1.5-1-2.5-2-3-2z" strokeLinejoin="round" />
           <path d="M10 8c.5.5 1.5.5 2 0" stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
           <path d="M14 12c-.5.5-1.5.5-2 0" stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
        </svg>
      );
    case 'Silver': // Ingot Stack - Centered
      return (
        <svg width="80" height="80" viewBox="0 0 24 24" fill={color} stroke="white" strokeWidth="0.5">
           {/* Shifted up by 4 units to center vertically (was 10, now 6) */}
           <path d="M4 6l2-2h12l2 2-2 2H6l-2-2z" />
           <path d="M4 6v4l2 2h12l2-2v-4" />
           <path d="M4 10v4l2 2h12l2-2v-4" />
        </svg>
      );
    case 'Gold': // Jagged Crystal - Centered
      return (
        <svg width="80" height="80" viewBox="0 0 24 24" fill={color} stroke="white" strokeWidth="0.5">
           {/* Centered the crystal mass */}
           <path d="M12 3l3 6 6 2-5 5 1 7-7-3-7 3 1-7-5-5 6-2 3-6z" strokeLinejoin="round" />
           <path d="M12 3v20" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
           <path d="M3 11h18" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
        </svg>
      );
    case 'Platinum': // Hexagonal Prism
      return (
        <svg width="80" height="80" viewBox="0 0 24 24" fill={color} stroke="white" strokeWidth="0.5">
           <path d="M12 2l8.5 5v10L12 22 3.5 17V7L12 2z" />
           <path d="M12 2v20" stroke="rgba(0,0,0,0.2)" />
           <path d="M3.5 7l17 0" stroke="rgba(0,0,0,0.2)" />
           <path d="M3.5 17l17 0" stroke="rgba(0,0,0,0.2)" />
        </svg>
      );
    case 'Obsidian': // Sharp Shard
      return (
        <svg width="80" height="80" viewBox="0 0 24 24" fill={color} stroke="white" strokeWidth="0.5">
           <path d="M12 2L8 14l4 8 4-8-4-14z" />
           <path d="M12 2l-2 12 2 8 2-8-2-12z" fill="rgba(255,255,255,0.2)" />
           <path d="M8 14h8" stroke="rgba(255,255,255,0.3)" />
        </svg>
      );
    case 'Diamond': // Classic Cut
      return (
        <svg width="80" height="80" viewBox="0 0 24 24" fill={color} stroke="white" strokeWidth="0.5">
           <path d="M6 5h12l4 5-10 11L2 10l4-5z" strokeLinejoin="round" />
           <path d="M6 5l6 16 6-16" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
           <path d="M2 10h20" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
        </svg>
      );
    default:
      return null;
  }
}