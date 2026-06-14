import type { ReactNode } from "react";
import styles from "./BrowserPhoneChrome.module.css";

type Props = {
  url: string;
  children: ReactNode;
};

function displayHost(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url.replace(/^https?:\/\//, "").split("/")[0] ?? url;
  }
}

function BluetoothIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
      <path
        d="m14.5 8.5-3.2 3.2 3.2 3.2-1.8 1.8L7 12l5.7-5.7 1.8 1.8Zm0 7-3.2-3.2 3.2-3.2-1.8-1.8L7 12l5.7 5.7 1.8-1.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg viewBox="0 0 16 12" width="15" height="11" aria-hidden>
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
  );
}

function SignalIcon() {
  return (
    <span className={styles.signal} aria-hidden>
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

function BatteryIcon() {
  return (
    <span className={styles.battery} aria-hidden title="Battery">
      <span className={styles.batteryBody}>
        <span className={styles.batteryLevel} />
      </span>
      <span className={styles.batteryCap} />
      <span className={styles.batteryPct}>100%</span>
    </span>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
      <path
        d="M12 5.2 4 12v7h5v-5h6v5h5v-7l-8-6.8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TuneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
      <path
        d="M4 7h10M18 7h2M4 12h2M10 12h10M4 17h6M14 17h6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="16" cy="7" r="2" fill="currentColor" />
      <circle cx="8" cy="12" r="2" fill="currentColor" />
      <circle cx="12" cy="17" r="2" fill="currentColor" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
      <path
        d="M12 5v14M5 12h14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TabIcon() {
  return <span className={styles.tabBadge}>1</span>;
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
      <circle cx="12" cy="6" r="1.6" fill="currentColor" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      <circle cx="12" cy="18" r="1.6" fill="currentColor" />
    </svg>
  );
}

function RecentsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
      <path
        d="M6 7h2v10H6V7Zm5 0h2v10h-2V7Zm5 0h2v10h-2V7Z"
        fill="currentColor"
      />
    </svg>
  );
}

function NavHomeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
      <rect
        x="7"
        y="7"
        width="10"
        height="10"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
      <path
        d="M14.5 6.5 8 12l6.5 5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BrowserPhoneChrome({ url, children }: Props) {
  const host = displayHost(url);

  return (
    <div className={styles.chrome}>
      <header className={styles.statusBar} aria-label="Status bar">
        <span className={styles.time}>5:22</span>
        <div className={styles.statusIcons}>
          <span className={styles.statusIcon}>
            <BluetoothIcon />
          </span>
          <span className={styles.statusIcon}>
            <WifiIcon />
          </span>
          <span className={styles.volte}>Vo LTE</span>
          <SignalIcon />
          <BatteryIcon />
        </div>
      </header>

      <div className={styles.toolbar} aria-label="Browser toolbar">
        <button type="button" className={styles.toolBtn} aria-label="Home" disabled>
          <HomeIcon />
        </button>
        <div className={styles.omnibox} aria-label="Address bar">
          <span className={styles.omniboxIcon}>
            <TuneIcon />
          </span>
          <span className={styles.omniboxText}>{host}</span>
        </div>
        <button type="button" className={styles.toolBtn} aria-label="New tab" disabled>
          <PlusIcon />
        </button>
        <button type="button" className={styles.toolBtn} aria-label="Tabs" disabled>
          <TabIcon />
        </button>
        <button type="button" className={styles.toolBtn} aria-label="Menu" disabled>
          <MenuIcon />
        </button>
      </div>

      <main className={styles.content}>{children}</main>

      <nav className={styles.systemNav} aria-label="System navigation">
        <button type="button" className={styles.systemNavBtn} aria-label="Recents" disabled>
          <RecentsIcon />
        </button>
        <button type="button" className={styles.systemNavBtn} aria-label="Home" disabled>
          <NavHomeIcon />
        </button>
        <button type="button" className={styles.systemNavBtn} aria-label="Back" disabled>
          <BackIcon />
        </button>
      </nav>
    </div>
  );
}
