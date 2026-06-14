import { Location01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import styles from "./ItineraryInsights.module.css";

type Props = {
  insights: string[];
};

export function ItineraryInsights({ insights }: Props) {
  if (insights.length === 0) {
    return null;
  }

  return (
    <section className={styles.section} aria-label="Location">
      <div className={styles.titleRow}>
        <HugeiconsIcon
          icon={Location01Icon}
          size={16}
          strokeWidth={1.5}
          className={styles.titleIcon}
          aria-hidden
        />
        <h3 className={styles.title}>Location</h3>
      </div>
      <ul className={styles.list}>
        {insights.map((insight) => (
          <li key={insight} className={styles.item}>
            {insight}
          </li>
        ))}
      </ul>
    </section>
  );
}
