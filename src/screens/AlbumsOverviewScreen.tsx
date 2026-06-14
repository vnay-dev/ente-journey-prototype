import { AlbumGrid } from "../components/AlbumGrid";
import { AlbumsFilterChips, AlbumsTitleBar } from "../components/AlbumsHeader";
import { HomeBottomNav } from "../components/HomeBottomNav";
import { onEnteAlbums } from "../data/mockAlbumsOverview";
import styles from "./AlbumsOverviewScreen.module.css";

export function AlbumsOverviewScreen() {
  return (
    <div className={styles.page}>
      <div className={styles.scroll}>
        <div className={styles.sections}>
          <AlbumsTitleBar />
          <AlbumsFilterChips />
          <AlbumGrid albums={onEnteAlbums} />
        </div>
        <div className={styles.scrollEnd} aria-hidden />
      </div>
      <HomeBottomNav activeTab="albums" />
    </div>
  );
}
