export type GalleryPhoto = {
  id: string;
  seed: number;
  imageUrl?: string;
};

export type GalleryDateGroup = {
  id: string;
  label: string;
  photos: GalleryPhoto[];
};

/** 79 unique Malaysia photos — each album thumbnail maps to one index (no repeats). */
export const MALAYSIA_ALBUM_PHOTO_IDS = [
  // Cover — Petronas from Bukit Bintang
  "photo-1764923163983-486b18540f72",
  // Monorail & trains
  "photo-1678158766555-277dd4861807",
  "photo-1727271551315-9d61f124460f",
  // Food — nasi goreng & street eats
  "photo-1668839746796-c5bca3982957",
  "photo-1680674774705-90b4904b3a7f",
  "photo-1696340030298-a7f877a7780c",
  "photo-1741243413074-f87bd31f4971",
  "photo-1670239510523-4bb105d27433",
  "photo-1771945038866-6608f778d080",
  "photo-1774428755031-0991c8901f08",
  "photo-1584269600464-37b1b58a9fe7",
  "photo-1551326844-4df70f78d0e9",
  "photo-1578160112054-954a67602b88",
  // Chinese temple — Thean Hou
  "photo-1682827866355-917d5242b1b0",
  "photo-1578762857609-6ffbcb8b4642",
  "photo-1682827396518-b101a60af7f6",
  "photo-1550993283-8ae03218bac5",
  "photo-1595166200392-b4fdd2b84147",
  "photo-1581792407982-a7975c1c586c",
  "photo-1740547584589-212627522448",
  "photo-1554309898-cb92468f6f3f",
  "photo-1708687602218-3737c2c14c1e",
  "photo-1617695784486-afdb972d5de9",
  "photo-1561607963-b04028ab3e48",
  "photo-1581792407977-39ac63b13aab",
  "photo-1663430086035-2fc3494feabd",
  "photo-1560661227-12c0323fcc05",
  "photo-1564933862606-7ab4c8246d20",
  "photo-1588459825641-9d87b11d4116",
  // Merdeka 118 — world's 2nd tallest
  "photo-1682261282469-a5d3e84948f7",
  "photo-1691320939828-7606bceea485",
  "photo-1709213244516-466e7e5a956c",
  "photo-1711701916565-dea624d05792",
  "photo-1671938297512-ec2b57b5edac",
  "photo-1727271550173-13e8c8b13e91",
  "photo-1742089647167-66bbb9eaecab",
  "photo-1717539514927-ed321683ef38",
  "photo-1698000350538-e8c939ee5760",
  "photo-1741935069524-f282033269b9",
  "photo-1707895451456-2a0f6cf55fd4",
  "photo-1698348170271-8438c01bf852",
  "photo-1706249186139-884f6efe5d36",
  "photo-1647766937792-0a7c2adc7872",
  "photo-1742089495071-955a385cee25",
  // Batu Caves
  "photo-1651607770337-2b3c011c4322",
  "photo-1733390920757-945b13effbc3",
  // Traffic & city streets
  "photo-1712601979098-15dccb4d0996",
  "photo-1581981657871-77c0d8adc84d",
  "photo-1589553645584-2c839d8d6d54",
  "photo-1679113230029-a11884eb7293",
  "photo-1585031039436-16a906da2f05",
  // Petronas & KL skyline
  "photo-1546273300-70f00c0fc1a0",
  "photo-1533118673680-d7eaa85beb24",
  "photo-1764866208339-b096c5b21a95",
  "photo-1755434959823-153add7d1bd9",
  "photo-1768571969564-b0dd7b578e0b",
  "photo-1576506730652-f0e4ad14828f",
  "photo-1472017053394-b29fded587cd",
  "photo-1554846157-b9e7eb178e02",
  "photo-1562060726-e47264af32bd",
  "photo-1470217957101-da7150b9b681",
  "photo-1569878698898-3d112b16d123",
  "photo-1741158510208-d3fe871899b2",
  "photo-1597148543182-830ef7bbb904",
  "photo-1586633183800-dfbc1c761897",
  "photo-1719484072989-a0fd05e837eb",
  "photo-1706182560512-a607687c2c85",
  "photo-1706249111779-addc8b5a3a88",
  "photo-1566914447826-bf04e54bf1be",
  "photo-1508062878650-88b52897f298",
  "photo-1596422846543-75c6fc197f07",
  // KL city views
  "photo-1574218732130-6b19257fd9db",
  "photo-1581792343403-f3201559d559",
  "photo-1592723905426-1181bf431d3a",
  "photo-1577609060534-4254158ea447",
  "photo-1591702090989-e96626200e57",
  "photo-1611924779080-d20389c1f56c",
  "photo-1598797246294-7620e33a632f",
  "photo-1589260097587-942004ad2b3d",
] as const;

const KL_ALBUM_COVER_ID = MALAYSIA_ALBUM_PHOTO_IDS[0];

/** @deprecated Use MALAYSIA_ALBUM_PHOTO_IDS */
export const KL_UNSPLASH_IDS = MALAYSIA_ALBUM_PHOTO_IDS;

export function unsplashPhotoUrl(photoId: string, size = 200) {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${size}&h=${size}&q=80`;
}

export function malaysiaPhotoByIndex(index: number, size = 200) {
  const photoId = MALAYSIA_ALBUM_PHOTO_IDS[index % MALAYSIA_ALBUM_PHOTO_IDS.length];
  return unsplashPhotoUrl(photoId, size);
}

export function klPhotoUrl(seed: number, size = 200) {
  return malaysiaPhotoByIndex(seed, size);
}

export function photoThumbUrl(seed: number, size = 200) {
  return malaysiaPhotoByIndex(seed, size);
}

/** Trip to KL album cover — Petronas Towers, shown on home + album grids. */
export function demoAlbumCoverUrl(size = 220) {
  return unsplashPhotoUrl(KL_ALBUM_COVER_ID, size);
}

function homePhoto(index: number, id: string, seed: number): GalleryPhoto {
  return { id, seed, imageUrl: malaysiaPhotoByIndex(index, 400) };
}

export const homeGalleryGroups: GalleryDateGroup[] = [
  {
    id: "2026-01-18",
    label: "Sat, Jan 18, 2026",
    photos: [homePhoto(0, "jan-18-1", 410)],
  },
  {
    id: "2026-01-17",
    label: "Fri, Jan 17, 2026",
    photos: Array.from({ length: 14 }, (_, index) =>
      homePhoto(index + 1, `jan-17-${index + 1}`, 7221 + index),
    ),
  },
];
