import { ArrowDown01Icon, FilterHorizontalIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { EnteIconButton } from "./EnteIconButton";
import { TagChip } from "./TagChip";
import styles from "./AlbumsHeader.module.css";

const filters = [
  { id: "ente", label: "Ente", selected: true },
  { id: "device", label: "Device", selected: false },
  { id: "shared", label: "Shared", selected: false },
  { id: "more", label: "More", selected: false, trailing: true },
] as const;

export function AlbumsTitleBar() {
  return (
    <div className={styles.toolbar}>
      <h1 className={styles.title}>Albums</h1>
      <div className={styles.actions}>
        <EnteIconButton label="Search albums">
          <HugeiconsIcon icon={Search01Icon} size={18} strokeWidth={1.5} />
        </EnteIconButton>
        <EnteIconButton label="Album options">
          <HugeiconsIcon icon={FilterHorizontalIcon} size={18} strokeWidth={1.5} />
        </EnteIconButton>
      </div>
    </div>
  );
}

export function AlbumsFilterChips() {
  return (
    <div className={styles.chips}>
      {filters.map((filter) => (
        <TagChip
          key={filter.id}
          label={filter.label}
          selected={filter.selected}
          trailing={
            "trailing" in filter && filter.trailing ? (
              <HugeiconsIcon icon={ArrowDown01Icon} size={18} strokeWidth={2} />
            ) : undefined
          }
        />
      ))}
    </div>
  );
}

/** @deprecated Use AlbumsTitleBar + AlbumsFilterChips in a sections wrapper. */
export function AlbumsHeader() {
  return (
    <header className={styles.header}>
      <AlbumsTitleBar />
      <AlbumsFilterChips />
    </header>
  );
}
