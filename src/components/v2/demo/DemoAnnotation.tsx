import type { DemoScene } from "../../../demo/scenes";
import styles from "./DemoAnnotation.module.css";

type Props = {
  scene: DemoScene;
  placement?: "side" | "bottom";
  fadingOut?: boolean;
  faded?: boolean;
};

export function DemoAnnotation({
  scene,
  placement = "side",
  fadingOut = false,
  faded = false,
}: Props) {
  return (
    <aside
      className={`${styles.rail}${placement === "bottom" ? ` ${styles.railBottom}` : ""}${fadingOut ? ` ${styles.railOut}` : ""}${faded ? ` ${styles.railFaded}` : ""}`}
      role="status"
      aria-live="polite"
    >
      <div className={styles.card}>
        <p className={styles.body}>{scene.annotation}</p>
      </div>
    </aside>
  );
}
