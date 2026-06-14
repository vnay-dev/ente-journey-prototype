import { demoItinerary } from "../data/mockItinerary";
import { useSharePreview } from "../context/SharePreviewContext";
import { V2ItineraryScreen } from "../screens/v2/ItineraryScreen";
import styles from "./JourneySharePreview.module.css";

/** Recipient browser view — renders the shared journey without nested routing. */
export function JourneySharePreview() {
  const { sharedItinerary } = useSharePreview();
  const itinerary = sharedItinerary ?? demoItinerary;

  return (
    <div className={styles.root}>
      <V2ItineraryScreen shared previewItinerary={itinerary} />
    </div>
  );
}
