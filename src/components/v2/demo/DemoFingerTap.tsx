import styles from "./DemoFingerTap.module.css";

type Props = {
  x: number;
  y: number;
  clicking?: boolean;
  dragging?: boolean;
};

export function DemoFingerTap({ x, y, clicking = false, dragging = false }: Props) {
  return (
    <div
      className={`${styles.root}${clicking ? ` ${styles.rootClicking}` : ""}${dragging ? ` ${styles.rootDragging}` : ""}`}
      style={{ left: x, top: y }}
      aria-hidden
    >
      <span className={styles.dot} />
    </div>
  );
}
