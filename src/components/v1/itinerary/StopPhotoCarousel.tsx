import {
  memo,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type PointerEvent,
  type TransitionEvent,
} from "react";
import { stopPhotoUrl } from "../../../data/mockItinerary";
import styles from "./StopPhotoCarousel.module.css";

const AUTOPLAY_MS = 3500;
const SWIPE_THRESHOLD = 48;
const SLIDE_MS = 620;
const SLIDE_EASING = "cubic-bezier(0.16, 1, 0.3, 1)";
const SLIDE_TRANSITION = `transform ${SLIDE_MS}ms ${SLIDE_EASING}`;

type Props = {
  photoIndices: number[];
  onPhotoClick?: (index: number) => void;
  /** When the photo set changes, open on this slide (e.g. after adding photos). */
  focusSlideIndex?: number;
};

function buildLoopSeeds(seeds: number[]) {
  if (seeds.length === 0) {
    return [];
  }
  return [seeds[seeds.length - 1], ...seeds, seeds[0]];
}

export const StopPhotoCarousel = memo(function StopPhotoCarousel({
  photoIndices,
  onPhotoClick,
  focusSlideIndex,
}: Props) {
  const photoKey = photoIndices.join(",");
  const seeds = useMemo(
    () => (photoIndices.length > 0 ? photoIndices : [0]),
    [photoKey, photoIndices],
  );
  const loopSeeds = useMemo(() => buildLoopSeeds(seeds), [seeds]);
  const lastPhotoKeyRef = useRef("");
  const [position, setPosition] = useState(1);
  const [paused, setPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [animate, setAnimate] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(1);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const dragAxisRef = useRef<"horizontal" | "vertical" | null>(null);
  const dragOffsetRef = useRef(0);
  const dragFrameRef = useRef<number | null>(null);

  function resumeAutoplay() {
    setPaused(false);
  }

  const realIndex =
    position === 0
      ? seeds.length - 1
      : position === loopSeeds.length - 1
        ? 0
        : position - 1;

  function slideWidth() {
    return viewportRef.current?.clientWidth ?? 0;
  }

  function setTrackTransform(nextPosition: number, dragPx: number, animated: boolean) {
    const track = trackRef.current;
    const width = slideWidth();
    if (!track) {
      return;
    }

    if (width <= 0) {
      return;
    }

    track.style.transition = animated ? SLIDE_TRANSITION : "none";
    track.style.transform = `translate3d(${-nextPosition * width + dragPx}px, 0, 0)`;
  }

  function cancelDragFrame() {
    if (dragFrameRef.current !== null) {
      cancelAnimationFrame(dragFrameRef.current);
      dragFrameRef.current = null;
    }
  }

  function scheduleDragTransform() {
    if (dragFrameRef.current !== null) {
      return;
    }

    dragFrameRef.current = requestAnimationFrame(() => {
      dragFrameRef.current = null;
      setTrackTransform(positionRef.current, dragOffsetRef.current, false);
    });
  }

  useLayoutEffect(() => {
    if (lastPhotoKeyRef.current === photoKey) {
      return;
    }

    lastPhotoKeyRef.current = photoKey;
    const safeIndex =
      focusSlideIndex !== undefined
        ? Math.max(0, Math.min(focusSlideIndex, seeds.length - 1))
        : 0;
    const loopPosition = safeIndex + 1;

    positionRef.current = loopPosition;
    setPosition(loopPosition);
    setAnimate(true);
    setPaused(false);
    dragOffsetRef.current = 0;
    setIsDragging(false);
    cancelDragFrame();
    setTrackTransform(loopPosition, 0, false);
  }, [photoKey, focusSlideIndex, seeds.length]);

  useLayoutEffect(() => {
    positionRef.current = position;
    if (!isDragging) {
      setTrackTransform(position, 0, animate);
    }
  }, [position, animate, isDragging]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    function syncSlideOffset() {
      setTrackTransform(positionRef.current, dragOffsetRef.current, false);
    }

    const observer = new ResizeObserver(syncSlideOffset);
    observer.observe(viewport);
    syncSlideOffset();

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => cancelDragFrame();
  }, []);

  useEffect(() => {
    if (paused || seeds.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setPosition((current) => current + 1);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [paused, seeds.length]);

  useEffect(() => {
    function handlePointerDownOutside(event: globalThis.PointerEvent) {
      if (!carouselRef.current?.contains(event.target as Node)) {
        resumeAutoplay();
      }
    }

    function handleWindowBlur() {
      resumeAutoplay();
    }

    document.addEventListener("pointerdown", handlePointerDownOutside);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDownOutside);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, []);

  function jumpWithoutAnimation(nextPosition: number) {
    setAnimate(false);
    positionRef.current = nextPosition;
    setPosition(nextPosition);
    setTrackTransform(nextPosition, 0, false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimate(true));
    });
  }

  function handleTransitionEnd(event: TransitionEvent<HTMLDivElement>) {
    if (event.propertyName !== "transform") {
      return;
    }

    if (position === loopSeeds.length - 1) {
      jumpWithoutAnimation(1);
      return;
    }

    if (position === 0) {
      jumpWithoutAnimation(seeds.length);
    }
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    setPaused(true);
    event.currentTarget.focus({ preventScroll: true });
    pointerStartRef.current = { x: event.clientX, y: event.clientY };
    dragAxisRef.current = null;
    dragOffsetRef.current = 0;
    setIsDragging(true);
    setTrackTransform(positionRef.current, 0, false);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const start = pointerStartRef.current;
    if (!start || !isDragging) {
      return;
    }

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;

    if (dragAxisRef.current === null) {
      if (Math.abs(deltaX) < 8 && Math.abs(deltaY) < 8) {
        return;
      }
      dragAxisRef.current = Math.abs(deltaX) > Math.abs(deltaY) ? "horizontal" : "vertical";
    }

    if (dragAxisRef.current !== "horizontal") {
      return;
    }

    event.preventDefault();
    dragOffsetRef.current = deltaX * 0.985;
    scheduleDragTransform();
  }

  function finishDrag(event: PointerEvent<HTMLDivElement>, nextPosition?: number) {
    pointerStartRef.current = null;
    dragAxisRef.current = null;
    dragOffsetRef.current = 0;
    cancelDragFrame();
    setIsDragging(false);

    if (nextPosition !== undefined) {
      setPosition(nextPosition);
    } else {
      setTrackTransform(positionRef.current, 0, true);
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    const start = pointerStartRef.current;
    const wasTap =
      start &&
      (dragAxisRef.current === null ||
        (Math.abs(event.clientX - start.x) < 8 && Math.abs(event.clientY - start.y) < 8));

    if (start && dragAxisRef.current === "horizontal") {
      const deltaX = event.clientX - start.x;
      if (deltaX <= -SWIPE_THRESHOLD) {
        finishDrag(event, positionRef.current + 1);
        return;
      }
      if (deltaX >= SWIPE_THRESHOLD) {
        finishDrag(event, positionRef.current - 1);
        return;
      }
    }

    finishDrag(event);

    if (wasTap && onPhotoClick) {
      const tappedIndex =
        positionRef.current === 0
          ? seeds.length - 1
          : positionRef.current === loopSeeds.length - 1
            ? 0
            : positionRef.current - 1;
      onPhotoClick(tappedIndex);
    }
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!carouselRef.current?.contains(event.relatedTarget as Node)) {
      resumeAutoplay();
    }
  }

  return (
    <div
      ref={carouselRef}
      className={styles.carousel}
      tabIndex={-1}
      onBlur={handleBlur}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div ref={viewportRef} className={styles.viewport}>
        <div
          ref={trackRef}
          className={styles.track}
          onTransitionEnd={handleTransitionEnd}
        >
          {loopSeeds.map((photoIndex, slideIndex) => (
            <div key={`${photoIndex}-${slideIndex}`} className={styles.slide}>
              <img
                className={styles.photo}
                src={stopPhotoUrl(photoIndex, 480)}
                alt=""
                loading="eager"
                decoding="async"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.dots} aria-hidden>
        {seeds.map((photoIndex, dotIndex) => (
          <span
            key={`${photoIndex}-${dotIndex}`}
            className={`${styles.dot} ${dotIndex === realIndex ? styles.dotActive : ""}`}
          />
        ))}
      </div>
    </div>
  );
});
