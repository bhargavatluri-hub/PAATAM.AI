import { ButtonLink } from "./ui/Button";
import { Icon } from "./ui/Icon";

/** Closing call to action on inner pages; the full enquiry form lives on /contact. */
export function CtaBand({ title = "See Paatam in your school." }: { title?: string }) {
  return (
    <section aria-labelledby="cta-title" className="bg-primary-strong py-16 md:py-20">
      <div className="container-page flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl text-white">
          <h2 id="cta-title" className="font-display text-3xl font-semibold leading-tight tracking-tight text-balance md:text-4xl">
            {title}
          </h2>
          <p className="mt-3 text-lg text-white/80">
            Book a walkthrough for your leadership team, or partner with us on a pilot.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/contact?interest=demo" variant="inverted" size="lg">
            Request a Demo
            <Icon name="arrowRight" size={18} />
          </ButtonLink>
          <ButtonLink href="/contact?interest=pilot" variant="outlineInverted" size="lg">
            Partner With Paatam
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
