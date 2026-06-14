import { useLayoutEffect } from "react";

const OUTER_W = 370;
const OUTER_H = 810;
const PAD = 64;
const FRAME_GAP = 28;
const LABEL_HEIGHT = 28;
const PREVIEW_BTN_W = 170;

/** Scale demo phone to fit the browser window without F11. */
export function useDemoScale(enabled: boolean, frameCount = 1, hasPreviewButton = false) {
  useLayoutEffect(() => {
    if (!enabled) {
      document.documentElement.style.removeProperty("--phone-demo-scale");
      return;
    }

    const count = Math.max(1, frameCount);

    const update = () => {
      const framesWidth = OUTER_W * count + FRAME_GAP * (count - 1);
      const previewButtonWidth = hasPreviewButton ? FRAME_GAP + PREVIEW_BTN_W : 0;
      const totalWidth = framesWidth + previewButtonWidth;
      const totalHeight = OUTER_H + LABEL_HEIGHT;
      const scale = Math.min(
        1,
        (window.innerWidth - PAD) / totalWidth,
        (window.innerHeight - PAD) / totalHeight,
      );
      document.documentElement.style.setProperty(
        "--phone-demo-scale",
        String(Math.max(0.42, scale)),
      );
    };

    update();
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      document.documentElement.style.removeProperty("--phone-demo-scale");
    };
  }, [enabled, frameCount, hasPreviewButton]);
}
