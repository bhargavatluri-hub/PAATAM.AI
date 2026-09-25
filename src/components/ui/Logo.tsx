type LogoProps = {
  className?: string;
  /** Render the wordmark in light colours for dark backgrounds. */
  inverted?: boolean;
};

/**
 * The Paatam mark: a lowercase "p" drawn like a page margin and a ruled line,
 * with a marigold dot — the insight found in every answer.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="8" fill="#0e5a5f" />
      <path
        d="M11 25V11.5M11 12.5c1.2-1.6 3-2.5 5-2.5 3.3 0 6 2.5 6 5.75S19.3 21.5 16 21.5c-2 0-3.8-.9-5-2.5"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <circle cx="23.5" cy="23.5" r="2.6" fill="#f0a53a" />
    </svg>
  );
}

export function Logo({ className = "", inverted = false }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-8 w-8 shrink-0" />
      <span
        className={`font-display text-[1.35rem] font-semibold tracking-tight ${inverted ? "text-white" : "text-ink"}`}
      >
        Paatam<span className={inverted ? "text-accent" : "text-primary"}>.ai</span>
      </span>
    </span>
  );
}
