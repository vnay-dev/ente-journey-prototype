import { Calendar03Icon, User02Icon, UserMultiple02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  itineraryCountryName,
  itineraryDateRange,
  itineraryPlaceName,
  itineraryTripGroupLabel,
  type Itinerary,
  type TripGroup,
} from "../../../data/mockItinerary";
import styles from "./ItineraryHeroTitle.module.css";

type Props = {
  itinerary: Itinerary;
  tone?: "default" | "onPrimary";
};

function tripGroupIcon(group: TripGroup) {
  return group === "solo" ? User02Icon : UserMultiple02Icon;
}

export function ItineraryHeroTitle({ itinerary, tone = "default" }: Props) {
  const dateRange = itineraryDateRange(itinerary);
  const tripGroup = itineraryTripGroupLabel(itinerary.tripContext.group);
  const countryName = itineraryCountryName(itinerary);
  const placeName = itineraryPlaceName(itinerary);
  const toneClass = tone === "onPrimary" ? styles.heroOnPrimary : "";

  return (
    <header className={`${styles.hero} ${toneClass}`}>
      <h1 className={styles.destination}>
        <span className={styles.placeName}>{placeName}</span>
        <span className={styles.countryName}>{countryName}</span>
      </h1>
      <p className={styles.meta}>
        <span className={styles.metaItem}>
          <HugeiconsIcon
            icon={Calendar03Icon}
            size={14}
            strokeWidth={1.5}
            className={styles.metaIcon}
            aria-hidden
          />
          <span>{dateRange}</span>
        </span>
        <span className={styles.metaDot} aria-hidden>
          ·
        </span>
        <span className={styles.metaItem}>
          <HugeiconsIcon
            icon={tripGroupIcon(itinerary.tripContext.group)}
            size={14}
            strokeWidth={1.5}
            className={styles.metaIcon}
            aria-hidden
          />
          <span>{tripGroup}</span>
        </span>
      </p>
    </header>
  );
}
