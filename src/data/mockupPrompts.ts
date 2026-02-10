export interface MockupPrompt {
  id: string;
  tool: string;
  model: string;
  prompt: string;
  notes: string;
}

export const MOCKUP_PROMPTS: MockupPrompt[] = [
  {
    id: "midjourney",
    tool: "Midjourney",
    model: "v6",
    prompt:
      "premium mobile game UI mockup on iPhone screen, futuristic vault unlocking app, tier cards bronze silver gold diamond, dark metallic interface, clear hierarchy, realistic reflections, product marketing render, no text artifacts, centered composition, studio lighting --ar 9:19 --stylize 180 --v 6",
    notes:
      "Great for polished hero-style renders. Export one clean front-facing frame for web placement.",
  },
  {
    id: "flux",
    tool: "ComfyUI / Flux",
    model: "FLUX.1-dev",
    prompt:
      "photoreal iPhone app mockup showing a vault opening game screen, dark steel UI, tiered rarity bars, glowing call-to-action button, cinematic but clean, modern startup landing page asset, ultra-detailed, no watermark, no gibberish text",
    notes:
      "Use 1179x2556 source output for high quality, then downscale web image to about 900px height.",
  },
  {
    id: "dalle",
    tool: "DALL-E",
    model: "Latest",
    prompt:
      "Generate a realistic iPhone mockup displaying a gamified vault app. The UI should feel premium and metallic, with tier colors for bronze, silver, gold, and diamond, plus a secure badge insertion interaction and a clear unlock state. Keep the device centered on a transparent or dark-neutral background suitable for a marketing website.",
    notes:
      "Ask for transparent background variant if available. If not, use dark neutral background for easy blending.",
  },
];
