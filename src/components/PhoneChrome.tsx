import type { ReactNode } from "react";
import styles from "./PhoneChrome.module.css";

type Props = {
  children: ReactNode;
};

export function PhoneChrome({ children }: Props) {
  return (
    <div className={styles.chrome}>
      <header className={styles.statusBar} aria-label="Status bar">
        <span className={styles.time}>9:41</span>
        <div className={styles.statusIcons}>
          <span className={styles.signal} aria-hidden>
            <i />
            <i />
            <i />
            <i />
          </span>
          <span className={styles.wifi} aria-hidden title="Wi‑Fi">
            <svg viewBox="0 0 16 12" width="16" height="12">
              <path
                d="M8 10.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM2.5 5.2a7.5 7.5 0 0 1 11 0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              <path
                d="M5 7.4a4.5 4.5 0 0 1 6 0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              <path
                d="M7.2 9.1a1.8 1.8 0 0 1 1.6 0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className={styles.battery} aria-hidden title="Battery">
            <span className={styles.batteryBody}>
              <span className={styles.batteryLevel} />
            </span>
            <span className={styles.batteryCap} />
          </span>
        </div>
      </header>

      <main className={styles.content}>{children}</main>

      <nav className={styles.navBar} aria-label="Navigation bar">
        <button type="button" className={styles.navBtn} aria-label="Back">
          <svg viewBox="0 0 24 24" width="22" height="22">
            <path
              d="M14.5 5.5 8 12l6.5 6.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button type="button" className={styles.navBtn} aria-label="Home">
          <svg viewBox="0 0 24 24" width="22" height="22">
            <circle
              cx="12"
              cy="12"
              r="6.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </button>
        <button type="button" className={styles.navBtn} aria-label="Recent apps">
          <svg viewBox="0 0 24 24" width="22" height="22">
            <rect
              x="6"
              y="6"
              width="12"
              height="12"
              rx="1.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </button>
      </nav>
    </div>
  );
}
