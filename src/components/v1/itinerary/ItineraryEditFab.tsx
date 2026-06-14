import { Edit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import styles from "./ItineraryEditFab.module.css";

type Props = {
  onClick: () => void;
};

export function ItineraryEditFab({ onClick }: Props) {
  return (
    <button type="button" className={styles.fab} onClick={onClick}>
      <HugeiconsIcon icon={Edit02Icon} size={18} strokeWidth={1.5} />
      Edit
    </button>
  );
}
