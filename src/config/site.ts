/**
 * Central site configuration.
 *
 * Contact details are never invented. The address, phone, emails and social
 * profiles live in `business` and `socialLinks` below (the primary email can be
 * overridden with an environment variable). When a value is missing the UI simply
 * omits it rather than showing a fabricated address, phone number or email.
 */

import type { SocialNetwork } from "@/components/ui/SocialIcon";

function optional(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

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
  emails: string[];
  hours: string;
  /** Named on /privacy, as the IT Act and the DPDP Act require. */
  grievanceOfficer: { name: string; title: string; email: string };
};

export const business: Business = {
  /** Registered company name. */
  legalName: "ABC Learning Technologies Private Limited",
  address: {
    street: "RTIH, 5th Floor, VMRDA – The DECK",
    locality: "Siripuram",
    city: "Visakhapatnam",
    state: "Andhra Pradesh",
    postalCode: "530003",
    country: "India",
  },
  /** Phone with country code, e.g. "+91 98765 43210". */
  phone: "+91 95826 32863",
  /** WhatsApp number with country code, digits only, e.g. "919876543210". */
  whatsapp: "918870902456",
  /** Public enquiry emails, shown in this order. NEXT_PUBLIC_CONTACT_EMAIL, when set, is listed first. */
  emails: ["bhargav@paatam.in", "nikitha@paatam.in"],
  /** e.g. "Mon–Sat, 9:30 am – 6:30 pm IST". */
  hours: "",
  grievanceOfficer: { name: "Nikitha Atluri", title: "Co-Founder & Head of Learning", email: "nikitha@paatam.in" },
};

export const siteConfig = {
  name: "Paatam.ai",
  shortName: "Paatam",
  tagline: "Turning Assessments into Learning Intelligence.",
  title: "Paatam.ai | Turning Assessments into Learning Intelligence",
  description:
    "Paatam helps schools transform handwritten student assessments into actionable learning insights, with AI-assisted evaluation and teachers always in control.",
  /** Canonical origin. Override with NEXT_PUBLIC_SITE_URL (e.g. for staging). */
  url: optional(process.env.NEXT_PUBLIC_SITE_URL) ?? "https://www.paatam.ai",
  /** Primary enquiry email: NEXT_PUBLIC_CONTACT_EMAIL, else the first of `business.emails`. */
  contactEmail: optional(process.env.NEXT_PUBLIC_CONTACT_EMAIL) ?? business.emails[0],
  locale: "en_IN",
} as const;

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

/** Every public enquiry email, primary first, without duplicates. */
export function contactEmails() {
  return [...new Set([siteConfig.contactEmail, ...business.emails].filter((e): e is string => Boolean(e)))];
}

/** "918870902456" → "+91 88709 02456"; other formats are shown as given. */
export function formatIndianNumber(digits: string) {
  const d = digits.replace(/\D/g, "");
  return d.length === 12 && d.startsWith("91") ? `+91 ${d.slice(2, 7)} ${d.slice(7)}` : digits;
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
