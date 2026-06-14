import { Link } from "react-router-dom";
import type { Trip } from "../data/mockTrips";
import styles from "./TripCard.module.css";

type Props = {
  trip: Trip;
};

export function TripCard({ trip }: Props) {
  return (
    <Link to={`/trips/${trip.id}`} className={styles.card}>
      <div
        className={styles.cover}
        style={{ background: trip.coverGradient }}
        aria-hidden
      />
      <div className={styles.body}>
        <h2 className={styles.name}>{trip.name}</h2>
        <p className={styles.meta}>{trip.dates}</p>
        <p className={styles.meta}>{trip.location}</p>
        <p className={styles.photos}>{trip.photoCount} photos</p>
      </div>
    </Link>
  );
}
