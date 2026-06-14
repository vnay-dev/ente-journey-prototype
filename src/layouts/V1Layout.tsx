import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ItineraryNotificationShade } from "../components/v1/ItineraryNotificationShade";
import { useItineraryGeneration } from "../context/ItineraryGenerationContext";
import { usePrototypePaths } from "../hooks/usePrototypePaths";
import styles from "./V1Layout.module.css";

export function V1Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const paths = usePrototypePaths();
  const { job, dismissBanner, openItinerary } = useItineraryGeneration();

  const onItineraryScreen = location.pathname.includes("/itinerary");
  const showNotification =
    job?.status === "ready" && job.bannerVisible && !onItineraryScreen;

  function handleOpen() {
    if (!job) {
      return;
    }
    openItinerary();
    navigate(paths.itinerary(job.albumId));
  }

  return (
    <div className={styles.shell}>
      <div className={styles.content}>
        <Outlet />
      </div>
      <ItineraryNotificationShade
        open={showNotification}
        onOpen={handleOpen}
        onDismiss={dismissBanner}
      />
    </div>
  );
}
