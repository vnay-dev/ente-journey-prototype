import type { GalleryDateGroup, GalleryPhoto } from "./mockHomeGallery";
import { demoAlbumCoverUrl, malaysiaPhotoByIndex } from "./mockHomeGallery";

function dayPhotos(prefix: string, startIndex: number, count: number): GalleryPhoto[] {
  return Array.from({ length: count }, (_, index) => {
    const photoIndex = startIndex + index;
    return {
      id: `${prefix}-${index + 1}`,
      seed: 7000 + photoIndex,
      imageUrl: malaysiaPhotoByIndex(photoIndex, 400),
    };
  });
}

export const demoAlbumGalleryGroups: GalleryDateGroup[] = [
  {
    id: "2026-01-18",
    label: "Sat, Jan 18, 2026",
    photos: [{ id: "jan-18-1", seed: 410, imageUrl: demoAlbumCoverUrl(400) }],
  },
  {
    id: "2026-01-17",
    label: "Fri, Jan 17, 2026",
    photos: dayPhotos("jan-17", 1, 14),
  },
  {
    id: "2026-01-16",
    label: "Thu, Jan 16, 2026",
    photos: dayPhotos("jan-16", 15, 16),
  },
  {
    id: "2026-01-15",
    label: "Wed, Jan 15, 2026",
    photos: dayPhotos("jan-15", 31, 16),
  },
  {
    id: "2026-01-14",
    label: "Tue, Jan 14, 2026",
    photos: dayPhotos("jan-14", 47, 16),
  },
  {
    id: "2026-01-13",
    label: "Mon, Jan 13, 2026",
    photos: dayPhotos("jan-13", 63, 16),
  },
];

export const demoAlbumPhotoCount = demoAlbumGalleryGroups.reduce(
  (total, group) => total + group.photos.length,
  0,
);

export function albumPhotoUrl(photo: { seed: number; imageUrl?: string }, size = 200) {
  return photo.imageUrl ?? malaysiaPhotoByIndex(photo.seed - 7000, size);
}

export const demoAlbumBannerPhotos = demoAlbumGalleryGroups
  .flatMap((group) => group.photos)
  .slice(0, 8)
  .map((photo) => albumPhotoUrl(photo, 480));
