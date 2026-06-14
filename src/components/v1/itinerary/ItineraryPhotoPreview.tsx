import { Cancel01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import { stopPhotoUrl } from "../../../data/mockItinerary";
import styles from "./ItineraryPhotoPreview.module.css";

const SWIPE_THRESHOLD = 48;
const SLIDE_MS = 320;
const SLIDE_EASING = "cubic-bezier(0.16, 1, 0.3, 1)";

type Props = {
  open: boolean;
  location: string;
  photoIndices: number[];
  initialIndex: number;
  readOnly?: boolean;
  onClose: () => void;
  onPhotoIndicesChange?: (photoIndices: number[]) => void;
};

export function ItineraryPhotoPreview({
  open,
  location,
  photoIndices,
  initialIndex,
  readOnly = false,
  onClose,
  onPhotoIndicesChange,
}: Props) {
  const [index, setIndex] = useState(initialIndex);
  const [isDragging, setIsDragging] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const dragAxisRef = useRef<"horizontal" | "vertical" | null>(null);
  const dragOffsetRef = useRef(0);

  useEffect(() => {
    if (open) {
      setIndex(initialIndex);
    }
  }, [open, initialIndex]);

  useEffect(() => {
    if (index >= photoIndices.length) {
      setIndex(Math.max(0, photoIndices.length - 1));
    }
  }, [index, photoIndices.length]);

  function slideWidth() {
    return viewportRef.current?.clientWidth ?? 0;
  }

  function setTrackTransform(nextIndex: number, dragPx: number, animated: boolean) {
    const track = trackRef.current;
    const width = slideWidth();
    if (!track || width <= 0) {
      return;
    }

    track.style.transition = animated ? `transform ${SLIDE_MS}ms ${SLIDE_EASING}` : "none";
    track.style.transform = `translate3d(${-nextIndex * width + dragPx}px, 0, 0)`;
  }

  useLayoutEffect(() => {
    if (!open || isDragging) {
      return;
    }
    setTrackTransform(index, 0, !isDragging);
  }, [open, index, isDragging, photoIndices]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !open) {
      return;
    }

    function syncSlideOffset() {
      setTrackTransform(index, dragOffsetRef.current, false);
    }

    const observer = new ResizeObserver(syncSlideOffset);
    observer.observe(viewport);
    syncSlideOffset();

    return () => observer.disconnect();
  }, [open, index]);

  if (!open || photoIndices.length === 0) {
    return null;
  }

  const safeIndex = Math.min(index, photoIndices.length - 1);

  function handleRemove() {
    if (!onPhotoIndicesChange) {
      return;
    }

    if (photoIndices.length <= 1) {
      onPhotoIndicesChange([]);
      onClose();
      return;
    }

    const next = photoIndices.filter((_, photoIndex) => photoIndex !== safeIndex);
    onPhotoIndicesChange(next);
    setIndex(Math.min(safeIndex, next.length - 1));
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    pointerStartRef.current = { x: event.clientX, y: event.clientY };
    dragAxisRef.current = null;
    dragOffsetRef.current = 0;
    setIsDragging(true);
    setTrackTransform(safeIndex, 0, false);
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
    dragOffsetRef.current = deltaX;
    setTrackTransform(safeIndex, deltaX, false);
  }

  function finishDrag(event: PointerEvent<HTMLDivElement>, nextIndex?: number) {
    pointerStartRef.current = null;
    dragAxisRef.current = null;
    dragOffsetRef.current = 0;
    setIsDragging(false);

    if (nextIndex !== undefined) {
      setIndex(nextIndex);
    } else {
      setTrackTransform(safeIndex, 0, true);
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    const start = pointerStartRef.current;
    if (start && dragAxisRef.current === "horizontal") {
      const deltaX = event.clientX - start.x;
      if (deltaX <= -SWIPE_THRESHOLD && safeIndex < photoIndices.length - 1) {
        finishDrag(event, safeIndex + 1);
        return;
      }
      if (deltaX >= SWIPE_THRESHOLD && safeIndex > 0) {
        finishDrag(event, safeIndex - 1);
        return;
      }
    }

    finishDrag(event);
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={location}>
      <div className={styles.topBar}>
        <h2 className={styles.title}>{location}</h2>
        <button type="button" className={styles.closeBtn} aria-label="Close preview" onClick={onClose}>
          <HugeiconsIcon icon={Cancel01Icon} size={20} strokeWidth={1.5} />
        </button>
      </div>

      <div
        className={styles.stage}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div ref={viewportRef} className={styles.viewport}>
          <div ref={trackRef} className={styles.track}>
            {photoIndices.map((photoIndex, slideIndex) => (
              <div key={`${photoIndex}-${slideIndex}`} className={styles.slide}>
                <img
                  className={styles.photo}
                  src={stopPhotoUrl(photoIndex, 960)}
                  alt=""
                  loading="eager"
                  decoding="async"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {!readOnly ? (
        <div className={styles.bottomBar}>
          <button type="button" className={styles.removeBtn} onClick={handleRemove}>
            <HugeiconsIcon icon={Delete02Icon} size={18} strokeWidth={1.5} />
            Remove
          </button>
        </div>
      ) : null}
    </div>
  );
}
