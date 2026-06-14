import styles from "./SharedWebNav.module.css";

export function SharedWebNav() {
  return (
    <header className={styles.nav} aria-label="Site navigation">
      <a className={styles.brand} href="https://ente.io" aria-label="ente">
        <img
          className={styles.logo}
          src="/assets/ente-logo.svg"
          alt=""
          width={62}
          height={16}
        />
      </a>
      <div className={styles.actions}>
        <button type="button" className={styles.signUpBtn}>
          Sign up
        </button>
      </div>
    </header>
  );
}
