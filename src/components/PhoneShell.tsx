import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDemoGuideOptional } from "../context/DemoGuideContext";
import { BrowserPhoneChrome } from "./BrowserPhoneChrome";
import { DemoAnnotation } from "./v2/demo/DemoAnnotation";
import { DemoEndSplash } from "./v2/demo/DemoEndSplash";
import { JourneySharePreview } from "./JourneySharePreview";
import { useSharePreview } from "../context/SharePreviewContext";
import { useDemoOutro } from "../hooks/useDemoOutro";
import { useDemoScale } from "../hooks/useDemoScale";
import {
  DEMO_INTRO_FADE_MS,
  DEMO_OUTRO_DUAL_FADE_MS,
  DEMO_OUTRO_FRAME_FADE_MS,
} from "../demo/presentation";
import { usePresentationMode } from "../hooks/usePresentationMode";
import { PhoneChrome } from "./PhoneChrome";
import { PhoneFrameSvg } from "./PhoneFrameSvg";
import styles from "./PhoneShell.module.css";

type Props = {
  children?: ReactNode;
};

function DemoFrame({
  children,
  splash,
}: {
  children: ReactNode;
  splash?: ReactNode;
}) {
  return (
    <div className={styles.device}>
      <span className={`${styles.sideBtn} ${styles.btnMute}`} aria-hidden />
      <span className={`${styles.sideBtn} ${styles.btnVolUp}`} aria-hidden />
      <span className={`${styles.sideBtn} ${styles.btnVolDown}`} aria-hidden />
      <span className={`${styles.sideBtn} ${styles.btnPower}`} aria-hidden />

      <div className={styles.frame}>
        <PhoneFrameSvg />
        <div className={`${styles.screen} phone-screen`}>
          {children}
          {splash}
        </div>
      </div>
    </div>
  );
}

