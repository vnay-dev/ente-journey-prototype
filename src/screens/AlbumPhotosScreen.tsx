import { useParams } from "react-router-dom";
import { AlbumPhotosFloatingActions } from "../components/AlbumPhotosFloatingActions";
import { CollectionAppBar } from "../components/CollectionAppBar";
import { GalleryDateSection } from "../components/GalleryDateSection";
import { demoAlbumGalleryGroups } from "../data/mockAlbumPhotos";
import { onEnteAlbums } from "../data/mockAlbumsOverview";
import styles from "./AlbumPhotosScreen.module.css";

export function AlbumPhotosScreen() {
  const { albumId } = useParams();
  const album = onEnteAlbums.find((item) => item.id === albumId);

  if (!album) {
    return (
      <div className={styles.page}>
        <CollectionAppBar title="Album" />
        <p className={styles.empty}>Album not found.</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <CollectionAppBar title={album.title} />
      <div className={styles.scroll}>
        {demoAlbumGalleryGroups.map((group) => (
          <GalleryDateSection key={group.id} group={group} />
        ))}
        <div className={styles.scrollEnd} aria-hidden />
      </div>
      <AlbumPhotosFloatingActions />
    </div>
  );
}
