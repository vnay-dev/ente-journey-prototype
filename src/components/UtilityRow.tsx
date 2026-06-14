import type { UtilityRowItem } from "../data/mockAlbumsOverview";
import { IconChevronRight, IconLock, UtilityIcon } from "./icons/SystemIcons";
import styles from "./UtilityRow.module.css";

type Props = {
  item: UtilityRowItem;
};

export function UtilityRow({ item }: Props) {
  return (
    <button type="button" className={styles.row}>
      <span className={styles.leading}>
        <UtilityIcon type={item.icon} className={styles.icon} />
        <span className={styles.label}>{item.label}</span>
      </span>
      <span className={styles.trailing}>
        {item.trailing === "count" && item.count !== undefined ? (
          <>
            <span className={styles.dot} aria-hidden />
            <span className={styles.count}>{item.count}</span>
          </>
        ) : null}
        {item.trailing === "lock" ? (
          <>
            <span className={styles.dot} aria-hidden />
            <IconLock className={styles.lock} />
          </>
        ) : null}
        {item.trailing === "chevron" ? <IconChevronRight size={20} /> : null}
      </span>
    </button>
  );
}
