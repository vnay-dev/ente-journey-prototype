import { PlayIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import styles from "./ItineraryPlayButton.module.css";

type Props = {
  onClick?: () => void;
  hintTrigger?: number;
};

const SHEET_CLOSE_MS = 320;
const EXPAND_RAF_MS = 50;
const EXPANDED_HOLD_MS = 2800;

export function ItineraryPlayButton({ onClick, hintTrigger = 0 }: Props) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!hintTrigger) {
      return;
    }

    let expandRaf1 = 0;
    let expandRaf2 = 0;
    let collapseTimer: number;

    const expandTimer = window.setTimeout(() => {
      expandRaf1 = window.requestAnimationFrame(() => {
        expandRaf2 = window.requestAnimationFrame(() => {
          setExpanded(true);
          collapseTimer = window.setTimeout(() => setExpanded(false), EXPANDED_HOLD_MS);
        });
      });
    }, SHEET_CLOSE_MS + EXPAND_RAF_MS);

    return () => {
      window.clearTimeout(expandTimer);
      window.clearTimeout(collapseTimer);
      window.cancelAnimationFrame(expandRaf1);
      window.cancelAnimationFrame(expandRaf2);
    };
  }, [hintTrigger]);

  return (
    <button
      type="button"
      className={`${styles.playBtn} ${expanded ? styles.playBtnExpanded : ""}`}
      aria-label="Journey"
      onClick={onClick}
    >
      <span className={styles.playIcon}>
        <HugeiconsIcon icon={PlayIcon} size={18} strokeWidth={1.5} />
      </span>
      <span className={styles.playLabel}>Journey</span>
    </button>
  );
}
