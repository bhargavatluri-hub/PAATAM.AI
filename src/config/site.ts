/**
 * Central site configuration.
 *
 * Contact details are never invented. The enquiry email is read from an
 * environment variable; the address, phone and social profiles live in
 * `business` and `socialLinks` below. When a value is missing the UI simply
 * omits it rather than showing a fabricated address, phone number or email.
 */

import type { SocialNetwork } from "@/components/ui/SocialIcon";

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
  /** Canonical origin. Override with NEXT_PUBLIC_SITE_URL (e.g. for staging). */
  url: optional(process.env.NEXT_PUBLIC_SITE_URL) ?? "https://www.paatam.in",
  /** Public enquiry email. Omitted from the UI when unset. */
  contactEmail: optional(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  locale: "en_IN",
} as const;

/**
 * Public business details shown in the footer, on /contact and in search-engine
 * structured data. Fill these in with verified details only; anything left empty
 * is simply not shown.
 */
type Business = {
  legalName: string;
  address: { street: string; locality: string; city: string; state: string; postalCode: string; country: string };
  phone: string;
  whatsapp: string;
  hours: string;
};

export const business: Business = {
  /** Registered company name, e.g. "Paatam Technologies Private Limited". */
  legalName: "",
  address: {
    street: "",
    locality: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  },
  /** Phone with country code, e.g. "+91 98765 43210". */
  phone: "",
  /** WhatsApp number with country code, digits only, e.g. "919876543210". */
  whatsapp: "",
  /** e.g. "Mon–Sat, 9:30 am – 6:30 pm IST". */
  hours: "",
};

/** Full profile URLs. Networks left empty are hidden. */
export const socialLinks: { network: SocialNetwork; label: string; href: string }[] = [
  { network: "linkedin", label: "LinkedIn", href: "" },
  { network: "instagram", label: "Instagram", href: "" },
  { network: "youtube", label: "YouTube", href: "" },
  { network: "x", label: "X (Twitter)", href: "" },
  { network: "facebook", label: "Facebook", href: "" },
];

export function activeSocialLinks() {
  return socialLinks.filter((s) => s.href.trim());
}

/** Address lines in display order, without empty parts. */
export function addressLines() {
  const { street, locality, city, state, postalCode, country } = business.address;
  const cityLine = [city, [state, postalCode].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  const lines = [street, locality, cityLine].filter(Boolean);
  return lines.length ? [...lines, country] : [];
}

export const navItems = [
  { label: "Product", href: "/product" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "For Schools", href: "/for-schools" },
  { label: "For Teachers", href: "/for-teachers" },
  { label: "About", href: "/about" },
  { label: "Demo", href: "/demo" },
  { label: "Contact", href: "/contact" },
] as const;
