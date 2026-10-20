import { activeSocialLinks, addressLines, business, contactEmails, siteConfig } from "@/config/site";
import { Icon, type IconName } from "./ui/Icon";
import { SocialIcon } from "./ui/SocialIcon";

/** Address, phone, WhatsApp, email and hours, for dark backgrounds. Unset details are omitted. */
export function ContactDetails({ className = "" }: { className?: string }) {
  const address = addressLines();
  const items: { icon: IconName; label: string; content: React.ReactNode }[] = [];

  if (address.length) {
    const query = encodeURIComponent([business.legalName || siteConfig.name, ...address].join(", "));
    items.push({
      icon: "mapPin",
      label: "Address",
      content: (
        <a href={`https://www.google.com/maps/search/?api=1&query=${query}`} target="_blank" rel="noopener noreferrer" className="hover:text-white">
          <address className="not-italic">
            {business.legalName && <span className="block font-semibold text-white">{business.legalName}</span>}
            {address.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
        </a>
      ),
    });
  }
  if (business.phone) {
    items.push({
      icon: "phone",
      label: "Phone",
      content: (
        <a href={`tel:${business.phone.replace(/[^\d+]/g, "")}`} className="hover:text-white">
          {business.phone}
        </a>
      ),
    });
  }
  if (business.whatsapp) {
    items.push({
      icon: "message",
      label: "WhatsApp",
      content: (
        <a href={`https://wa.me/${business.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="hover:text-white">
          {formatIndianNumber(business.whatsapp)}
        </a>
      ),
    });
  }
  const emails = contactEmails();
  if (emails.length) {
    items.push({
      icon: "mail",
      label: "Email",
      content: emails.map((email) => (
        <a key={email} href={`mailto:${email}`} className="block hover:text-white">
          {email}
        </a>
      )),
    });
  }
  if (business.hours) {
    items.push({ icon: "clock", label: "Hours", content: business.hours });
  }

  if (!items.length) return null;

  return (
    <dl className={`space-y-5 ${className}`}>
      {items.map((item) => (
        <div key={item.label} className="flex gap-3.5">
          <Icon name={item.icon} size={20} className="mt-0.5 shrink-0 text-accent" />
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50">{item.label}</dt>
            <dd className="mt-1 leading-relaxed text-white/80">{item.content}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}

/** Round links to the social profiles that are configured. Renders nothing when none are. */
export function SocialLinks({ className = "" }: { className?: string }) {
  const links = activeSocialLinks();
  if (!links.length) return null;
  return (
    <ul className={`flex flex-wrap gap-3 ${className}`}>
      {links.map((s) => (
        <li key={s.network}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${siteConfig.shortName} on ${s.label}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white"
          >
            <SocialIcon name={s.network} size={18} />
          </a>
        </li>
      ))}
    </ul>
  );
}

/** "918870902456" → "+91 88709 02456"; other formats are shown as given. */
function formatIndianNumber(digits: string) {
  const d = digits.replace(/\D/g, "");
  return d.length === 12 && d.startsWith("91") ? `+91 ${d.slice(2, 7)} ${d.slice(7)}` : digits;
}
