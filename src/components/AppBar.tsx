import { useNavigate } from "react-router-dom";
import styles from "./AppBar.module.css";

type Props = {
  title: string;
  showBack?: boolean;
};

export function AppBar({ title, showBack = false }: Props) {
  const navigate = useNavigate();

  return (
    <header className={styles.bar}>
      {showBack ? (
        <button
          type="button"
          className={styles.back}
          aria-label="Go back"
          onClick={() => navigate(-1)}
        >
          ←
        </button>
      ) : (
        <span className={styles.spacer} />
      )}
      <h1 className={styles.title}>{title}</h1>
      <span className={styles.spacer} />
    </header>
  );
}
