import {
  EMBLEM_PATH,
  EMBLEM_VIEWBOX,
  P_GLYPH_PATH,
  P_GLYPH_VIEWBOX,
  SWOOSH_PATH,
  WORDMARK_PATH,
  WORDMARK_VIEWBOX,
} from "./brandPaths";

type LogoProps = {
  className?: string;
  /** Light artwork for dark backgrounds. */
  inverted?: boolean;
};

/**
 * The Paatam wordmark: "paatam" lettering (a teacher at the board, an open book,
 * a lightbulb, a pencil, a circuit tree and a graduation cap) above an open-book swoosh.
 * Traced from the official logo so it stays crisp at every size.
 */
export function Logo({ className = "h-11", inverted = false }: LogoProps) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <svg
        viewBox={WORDMARK_VIEWBOX}
        className="h-full w-auto"
        style={{ aspectRatio: "1217 / 655" }}
        aria-hidden="true"
        focusable="false"
      >
        <path fill={inverted ? "#ffffff" : "#12242b"} fillRule="evenodd" d={WORDMARK_PATH} />
        <path fill={inverted ? "#f0a53a" : "#0e5a5f"} d={SWOOSH_PATH} />
      </svg>
      <span className="sr-only">Paatam.ai</span>
    </span>
  );
}

/** Compact app mark: the logo's "p" with the teacher, and a marigold dot. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="14" fill="#0e5a5f" />
      <svg x="12" y="7" width="40" height="50" viewBox={P_GLYPH_VIEWBOX}>
        <path fill="#fff" fillRule="evenodd" d={P_GLYPH_PATH} />
      </svg>
      <circle cx="49" cy="51" r="5" fill="#f0a53a" />
    </svg>
  );
}

/** The complete circular Paatam emblem. Uses the current text colour. */
export function Emblem({ className = "h-40 w-40", label }: { className?: string; label?: string }) {
  return (
    <svg
      viewBox={EMBLEM_VIEWBOX}
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <path fill="currentColor" fillRule="evenodd" d={EMBLEM_PATH} />
    </svg>
  );
}
