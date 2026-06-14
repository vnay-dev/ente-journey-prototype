import { useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ItineraryNotificationShade } from "../components/v2/ItineraryNotificationShade";
import { DemoOverlay } from "../components/v2/demo/DemoOverlay";
import { useDemoGuideOptional } from "../context/DemoGuideContext";
import { useItineraryGeneration } from "../context/ItineraryGenerationContext";
import { usePrototypePaths } from "../hooks/usePrototypePaths";
import styles from "./V2Layout.module.css";

export function V2Layout() {
  const shellRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const paths = usePrototypePaths();
  const demoGuide = useDemoGuideOptional();
  const { job, dismissBanner, openItinerary } = useItineraryGeneration();

  const onItineraryScreen = location.pathname.includes("/itinerary");
  const notificationAllowed =
    !demoGuide?.isAutomatedDemo || demoGuide.notificationRevealed;
  const showNotification =
    job?.status === "ready" &&
    job.bannerVisible &&
    !onItineraryScreen &&
    notificationAllowed;

  function handleOpen() {
    if (!job) {
      return;
    }
    openItinerary();
    navigate(paths.itinerary(job.albumId));
  }

  return (
    <div className={styles.shell} ref={shellRef}>
      <div className={styles.content}>
        <Outlet />
      </div>
      <ItineraryNotificationShade
        open={showNotification}
        onOpen={handleOpen}
        onDismiss={dismissBanner}
      />
      <DemoOverlay shellRef={shellRef} />
    </div>
  );
}
