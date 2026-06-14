import { demoAlbumCoverUrl } from "./mockHomeGallery";
import { demoAlbumPhotoCount } from "./mockAlbumPhotos";

export type AlbumItem = {
  id: string;
  title: string;
  count: number;
  imageUrl: string;
  /** Device-only: not backed up to cloud */
  offline?: boolean;
};

const u = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=220&h=220&q=80`;

export const onDeviceAlbums: AlbumItem[] = [
  {
    id: "whatsapp",
    title: "WhatsApp Im...",
    count: 6,
    imageUrl: u("photo-1578985545062-69928b1d9587"),
    offline: true,
  },
  {
    id: "air-india",
    title: "Air India",
    count: 4,
    imageUrl: u("photo-1507003211169-0a1dd7228f2d"),
    offline: true,
  },
  {
    id: "wedding",
    title: "Richus weddi...",
    count: 62,
    imageUrl: u("photo-1511285560929-80b456938fb2"),
    offline: true,
  },
  {
    id: "screenshots",
    title: "Screenshots",
    count: 1,
    imageUrl: u("photo-1512949271128-90eacefb1b80"),
    offline: true,
  },
];

export const onEnteAlbums: AlbumItem[] = [
  {
    id: "trip-kl-26",
    title: "Trip to KL '26",
    count: demoAlbumPhotoCount,
    imageUrl: demoAlbumCoverUrl(),
  },
];

export type UtilityRowItem = {
  id: string;
  label: string;
  trailing?: "chevron" | "lock" | "count";
  count?: number;
  icon: "uncategorized" | "archive" | "hidden" | "trash";
};

export const utilityRows: UtilityRowItem[] = [
  { id: "uncategorized", label: "Uncategorized", icon: "uncategorized", trailing: "chevron" },
  { id: "archive", label: "Archive", icon: "archive", trailing: "chevron" },
  { id: "hidden", label: "Hidden", icon: "hidden", trailing: "lock" },
  { id: "trash", label: "Trash", icon: "trash", trailing: "count", count: 6 },
];
