import type { AlbumItem } from "../data/mockAlbumsOverview";
import { IconCloudOff, IconPlus } from "./icons/SystemIcons";
import styles from "./AlbumTile.module.css";

type Props =
  | { variant: "album"; album: AlbumItem }
  | { variant: "add-new" };

export function AlbumTile(props: Props) {
  if (props.variant === "add-new") {
    return (
      <article className={styles.tile}>
        <div className={`${styles.thumb} ${styles.thumbAdd}`}>
          <IconPlus className={styles.plusIcon} />
        </div>
        <p className={styles.titleMuted}>Add new</p>
      </article>
    );
  }

  const { album } = props;
  return (
    <article className={styles.tile}>
      <div className={styles.thumb}>
        <img src={album.imageUrl} alt="" className={styles.img} loading="lazy" />
        {album.offline ? (
          <span className={styles.cloudOff} aria-label="Not backed up">
            <IconCloudOff size={14} />
          </span>
        ) : null}
      </div>
      <p className={styles.title}>{album.title}</p>
      <p className={styles.count}>{album.count}</p>
    </article>
  );
}
