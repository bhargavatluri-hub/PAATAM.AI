import { revealDelay } from "@/lib/reveal";
import { Icon, type IconName } from "../ui/Icon";
import { Section, SectionHeading } from "../ui/Section";

const problems: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "clock",
    title: "Assessment takes teacher time",
    body: "Evaluating stacks of handwritten answer sheets, totalling marks and noting common mistakes takes hours that could go to teaching.",
  },
  {
    icon: "chart",
    title: "Marks don’t explain understanding",
    body: "A score shows how a student performed on the day — not which concept they missed, or why.",
  },
  {
    icon: "layers",
    title: "Gaps are hard to see at scale",
    body: "With many students and sections, spotting individual learning gaps and class-wide patterns consistently is difficult.",
  },
  {
    icon: "parent",
    title: "Parents need more than a scorecard",
    body: "Parents often receive a number, without the context to know where their child is struggling or how they can help.",
  },
];

export function Problem() {
  return (
    <Section id="beyond-marks" labelledBy="problem-title" className="bg-surface">
      <div className="grid gap-14 lg:grid-cols-[1fr_0.9fr] lg:items-start lg:gap-20">
        <div>
          <SectionHeading
            id="problem-title"
            eyebrow="Beyond marks"
            title="Marks tell you how a student performed. Insights tell you what to do next."
            intro="Teachers already know their students well. What’s missing is time — and a practical way to turn every answer sheet into a clear picture of what each student understands."
          />
          <ul className="mt-12 grid gap-x-8 gap-y-9 sm:grid-cols-2">
            {problems.map((p, i) => (
              <li key={p.title} data-reveal style={revealDelay(i * 70)}>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <Icon name={p.icon} size={22} />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-ink">{p.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>

        <MarksVersusInsight />
      </div>
    </Section>
  );
}

function MarksVersusInsight() {
  return (
    <div className="lg:sticky lg:top-28" data-reveal>
      <p className="mb-3 text-sm font-semibold text-muted">The same unit test, two ways</p>
      <div className="overflow-hidden rounded-xl border border-line bg-paper shadow-card">
        <div className="border-b border-line p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">What a mark sheet shows</p>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="font-medium text-ink">Mathematics — Fractions</span>
            <span className="font-display text-4xl font-semibold text-ink">6/10</span>
          </div>
        </div>
        <div className="bg-surface p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">What learning intelligence shows</p>
          <dl className="mt-4 space-y-4 text-[0.95rem]">
            <div className="flex gap-3">
              <dt className="sr-only">Strength</dt>
              <Icon name="checkCircle" size={20} className="mt-0.5 shrink-0 text-approved" />
              <dd className="text-ink-soft">
                <span className="font-semibold text-ink">Secure:</span> equivalent fractions and simplifying.
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="sr-only">Learning gap</dt>
              <Icon name="alert" size={20} className="mt-0.5 shrink-0 text-gap" />
              <dd className="text-ink-soft">
                <span className="font-semibold text-ink">Gap:</span> adds numerators and denominators directly
                when denominators differ.
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="sr-only">Next step</dt>
              <Icon name="arrowRight" size={20} className="mt-0.5 shrink-0 text-primary" />
              <dd className="text-ink-soft">
                <span className="font-semibold text-ink">Next step:</span> practise finding a common
                denominator before adding.
              </dd>
            </div>
          </dl>
          <p className="mt-5 text-xs text-muted">Illustrative example with fictional data.</p>
        </div>
      </div>
    </div>
  );
}
