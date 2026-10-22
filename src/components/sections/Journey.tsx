import { revealDelay } from "@/lib/reveal";
import { ButtonLink } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { Section, SectionHeading } from "../ui/Section";

const milestones: { when: string; title: string; body: string; next?: boolean }[] = [
  {
    when: "September 2026",
    title: "Company incorporated",
    body: "ABC Learning Technologies Private Limited is founded in Visakhapatnam, with an office at the Ratan Tata Innovation Hub.",
  },
  {
    when: "2026",
    title: "Recognised by DPIIT",
    body: "Paatam is a DPIIT-recognised startup under the Government of India’s Startup India programme.",
  },
  {
    when: "October 2026",
    title: "Product and website launched",
    body: "The grading desk is built, and paatam.ai goes live with a narrated product demo.",
  },
  {
    when: "From Diwali 2026",
    title: "First pilot schools",
    body: "Five schools in Andhra Pradesh are in discussion to start pilots with their own teachers and classes.",
    next: true,
  },
];

/** An early-stage company's honest record: what has happened, and what comes next. */
export function Journey() {
  return (
    <Section id="journey" labelledBy="journey-title">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <SectionHeading
            id="journey-title"
            eyebrow="Where we are"
            title="We’re at the beginning, and building it with schools."
            intro="Paatam is a young company. Rather than claim what we haven’t done yet, here is exactly where we stand, and where we’re going next."
          />
          <div className="mt-8 rounded-2xl border border-primary/25 bg-primary-soft p-6" data-reveal>
            <p className="font-display text-xl font-semibold text-ink">Be one of our first pilot schools.</p>
            <p className="mt-2 leading-relaxed text-ink-soft">
              Pilot schools shape Paatam around their own classrooms, assessments and teachers.
            </p>
            <ButtonLink href="/contact?interest=pilot" className="mt-5">
              Talk to us about a pilot <Icon name="arrowRight" size={18} />
            </ButtonLink>
          </div>
        </div>

        <ol className="relative self-center border-l-2 border-line-strong pl-8">
          {milestones.map((m, i) => (
            <li key={m.title} className="relative pb-9 last:pb-0" data-reveal style={revealDelay(i * 80)}>
              <span
                aria-hidden="true"
                className={`absolute -left-[2.6rem] top-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full ${
                  m.next ? "border-2 border-accent bg-surface" : "bg-primary text-white"
                }`}
              >
                {m.next ? null : <Icon name="check" size={12} strokeWidth={3} />}
              </span>
              <p className={`text-xs font-bold uppercase tracking-[0.14em] ${m.next ? "text-accent-strong" : "text-primary"}`}>
                {m.when}
                {m.next ? <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-ink">Next</span> : null}
              </p>
              <h3 className="mt-1.5 font-display text-xl font-semibold text-ink">{m.title}</h3>
              <p className="mt-1.5 leading-relaxed text-muted">{m.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
