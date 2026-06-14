import styles from "./PhoneShell.module.css";

/** Even-odd masks → perfectly even 3px metal + 2px black rings on corners. */
export function PhoneFrameSvg() {
  return (
    <svg
      className={styles.frameSvg}
      viewBox="0 0 370 810"
      width="370"
      height="810"
      aria-hidden
    >
      <defs>
        <linearGradient id="enteMetalSheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8e8ec" />
          <stop offset="50%" stopColor="#b8b8be" />
          <stop offset="100%" stopColor="#d8d8de" />
        </linearGradient>
        <mask id="enteMetalCut">
          <rect width="370" height="810" fill="white" />
          <rect x="3" y="3" width="364" height="804" rx="39" fill="black" />
        </mask>
        <mask id="enteBlackCut">
          <rect x="3" y="3" width="364" height="804" rx="39" fill="white" />
          <rect x="5" y="5" width="360" height="800" rx="37" fill="black" />
        </mask>
      </defs>
      <rect
        width="370"
        height="810"
        rx="42"
        fill="url(#enteMetalSheen)"
        mask="url(#enteMetalCut)"
      />
      <rect
        x="3"
        y="3"
        width="364"
        height="804"
        rx="39"
        fill="#0a0a0a"
        mask="url(#enteBlackCut)"
      />
    </svg>
  );
}
