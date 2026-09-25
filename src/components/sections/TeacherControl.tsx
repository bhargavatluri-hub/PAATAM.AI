import { revealDelay } from "@/lib/reveal";
import { Icon } from "../ui/Icon";
import { SectionHeading } from "../ui/Section";

const controls = [
  { title: "Review AI-generated marks", body: "Every suggested mark comes with a rationale you can check against the answer sheet." },
  { title: "Correct evaluation results", body: "Change any mark or comment. Your judgement overrides the suggestion." },
  { title: "Validate learning insights", body: "Confirm which gaps and strengths are accurate before they’re recorded." },
  { title: "Approve feedback", body: "Feedback becomes final only when you approve it." },
  { title: "Decide what parents see", body: "Nothing is sent to a parent without your approval." },
];

export function TeacherControl() {
  return (
    <section id="for-teachers" aria-labelledby="teachers-title" className="bg-ink py-20 text-white md:py-28">
      <div className="container-page grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <SectionHeading
            id="teachers-title"
            eyebrow="Built for teachers"
            tone="inverted"
            title={
              <>
                AI that supports teachers.{" "}
                <span className="text-accent">Not replaces them.</span>
              </>
            }
            intro="You know your students, your syllabus and your classroom. Paatam does the preparation, so your time goes to the judgements only a teacher can make."
          />
          <ul className="mt-10 space-y-5">
            {controls.map((c, i) => (
              <li key={c.title} className="flex gap-4" data-reveal style={revealDelay(i * 60)}>
                <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-approved text-white">
                  <Icon name="check" size={15} strokeWidth={2.6} />
                </span>
                <div>
                  <h3 className="font-semibold text-white">{c.title}</h3>
                  <p className="mt-1 leading-relaxed text-white/70">{c.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <DecisionDiagram />
      </div>
    </section>
  );
}

function DecisionDiagram() {
  return (
    <figure className="self-center" data-reveal aria-labelledby="decision-caption">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-7">
        {/* AI drafts */}
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#aab4ec]">AI prepares drafts</p>
        <ul className="mt-3 grid grid-cols-2 gap-2.5 text-sm">
          {["Suggested marks", "Draft feedback", "Learning insights", "Parent update draft"].map((d) => (
            <li
              key={d}
              className="rounded-lg border border-dashed border-[#aab4ec]/50 bg-[#aab4ec]/10 px-3 py-2.5 text-white/85"
            >
              {d}
            </li>
          ))}
        </ul>

        <Connector />

        {/* Teacher */}
        <div className="rounded-xl border-2 border-accent bg-surface p-5 text-ink shadow-lift">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent-strong">
              <Icon name="teacher" size={22} />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent-strong">The teacher decides</p>
              <p className="font-semibold">Review · Edit · Approve · or set aside</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-sm font-semibold" aria-hidden="true">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-approved px-3 py-1.5 text-white">
              <Icon name="check" size={14} strokeWidth={2.6} /> Approve
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3 py-1.5 text-ink">
              <Icon name="pencil" size={14} /> Edit
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3 py-1.5 text-muted">
              <Icon name="close" size={14} /> Set aside
            </span>
          </div>
        </div>

        <Connector />

        {/* Shared */}
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8fd3ae]">Only approved results are shared</p>
        <ul className="mt-3 grid grid-cols-2 gap-2.5 text-sm">
          {["Final marks & feedback", "Parent update"].map((d) => (
            <li
              key={d}
              className="inline-flex items-center gap-2 rounded-lg border border-[#8fd3ae]/40 bg-[#8fd3ae]/10 px-3 py-2.5 text-white/90"
            >
              <Icon name="checkCircle" size={16} className="shrink-0 text-[#8fd3ae]" />
              {d}
            </li>
          ))}
        </ul>
      </div>
      <figcaption id="decision-caption" className="mt-4 text-sm text-white/60">
        AI output is always a draft. The teacher is the final decision-maker on marks, insights and every message to
        a parent.
      </figcaption>
    </figure>
  );
}

function Connector() {
  return (
    <div aria-hidden="true" className="flex justify-center py-2.5">
      <span className="flex flex-col items-center text-white/40">
        <span className="h-4 w-px bg-current" />
        <Icon name="arrowDown" size={16} />
      </span>
    </div>
  );
}
