import { revealDelay } from "@/lib/reveal";
import { Icon, type IconName } from "../ui/Icon";
import { Section, SectionHeading } from "../ui/Section";
import { Frac } from "../visuals/AnswerSheet";

const audiences: { icon: IconName; title: string; lead: string; items: string[] }[] = [
  {
    icon: "teacher",
    title: "For teachers",
    lead: "Less repetitive checking, clearer insight.",
    items: [
      "Assessment evaluation assistance",
      "Individual student learning insights",
      "Class-level learning patterns",
      "Teacher-reviewed feedback",
    ],
  },
  {
    icon: "student",
    title: "For students",
    lead: "Feedback that explains, not just a score.",
    items: [
      "Understand their mistakes",
      "Receive actionable feedback",
      "See which areas to improve",
      "Build a clearer learning path",
    ],
  },
  {
    icon: "parent",
    title: "For parents",
    lead: "Understandable updates they can act on.",
    items: [
      "Understand academic progress",
      "Receive meaningful updates",
      "Know where their child needs support",
      "Stay connected through approved messages, including WhatsApp",
    ],
  },
];

export function ConnectedLearning() {
  return (
    <Section id="connected-learning" labelledBy="connected-title">
      <SectionHeading
        id="connected-title"
        eyebrow="Connected learning"
        title="One assessment. Three people who understand it better."
        intro="Paatam connects what happens on the answer sheet with the people who can act on it — the teacher, the student and the parent."
      />

      <ul className="mt-12 grid gap-5 md:grid-cols-3">
        {audiences.map((a, i) => (
          <li
            key={a.title}
            data-reveal
            style={revealDelay(i * 80)}
            className="flex flex-col rounded-xl border border-line bg-surface p-6 shadow-card"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent-soft text-accent-strong">
              <Icon name={a.icon} size={22} />
            </span>
            <h3 className="mt-5 font-display text-2xl font-semibold text-ink">{a.title}</h3>
            <p className="mt-1 text-muted">{a.lead}</p>
            <ul className="mt-5 space-y-2.5 border-t border-line pt-5">
              {a.items.map((item) => (
                <li key={item} className="flex gap-2.5 text-ink-soft">
                  <Icon name="check" size={18} strokeWidth={2.2} className="mt-0.5 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <div className="mt-16 grid items-center gap-12 rounded-2xl bg-paper-deep p-6 sm:p-10 lg:grid-cols-[1fr_0.8fr]">
        <div data-reveal>
          <h3 className="font-display text-3xl font-semibold leading-tight text-ink">
            Updates parents can understand — sent only when the teacher says so.
          </h3>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Instead of a bare number, parents can receive a short, teacher-approved note on what their child
            understands, where they need support, and one practical way to help at home.
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            WhatsApp is one convenient way to deliver these updates, because it’s where many families already are.
            It’s a channel, not the product: the insight comes first, and the teacher approves it before it goes
            anywhere.
          </p>
        </div>
        <ParentMessage />
      </div>
    </Section>
  );
}

function ParentMessage() {
  return (
    <figure className="mx-auto w-full max-w-sm" data-reveal aria-labelledby="parent-msg-caption">
      <div className="overflow-hidden rounded-[1.75rem] border-[6px] border-ink bg-[#efe9df] shadow-lift">
        <div className="flex items-center gap-3 bg-primary-strong px-4 py-3 text-white">
          <span aria-hidden="true" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-xs font-bold">
            KL
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Ms. K. Lakshmi · Class 7B</p>
            <p className="text-xs text-white/70">Message to parent</p>
          </div>
        </div>
        <div className="space-y-2 p-4">
          <div className="max-w-[92%] rounded-xl rounded-tl-sm bg-surface px-3.5 py-3 text-[0.9rem] leading-relaxed text-ink shadow-sm">
            <p>Namaste! A quick update on Ananya&rsquo;s Mathematics unit test on fractions.</p>
            <p className="mt-2">
              <span className="font-semibold">Doing well:</span> equivalent fractions — she explained her
              reasoning clearly.
            </p>
            <p className="mt-2">
              <span className="font-semibold">Needs practice:</span> adding fractions with different
              denominators.
            </p>
            <p className="mt-2">
              <span className="font-semibold">At home:</span> ask her to show how she would add{" "}
              <Frac n="1" d="2" className="text-[0.8rem]" /> + <Frac n="1" d="3" className="text-[0.8rem]" /> by
              first finding a common denominator.
            </p>
            <p className="mt-2 flex items-center justify-end gap-1 text-[0.7rem] text-muted">
              <Icon name="checkCircle" size={13} className="text-approved" /> Approved by class teacher
            </p>
          </div>
        </div>
      </div>
      <figcaption id="parent-msg-caption" className="mt-4 text-center text-sm text-muted">
        Illustrative parent update with fictional names.
      </figcaption>
    </figure>
  );
}
