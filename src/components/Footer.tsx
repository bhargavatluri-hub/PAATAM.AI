import Link from "next/link";
import { activeSocialLinks, business, navItems, siteConfig } from "@/config/site";
import { deliveryConfigured } from "@/lib/enquiry-email";
import { ContactDetails, SocialLinks } from "./ContactDetails";
import { ContactForm } from "./ContactForm";
import { Logo } from "./ui/Logo";

type FooterProps = {
  /** The enquiry form is left out on /contact, which already shows it in full. */
  showEnquiry?: boolean;
};

export function Footer({ showEnquiry = true }: FooterProps) {
  const year = new Date().getFullYear();
  // Read on the server; delivery secrets never reach the browser.
  const configured = deliveryConfigured();
  const hasSocial = activeSocialLinks().length > 0;

  return (
    <footer className="bg-ink text-white/70">
      {showEnquiry && (
        <section id="get-in-touch" aria-labelledby="footer-contact-title" className="border-b border-white/10">
          <div className="container-page grid gap-12 py-16 md:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div>
              <p className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-accent">
                <span aria-hidden="true" className="h-px w-6 bg-current" />
                Get in touch
              </p>
              <h2 id="footer-contact-title" className="font-display text-3xl font-semibold leading-tight tracking-tight text-balance text-white md:text-4xl">
                Bring Paatam to your school.
              </h2>
              <p className="mt-4 max-w-md leading-relaxed">
                Request a demo, partner with us on a pilot, or just ask a question. We reply to every school enquiry.
              </p>
              <ContactDetails className="mt-10" />
              {hasSocial && (
                <div className="mt-10">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50">Follow us</h3>
                  <SocialLinks className="mt-3" />
                </div>
              )}
            </div>
            <ContactForm configured={configured} contactEmail={siteConfig.contactEmail} />
          </div>
        </section>
      )}

      <div className="container-page grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="max-w-sm">
          <Link href="/" className="inline-block rounded-md" aria-label="Paatam.ai home">
            <Logo inverted className="h-14" />
          </Link>
          <p className="mt-5 leading-relaxed">
            A teacher-first learning intelligence platform that turns handwritten assessments into actionable insights
            for teachers, students and parents. Built in India, starting in Andhra Pradesh.
          </p>
          <p className="mt-4 font-display text-lg text-white">{siteConfig.tagline}</p>
          {!showEnquiry && hasSocial && <SocialLinks className="mt-6" />}
        </div>

        <nav aria-label="Footer">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-white">Explore</h2>
          <ul className="mt-4 space-y-2.5">
            {navItems
              .filter((item) => item.href !== "/contact")
              .map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-white">Work with us</h2>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link href="/contact?interest=demo" className="hover:text-white">
                Request a school demo
              </Link>
            </li>
            <li>
              <Link href="/contact?interest=pilot" className="hover:text-white">
                Partner on a pilot
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Contact us
              </Link>
            </li>
            <li>
              <Link href="/#faq" className="hover:text-white">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-white">Legal</h2>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link href="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {business.legalName || siteConfig.name}. All rights reserved.
          </p>
          <p className="text-white/50">Made in India for Indian classrooms.</p>
        </div>
      </div>
    </footer>
  );
}
