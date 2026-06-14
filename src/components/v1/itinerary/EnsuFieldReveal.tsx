import { useEffect, useState } from "react";
import styles from "./EnsuFieldReveal.module.css";

type Phase = "idle" | "sweep" | "fade" | "reveal" | "done";

type Props = {
  value: string;
  active: boolean;
  previousValue?: string;
  animationKey?: number;
  className?: string;
  textClassName?: string;
  as?: "h2" | "p";
  onComplete?: () => void;
};

const TIMING = {
  sweep: 2400,
  fade: 1200,
  reveal: 3900,
} as const;

function HighlightStack({
  text,
  phaseClass,
  showSweep,
}: {
  text: string;
  phaseClass?: string;
  showSweep: boolean;
}) {
  return (
    <span className={`${styles.highlightStack} ${phaseClass ?? ""}`}>
      <span
        className={`${styles.textBase} ${showSweep ? styles.textHighlightSweep : ""}`}
      >
        {text}
      </span>
    </span>
  );
}

export function EnsuFieldReveal({
  value,
  active,
  previousValue,
  animationKey,
  className,
  textClassName,
  as: Tag = "p",
  onComplete,
}: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const canAnimate =
    active && Boolean(previousValue) && previousValue !== value;

  const displayPhase: Phase = canAnimate && phase === "idle" ? "sweep" : phase;

  useEffect(() => {
    if (!active || !canAnimate) {
      setPhase("idle");
      return;
    }

    setPhase("sweep");

    const fadeTimer = window.setTimeout(() => setPhase("fade"), TIMING.sweep);
    const revealTimer = window.setTimeout(
      () => setPhase("reveal"),
      TIMING.sweep + TIMING.fade,
    );
    const doneTimer = window.setTimeout(() => {
      setPhase("done");
      onComplete?.();
    }, TIMING.sweep + TIMING.fade + TIMING.reveal);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(revealTimer);
      window.clearTimeout(doneTimer);
    };
  }, [active, animationKey, canAnimate, onComplete, previousValue, value]);

  const textClass = `${styles.text} ${textClassName ?? ""}`;

  if (!canAnimate) {
    return (
      <span className={`${styles.wrap} ${className ?? ""}`}>
        <Tag className={textClass}>{value}</Tag>
      </span>
    );
  }

  const showOld = displayPhase === "sweep" || displayPhase === "fade";
  const showNew = displayPhase === "reveal" || displayPhase === "done";

  const oldPhaseClass =
    displayPhase === "sweep" ? styles.oldSweep : styles.oldFade;

  return (
    <span className={`${styles.wrap} ${className ?? ""}`}>
      <Tag className={textClass}>
        <span className={styles.animBody}>
          {showOld ? (
            <span className={styles.oldLayer}>
              <HighlightStack
                text={previousValue ?? ""}
                phaseClass={oldPhaseClass}
                showSweep={displayPhase === "sweep"}
              />
            </span>
          ) : null}
          {showNew ? (
            displayPhase === "reveal" ? (
              <span className={`${styles.newLayer} ${styles.newReveal}`}>
                <HighlightStack text={value} showSweep />
              </span>
            ) : (
              <span className={styles.newSettled}>{value}</span>
            )
          ) : null}
        </span>
      </Tag>
    </span>
  );
}
