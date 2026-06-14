import { Menu01Icon, Upload01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import styles from "./HomeHeader.module.css";

export function HomeHeader() {
  return (
    <header className={styles.header}>
      <button type="button" className={styles.iconBtn} aria-label="Open menu">
        <HugeiconsIcon icon={Menu01Icon} size={24} strokeWidth={1.5} />
      </button>

      <div className={styles.brand}>
        <img
          className={styles.wordmark}
          src="/assets/ente-logo.svg"
          alt="ente"
          width={62}
          height={16}
        />
      </div>

      <button type="button" className={styles.iconBtn} aria-label="Upload">
        <HugeiconsIcon icon={Upload01Icon} size={24} strokeWidth={1.5} />
      </button>
    </header>
  );
}
