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
};

export function ItineraryStopCard({
  stop,
  highlight,
  onHighlightComplete,
  onPhotoClick,
  cardRef,
  focusCarouselSlideIndex,
}: Props) {
  const isHighlighted = highlight?.stopId === stop.id;
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
            <EnsuFieldReveal
              as="h2"
              value={stop.location}
              active={isHighlighted && highlight?.field === "location"}
              previousValue={
                highlight?.field === "location" ? highlight.previousValue : undefined
              }
              animationKey={highlight?.field === "location" ? highlight.revision : undefined}
              textClassName={styles.location}
              onComplete={
                isHighlighted && highlight?.field === "location"
                  ? onHighlightComplete
                  : undefined
              }
            />
          </div>
          <div data-stop-id={stop.id} data-ensu-field="tagline" className={styles.taglineWrap}>
            {isHighlighted && highlight?.field === "tagline" && isLocateHighlight ? (
              <EnsuShimmer
                active
                animationKey={highlight.revision}
                onComplete={onHighlightComplete}
              >
                <p className={styles.tagline}>{stop.tagline}</p>
              </EnsuShimmer>
            ) : (
              <EnsuFieldReveal
                as="p"
                value={stop.tagline}
                active={isHighlighted && highlight?.field === "tagline"}
                previousValue={
                  highlight?.field === "tagline" ? highlight.previousValue : undefined
                }
                animationKey={highlight?.field === "tagline" ? highlight.revision : undefined}
                textClassName={styles.tagline}
                onComplete={
                  isHighlighted && highlight?.field === "tagline"
                    ? onHighlightComplete
                    : undefined
                }
              />
            )}
          </div>
        </div>
      </div>

      <div className={styles.photoStage}>
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
                  isHighlighted &&
                  highlight?.field === "mustTry" &&
                  highlight.nextValue === item
                }
                animationKey={
                  highlight?.field === "mustTry" && highlight.nextValue === item
                    ? highlight.revision
                    : undefined
                }
                onComplete={
                  isHighlighted && highlight?.field === "mustTry"
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
            <EnsuFieldReveal
              as="p"
              value={stop.additionalInfo}
              active={isHighlighted && highlight?.field === "additionalInfo"}
              previousValue={
                highlight?.field === "additionalInfo" ? highlight.previousValue : undefined
              }
              animationKey={
                highlight?.field === "additionalInfo" ? highlight.revision : undefined
              }
              textClassName={styles.note}
              onComplete={
                isHighlighted && highlight?.field === "additionalInfo"
                  ? onHighlightComplete
                  : undefined
              }
            />
          </div>
        </section>
      ) : null}
    </article>
  );
}
