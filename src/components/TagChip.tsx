import type { ReactNode } from "react";
import styles from "./TagChip.module.css";

type Props = {
  label: string;
  selected?: boolean;
  trailing?: ReactNode;
  onClick?: () => void;
};

export function TagChip({ label, selected = false, trailing, onClick }: Props) {
  return (
    <button
      type="button"
      className={`${styles.chip} ${trailing ? styles.chipTrailing : ""} ${
        selected ? styles.selected : styles.unselected
      }`}
      onClick={onClick}
    >
      {label}
      {trailing ? <span className={styles.trailing}>{trailing}</span> : null}
    </button>
  );
}
