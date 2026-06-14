import type { AlbumItem } from "../data/mockAlbumsOverview";
import { AlbumTile } from "./AlbumTile";
import { IconChevronRight, IconSearch } from "./icons/SystemIcons";
import styles from "./AlbumSection.module.css";

type Props = {
  title: string;
  albums: AlbumItem[];
  showAddNew?: boolean;
};

export function AlbumSection({ title, albums, showAddNew = false }: Props) {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.actions}>
          <button type="button" className={styles.iconBtn} aria-label={`Search ${title}`}>
            <IconSearch size={22} />
          </button>
          <button type="button" className={styles.iconBtn} aria-label={`Open ${title}`}>
            <IconChevronRight size={22} />
          </button>
        </div>
      </header>

      <div className={styles.rowScroll}>
        <div className={styles.row}>
          {showAddNew ? <AlbumTile variant="add-new" /> : null}
          {albums.map((album) => (
            <AlbumTile key={album.id} variant="album" album={album} />
          ))}
        </div>
      </div>
    </section>
  );
}