function DemoFrameColumn({
  label,
  children,
  showLabel = true,
  fadingOut = false,
  scaleTransitioning = false,
}: {
  label: string;
  children: ReactNode;
  showLabel?: boolean;
  fadingOut?: boolean;
  scaleTransitioning?: boolean;
}) {
  return (
    <div
      className={[
        styles.frameColumn,
        fadingOut ? styles.frameColumnOut : "",
        scaleTransitioning ? styles.frameColumnScaleTransition : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {showLabel ? (
        <div className={styles.frameLabelRow}>
          <span className={styles.frameLabel}>{label}</span>
        </div>
      ) : null}
      <div className={styles.scaleHost}>
        {children}
      </div>
    </div>
  );
}

export function PhoneShell({ children }: Props) {
  const mode = usePresentationMode();
  const isDemo = mode === "demo";
  const location = useLocation();
  const demoGuide = useDemoGuideOptional();
  const { shareUrl, previewPromptVisible, previewOpen, togglePreview, dismissPreviewPrompt } =
    useSharePreview();

  const presentationPhase = demoGuide?.presentationPhase ?? "running";
  const isIntro = presentationPhase === "intro";
  const isOutro = presentationPhase === "outro";
  const isComplete = presentationPhase === "complete";

  const handleOutroComplete = useCallback(() => {
    demoGuide?.completePresentation();
  }, [demoGuide]);

  const outroStep = useDemoOutro(isOutro, handleOutroComplete);
  const [introRevealed, setIntroRevealed] = useState(false);
  const [frameExitReady, setFrameExitReady] = useState(false);

  useEffect(() => {
    if (!isIntro) {
      setIntroRevealed(false);
      return;
    }
    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setIntroRevealed(true));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [isIntro]);

  useEffect(() => {
    if (outroStep !== "frame-fade") {
      setFrameExitReady(false);
      return;
    }
    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setFrameExitReady(true));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [outroStep]);

  useEffect(() => {
    if (outroStep === "center") {
      dismissPreviewPrompt();
    }
  }, [dismissPreviewPrompt, outroStep]);

  const showRecipient = Boolean(
    previewOpen && shareUrl && (outroStep === "idle" || outroStep === "fade-dual"),
  );
  const recipientFading = outroStep === "fade-dual";
  const annotationFading = recipientFading;
  const annotationFaded = isOutro && outroStep === "center";
  const showAnnotation =
    isDemo &&
    location.pathname.startsWith("/v2") &&
    demoGuide &&
    (presentationPhase === "running" || annotationFading || annotationFaded);
  const showBottomAnnotation = (previewOpen || annotationFading || annotationFaded) && !isIntro;
  const showPreviewPrompt =
    previewPromptVisible && !demoGuide?.isAutomatedDemo && !isOutro;
  const hasDualLayout =
    Boolean(previewOpen && shareUrl) &&
    (outroStep === "idle" || outroStep === "fade-dual" || outroStep === "center");
  const frameCount = hasDualLayout ? 2 : 1;
  const scaleTransitioning = isOutro && (outroStep === "fade-dual" || outroStep === "center");
  const showEndSplash =
    !isComplete && (outroStep === "splash" || outroStep === "frame-fade");
  const showFramesExit =
    isComplete || (outroStep === "frame-fade" && frameExitReady);

  useDemoScale(isDemo, frameCount, showPreviewPrompt);

  const content = children ?? (
    <PhoneChrome>
      <div />
    </PhoneChrome>
  );

  if (!isDemo) {
    return (
      <div className="shell shell--device">
        <div className="phone-frame">
          <div className="phone-screen">{content}</div>
        </div>
      </div>
    );
  }

  const framesClass = [
    styles.framesRow,
    showRecipient ? styles.framesRowDual : "",
    isOutro && outroStep !== "fade-dual" ? styles.framesRowCentered : "",
  ]
    .filter(Boolean)
    .join(" ");

  const introRevealClass = [
    styles.introReveal,
    isIntro && !introRevealed ? styles.introRevealPending : "",
    showFramesExit ? styles.introRevealExit : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`shell shell--demo${isComplete ? ` ${styles.shellComplete}` : ""}`}>
      <div
        className={`${styles.stage}${isComplete ? ` ${styles.stageComplete}` : ""}`}
        style={
          isOutro
            ? ({
                "--demo-outro-dual-fade-ms": `${DEMO_OUTRO_DUAL_FADE_MS}ms`,
              } as React.CSSProperties)
            : undefined
        }
      >
        {showAnnotation ? (
          <DemoAnnotation
            scene={demoGuide.scene}
            placement={showBottomAnnotation ? "bottom" : "side"}
            fadingOut={annotationFading}
            faded={annotationFaded}
          />
        ) : null}
        <div
          className={introRevealClass}
          style={
            isIntro
              ? ({ "--demo-intro-fade-ms": `${DEMO_INTRO_FADE_MS}ms` } as React.CSSProperties)
              : showFramesExit
                ? ({ "--demo-frame-fade-ms": `${DEMO_OUTRO_FRAME_FADE_MS}ms` } as React.CSSProperties)
                : undefined
          }
        >
        <div className={framesClass}>
          <DemoFrameColumn
            label="Ente app"
            showLabel={showRecipient}
            scaleTransitioning={scaleTransitioning}
          >
            <DemoFrame
              splash={showEndSplash ? <DemoEndSplash /> : undefined}
            >
              {content}
            </DemoFrame>
          </DemoFrameColumn>

          {showPreviewPrompt ? (
            <button
              type="button"
              className={`${styles.previewPrompt}${previewOpen ? ` ${styles.previewPromptActive}` : ""}`}
              onClick={togglePreview}
              aria-pressed={previewOpen}
            >
              <span className={styles.previewPromptTitle}>
                {previewOpen ? "Browser preview" : "Link copied"}
              </span>
              <span className={styles.previewPromptAction}>
                {previewOpen ? "Close preview" : "Preview in browser"}
              </span>
            </button>
          ) : null}

          {showRecipient ? (
            <DemoFrameColumn label="Recipient · Chrome" fadingOut={recipientFading}>
              <DemoFrame>
                <BrowserPhoneChrome url={shareUrl ?? ""}>
                  <JourneySharePreview />
                </BrowserPhoneChrome>
              </DemoFrame>
            </DemoFrameColumn>
          ) : null}
        </div>
        </div>
      </div>
    </div>
  );
}
