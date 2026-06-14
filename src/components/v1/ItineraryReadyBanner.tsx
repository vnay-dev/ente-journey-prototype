import { useEffect, useState } from "react";
import { demoAlbumBannerPhotos } from "../../data/mockAlbumPhotos";
import styles from "./ItineraryReadyBanner.module.css";

const CAROUSEL_MS = 2800;

type Props = {
  photos?: string[];
  onOpen: () => void;
};

export function ItineraryReadyBanner({
  photos = demoAlbumBannerPhotos,
  onOpen,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const slides = photos.length > 0 ? photos : demoAlbumBannerPhotos;

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, CAROUSEL_MS);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <button type="button" className={styles.banner} onClick={onOpen}>
      <div className={styles.carousel} aria-hidden>
        {slides.map((url, index) => (
          <img
            key={`${index}-${url}`}
            src={url}
            alt=""
            className={`${styles.slide} ${index === activeIndex ? styles.slideActive : ""}`}
          />
        ))}
      </div>

      <span className={styles.overlay}>
        <span className={styles.nudge}>
          <span className={styles.nudgeLine}>Your trip to KL is now</span>
          <span className={styles.nudgeLine}>a shareable journey!</span>
        </span>
      </span>
    </button>
  );
}
