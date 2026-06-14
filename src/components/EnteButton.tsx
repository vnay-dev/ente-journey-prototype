import type { ReactNode } from "react";
import styles from "./EnteButton.module.css";

type Props = {
  label: string;
  icon?: ReactNode;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  onClick?: () => void;
  demoTarget?: string;
};

export function EnteButton({
  label,
  icon,
  variant = "primary",
  disabled = false,
  onClick,
  demoTarget,
}: Props) {
  return (
    <button
      type="button"
      className={`${styles.btn} ${variant === "secondary" ? styles.secondary : styles.primary}`}
      disabled={disabled}
      onClick={onClick}
      {...(demoTarget ? { "data-demo-target": demoTarget } : {})}
    >
      {icon ? <span className={styles.icon}>{icon}</span> : null}
      {label}
    </button>
  );
}
