import {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useCallback,
  useState
} from "react";
import type {
  TurnstileWidgetHandle,
  TurnstileWidgetProps
} from "../types/landing";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          theme?: "light" | "dark" | "auto";
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export const TurnstileWidget = forwardRef<
  TurnstileWidgetHandle,
  TurnstileWidgetProps
>(({ siteKey }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const tokenRef = useRef<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useImperativeHandle(ref, () => ({
    getResponse: () => tokenRef.current,
    reset: () => {
      tokenRef.current = null;
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
      }
    }
  }));

  const renderWidget = useCallback(() => {
    if (
      !siteKey ||
      !containerRef.current ||
      !window.turnstile ||
      widgetIdRef.current
    )
      return;
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: "dark",
      callback: (token: string) => {
        tokenRef.current = token;
      },
      "expired-callback": () => {
        tokenRef.current = null;
      },
      "error-callback": () => {
        tokenRef.current = null;
      }
    });
  }, [siteKey]);

  useEffect(() => {
    if (!siteKey) return;

    // If turnstile is already loaded (e.g. HMR), render immediately
    if (window.turnstile) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.head.appendChild(script);

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
      script.remove();
    };
  }, [siteKey]);

  useEffect(() => {
    if (scriptLoaded) renderWidget();
  }, [scriptLoaded, renderWidget]);

  if (!siteKey) return null;

  return <div ref={containerRef} className="flex justify-center mt-4" />;
});

TurnstileWidget.displayName = "TurnstileWidget";
