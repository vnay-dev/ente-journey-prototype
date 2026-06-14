export type PrototypeVersion = "v1" | "v2";

const VERSION_PATTERN = /^\/(v\d+)\b/;

export function getVersionFromPath(pathname: string): PrototypeVersion {
  const match = pathname.match(VERSION_PATTERN);
  if (match?.[1] === "v2") {
    return "v2";
  }
  return "v1";
}

export function prototypePaths(version: PrototypeVersion) {
  const base = `/${version}`;

  return {
    home: base,
    albums: `${base}/albums`,
    album: (albumId: string) => `${base}/albums/${albumId}`,
    itinerary: (albumId: string) => `${base}/albums/${albumId}/itinerary`,
  } as const;
}
