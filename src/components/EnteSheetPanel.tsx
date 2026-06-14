import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState, type ReactNode } from "react";
import { EnteIconButton } from "./EnteIconButton";
import styles from "./EnteSheetPanel.module.css";

type Props = {
  open: boolean;
  title: ReactNode;
  onClose: () => void;
  children: ReactNode;
  hideCloseButton?: boolean;
  hideHeader?: boolean;
  closeDemoTarget?: string;
};

export function EnteSheetPanel({
  open,
  title,
  onClose,
  children,
  hideCloseButton = false,
  hideHeader = false,
  closeDemoTarget,
}: Props) {
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
        className={`${styles.panel} ${active ? styles.panelVisible : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ente-sheet-title"
      >
        {hideHeader ? null : (
          <div className={styles.header}>
            <h2 id="ente-sheet-title" className={styles.title}>
              {title}
            </h2>
            {hideCloseButton ? null : (
              <EnteIconButton
                label="Close"
                variant="circular"
                onClick={onClose}
                demoTarget={closeDemoTarget}
              >
                <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={1.5} />
              </EnteIconButton>
            )}
          </div>
        )}
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}
