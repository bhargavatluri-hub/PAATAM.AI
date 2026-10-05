import { revealDelay } from "@/lib/reveal";
import { Emblem } from "../ui/Logo";
import { Section, SectionHeading } from "../ui/Section";

const horizon = [
  {
    label: "Where we start",
    title: "Handwritten assessments, teacher-led insight",
    body: "Helping teachers evaluate answer sheets and understand each student’s learning, with every result reviewed by the teacher.",
  },
  {
    label: "What we’re building toward",
    title: "A continuous learning loop",
    body: "Connecting assessments, teachers, students and parents, so each assessment informs what happens next in the classroom and at home.",
  },
  {
    label: "The long-term ambition",
    title: "Every student understood",
    body: "Learning that is more visible, personalised and actionable in schools across India, including those that are often served last.",
  },
];

export function Vision() {
  return (
    <Section id="vision" labelledBy="vision-title">
      <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <SectionHeading
            id="vision-title"
            eyebrow="Our vision"
            title="A future where every student is understood."
          />
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted" data-reveal>
            <p>
              <span lang="te" className="font-telugu font-medium text-ink">
                పాఠం
              </span>{" "}
              <span className="text-ink">(paatam)</span> means <em>lesson</em> in Telugu. We chose the name because
              every assessment holds one: about what a student understands, and what they need next.
            </p>
            <p>
              Today, much of that lesson stays on the answer sheet. Our vision is to make learning more visible,
              personalised and actionable by connecting assessment data with meaningful support from teachers and
              families.
            </p>
          </div>
          <div className="mt-10 flex items-center gap-6" data-reveal>
            <Emblem className="h-24 w-24 shrink-0 text-ink md:h-28 md:w-28" label="Paatam logo" />
            <blockquote className="border-l-4 border-accent pl-5">
              <p className="font-display text-2xl font-medium leading-snug text-ink md:text-3xl">
                Every assessment is an opportunity to understand a student better.
              </p>
            </blockquote>
          </div>
        </div>

        <ol className="space-y-4 self-center">
          {horizon.map((h, i) => (
            <li
              key={h.label}
              className={`rounded-xl border p-6 ${
                i === 0 ? "border-primary/30 bg-primary-soft" : "border-line bg-surface"
              }`}
              data-reveal
              style={revealDelay(i * 90)}
            >
              <p className={`text-xs font-bold uppercase tracking-[0.14em] ${i === 0 ? "text-primary" : "text-muted"}`}>
                {h.label}
              </p>
              <h3 className="mt-2 font-display text-xl font-semibold text-ink">{h.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{h.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
