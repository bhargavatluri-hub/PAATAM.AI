import { siteConfig } from "@/config/site";
import { deliveryConfigured } from "@/lib/enquiry-email";
import { ContactDetails, SocialLinks } from "../ContactDetails";
import { ContactForm } from "../ContactForm";
import { buttonClasses } from "../ui/Button";
import { Icon } from "../ui/Icon";

export function FinalCta() {
  // Read on the server; delivery secrets never reach the browser.
  const configured = deliveryConfigured();

  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-primary-strong py-20 md:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="text-white">
          <p className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-accent">
            <span aria-hidden="true" className="h-px w-6 bg-current" />
            Get in touch
          </p>
          <h2 id="contact-title" className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-balance md:text-5xl">
            Let’s make every assessment count.
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/80">
            Bring meaningful learning insights into your school. Let’s explore what Paatam can do for your teachers and
            students.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#contact-form" data-interest="pilot" className={buttonClasses("inverted", "lg")}>
              Partner With Paatam
              <Icon name="arrowRight" size={18} />
            </a>
            <a
              href="#contact-form"
              data-interest="demo"
              className={buttonClasses("outlineInverted", "lg")}
            >
              Request a Demo
            </a>
          </div>

          <ul className="mt-12 space-y-4 text-white/80">
            <li className="flex gap-3">
              <Icon name="clock" size={20} className="mt-0.5 shrink-0 text-accent" />
              A demo walks through the teacher review workflow with sample answer sheets.
            </li>
            <li className="flex gap-3">
              <Icon name="student" size={20} className="mt-0.5 shrink-0 text-accent" />
              For schools serving Classes 5–10, starting in Andhra Pradesh.
            </li>
          </ul>

          <ContactDetails className="mt-10 border-t border-white/15 pt-10" />
          <SocialLinks className="mt-8" />
        </div>

        <ContactForm configured={configured} contactEmail={siteConfig.contactEmail} />
      </div>
    </section>
  );
}
