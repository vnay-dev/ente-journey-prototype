import styles from "./DemoEndSplash.module.css";

type Props = {
  fadingOut?: boolean;
};

export function DemoEndSplash({ fadingOut = false }: Props) {
  return (
    <div
      className={`${styles.splash}${fadingOut ? ` ${styles.splashOut}` : ` ${styles.splashIn}`}`}
      aria-hidden
    >
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
