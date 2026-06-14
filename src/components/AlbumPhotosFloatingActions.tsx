import { ImageAdd01Icon, Share08Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import styles from "./AlbumPhotosFloatingActions.module.css";

type Props = {
  onAddPhotos?: () => void;
  onShare?: () => void;
};

export function AlbumPhotosFloatingActions({ onAddPhotos, onShare }: Props) {
  return (
    <div className={styles.fab}>
      <button type="button" className={styles.action} aria-label="Add photos" onClick={onAddPhotos}>
        <HugeiconsIcon icon={ImageAdd01Icon} size={18} strokeWidth={1.5} />
      </button>
      <span className={styles.divider} aria-hidden />
      <button type="button" className={styles.action} aria-label="Share album" onClick={onShare}>
        <HugeiconsIcon icon={Share08Icon} size={18} strokeWidth={1.5} />
      </button>
    </div>
  );
}
