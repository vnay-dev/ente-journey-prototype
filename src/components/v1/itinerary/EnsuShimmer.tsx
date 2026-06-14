import { useEffect } from "react";
import type { ReactNode } from "react";
import styles from "./EnsuShimmer.module.css";

const SHIMMER_MS = 3900;

type Props = {
  active: boolean;
  animationKey?: number;
  className?: string;
  children: ReactNode;
  onComplete?: () => void;
};

export function EnsuShimmer({ active, animationKey, className, children, onComplete }: Props) {
  useEffect(() => {
    if (!active) {
      return;
    }

    const timer = window.setTimeout(() => onComplete?.(), SHIMMER_MS);
    return () => window.clearTimeout(timer);
  }, [active, animationKey, onComplete]);

  if (!active) {
    return <>{children}</>;
  }

  return (
    <span className={`${styles.shimmerStack} ${className ?? ""}`}>
      <span className={styles.shimmerBase}>{children}</span>
    </span>
  );
}
