import type { CSSProperties } from "react";

/** Staggers a `[data-reveal]` element's entrance by the given number of milliseconds. */
export function revealDelay(ms: number): CSSProperties {
  return { "--reveal-delay": `${ms}ms` } as CSSProperties;
}
