import { useNavigate } from "react-router-dom";
import { usePrototypePaths } from "../hooks/usePrototypePaths";
import type { AlbumItem } from "../data/mockAlbumsOverview";
import { CreateAlbumIcon } from "./CreateAlbumIcon";
import styles from "./AlbumGrid.module.css";

type Props = {
  albums: AlbumItem[];
};

export function AlbumGrid({ albums }: Props) {
  const navigate = useNavigate();
  const paths = usePrototypePaths();

  return (
    <div className={styles.grid}>
      <button type="button" className={styles.tile} aria-label="Create album">
        <div className={`${styles.thumb} ${styles.thumbCreate}`}>
          <CreateAlbumIcon />
        </div>
        <p className={styles.label}>Create album</p>
      </button>

      {albums.map((album) => (
        <button
          key={album.id}
          type="button"
          className={styles.tile}
          aria-label={`${album.title}, ${album.count} items`}
          onClick={() => navigate(paths.album(album.id))}
        >
          <div className={styles.thumb}>
            <img src={album.imageUrl} alt="" loading="lazy" decoding="async" />
          </div>
          <p className={`${styles.label} ${styles.labelDark}`}>{album.title}</p>
          <p className={styles.count}>{album.count} items</p>
        </button>
      ))}
    </div>
  );
}
