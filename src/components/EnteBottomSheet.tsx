import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState, type ReactNode } from "react";
import { EnteIconButton } from "./EnteIconButton";
import styles from "./EnteBottomSheet.module.css";

type Props = {
  open: boolean;
  title: string;
  message: ReactNode;
  actions: ReactNode;
  onClose: () => void;
};

export function EnteBottomSheet({ open, title, message, actions, onClose }: Props) {
  const [mounted, setMounted] = useState(open);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!open) {
      setActive(false);
      const timeout = window.setTimeout(() => setMounted(false), 280);
      return () => window.clearTimeout(timeout);
    }

    setMounted(true);
    const frame = window.requestAnimationFrame(() => setActive(true));
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  if (!mounted) {
    return null;
  }

  return (
    <div className={`${styles.overlay} ${styles.overlayOpen}`} role="presentation">
      <button
        type="button"
        className={`${styles.scrim} ${active ? styles.scrimVisible : ""}`}
        aria-label="Dismiss"
        onClick={onClose}
      />
      <div
        className={`${styles.sheet} ${active ? styles.sheetVisible : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ente-bottom-sheet-title"
      >
        <div className={styles.copy}>
          <div className={styles.header}>
            <h2 id="ente-bottom-sheet-title" className={styles.title}>
              {title}
            </h2>
            <EnteIconButton label="Close" variant="circular" onClick={onClose}>
              <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={1.5} />
            </EnteIconButton>
          </div>
          <p className={styles.body}>{message}</p>
        </div>
        <div className={styles.actions}>{actions}</div>
      </div>
    </div>
  );
}
