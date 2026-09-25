import { revealDelay } from "@/lib/reveal";
import { ButtonLink } from "../ui/Button";
import { Icon, type IconName } from "../ui/Icon";
import { Section, SectionHeading } from "../ui/Section";

const benefits: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "chart",
    title: "Academic visibility",
    body: "See concept-level understanding across sections and subjects, not just averages.",
  },
  {
    icon: "teacher",
    title: "Support for your teachers",
    body: "Give teachers help with the repetitive parts of evaluation, so more of their time goes to teaching.",
  },
  {
    icon: "discover",
    title: "Students who need attention",
    body: "Surface recurring gaps early, so support reaches students before small gaps grow.",
  },
  {
    icon: "message",
    title: "Better parent communication",
    body: "Share clearer, teacher-approved progress updates that families can act on.",
  },
  {
    icon: "layers",
    title: "Fits your existing process",
    body: "Your teachers keep setting and conducting assessments on paper, as they do today.",
  },
  {
    icon: "shield",
    title: "Academic control stays with you",
    body: "Your teachers make the final call on marks, feedback and communication.",
  },
];

export function ForSchools() {
  return (
    <Section id="for-schools" labelledBy="schools-title" className="bg-surface">
      <div className="grid gap-14 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
        <div>
          <SectionHeading
            id="schools-title"
            eyebrow="For schools"
            title="Practical AI for school leaders who want clarity, not complexity."
            intro="For principals, academic coordinators and management teams, Paatam turns the assessments your school already conducts into a clearer picture of learning — while teachers remain in charge."
          />
          <ul className="mt-12 grid gap-x-8 gap-y-8 sm:grid-cols-2">
            {benefits.map((b, i) => (
              <li key={b.title} className="flex gap-4" data-reveal style={revealDelay(i * 50)}>
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <Icon name={b.icon} size={20} />
                </span>
                <div>
                  <h3 className="font-semibold text-ink">{b.title}</h3>
                  <p className="mt-1 leading-relaxed text-muted">{b.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside
          aria-labelledby="pilot-title"
          className="self-start rounded-2xl border border-primary/20 bg-primary-soft p-6 sm:p-8 lg:sticky lg:top-28"
          data-reveal
        >
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Pilot programme</p>
          <h3 id="pilot-title" className="mt-3 font-display text-2xl font-semibold leading-snug text-ink">
            We’re looking for schools to build Paatam with us.
          </h3>
          <p className="mt-3 leading-relaxed text-ink-soft">
            We’re inviting schools serving Classes 5–10, starting in Andhra Pradesh, to pilot Paatam and help shape
            it around real classrooms.
          </p>
          <ol className="mt-6 space-y-4">
            {[
              "A conversation about how your school runs assessments today.",
              "Agree together on a few classes and subjects to start with.",
              "Your teachers try Paatam and tell us honestly what works.",
            ].map((step, i) => (
              <li key={step} className="flex gap-3 text-ink-soft">
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <ButtonLink href="#contact" data-interest="pilot" className="mt-8 w-full">
            Partner With Paatam
            <Icon name="arrowRight" size={18} />
          </ButtonLink>
        </aside>
      </div>
    </Section>
  );
}
