import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useLayoutEffect, useRef } from "react";
import styles from "./AnimatedSuccessCheck.module.css";

type Props = {
  size?: number;
  className?: string;
};

const ICON_SCALE = 0.58;

export function AnimatedSuccessCheck({ size = 56, className }: Props) {
  const iconRef = useRef<SVGSVGElement>(null);
  const iconSize = Math.round(size * ICON_SCALE);

  useLayoutEffect(() => {
    iconRef.current?.querySelector("path")?.setAttribute("pathLength", "1");
  }, []);

  return (
    <div
      className={[styles.root, className].filter(Boolean).join(" ")}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <div className={styles.circle} />
      <HugeiconsIcon
        ref={iconRef}
        icon={Tick02Icon}
        size={iconSize}
        strokeWidth={1.75}
        className={styles.check}
      />
    </div>
  );
}
