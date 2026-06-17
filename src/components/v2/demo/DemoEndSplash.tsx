import styles from "./DemoEndSplash.module.css";

export function DemoEndSplash() {
  return (
    <div className={`${styles.splash} ${styles.splashIn}`} aria-hidden>
      <img
        className={styles.mascot}
        src="/assets/ente_mascot.png"
        alt=""
      />
      <div className={styles.brand}>
        <img
          className={styles.logo}
          src="/assets/ente-logo.svg"
          alt="ente"
        />
        <p className={styles.wordmark}>journey</p>
      </div>
    </div>
  );
}
