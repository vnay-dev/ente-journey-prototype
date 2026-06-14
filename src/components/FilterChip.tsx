import type { ReactNode } from "react";
import styles from "./FilterChip.module.css";

type Props = {
  label: string;
  leading?: ReactNode;
  selected?: boolean;
  onClick?: () => void;
};

export function FilterChip({ label, leading, selected = false, onClick }: Props) {
  return (
    <button
      type="button"
      className={`${styles.chip} ${selected ? styles.selected : styles.unselected}`}
      onClick={onClick}
    >
      {leading ? <span className={styles.icon}>{leading}</span> : null}
      {label}
    </button>
  );
}
