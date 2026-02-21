import posthog from "posthog-js";

const POSTHOG_KEY = import.meta.env.VITE_PUBLIC_POSTHOG_KEY as
  | string
  | undefined;
const POSTHOG_HOST = import.meta.env.VITE_PUBLIC_POSTHOG_HOST as
  | string
  | undefined;
const POSTHOG_API_HOST = import.meta.env.VITE_API_POSTHOG_HOST as
  | string
  | undefined;
const SESSION_REPLAY_ENABLED =
  (import.meta.env.VITE_PUBLIC_POSTHOG_SESSION_REPLAY ?? "true") !== "false";
const HEATMAPS_ENABLED =
  (import.meta.env.VITE_PUBLIC_POSTHOG_HEATMAPS ?? "true") !== "false";
const REPLAY_CONSOLE_LOGS_ENABLED =
  import.meta.env.VITE_PUBLIC_POSTHOG_REPLAY_CONSOLE_LOGS === "true";

export const isPostHogEnabled = Boolean(
  POSTHOG_KEY && POSTHOG_HOST && POSTHOG_API_HOST
);

if (isPostHogEnabled) {
  posthog.init(POSTHOG_KEY!, {
    api_host: POSTHOG_HOST,
    ui_host: POSTHOG_HOST,
    autocapture: true,
    capture_pageview: false,
    capture_pageleave: true,
    capture_heatmaps: HEATMAPS_ENABLED,
    disable_session_recording: !SESSION_REPLAY_ENABLED,
    enable_recording_console_log:
      SESSION_REPLAY_ENABLED && REPLAY_CONSOLE_LOGS_ENABLED,
    session_recording: SESSION_REPLAY_ENABLED
      ? {
          // Keep inputs masked in replays by default.
          maskAllInputs: true,
          maskInputOptions: { password: true },
          strictMinimumDuration: true,
        }
      : {},
  });
}

export default posthog;
