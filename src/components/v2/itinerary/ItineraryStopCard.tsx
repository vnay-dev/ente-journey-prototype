import type { ItineraryHighlight, ItineraryStop } from "../../../data/mockItinerary";
import { EnsuFieldReveal } from "./EnsuFieldReveal";
import { ItineraryInsights } from "./ItineraryInsights";
import { StopPhotoCarousel } from "./StopPhotoCarousel";
import { EnsuShimmer } from "./EnsuShimmer";
import styles from "./ItineraryStopCard.module.css";

type Props = {
  stop: ItineraryStop;
  highlight: ItineraryHighlight | null;
  onHighlightComplete?: () => void;
  onPhotoClick?: (index: number) => void;
  cardRef?: (node: HTMLElement | null) => void;
  focusCarouselSlideIndex?: number;
  demoPhotoTarget?: boolean;
};

export function ItineraryStopCard({
  stop,
  highlight,
  onHighlightComplete,
  onPhotoClick,
  cardRef,
  focusCarouselSlideIndex,
  demoPhotoTarget = false,
}: Props) {
  const isHighlighted = highlight?.stopId === stop.id;
  const isApplyHighlight = isHighlighted && highlight?.kind === "apply";
  const isLocateHighlight = isHighlighted && highlight?.kind === "locate";

  return (
    <article className={styles.card} ref={cardRef} id={`stop-${stop.id}`}>
      <div className={styles.meta}>
        <div className={styles.calendar} aria-hidden>
          <span className={styles.dayLabel}>Day</span>
          <span className={styles.dayNumber}>{stop.day}</span>
        </div>
        <div className={styles.heading}>
          <div data-stop-id={stop.id} data-ensu-field="location" className={styles.locationWrap}>
            {isHighlighted && highlight?.field === "location" && isLocateHighlight ? (
              <EnsuFieldReveal
                as="h2"
                value={stop.location}
                active
                highlightOnly
                animationKey={highlight.revision}
                textClassName={styles.location}
                onComplete={onHighlightComplete}
              />
            ) : isHighlighted && highlight?.field === "location" ? (
              <EnsuFieldReveal
                as="h2"
                value={stop.location}
                active={isApplyHighlight && highlight?.field === "location"}
                previousValue={
                  isApplyHighlight && highlight?.field === "location"
                    ? highlight.previousValue
                    : undefined
                }
                animationKey={
                  isApplyHighlight && highlight?.field === "location"
                    ? highlight.revision
                    : undefined
                }
                textClassName={styles.location}
                onComplete={
                  isApplyHighlight && highlight?.field === "location"
                    ? onHighlightComplete
                    : undefined
                }
              />
            ) : (
              <h2 className={styles.location}>{stop.location}</h2>
            )}
          </div>
          <div
            data-stop-id={stop.id}
            data-ensu-field="tagline"
            className={styles.taglineWrap}
            {...(isHighlighted && highlight?.field === "tagline"
              ? { "data-demo-target": "ensu-highlight-active" }
              : {})}
          >
            {isHighlighted && highlight?.field === "tagline" && isLocateHighlight ? (
              <EnsuFieldReveal
                as="p"
                value={stop.tagline}
                active
                highlightOnly
                animationKey={highlight.revision}
                textClassName={styles.tagline}
                onComplete={onHighlightComplete}
              />
            ) : isHighlighted && highlight?.field === "tagline" ? (
              <EnsuFieldReveal
                as="p"
                value={stop.tagline}
                active={isApplyHighlight}
                previousValue={highlight.previousValue}
                animationKey={highlight.revision}
                textClassName={styles.tagline}
                onComplete={onHighlightComplete}
              />
            ) : (
              <p className={styles.tagline}>{stop.tagline}</p>
            )}
          </div>
        </div>
      </div>

      <div
        className={styles.photoStage}
        {...(demoPhotoTarget ? { "data-demo-target": "stop-photo" } : {})}
        onClick={demoPhotoTarget ? () => onPhotoClick?.(0) : undefined}
        onKeyDown={
          demoPhotoTarget
            ? (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onPhotoClick?.(0);
                }
              }
            : undefined
        }
        role={demoPhotoTarget ? "button" : undefined}
        tabIndex={demoPhotoTarget ? 0 : undefined}
      >
        <StopPhotoCarousel
          photoIndices={stop.photoIndices}
          focusSlideIndex={focusCarouselSlideIndex}
          onPhotoClick={onPhotoClick}
        />
      </div>

      <ItineraryInsights insights={stop.insights} />

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Must try</h3>
        <ul className={styles.mustTryList}>
          {stop.mustTry.map((item) => (
            <li
              key={item}
              className={styles.mustTryItem}
              data-stop-id={stop.id}
              data-ensu-field="mustTry"
              data-ensu-value={item}
            >
              <EnsuShimmer
                active={
                  isApplyHighlight &&
                  highlight?.field === "mustTry" &&
                  highlight.nextValue === item
                }
                animationKey={
                  highlight?.field === "mustTry" && highlight.nextValue === item
                    ? highlight.revision
                    : undefined
                }
                onComplete={
                  isApplyHighlight && highlight?.field === "mustTry"
                    ? onHighlightComplete
                    : undefined
                }
              >
                {item}
              </EnsuShimmer>
            </li>
          ))}
        </ul>
      </section>

      {stop.additionalInfo ? (
        <section className={styles.section} data-stop-id={stop.id} data-ensu-field="additionalInfo">
          <h3 className={styles.sectionTitle}>Good to know</h3>
          <div className={styles.noteCallout}>
            {isHighlighted && highlight?.field === "additionalInfo" && isLocateHighlight ? (
              <EnsuFieldReveal
                as="p"
                value={stop.additionalInfo}
                active
                highlightOnly
                animationKey={highlight.revision}
                textClassName={styles.note}
                onComplete={onHighlightComplete}
              />
            ) : isHighlighted && highlight?.field === "additionalInfo" ? (
              <EnsuFieldReveal
                as="p"
                value={stop.additionalInfo}
                active={isApplyHighlight && highlight?.field === "additionalInfo"}
                previousValue={
                  isApplyHighlight && highlight?.field === "additionalInfo"
                    ? highlight.previousValue
                    : undefined
                }
                animationKey={
                  isApplyHighlight && highlight?.field === "additionalInfo"
                    ? highlight.revision
                    : undefined
                }
                textClassName={styles.note}
                onComplete={
                  isApplyHighlight && highlight?.field === "additionalInfo"
                    ? onHighlightComplete
                    : undefined
                }
              />
            ) : (
              <p className={styles.note}>{stop.additionalInfo}</p>
            )}
          </div>
        </section>
      ) : null}
    </article>
  );
}
