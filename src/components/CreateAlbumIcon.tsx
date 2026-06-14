import styles from "./CreateAlbumIcon.module.css";

export function CreateAlbumIcon() {
  return (
    <img
      className={styles.icon}
      src="/assets/new-album-icon.png"
      srcSet="/assets/new-album-icon.png 1x, /assets/new-album-icon@2x.png 2x"
      alt=""
      width={34}
      height={34}
      decoding="async"
    />
  );
}
