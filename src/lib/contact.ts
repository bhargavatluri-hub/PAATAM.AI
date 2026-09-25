/**
 * Shared contact-form schema and validation, used by both the browser form and
 * the /api/contact route so the rules can never drift apart.
 *
 * The form deliberately collects only what is needed to follow up with a
 * school. It must never be used to collect student information.
 */

export const roles = [
  "Principal / Head of school",
  "School owner / Management",
  "Academic coordinator",
  "Teacher",
  "Parent",
  "Other",
] as const;

export const interests = [
  { value: "demo", label: "A school demo" },
  { value: "pilot", label: "Partnering on a pilot" },
  { value: "other", label: "Something else" },
] as const;

export type Interest = (typeof interests)[number]["value"];

export type ContactPayload = {
  name: string;
  contact: string;
  school: string;
  role: string;
  city: string;
  interest: Interest;
  message: string;
  /** Honeypot. Real users never see or fill this field. */
  website?: string;
};

export type ContactErrors = Partial<Record<keyof ContactPayload, string>>;

const LIMITS = { name: 100, contact: 120, school: 150, city: 80, message: 1500 } as const;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/**
 * Indian mobile numbers and landlines (with STD code) are both 10 digits,
 * optionally prefixed with +91, 91 or 0. Spaces, hyphens and brackets are ignored.
 */
const PHONE = /^(?:\+91|91|0)?[1-9]\d{9}$/;

export function isEmailOrPhone(value: string) {
  const v = value.trim();
  return EMAIL.test(v) || PHONE.test(v.replace(/[\s\-()]/g, ""));
}

export function normalise(input: Record<string, unknown>): ContactPayload {
  const str = (key: string) => (typeof input[key] === "string" ? (input[key] as string).trim() : "");
  const interest = str("interest");
  return {
    name: str("name"),
    contact: str("contact"),
    school: str("school"),
    role: str("role"),
    city: str("city"),
    interest: (interests.some((i) => i.value === interest) ? interest : "demo") as Interest,
    message: str("message"),
    website: str("website"),
  };
}

export function validate(data: ContactPayload): ContactErrors {
  const errors: ContactErrors = {};

  if (!data.name) errors.name = "Please enter your name.";
  else if (data.name.length > LIMITS.name) errors.name = "Please keep your name under 100 characters.";

  if (!data.contact) errors.contact = "Please enter a work email or phone number.";
  else if (data.contact.length > LIMITS.contact || !isEmailOrPhone(data.contact))
    errors.contact = "Enter a valid email address or a 10-digit phone number.";

  if (!data.school) errors.school = "Please enter your school’s name.";
  else if (data.school.length > LIMITS.school) errors.school = "Please keep this under 150 characters.";

  if (!data.role) errors.role = "Please choose your role.";
  else if (!(roles as readonly string[]).includes(data.role)) errors.role = "Please choose a role from the list.";

  if (!data.city) errors.city = "Please enter your city or town.";
  else if (data.city.length > LIMITS.city) errors.city = "Please keep this under 80 characters.";

  if (data.message.length > LIMITS.message) errors.message = "Please keep your message under 1,500 characters.";

  return errors;
}

export const MESSAGE_LIMIT = LIMITS.message;
