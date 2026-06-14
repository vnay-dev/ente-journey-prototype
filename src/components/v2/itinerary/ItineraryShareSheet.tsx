import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useRef, useState } from "react";
import { useDemoGuideOptional } from "../../../context/DemoGuideContext";
import { useSharePreviewOptional } from "../../../context/SharePreviewContext";
import { itineraryShareJourneyUrl, type Itinerary } from "../../../data/mockItinerary";
import { usePrototypeVersion } from "../../../hooks/usePrototypePaths";
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
  const demoGuide = useDemoGuideOptional();
  const version = usePrototypeVersion();
  const shareUrl = itineraryShareJourneyUrl(itinerary, version);

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

    const isAutomatedDemo = demoGuide?.isAutomatedDemo ?? false;

    sharePreview?.requestPreview(shareUrl, {
      showPrompt: !isAutomatedDemo,
      openRecipient: isAutomatedDemo,
      itinerary,
    });

    if (isAutomatedDemo) {
      onClose();
    }

    setCopied(true);

    try {
      await navigator.clipboard?.writeText(shareUrl);
    } catch {
      // Clipboard can fail in embedded previews; the demo still continues.
    }

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
      <div className={styles.content} data-demo-target="share-sheet">
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
          demoTarget="share-copy"
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
