import { AppBar } from "../components/AppBar";
import { TripCard } from "../components/TripCard";
import { mockTrips } from "../data/mockTrips";
import styles from "./TripListScreen.module.css";

export function TripListScreen() {
  return (
    <div className={styles.page}>
      <AppBar title="Trips" />
      <main className={styles.main}>
        <p className="display-2">Your trips</p>
        <p className="body-muted">
          Prototype — tap a trip to open the detail screen.
        </p>
        <ul className={styles.list}>
          {mockTrips.map((trip) => (
            <li key={trip.id}>
              <TripCard trip={trip} />
            </li>
          ))}
        </ul>
        <button type="button" className={styles.fab} aria-label="New trip">
          +
        </button>
      </main>
    </div>
  );
}
