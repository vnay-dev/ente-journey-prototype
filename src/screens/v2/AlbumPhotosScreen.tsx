import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CollectionAppBar, CollectionAppBarFilters } from "../../components/CollectionAppBar";
import { GalleryDateSection } from "../../components/GalleryDateSection";
import { ItineraryReadyBanner } from "../../components/v2/ItineraryReadyBanner";
import { useItineraryGeneration } from "../../context/ItineraryGenerationContext";
import { demoAlbumGalleryGroups } from "../../data/mockAlbumPhotos";
import { onEnteAlbums } from "../../data/mockAlbumsOverview";
import { usePrototypePaths } from "../../hooks/usePrototypePaths";
import styles from "../AlbumPhotosScreen.module.css";

const TRIP_ALBUM_ID = "trip-kl-26";

export function V2AlbumPhotosScreen() {
  const navigate = useNavigate();
  const paths = usePrototypePaths();
  const { albumId } = useParams();
  const album = onEnteAlbums.find((item) => item.id === albumId);
  const { job, openItinerary, startGeneration } = useItineraryGeneration();

  const showHighlight =
    album?.id === TRIP_ALBUM_ID && job?.status === "ready" && job.albumId === album.id;

  useEffect(() => {
    if (album?.id !== TRIP_ALBUM_ID) {
      return;
    }

    startGeneration(album.id, album.title);
  }, [album?.id, album?.title, startGeneration]);

  function handleOpenItinerary() {
    if (!job) {
      return;
    }

    openItinerary();
    navigate(paths.itinerary(job.albumId));
  }

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
      <CollectionAppBar title={album.title} showAlbumActions showFilters={false} />
      {showHighlight ? (
        <div className={styles.highlightSlot}>
          <ItineraryReadyBanner onOpen={handleOpenItinerary} />
        </div>
      ) : null}
      <CollectionAppBarFilters />
      <div className={styles.scroll}>
        {demoAlbumGalleryGroups.map((group) => (
          <GalleryDateSection key={group.id} group={group} />
        ))}
        <div className={styles.scrollEndCompact} aria-hidden />
      </div>
    </div>
  );
}
