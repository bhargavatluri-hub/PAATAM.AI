/**
 * Central site configuration.
 *
 * Contact details are intentionally NOT hard-coded. Anything we could not
 * verify is read from environment variables so it can be configured at
 * deploy time. When a value is missing the UI simply omits it rather than
 * showing a fabricated address, phone number or email.
 */

function optional(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export const siteConfig = {
  name: "Paatam.ai",
  shortName: "Paatam",
  tagline: "Turning Assessments into Learning Intelligence.",
  title: "Paatam.ai | Turning Assessments into Learning Intelligence",
  description:
    "Paatam helps schools transform handwritten student assessments into actionable learning insights, with AI-assisted evaluation and teachers always in control.",
  /** Canonical origin, e.g. https://paatam.ai. Falls back to localhost in development. */
  url: optional(process.env.NEXT_PUBLIC_SITE_URL) ?? "http://localhost:3000",
  /** Public enquiry email. Omitted from the UI when unset. */
  contactEmail: optional(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  locale: "en_IN",
} as const;

export const navItems = [
  { label: "Product", href: "#product" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "For Schools", href: "#for-schools" },
  { label: "Our Vision", href: "#vision" },
  { label: "Contact", href: "#contact" },
] as const;
