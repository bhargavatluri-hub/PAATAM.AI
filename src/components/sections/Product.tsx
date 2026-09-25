import { revealDelay } from "@/lib/reveal";
import { Icon, type IconName } from "../ui/Icon";
import { Section, SectionHeading } from "../ui/Section";
import { ReviewDemo } from "./ReviewDemo";

const pillars: { icon: IconName; title: string; body: string }[] = [
  { icon: "scan", title: "Understand", body: "Interpret handwritten student assessments with AI." },
  { icon: "evaluate", title: "Evaluate", body: "Generate suggested marks and subject-aware feedback." },
  { icon: "discover", title: "Discover", body: "Identify individual learning gaps and classroom-wide patterns." },
  { icon: "teacher", title: "Empower", body: "Help teachers take action and keep parents informed." },
];

export function Product() {
  return (
    <Section id="product" labelledBy="product-title" className="bg-surface">
      <SectionHeading
        id="product-title"
        eyebrow="The product"
        title="See a teacher’s review, question by question."
        intro="Automated evaluation is where Paatam starts. Learning intelligence is where it leads: a clear view of what each student understands, and what to do next."
      />

      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((p, i) => (
          <li
            key={p.title}
            data-reveal
            style={revealDelay(i * 60)}
            className="rounded-xl border border-line bg-paper p-5"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
                <Icon name={p.icon} size={18} />
              </span>
              <h3 className="font-display text-xl font-semibold text-ink">{p.title}</h3>
            </div>
            <p className="mt-3 leading-relaxed text-muted">{p.body}</p>
          </li>
        ))}
      </ul>

      <div className="mt-16" data-reveal>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <p className="max-w-2xl text-ink-soft">
            <span className="font-semibold text-ink">Try it:</span> adjust a mark, approve each question, edit the
            insight, then approve the assessment. Nothing is final until you do.
          </p>
        </div>
        <ReviewDemo />
        <p className="mt-4 text-sm text-muted">
          An illustrative interface with a fictional student, teacher and assessment, built to show the review
          workflow. It is not a screenshot of a deployed product, and the evaluations shown are examples.
        </p>
      </div>
    </Section>
  );
}
