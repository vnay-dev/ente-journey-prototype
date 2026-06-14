import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useRef, useState } from "react";
import { useSharePreviewOptional } from "../../../context/SharePreviewContext";
import { itineraryShareJourneyUrl, type Itinerary } from "../../../data/mockItinerary";
import { EnteButton } from "../../EnteButton";
import { EnteSheetPanel } from "../../EnteSheetPanel";
import styles from "./ItineraryShareSheet.module.css";

const COPIED_RESET_MS = 2500;

type Props = {
  open: boolean;
  itinerary: Itinerary;
  onClose: () => void;
};

export function ItineraryShareSheet({ open, itinerary, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef<number | null>(null);
  const sharePreview = useSharePreviewOptional();
  const shareUrl = itineraryShareJourneyUrl(itinerary);

  useEffect(() => {
    if (!open) {
      setCopied(false);
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }
    }
  }, [open]);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  async function handleCopyLink() {
    if (copied) {
      return;
    }

    await navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    sharePreview?.requestPreview(shareUrl);

    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }

    resetTimerRef.current = window.setTimeout(() => {
      setCopied(false);
      resetTimerRef.current = null;
    }, COPIED_RESET_MS);
  }

  return (
    <EnteSheetPanel open={open} title="Share Journey" onClose={onClose}>
      <div className={styles.content}>
        <div className={styles.copy}>
          <p className={styles.description}>
            Share your journey with friends and family so they can relive your trip through photos,
            places, and highlights.
          </p>
          <p className={styles.urlPreview}>{shareUrl}</p>
        </div>
        <div className={styles.actions}>
          <EnteButton
          label={copied ? "Copied!" : "Copy link"}
          icon={
            <HugeiconsIcon
              icon={copied ? Tick02Icon : Copy01Icon}
              size={18}
              strokeWidth={1.5}
            />
          }
          onClick={() => void handleCopyLink()}
        />
        </div>
      </div>
    </EnteSheetPanel>
  );
}
