import type { ReactNode } from "react";
import styles from "./EnteIconButton.module.css";

type Props = {
  children: ReactNode;
  label: string;
  onClick?: () => void;
  variant?: "surface" | "muted" | "circular" | "onPrimary";
  demoTarget?: string;
};

export function EnteIconButton({
  children,
  label,
  onClick,
  variant = "surface",
  demoTarget,
}: Props) {
  const variantClass =
    variant === "muted"
      ? styles.btnMuted
      : variant === "circular"
        ? styles.btnCircular
        : variant === "onPrimary"
          ? styles.btnOnPrimary
          : "";

  return (
    <button
      type="button"
      className={`${styles.btn} ${variantClass}`}
      aria-label={label}
      onClick={onClick}
      {...(demoTarget ? { "data-demo-target": demoTarget } : {})}
    >
      {children}
    </button>
  );
}
