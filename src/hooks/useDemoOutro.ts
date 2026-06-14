import { useEffect, useState } from "react";
import {
  DEMO_OUTRO_CENTER_MS,
  DEMO_OUTRO_DUAL_FADE_MS,
  DEMO_OUTRO_FRAME_FADE_MS,
  DEMO_OUTRO_SPLASH_FADE_MS,
  DEMO_OUTRO_SPLASH_HOLD_MS,
  DEMO_OUTRO_SPLASH_IN_MS,
} from "../demo/presentation";

export type DemoOutroStep =
  | "idle"
  | "fade-dual"
  | "center"
  | "splash"
  | "splash-fade"
  | "frame-fade"
  | "done";

export function useDemoOutro(active: boolean, onComplete: () => void) {
  const [step, setStep] = useState<DemoOutroStep>("idle");

  useEffect(() => {
    if (!active) {
      setStep("idle");
      return;
    }

    setStep("fade-dual");

    const centerAt = DEMO_OUTRO_DUAL_FADE_MS;
    const splashAt = centerAt + DEMO_OUTRO_CENTER_MS;
    const splashFadeAt = splashAt + DEMO_OUTRO_SPLASH_IN_MS + DEMO_OUTRO_SPLASH_HOLD_MS;
    const frameFadeAt = splashFadeAt + DEMO_OUTRO_SPLASH_FADE_MS;

    const centerTimer = window.setTimeout(() => setStep("center"), centerAt);
    const splashTimer = window.setTimeout(() => setStep("splash"), splashAt);
    const splashFadeTimer = window.setTimeout(() => setStep("splash-fade"), splashFadeAt);
    const frameFadeTimer = window.setTimeout(() => setStep("frame-fade"), frameFadeAt);
    const doneTimer = window.setTimeout(() => {
      setStep("done");
      onComplete();
    }, frameFadeAt + DEMO_OUTRO_FRAME_FADE_MS);

    return () => {
      window.clearTimeout(centerTimer);
      window.clearTimeout(splashTimer);
      window.clearTimeout(splashFadeTimer);
      window.clearTimeout(frameFadeTimer);
      window.clearTimeout(doneTimer);
    };
  }, [active, onComplete]);

  return step;
}
