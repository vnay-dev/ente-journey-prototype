import {
  Cancel01Icon,
  InstagramIcon,
  NewTwitterIcon,
  WhatsappIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCallback, useEffect, useState, type CSSProperties } from "react";
import {
  demoItineraryStorySlides,
  type ItineraryStorySlide,
} from "../../data/mockItinerary";
import styles from "./ItineraryStoryViewer.module.css";

const STORY_MS = 5000;

type Props = {
  open: boolean;
  albumTitle?: string;
  coverUrl?: string;
  slides?: ItineraryStorySlide[];
  onClose: () => void;
  onShareInstagram?: () => void;
  onShareWhatsApp?: () => void;
  onShareX?: () => void;
  onViewItinerary?: () => void;
};

export function ItineraryStoryViewer({
  open,
  albumTitle = "Trip to KL '26",
  coverUrl,
  slides = demoItineraryStorySlides(),
  onClose,
  onShareInstagram,
  onShareWhatsApp,
  onShareX,
  onViewItinerary,
}: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [mounted, setMounted] = useState(false);

  const slide = slides[index];
  const avatarUrl = coverUrl ?? slide?.imageUrl ?? "";
  const isTitleSlide = slide?.kind === "intro" || slide?.kind === "outro";

  useEffect(() => {
    if (!open) {
      const timer = window.setTimeout(() => {
        setMounted(false);
        setIndex(0);
        setPaused(false);
      }, 200);
      return () => window.clearTimeout(timer);
    }

    setMounted(true);
    setIndex(0);
    setPaused(false);
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    slides.forEach((item) => {
      const image = new Image();
      image.src = item.imageUrl;
    });
  }, [open, slides]);

  const goNext = useCallback(() => {
    setIndex((current) => {
      if (current >= slides.length - 1) {
        onClose();
        return current;
      }
      return current + 1;
    });
  }, [onClose, slides.length]);

  const goPrev = useCallback(() => {
    setIndex((current) => (current > 0 ? current - 1 : current));
  }, []);

  useEffect(() => {
    if (!open || !mounted) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight") {
        goNext();
      } else if (event.key === "ArrowLeft") {
        goPrev();
      } else if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev, mounted, onClose, open]);

  if (!mounted || !slide) {
    return null;
  }

  return (
    <div
      className={styles.viewer}
      role="dialog"
      aria-label="Journey preview"
      style={{ "--story-duration": `${STORY_MS}ms` } as CSSProperties}
    >
      <div className={styles.topBar}>
        <div className={styles.progressRow} aria-hidden>
          {slides.map((item, slideIndex) => {
            const isDone = slideIndex < index;
            const isActive = slideIndex === index;

            return (
              <div key={item.id} className={styles.progressTrack}>
                <div
                  key={isActive ? `active-${index}` : item.id}
                  className={`${styles.progressFill} ${isDone ? styles.progressFillDone : ""} ${
                    isActive ? styles.progressFillActive : ""
                  } ${isActive && paused ? styles.progressFillActivePaused : ""}`}
                  onAnimationEnd={isActive && !paused && slide.kind !== "outro" ? goNext : undefined}
                />
              </div>
            );
          })}
        </div>

        <div className={styles.metaRow}>
          <img src={avatarUrl} alt="" className={styles.avatar} aria-hidden />
          <div className={styles.metaCopy}>
            <span className={styles.metaTitle}>{albumTitle}</span>
          </div>
          <button type="button" className={styles.closeBtn} aria-label="Close" onClick={onClose}>
            <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <div className={styles.stage}>
        {slides.map((item, slideIndex) => (
          <img
            key={item.id}
            src={item.imageUrl}
            alt=""
            className={`${styles.photo} ${slideIndex === index ? styles.photoActive : ""}`}
            decoding="async"
            loading="eager"
          />
        ))}

        {isTitleSlide ? <div className={styles.stageScrim} aria-hidden /> : null}

        {slide.kind === "intro" ? (
          <div className={styles.introSlide}>
            <div className={styles.introFrame}>
              <p className={styles.introLead}>{slide.location}</p>
              <h2 className={styles.introPlace}>{slide.tagline}</h2>
              <img
                src="/assets/malaysia-flag.png"
                alt=""
                className={styles.introFlag}
                aria-hidden
              />
            </div>
            <div className={styles.introFooter}>
              <span className={styles.introFooterText}>Created by</span>
              <img
                src="/assets/ente-logo.svg"
                alt="Ente"
                className={styles.introFooterLogo}
              />
            </div>
          </div>
        ) : null}

        {slide.kind === "outro" ? (
          <div className={styles.outroCard}>
            <div className={styles.outroMain}>
              <p className={styles.outroTitle}>Share your journey with others:</p>
              <div className={styles.socialRow}>
                <button
                  type="button"
                  className={`${styles.socialBtn} ${styles.socialBtnInstagram}`}
                  aria-label="Share on Instagram"
                  onClick={onShareInstagram}
                >
                  <HugeiconsIcon icon={InstagramIcon} size={20} strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  className={`${styles.socialBtn} ${styles.socialBtnWhatsapp}`}
                  aria-label="Share on WhatsApp"
                  onClick={onShareWhatsApp}
                >
                  <HugeiconsIcon icon={WhatsappIcon} size={20} strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  className={`${styles.socialBtn} ${styles.socialBtnX}`}
                  aria-label="Share on X"
                  onClick={onShareX}
                >
                  <HugeiconsIcon icon={NewTwitterIcon} size={20} strokeWidth={1.5} />
                </button>
              </div>
            </div>
            <button
              type="button"
              className={styles.itineraryBtn}
              onClick={onViewItinerary ?? onClose}
            >
              View detailed itinerary
            </button>
          </div>
        ) : null}

        {slide.kind === "stop" ? (
          <div className={styles.caption}>
            {slide.dayLabel ? <span className={styles.dayLabel}>{slide.dayLabel}</span> : null}
            <span className={styles.location}>{slide.location}</span>
            {slide.tagline ? <span className={styles.tagline}>{slide.tagline}</span> : null}
          </div>
        ) : null}

        <div
          className={styles.tapLayer}
          onPointerDown={() => setPaused(true)}
          onPointerUp={() => setPaused(false)}
          onPointerCancel={() => setPaused(false)}
          onPointerLeave={() => setPaused(false)}
        >
          <button
            type="button"
            className={`${styles.tapZone} ${styles.tapZonePrev}`}
            aria-label="Previous"
            onClick={goPrev}
          />
          <button
            type="button"
            className={`${styles.tapZone} ${styles.tapZoneNext}`}
            aria-label="Next"
            onClick={goNext}
          />
        </div>
      </div>
    </div>
  );
}
