import { ImageAdd01Icon, PlayIcon, Share08Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useNavigate } from "react-router-dom";
import { EnteIconButton } from "../../EnteIconButton";
import styles from "./ItineraryAppBar.module.css";

function ArrowBackIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
    </svg>
  );
}

type Props = {
  title: string;
  className?: string;
  showBack?: boolean;
  tone?: "default" | "onPrimary";
  onPlay?: () => void;
  onShare?: () => void;
  onAddPhoto?: () => void;
};

export function ItineraryAppBar({
  title,
  className,
  showBack = true,
  tone = "default",
  onPlay,
  onShare,
  onAddPhoto,
}: Props) {
  const navigate = useNavigate();
  const toneClass = tone === "onPrimary" ? styles.barOnPrimary : "";

  return (
    <header className={`${styles.bar} ${toneClass}${className ? ` ${className}` : ""}`}>
      <div className={styles.toolbar}>
        {showBack ? (
          <button
            type="button"
            className={styles.backBtn}
            aria-label="Go back"
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon />
          </button>
        ) : (
          <span className={styles.backSpacer} aria-hidden />
        )}
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.actions}>
          {onPlay ? (
            <EnteIconButton label="Play journey" onClick={onPlay} variant={tone === "onPrimary" ? "onPrimary" : "surface"}>
              <HugeiconsIcon icon={PlayIcon} size={18} strokeWidth={1.5} />
            </EnteIconButton>
          ) : null}
          {onAddPhoto ? (
            <EnteIconButton label="Add photo" onClick={onAddPhoto} variant={tone === "onPrimary" ? "onPrimary" : "surface"}>
              <HugeiconsIcon icon={ImageAdd01Icon} size={18} strokeWidth={1.5} />
            </EnteIconButton>
          ) : null}
          {onShare ? (
            <EnteIconButton label="Share journey" onClick={onShare} variant={tone === "onPrimary" ? "onPrimary" : "surface"}>
              <HugeiconsIcon icon={Share08Icon} size={18} strokeWidth={1.5} />
            </EnteIconButton>
          ) : null}
        </div>
      </div>
    </header>
  );
}
