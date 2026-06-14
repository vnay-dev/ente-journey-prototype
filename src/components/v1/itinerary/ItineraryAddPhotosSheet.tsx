import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { MALAYSIA_ALBUM_PHOTO_IDS, photoThumbUrl } from "../../../data/mockHomeGallery";
import { itineraryStopDayLabel, type ItineraryStop } from "../../../data/mockItinerary";
import { AnimatedSuccessCheck } from "../../AnimatedSuccessCheck";
import { EnteButton } from "../../EnteButton";
import { EnteSheetPanel } from "../../EnteSheetPanel";
import styles from "./ItineraryAddPhotosSheet.module.css";

type Step = "photos" | "place" | "success";

type AddResult = {
  addedCount: number;
  location: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  stops: ItineraryStop[];
  onAddToStop: (stopId: string, photoIndices: number[]) => AddResult | null;
};

export function ItineraryAddPhotosSheet({ open, onClose, stops, onAddToStop }: Props) {
  const [step, setStep] = useState<Step>("photos");
  const [selected, setSelected] = useState<Set<number>>(() => new Set());
  const [success, setSuccess] = useState<AddResult | null>(null);

  useEffect(() => {
    if (!open) {
      setStep("photos");
      setSelected(new Set());
      setSuccess(null);
    }
  }, [open]);

  function handleDismiss() {
    if (step === "success" || step === "photos") {
      onClose();
      return;
    }
    setStep("photos");
  }

  function togglePhoto(index: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  function handlePlaceSelect(stopId: string) {
    const result = onAddToStop(stopId, [...selected]);
    if (!result || result.addedCount === 0) {
      return;
    }
    setSuccess(result);
    setStep("success");
  }

  const selectedCount = selected.size;
  const title =
    step === "photos" ? "Trip to KL '26" : step === "place" ? "Add to place" : "";

  return (
    <EnteSheetPanel
      open={open}
      title={title}
      onClose={handleDismiss}
      hideHeader={step === "success"}
      hideCloseButton={step === "success"}
    >
      <div className={`${styles.content}${step === "success" ? ` ${styles.contentSuccess}` : ""}`}>
        {step === "photos" ? (
          <>
            <p className={styles.subtitle}>Select photos to add to your journey</p>
            <div className={styles.scroll}>
              <div className={styles.grid}>
                {MALAYSIA_ALBUM_PHOTO_IDS.map((_, index) => {
                  const isSelected = selected.has(index);
                  return (
                    <button
                      key={index}
                      type="button"
                      className={`${styles.photo}${isSelected ? ` ${styles.photoSelected}` : ""}`}
                      aria-label={`Photo ${index + 1}${isSelected ? ", selected" : ""}`}
                      aria-pressed={isSelected}
                      onClick={() => togglePhoto(index)}
                    >
                      <img
                        src={photoThumbUrl(index, 240)}
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                      {isSelected ? (
                        <span className={styles.check} aria-hidden>
                          <HugeiconsIcon icon={Tick02Icon} size={14} strokeWidth={2} />
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className={styles.footer}>
              <EnteButton
                label={selectedCount > 0 ? `Done (${selectedCount})` : "Done"}
                disabled={selectedCount === 0}
                onClick={() => setStep("place")}
              />
            </div>
          </>
        ) : null}

        {step === "place" ? (
          <>
            <p className={styles.subtitle}>
              {selectedCount === 1
                ? "Choose a place for 1 photo"
                : `Choose a place for ${selectedCount} photos`}
            </p>
            <div className={styles.scroll}>
              <div className={styles.placeList}>
                {stops.map((stop) => (
                  <button
                    key={stop.id}
                    type="button"
                    className={styles.placeRow}
                    onClick={() => handlePlaceSelect(stop.id)}
                  >
                    <span className={styles.placeName}>{stop.location}</span>
                    <span className={styles.placeDate}>{itineraryStopDayLabel(stop.day)}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : null}

        {step === "success" && success ? (
          <div className={styles.success}>
            <AnimatedSuccessCheck className={styles.successIcon} />
            <p className={styles.successMessage}>
              {success.addedCount === 1 ? "1 photo" : `${success.addedCount} photos`} added to{" "}
              <strong>{success.location}</strong>.
            </p>
            <div className={styles.successFooter}>
              <EnteButton label="Back to journey" onClick={onClose} />
            </div>
          </div>
        ) : null}
      </div>
    </EnteSheetPanel>
  );
}
