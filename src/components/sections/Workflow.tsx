import { revealDelay } from "@/lib/reveal";
import { Icon, type IconName } from "../ui/Icon";
import { Section, SectionHeading } from "../ui/Section";

type Stage = "school" | "ai" | "teacher";

const steps: { icon: IconName; title: string; body: string; stage: Stage }[] = [
  {
    icon: "upload",
    title: "Upload",
    body: "Scan or photograph completed answer sheets and upload them as supported images or documents.",
    stage: "school",
  },
  {
    icon: "scan",
    title: "Interpret",
    body: "Document intelligence and OCR read the handwritten answers and organise them question by question.",
    stage: "ai",
  },
  {
    icon: "evaluate",
    title: "Evaluate",
    body: "Subject-aware AI compares each response with your assessment criteria and suggests marks with a rationale.",
    stage: "ai",
  },
  {
    icon: "discover",
    title: "Discover",
    body: "Concept-level strengths, learning gaps and class-wide patterns are drafted for the teacher to review.",
    stage: "ai",
  },
  {
    icon: "teacher",
    title: "Teacher review",
    body: "The teacher checks every suggestion — editing marks, correcting feedback and approving what is final.",
    stage: "teacher",
  },
  {
    icon: "share",
    title: "Share",
    body: "Only approved feedback reaches students and parents, including through WhatsApp where the school chooses.",
    stage: "school",
  },
];

const stageLabel: Record<Stage, string> = {
  school: "School",
  ai: "AI suggests",
  teacher: "Teacher decides",
};

export function Workflow() {
  return (
    <Section id="how-it-works" labelledBy="workflow-title">
      <SectionHeading
        id="workflow-title"
        eyebrow="How it works"
        title="From answer sheets to actionable insights."
        intro="Paatam fits into the assessment process your school already runs. The AI prepares suggestions; the teacher makes the decisions."
      />

      <div className="mt-8 flex flex-wrap gap-3 text-sm" data-reveal>
        <span className="inline-flex items-center gap-2 rounded-full border border-dashed border-ai/50 bg-ai-soft px-3 py-1.5 font-medium text-ai">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-ai" /> AI-generated suggestion
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-approved/25 bg-approved-soft px-3 py-1.5 font-medium text-approved">
          <Icon name="check" size={14} strokeWidth={2.5} /> Teacher-approved result
        </span>
      </div>

      <ol className="relative mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 xl:gap-3">
        {steps.map((step, i) => {
          const isTeacher = step.stage === "teacher";
          const isAi = step.stage === "ai";
          return (
            <li
              key={step.title}
              data-reveal
              style={revealDelay(i * 60)}
              className={`relative flex flex-col rounded-xl p-5 ${
                isTeacher
                  ? "border-2 border-approved bg-surface shadow-lift xl:-my-3 xl:py-8"
                  : isAi
                    ? "ai-suggested"
                    : "border border-line bg-surface"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${
                    isTeacher ? "bg-approved text-white" : isAi ? "bg-surface text-ai" : "bg-primary-soft text-primary"
                  }`}
                >
                  <Icon name={step.icon} size={20} />
                </span>
                <span className="font-display text-sm font-semibold text-muted" aria-hidden="true">
                  0{i + 1}
                </span>
              </div>
              <p
                className={`mt-4 text-[0.7rem] font-bold uppercase tracking-[0.12em] ${
                  isTeacher ? "text-approved" : isAi ? "text-ai" : "text-muted"
                }`}
              >
                <span className="sr-only">Step {i + 1}, </span>
                {stageLabel[step.stage]}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{step.body}</p>
            </li>
          );
        })}
      </ol>

      <p className="mt-10 max-w-3xl text-muted" data-reveal>
        <span className="font-semibold text-ink">Nothing is final until a teacher approves it.</span> Suggested
        marks, insights and parent messages stay in draft until the teacher reviews them.
      </p>
    </Section>
  );
}
