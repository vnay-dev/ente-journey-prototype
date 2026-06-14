type IconProps = {
  size?: number;
  className?: string;
};

export function IconSearch({ size = 22, className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 16l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconChevronRight({ size = 22, className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconCloudOff({ size = 16, className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 18h11a4 4 0 0 0 .5-8 5.5 5.5 0 0 0-10.6-1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconPlus({ size = 28, className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconLock({ size = 14, className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function UtilityIcon({
  type,
  size = 22,
  className,
}: IconProps & { type: "uncategorized" | "archive" | "hidden" | "trash" }) {
  const common = { className, width: size, height: size, viewBox: "0 0 24 24", fill: "none" as const };

  switch (type) {
    case "uncategorized":
      return (
        <svg {...common} aria-hidden>
          <rect x="4" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="17" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M6 20l6-8 4 5 4-6 4 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "archive":
      return (
        <svg {...common} aria-hidden>
          <path
            d="M4 7h16v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 11v4M10 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "hidden":
      return (
        <svg {...common} aria-hidden>
          <path
            d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M4 4l16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "trash":
      return (
        <svg {...common} aria-hidden>
          <path d="M4 7h16M9 7V5h6v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path
            d="M7 7l1 12h8l1-12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

export function NavIconHome({ filled, size = 22 }: IconProps & { filled?: boolean }) {
  if (filled) {
    return (
      <svg width={size} height={size} viewBox="0 0 16 17" fill="currentColor" aria-hidden>
        <path d="M1.35 6.99 6.1 2.32c.78-.76 2.03-.76 2.81 0l4.75 4.67c.38.38.6.89.6 1.43v5.28c0 1.66-1.34 3-3 3h-3.75H3.75c-1.66 0-3-1.34-3-3V8.42c0-.54.22-1.05.6-1.43Z" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 16 17" fill="none" aria-hidden>
      <path
        d="M1.35 6.99 6.1 2.32c.78-.76 2.03-.76 2.81 0l4.75 4.67c.38.38.6.89.6 1.43v5.28c0 1.66-1.34 3-3 3h-3.75H3.75c-1.66 0-3-1.34-3-3V8.42c0-.54.22-1.05.6-1.43Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function NavIconAlbums({ filled, size = 22 }: IconProps & { filled?: boolean }) {
  if (filled) {
    return (
      <svg width={size} height={size} viewBox="0 0 16.5 16.5" fill="none" aria-hidden>
        <path
          d="M13.34 3.08c.81.13 1.5.39 2.06.95.6.6.86 1.37.98 2.27.12.88.12 2.01.12 3.41s0 2.53-.12 3.41c-.12.9-.38 1.67-.98 2.27-.6.6-1.36.86-2.26.98-.88.12-2.01.12-3.41.12s-2.53 0-3.41-.12c-.9-.12-1.67-.38-2.27-.98-.56-.56-.82-1.25-.95-2.06.09.02.18.04.27.06.88.12 2 .12 3.39.12s2.51 0 3.39-.12c.9-.12 1.67-.38 2.27-.98.6-.6.86-1.36.98-2.26.12-.88.12-2 .12-3.39s0-2.51-.12-3.39c-.01-.1-.03-.19-.06-.27Z"
          fill="currentColor"
        />
        <path
          d="M.75 6.75c0-2.83 0-4.24.88-5.12.88-.88 2.29-.88 5.12-.88s4.24 0 5.12.88c.88.88.88 2.29.88 5.12s0 4.24-.88 5.12c-.88.88-2.29.88-5.12.88s-4.24 0-5.12-.88C.75 10.99.75 9.58.75 6.75Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 16.5 16.5" fill="none" aria-hidden>
      <path
        d="M3.75 12.73c.1.98.31 1.64.8 2.12.88.88 2.31.88 5.16.88s4.28 0 5.16-.88c.88-.88.88-2.31.88-5.16s0-4.28-.88-5.16c-.49-.49-1.15-.7-2.12-.8"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M.75 6.75c0-2.83 0-4.24.88-5.12.88-.88 2.29-.88 5.12-.88s4.24 0 5.12.88c.88.88.88 2.29.88 5.12s0 4.24-.88 5.12c-.88.88-2.29.88-5.12.88s-4.24 0-5.12-.88C.75 10.99.75 9.58.75 6.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function NavIconPeople({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3 19c0-3.3 2.7-6 6-6s6 2.7 6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="17" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 19c.3-2.2 1.8-4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
