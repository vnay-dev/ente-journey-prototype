import { useCallback, useEffect, useRef, useState } from "react";
import { useDemoGuideOptional } from "../../context/DemoGuideContext";
import { useSharePreviewOptional } from "../../context/SharePreviewContext";
import { ItineraryAddPhotosSheet } from "../../components/v2/itinerary/ItineraryAddPhotosSheet";
import { SharedWebNav } from "../../components/v2/itinerary/SharedWebNav";
import { ItineraryShareSheet } from "../../components/v2/itinerary/ItineraryShareSheet";
import { ItineraryPhotoPreview } from "../../components/v2/itinerary/ItineraryPhotoPreview";
import { EnsuChatSheet } from "../../components/v2/itinerary/EnsuChatSheet";
import { ItineraryAppBar } from "../../components/v2/itinerary/ItineraryAppBar";
import { ItineraryEditFab } from "../../components/v2/itinerary/ItineraryEditFab";
import { ItineraryHeroTitle } from "../../components/v2/itinerary/ItineraryHeroTitle";
import { ItineraryStopCard } from "../../components/v2/itinerary/ItineraryStopCard";
import { ItineraryStoryViewer } from "../../components/v2/ItineraryStoryViewer";
import type { EnsuChatResult } from "../../components/v2/itinerary/EnsuChatSheet";
import {
  applyEnsuMessage,
  demoItinerary,
  isItineraryChangeValid,
  itineraryChangeRefFromHighlight,
  itineraryHighlightFromChangeRef,
  itineraryPlaceName,
  itineraryStorySlides,
  stopPhotoUrl,
  type Itinerary,
  type ItineraryChangeRef,
  type ItineraryHighlight,
  type ItineraryHighlightField,
} from "../../data/mockItinerary";
import { scrollElementIntoContainer } from "../../utils/scrollElementIntoContainer";
import styles from "./ItineraryScreen.module.css";

const SHEET_DISMISS_SCROLL_MS = 320;

type Props = {
  /** Read-only web preview for recipients opening a shared journey link. */
  shared?: boolean;
  /** Journey snapshot for the recipient browser preview frame. */
  previewItinerary?: Itinerary;
};

