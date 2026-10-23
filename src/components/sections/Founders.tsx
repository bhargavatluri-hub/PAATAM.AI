import Image from "next/image";
import { revealDelay } from "@/lib/reveal";
import { Icon } from "../ui/Icon";
import { Section, SectionHeading } from "../ui/Section";

const founders = [
  {
    name: "Bhargav Atluri",
    role: "Co-Founder & CEO",
    photo: "/team/bhargav-atluri.jpg",
    lens: "The AI lens",
    bio: "10+ years scaling enterprise AI and customer experience solutions across Asia-Pacific, Japan and China at Cisco, Ericsson and Infobip.",
    tags: ["Enterprise AI", "Go-to-market"],
  },
  {
    name: "Nikitha Atluri",
    role: "Co-Founder & Head of Learning",
    photo: "/team/nikitha-atluri.jpg",
    lens: "The learning lens",
    bio: "Psychologist, educator and counsellor: the learning-science lens behind the product, from how feedback is worded to how students are supported.",
    tags: ["Instructional Design", "Social Emotional Learning"],
  },
];

/** The two co-founders, shown as complementary halves: AI experience and learning science. */
export function Founders() {
  return (
    <Section id="founders" labelledBy="founders-title" className="bg-surface">
      <SectionHeading
        id="founders-title"
        eyebrow="The founders"
        title="Built by people who know AI, and people who know how children learn."
        intro="Good assessment needs both: technology that can read and evaluate at scale, and an understanding of how students learn and how feedback lands. Paatam’s founders bring one each."
      />

      <ul className="mt-12 grid gap-6 md:grid-cols-2">
        {founders.map((f, i) => (
          <li
            key={f.name}
            className="flex flex-col rounded-2xl border border-line bg-paper p-6 sm:p-8"
            data-reveal
            style={revealDelay(i * 90)}
          >
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent-strong">{f.lens}</p>
            <div className="mt-5 flex items-center gap-5">
              <Image
                src={f.photo}
                alt={`Portrait of ${f.name}`}
                width={112}
                height={112}
                className="h-24 w-24 shrink-0 rounded-full border-2 border-primary object-cover sm:h-28 sm:w-28"
              />
              <div>
                <h3 className="font-display text-2xl font-semibold leading-tight text-ink">{f.name}</h3>
                <p className="mt-1 font-semibold text-primary">{f.role}</p>
              </div>
            </div>
            <p className="mt-5 flex-1 leading-relaxed text-ink-soft">{f.bio}</p>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${f.name}: areas of expertise`}>
              {f.tags.map((t) => (
                <li key={t} className="rounded-full border border-primary/40 bg-surface px-3 py-1 text-sm font-medium text-primary">
                  {t}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <p className="mt-8 flex items-start gap-3 text-muted" data-reveal>
        <Icon name="teacher" size={20} className="mt-0.5 shrink-0 text-primary" />
        <span>
          The founders work with a team of AI engineers, educators and psychologists, including practising school
          teachers who keep the product grounded in real classrooms.
        </span>
      </p>
    </Section>
  );
}
