import { revealDelay } from "@/lib/reveal";
import { Icon } from "../ui/Icon";
import { Section, SectionHeading } from "../ui/Section";

const realities = [
  {
    reality: "Most assessments are handwritten.",
    response: "Paatam starts from paper. Students keep writing answers as they do today.",
  },
  {
    reality: "Teachers manage large volumes of student work.",
    response: "Evaluations are prepared in advance, so teachers can focus their review where it matters.",
  },
  {
    reality: "Classrooms are diverse.",
    response: "Responses are evaluated against your own assessment criteria, and teachers adjust for context.",
  },
  {
    reality: "Digital readiness varies from school to school.",
    response: "The workflow starts with a simple upload of scanned or photographed answer sheets.",
  },
  {
    reality: "Families need information they can use.",
    response: "Teacher-approved updates reach parents on channels they already use, such as WhatsApp.",
  },
];

export function IndianClassrooms() {
  return (
    <Section id="indian-classrooms" labelledBy="india-title">
      <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div>
          <SectionHeading
            id="india-title"
            eyebrow="India first"
            title="Built for Indian classrooms. Designed for every learner."
            intro="Paatam is designed around how Indian schools actually work — not adapted from a product built for somewhere else."
          />

          <div className="mt-10 rounded-2xl border border-line bg-surface p-6 shadow-card" data-reveal>
            <ol className="relative space-y-6 pl-8 before:absolute before:bottom-3 before:left-[0.55rem] before:top-3 before:border-l-2 before:border-dotted before:border-line-strong before:content-['']">
              <li className="relative">
                <span aria-hidden="true" className="absolute -left-8 top-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent text-ink">
                  <Icon name="mapPin" size={12} strokeWidth={2.4} />
                </span>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent-strong">Where we begin</p>
                <p className="mt-1 font-display text-2xl font-semibold text-ink">Andhra Pradesh</p>
                <p className="mt-1 text-muted">Our starting point: schools serving students in Classes 5–10.</p>
              </li>
              <li className="relative">
                <span aria-hidden="true" className="absolute -left-8 top-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary bg-surface" />
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Where we’re headed</p>
                <p className="mt-1 font-display text-2xl font-semibold text-ink">Schools across India</p>
                <p className="mt-1 text-muted">Including rural and underserved communities, where practical tools can matter most.</p>
              </li>
            </ol>
          </div>
        </div>

        <div className="self-center">
          <div className="hidden grid-cols-2 gap-6 border-b border-line pb-3 text-xs font-bold uppercase tracking-[0.14em] text-muted sm:grid">
            <p>The classroom reality</p>
            <p>How Paatam is designed for it</p>
          </div>
          <ul>
            {realities.map((r, i) => (
              <li
                key={r.reality}
                className="grid gap-2 border-b border-line py-5 sm:grid-cols-2 sm:gap-6"
                data-reveal
                style={revealDelay(i * 50)}
              >
                <p className="font-semibold text-ink">{r.reality}</p>
                <p className="flex gap-2.5 leading-relaxed text-muted">
                  <Icon name="arrowRight" size={18} className="mt-0.5 shrink-0 text-primary" />
                  <span>{r.response}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
