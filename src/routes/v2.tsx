import { Route, Routes } from "react-router-dom";
import { V2Layout } from "../layouts/V2Layout";
import { AlbumsOverviewScreen } from "../screens/AlbumsOverviewScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { V2AlbumPhotosScreen } from "../screens/v2/AlbumPhotosScreen";
import { V2ItineraryScreen } from "../screens/v2/ItineraryScreen";

/** Demo version — identical to v1, with guided walkthrough overlays. */
export function V2Routes() {
  return (
    <Routes>
      <Route element={<V2Layout />}>
        <Route index element={<HomeScreen />} />
        <Route path="albums" element={<AlbumsOverviewScreen />} />
        <Route path="albums/:albumId" element={<V2AlbumPhotosScreen />} />
        <Route path="albums/:albumId/itinerary" element={<V2ItineraryScreen />} />
        <Route path="journey/:journeySlug" element={<V2ItineraryScreen shared />} />
      </Route>
    </Routes>
  );
}
