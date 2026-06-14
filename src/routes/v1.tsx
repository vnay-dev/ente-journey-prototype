import { Route, Routes } from "react-router-dom";
import { V1Layout } from "../layouts/V1Layout";
import { AlbumsOverviewScreen } from "../screens/AlbumsOverviewScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { V1AlbumPhotosScreen } from "../screens/v1/AlbumPhotosScreen";
import { V1ItineraryScreen } from "../screens/v1/ItineraryScreen";

/** Baseline Ente Photos screens — home, albums overview, album detail. */
export function V1Routes() {
  return (
    <Routes>
      <Route element={<V1Layout />}>
        <Route index element={<HomeScreen />} />
        <Route path="albums" element={<AlbumsOverviewScreen />} />
        <Route path="albums/:albumId" element={<V1AlbumPhotosScreen />} />
        <Route path="albums/:albumId/itinerary" element={<V1ItineraryScreen />} />
        <Route path="journey/:journeySlug" element={<V1ItineraryScreen shared />} />
      </Route>
    </Routes>
  );
}
