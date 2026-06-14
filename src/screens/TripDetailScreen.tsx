import { Navigate, useParams } from "react-router-dom";
import { AppBar } from "../components/AppBar";
import { getTrip } from "../data/mockTrips";
import styles from "./TripDetailScreen.module.css";

export function TripDetailScreen() {
  const { tripId } = useParams<{ tripId: string }>();
  const trip = tripId ? getTrip(tripId) : undefined;

  if (!trip) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={styles.page}>
      <AppBar title={trip.name} showBack />
      <div
        className={styles.hero}
        style={{ background: trip.coverGradient }}
      />
      <main className={styles.main}>
        <p className="h1">{trip.name}</p>
        <p className="body-muted">{trip.dates}</p>
        <p className="body-muted">{trip.location}</p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Photos</h2>
          <div className={styles.grid}>
            {Array.from({ length: 9 }, (_, i) => (
              <div key={i} className={styles.thumb} aria-hidden />
            ))}
          </div>
          <p className={styles.count}>{trip.photoCount} photos in this trip</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Map</h2>
          <div className={styles.mapPlaceholder}>
            <span>Map placeholder</span>
          </div>
        </section>
      </main>
    </div>
  );
}
