import { revealDelay } from "@/lib/reveal";
import { Icon, type IconName } from "../ui/Icon";
import { Section, SectionHeading } from "../ui/Section";

const principles: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "teacher",
    title: "Teachers hold final authority",
    body: "Assessment outcomes are decided by teachers. AI output is a suggestion until a teacher approves it.",
  },
  {
    icon: "evaluate",
    title: "Every AI result is reviewable",
    body: "Suggested marks come with a rationale, so teachers can see why — and change it.",
  },
  {
    icon: "message",
    title: "Parent messages need approval",
    body: "No feedback or update reaches a parent without the teacher’s sign-off.",
  },
  {
    icon: "shield",
    title: "Student information handled with care",
    body: "Student work is treated as sensitive, and it is never used in public demonstrations like this one.",
  },
  {
    icon: "checkCircle",
    title: "Honest about what AI can do",
    body: "Handwriting varies and AI can make mistakes. That is exactly why teacher review is built into every step.",
  },
];

export function Responsible() {
  return (
    <Section id="responsible-ai" labelledBy="responsible-title" className="bg-paper-deep">
      <SectionHeading
        id="responsible-title"
        eyebrow="Responsible by design"
        title="Education data deserves care. Teachers deserve control."
        intro="Principles we build Paatam around, and that schools can hold us to."
      />
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {principles.map((p, i) => (
          <li
            key={p.title}
            className="rounded-xl border border-line bg-surface p-5"
            data-reveal
            style={revealDelay(i * 60)}
          >
            <Icon name={p.icon} size={24} className="text-primary" />
            <h3 className="mt-4 font-semibold leading-snug text-ink">{p.title}</h3>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{p.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
