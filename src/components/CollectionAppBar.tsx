import { Image01Icon, ImageAdd01Icon, Menu08Icon, MoreVerticalIcon, Share08Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useNavigate } from "react-router-dom";
import { EnteIconButton } from "./EnteIconButton";
import { FilterChip } from "./FilterChip";
import styles from "./CollectionAppBar.module.css";

function ArrowBackIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
    </svg>
  );
}

type Props = {
  title: string;
  showAlbumActions?: boolean;
  showFilters?: boolean;
};

export function CollectionAppBarFilters() {
  return (
    <div className={styles.filters}>
      <div className={styles.filterMenu}>
        <EnteIconButton label="All filters">
          <HugeiconsIcon icon={Menu08Icon} size={18} strokeWidth={1.5} />
        </EnteIconButton>
      </div>
      <FilterChip
        label="Photos"
        leading={<HugeiconsIcon icon={Image01Icon} size={16} strokeWidth={1.5} />}
      />
    </div>
  );
}

export function CollectionAppBar({
  title,
  showAlbumActions = false,
  showFilters = true,
}: Props) {
  const navigate = useNavigate();

  return (
    <header className={styles.bar}>
      <div className={styles.backRow}>
        <button
          type="button"
          className={styles.backBtn}
          aria-label="Go back"
          onClick={() => navigate(-1)}
        >
          <ArrowBackIcon />
        </button>
      </div>

      <div className={styles.titleRow}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.actions}>
          {showAlbumActions ? (
            <>
              <EnteIconButton label="Add photos">
                <HugeiconsIcon icon={ImageAdd01Icon} size={18} strokeWidth={1.5} />
              </EnteIconButton>
              <EnteIconButton label="Share album">
                <HugeiconsIcon icon={Share08Icon} size={18} strokeWidth={1.5} />
              </EnteIconButton>
            </>
          ) : null}
          <EnteIconButton label="More options">
            <HugeiconsIcon icon={MoreVerticalIcon} size={18} strokeWidth={1.5} />
          </EnteIconButton>
        </div>
      </div>

      {showFilters ? <CollectionAppBarFilters /> : null}
    </header>
  );
}
