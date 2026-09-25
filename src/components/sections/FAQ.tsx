import { Section, SectionHeading } from "../ui/Section";

export const faqs = [
  {
    q: "Does Paatam grade answer sheets on its own?",
    a: "No. Paatam suggests marks, feedback and learning insights. A teacher reviews, edits and approves every result before it is final or shared with anyone.",
  },
  {
    q: "Will Paatam replace teachers?",
    a: "No. Paatam is built to support teachers’ expertise, not to replace it. It helps with the repetitive parts of evaluation so teachers can spend more of their time on teaching and on the students who need them.",
  },
  {
    q: "How accurately can it read handwriting?",
    a: "Handwriting varies widely, and readability also depends on the quality of the scan or photo. The AI can make mistakes, which is why the original answer sheet stays alongside every suggestion and the teacher has the final word.",
  },
  {
    q: "Which classes does Paatam support?",
    a: "We’re starting with schools serving students in Classes 5–10. Subjects and assessment formats are something we’ll discuss with each school, based on how it assesses today.",
  },
  {
    q: "Which languages can students write in?",
    a: "Tell us which languages your school’s assessments use. We’ll be clear about what Paatam supports today, and we won’t claim support we haven’t verified.",
  },
  {
    q: "How do parents receive updates?",
    a: "Once a teacher approves feedback, it can be shared with parents, including through WhatsApp. Nothing is sent to a parent without the teacher’s approval.",
  },
  {
    q: "How is student information handled?",
    a: "We treat student work as sensitive information. This website never asks for student data. When you talk to us about a pilot, we’ll explain how assessment data would be handled for your school.",
  },
];

export function FAQ() {
  return (
    <Section id="faq" labelledBy="faq-title" className="bg-surface">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <SectionHeading
          id="faq-title"
          eyebrow="Questions"
          title="What schools usually ask us."
          intro="Straight answers, including about what AI can’t do."
        />
        <div className="divide-y divide-line border-y border-line" data-reveal>
          {faqs.map((item) => (
            <details key={item.q} className="group py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded-md py-4 text-left text-lg font-semibold text-ink [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  aria-hidden="true"
                  className="relative h-5 w-5 shrink-0 text-primary before:absolute before:left-0 before:top-1/2 before:h-0.5 before:w-5 before:-translate-y-1/2 before:rounded before:bg-current after:absolute after:left-1/2 after:top-0 after:h-5 after:w-0.5 after:-translate-x-1/2 after:rounded after:bg-current after:transition-transform group-open:after:scale-y-0"
                />
              </summary>
              <p className="pb-5 pr-10 leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}