export function V2ItineraryScreen({ shared = false, previewItinerary }: Props) {
  type PhotoPreviewState = {
    stopId: string;
    location: string;
    photoIndices: number[];
    initialIndex: number;
  };

  const [itinerary, setItinerary] = useState<Itinerary>(previewItinerary ?? demoItinerary);
  const itineraryRef = useRef(itinerary);
  const [chatOpen, setChatOpen] = useState(false);
  const [highlight, setHighlight] = useState<ItineraryHighlight | null>(null);
  const [photoPreview, setPhotoPreview] = useState<PhotoPreviewState | null>(null);
  const [addPhotosOpen, setAddPhotosOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const [carouselFocus, setCarouselFocus] = useState<{ stopId: string; slideIndex: number } | null>(
    null,
  );
  const stopRefs = useRef<Record<string, HTMLElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const demoGuide = useDemoGuideOptional();
  const sharePreview = useSharePreviewOptional();

  useEffect(() => {
    if (sharePreview?.previewOpen) {
      setShareOpen(false);
    }
  }, [sharePreview?.previewOpen]);

  useEffect(() => {
    itineraryRef.current = itinerary;
  }, [itinerary]);

  const scrollToHighlight = useCallback(
    (stopId: string, field?: ItineraryHighlightField, nextValue?: string) => {
      const container = scrollContainerRef.current;
      if (!container) {
        return;
      }

      let target: HTMLElement | null = null;

      if (field === "mustTry" && nextValue) {
        target = container.querySelector<HTMLElement>(
          `[data-stop-id="${stopId}"][data-ensu-field="mustTry"][data-ensu-value="${CSS.escape(nextValue)}"]`,
        );
      } else if (field) {
        target = container.querySelector<HTMLElement>(
          `[data-stop-id="${stopId}"][data-ensu-field="${field}"]`,
        );
      }

      if (!target) {
        target = stopRefs.current[stopId] ?? null;
      }

      if (target) {
        scrollElementIntoContainer(container, target);
      }
    },
    [],
  );

  const clearHighlight = useCallback(() => setHighlight(null), []);

  const goToChange = useCallback(
    (
      nextHighlight: ItineraryHighlight,
      options?: { closeChat?: boolean; sourceItinerary?: Itinerary },
    ) => {
      const itineraryForValidation = options?.sourceItinerary ?? itinerary;
      const changeRef: ItineraryChangeRef = {
        stopId: nextHighlight.stopId,
        field: nextHighlight.field,
        label:
          itineraryForValidation.stops.find((stop) => stop.id === nextHighlight.stopId)
            ?.location ?? "this stop",
      };

      if (!isItineraryChangeValid(itineraryForValidation, changeRef)) {
        return;
      }

      if (options?.closeChat ?? true) {
        setChatOpen(false);
      }

      if (nextHighlight.kind === "locate") {
        setHighlight({
          stopId: nextHighlight.stopId,
          field: nextHighlight.field,
          message: nextHighlight.message ?? "",
          kind: "locate",
          revision: nextHighlight.revision,
        });
        return;
      }

      setHighlight(null);
      requestAnimationFrame(() =>
        setHighlight({
          ...nextHighlight,
          kind: "apply",
          previousValue: nextHighlight.previousValue,
          nextValue: nextHighlight.nextValue,
        }),
      );
    },
    [itinerary],
  );

  useEffect(() => {
    if (!highlight) {
      return;
    }

    const scrollTimer = window.setTimeout(() => {
      requestAnimationFrame(() =>
        scrollToHighlight(highlight.stopId, highlight.field, highlight.nextValue),
      );
    }, SHEET_DISMISS_SCROLL_MS);

    const settleTimer = window.setTimeout(() => {
      scrollToHighlight(highlight.stopId, highlight.field, highlight.nextValue);
    }, SHEET_DISMISS_SCROLL_MS + 180);

    return () => {
      window.clearTimeout(scrollTimer);
      window.clearTimeout(settleTimer);
    };
  }, [highlight, scrollToHighlight]);

  async function handleEnsuMessage(message: string): Promise<EnsuChatResult> {
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    const result = applyEnsuMessage(itineraryRef.current, message);
    setItinerary(result.itinerary);

    const changeRef = result.highlight
      ? itineraryChangeRefFromHighlight(result.itinerary, result.highlight)
      : undefined;

    if (result.highlight) {
      goToChange(result.highlight, { sourceItinerary: result.itinerary, closeChat: true });
    }

    return {
      reply: result.reply,
      changeRef,
    };
  }

  function handleAddPhotosToStop(stopId: string, photoIndices: number[]) {
    const stop = itinerary.stops.find((item) => item.id === stopId);
    if (!stop) {
      return null;
    }

    const newIndices = photoIndices.filter((index) => !stop.photoIndices.includes(index));
    if (newIndices.length === 0) {
      return null;
    }

    const firstNewSlideIndex = stop.photoIndices.length;
    const merged = [...stop.photoIndices, ...newIndices];

    setItinerary((prev) => ({
      ...prev,
      stops: prev.stops.map((item) =>
        item.id === stopId ? { ...item, photoIndices: merged } : item,
      ),
    }));

    setCarouselFocus({ stopId, slideIndex: firstNewSlideIndex });
    window.setTimeout(() => scrollToHighlight(stopId), 320);

    return {
      addedCount: newIndices.length,
      location: stop.location,
    };
  }

  function handleStopPhotoIndicesChange(
    stopId: string,
    photoIndices: number[] | ((current: number[]) => number[]),
  ) {
    setItinerary((prev) => ({
      ...prev,
      stops: prev.stops.map((stop) => {
        if (stop.id !== stopId) {
          return stop;
        }
        const nextIndices =
          typeof photoIndices === "function" ? photoIndices(stop.photoIndices) : photoIndices;
        return { ...stop, photoIndices: [...nextIndices] };
      }),
    }));
    setPhotoPreview((prev) => {
      if (!prev || prev.stopId !== stopId) {
        return prev;
      }
      const nextIndices =
        typeof photoIndices === "function" ? photoIndices(prev.photoIndices) : photoIndices;
      return { ...prev, photoIndices: [...nextIndices] };
    });
  }

  return (
    <div className={`${styles.page}${shared ? ` ${styles.pageShared}` : ""}`}>
      {shared ? <SharedWebNav /> : null}
      <div className={`${styles.header}${shared ? ` ${styles.headerShared}` : ""}`}>
        <img
          src="/assets/ente_mascot.png"
          alt=""
          aria-hidden
          className={styles.headerMascot}
        />
        <div className={styles.headerContent}>
          {!photoPreview && !shared ? (
            <ItineraryAppBar
              title="Journey"
              showBack
              tone="onPrimary"
              onPlay={() => setStoryOpen(true)}
              onAddPhoto={() => setAddPhotosOpen(true)}
              onShare={() => setShareOpen(true)}
            />
          ) : null}
          <ItineraryHeroTitle itinerary={itinerary} tone="onPrimary" />
        </div>
      </div>

      <div
        className={styles.scroll}
        ref={scrollContainerRef}
        data-demo-target="itinerary-scroll"
      >
        <div className={styles.stops}>
          {itinerary.stops.map((stop) => (
            <ItineraryStopCard
              key={stop.id}
              stop={stop}
              highlight={highlight}
              focusCarouselSlideIndex={
                carouselFocus?.stopId === stop.id ? carouselFocus.slideIndex : undefined
              }
              onHighlightComplete={clearHighlight}
              onPhotoClick={(index) => {
                setPhotoPreview({
                  stopId: stop.id,
                  location: stop.location,
                  photoIndices: stop.photoIndices,
                  initialIndex: index,
                });
              }}
              cardRef={(node) => {
                stopRefs.current[stop.id] = node;
              }}
              demoPhotoTarget={stop.id === "klcc"}
            />
          ))}
        </div>
      </div>

      {!photoPreview && !shared ? <ItineraryEditFab onClick={() => setChatOpen(true)} /> : null}
      {!shared ? (
        <EnsuChatSheet
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          onSend={handleEnsuMessage}
          isChangeValid={(change) => isItineraryChangeValid(itinerary, change)}
          onGoToChange={(change) => {
            goToChange(itineraryHighlightFromChangeRef(change), { closeChat: true });
          }}
          demoTypeRequest={demoGuide?.ensuTypeRequest}
          onDemoTypeComplete={() => demoGuide?.completeEnsuType()}
        />
      ) : null}
      {!shared ? (
        <ItineraryShareSheet
          open={shareOpen}
          itinerary={itinerary}
          onClose={() => setShareOpen(false)}
        />
      ) : null}
      {!shared ? (
        <ItineraryAddPhotosSheet
          open={addPhotosOpen}
          onClose={() => setAddPhotosOpen(false)}
          stops={itinerary.stops}
          onAddToStop={handleAddPhotosToStop}
        />
      ) : null}
      {photoPreview ? (
        <ItineraryPhotoPreview
          open
          location={photoPreview.location}
          photoIndices={photoPreview.photoIndices}
          initialIndex={photoPreview.initialIndex}
          readOnly={shared}
          onClose={() => setPhotoPreview(null)}
          onPhotoIndicesChange={
            shared
              ? undefined
              : (photoIndices) => handleStopPhotoIndicesChange(photoPreview.stopId, photoIndices)
          }
        />
      ) : null}
      {!shared ? (
        <ItineraryStoryViewer
          open={storyOpen}
          albumTitle={itineraryPlaceName(itinerary)}
          coverUrl={stopPhotoUrl(itinerary.stops[0]?.photoIndices[0] ?? 0, 200)}
          slides={itineraryStorySlides(itinerary)}
          storyDurationMs={2200}
          onClose={() => setStoryOpen(false)}
          onShareInstagram={() => {
            setStoryOpen(false);
            setShareOpen(true);
          }}
          onShareWhatsApp={() => {
            setStoryOpen(false);
            setShareOpen(true);
          }}
          onShareX={() => {
            setStoryOpen(false);
            setShareOpen(true);
          }}
          onViewItinerary={() => setStoryOpen(false)}
        />
      ) : null}
    </div>
  );
}
