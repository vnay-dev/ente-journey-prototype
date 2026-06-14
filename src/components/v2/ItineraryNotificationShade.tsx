import {
  AirplaneModeIcon,
  BellIcon,
  CellularNetworkIcon,
  FlashlightIcon,
  OrientationPotraitToLandscapeIcon,
  Settings01Icon,
  VolumeHighIcon,
  Wifi01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import styles from "./ItineraryNotificationShade.module.css";

type Props = {
  open: boolean;
  onOpen: () => void;
  onDismiss: () => void;
};

const QUICK_TOGGLES = [
  { id: "wifi", icon: Wifi01Icon, active: true },
  { id: "volume", icon: VolumeHighIcon, active: false },
  { id: "data", icon: CellularNetworkIcon, active: false },
  { id: "airplane", icon: AirplaneModeIcon, active: false },
  { id: "portrait", icon: OrientationPotraitToLandscapeIcon, active: false },
  { id: "torch", icon: FlashlightIcon, active: false },
] as const;

export function ItineraryNotificationShade({ open, onOpen, onDismiss }: Props) {
  const [drawn, setDrawn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!open) {
      setDrawn(false);
      const timer = window.setTimeout(() => setMounted(false), 420);
      return () => window.clearTimeout(timer);
    }

    setMounted(true);
    const raf = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setDrawn(true));
    });
    return () => window.cancelAnimationFrame(raf);
  }, [open]);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={`${styles.overlay} ${drawn ? styles.overlayVisible : ""}`}
      role="dialog"
      aria-label="Notifications"
    >
      <div className={`${styles.shade} ${drawn ? styles.shadeOpen : ""}`}>
        <div className={styles.shadeContent}>
          <div className={styles.shadeHeader}>
            <span className={styles.date}>Mon, 10 Apr</span>
            <button type="button" className={styles.settingsBtn} aria-label="Settings">
              <HugeiconsIcon icon={Settings01Icon} size={18} strokeWidth={1.5} />
            </button>
          </div>

          <div className={styles.quickRow} aria-hidden>
            {QUICK_TOGGLES.map(({ id, icon, active }) => (
              <span
                key={id}
                className={`${styles.quickToggle} ${active ? styles.quickToggleActive : ""}`}
              >
                <HugeiconsIcon icon={icon} size={16} strokeWidth={1.5} />
              </span>
            ))}
          </div>

          <div className={styles.quickActions} aria-hidden>
            <span className={styles.quickPill}>Device control</span>
            <span className={styles.quickPill}>Media output</span>
          </div>

          <button
            type="button"
            className={styles.notification}
            data-demo-target="journey-notification"
            onClick={onOpen}
          >
            <img
              src="/assets/ente-app-icon.png"
              alt=""
              className={styles.notificationIcon}
              aria-hidden
            />
            <span className={styles.notificationBody}>
              <span className={styles.notificationMeta}>Ente · now</span>
              <span className={styles.notificationTitle}>
                We turned photos from your recent trip to KL into a journey!
              </span>
              <span className={styles.notificationSubtitle}>
                Preview the itinerary and share it with your travel companions!
              </span>
            </span>
            <span className={styles.notificationBell} aria-hidden>
              <HugeiconsIcon icon={BellIcon} size={12} strokeWidth={1.75} />
            </span>
          </button>

          <div className={styles.footer}>
            <button type="button" className={styles.clearBtn} onClick={onDismiss}>
              Clear
            </button>
          </div>
        </div>

        <button
          type="button"
          className={styles.shadeBackdrop}
          aria-label="Close notifications"
          onClick={onDismiss}
        />
      </div>
    </div>
  );
}
