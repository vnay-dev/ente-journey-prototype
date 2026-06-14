import { MoreVerticalIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { GalleryDateGroup } from "../data/mockHomeGallery";
import { photoThumbUrl } from "../data/mockHomeGallery";
import styles from "./GalleryDateSection.module.css";

type Props = {
  group: GalleryDateGroup;
  /** Gallery layout menu — only on the first (topmost) date section in ente home. */
  showLayoutMenu?: boolean;
};

export function GalleryDateSection({ group, showLayoutMenu = false }: Props) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{group.label}</h2>
        <div className={styles.actions}>
          <button type="button" className={styles.actionBtn} aria-label={`Select all from ${group.label}`}>
            <span className={styles.selectAll}>
              <HugeiconsIcon icon={Tick02Icon} size={14} strokeWidth={2} />
            </span>
          </button>
          {showLayoutMenu ? (
            <button type="button" className={styles.actionBtn} aria-label="Gallery layout options">
              <HugeiconsIcon icon={MoreVerticalIcon} size={18} strokeWidth={1.5} />
            </button>
          ) : null}
        </div>
      </div>

      <div className={styles.grid}>
        {group.photos.map((photo, photoIndex) => (
          <button
            key={photo.id}
            type="button"
            className={styles.thumb}
            aria-label={`Photo ${photo.id}`}
            {...(showLayoutMenu && photoIndex === 0
              ? { "data-demo-target": "home-photo" }
              : {})}
          >
            <img
              src={photo.imageUrl ?? photoThumbUrl(photo.seed)}
              alt=""
              loading="lazy"
              decoding="async"
            />
          </button>
        ))}
      </div>
    </section>
  );
}
