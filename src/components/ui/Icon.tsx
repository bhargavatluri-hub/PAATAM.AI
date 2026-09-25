import type { SVGProps } from "react";

/**
 * A small, dependency-free icon set (24px grid, stroke-based).
 * Icons are decorative by default; pass `aria-label` + `aria-hidden={false}`
 * where an icon carries meaning on its own.
 */
const paths = {
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowDown: <path d="M12 5v14M6 13l6 6 6-6" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.8 2.8L16.2 9.5" />
    </>
  ),
  upload: (
    <>
      <path d="M12 15V4M7.5 8.5L12 4l4.5 4.5" />
      <path d="M4 14v4a2 2 0 002 2h12a2 2 0 002-2v-4" />
    </>
  ),
  scan: (
    <>
      <path d="M4 8V6a2 2 0 012-2h2M16 4h2a2 2 0 012 2v2M20 16v2a2 2 0 01-2 2h-2M8 20H6a2 2 0 01-2-2v-2" />
      <path d="M8 10h8M8 14h5" />
    </>
  ),
  evaluate: (
    <>
      <rect x="5" y="3.5" width="14" height="17" rx="2" />
      <path d="M9 3.5h6v3H9zM8.5 12l2 2 4-4M8.5 17h7" />
    </>
  ),
  discover: (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="M15 15l5 5M8 11.5l1.8 1.8L13 9.5" />
    </>
  ),
  teacher: (
    <>
      <circle cx="9" cy="7.5" r="3" />
      <path d="M3.5 19.5c0-3.3 2.5-5.5 5.5-5.5s5.5 2.2 5.5 5.5" />
      <path d="M14 4.5h6.5v7H16" />
    </>
  ),
  share: (
    <>
      <path d="M20 12a8 8 0 01-11.6 7.1L4 20l1-4A8 8 0 1120 12z" />
      <path d="M9 11h6M9 14h4" />
    </>
  ),
  pencil: <path d="M4 20l1-4.5L15.5 5a2.1 2.1 0 013 3L8 18.5 4 20zM13.5 7l3 3" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  chart: <path d="M4 20h16M7 16v-4M11 16V8M15 16v-6M19 16V5" />,
  layers: <path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5" />,
  message: <path d="M5 5h14a1 1 0 011 1v10a1 1 0 01-1 1H9l-4 3.5V6a1 1 0 011-1z" />,
  student: (
    <>
      <path d="M3 9l9-4.5L21 9l-9 4.5L3 9z" />
      <path d="M7 11v4.5c0 1.4 2.2 3 5 3s5-1.6 5-3V11M21 9v5" />
    </>
  ),
  parent: (
    <>
      <circle cx="8" cy="7" r="2.8" />
      <circle cx="16.5" cy="10" r="2.2" />
      <path d="M3 19.5c0-3 2.2-5 5-5s5 2 5 5M13.5 19.5c.2-2.2 1.4-3.6 3-3.6s3 1.4 3 3.6" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7.5 3v5.5c0 4.5-3.2 8-7.5 9.5-4.3-1.5-7.5-5-7.5-9.5V6L12 3z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  mapPin: (
    <>
      <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0113 0c0 5-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  stack: (
    <>
      <rect x="4" y="7" width="13" height="13" rx="1.5" />
      <path d="M8 4h10.5A1.5 1.5 0 0120 5.5V16" />
    </>
  ),
  signal: <path d="M5 19v-2M9.5 19v-5M14 19v-8M18.5 19V6" />,
  sparkPath: <path d="M4 17l5-5 4 3 7-8M15 7h5v5" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  undo: <path d="M9 7L4.5 11.5 9 16M5 11.5h9.5a5 5 0 010 10H12" />,
  minus: <path d="M6 12h12" />,
  plus: <path d="M12 6v12M6 12h12" />,
  alert: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5v5.5M12 16.2v.3" />
    </>
  ),
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="M4 7l8 6 8-6" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="2.8" />
    </>
  ),
} as const;

export type IconName = keyof typeof paths;

type IconProps = SVGProps<SVGSVGElement> & { name: IconName; size?: number };

export function Icon({ name, size = 20, strokeWidth = 1.75, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
