import Link from "next/link";
import { revealDelay } from "@/lib/reveal";
import { Icon, type IconName } from "./ui/Icon";
import { Section, SectionHeading } from "./ui/Section";

const pages: { href: string; icon: IconName; title: string; body: string }[] = [
  { href: "/product", icon: "grid", title: "Product", body: "The grading desk, its modules, and a 1:37 demo of the platform." },
  { href: "/how-it-works", icon: "layers", title: "How it works", body: "From a handwritten answer sheet to teacher-approved insight." },
  { href: "/for-teachers", icon: "teacher", title: "For teachers", body: "AI prepares the drafts. You make every decision that matters." },
  { href: "/for-schools", icon: "student", title: "For schools", body: "Insight for coordinators and principals, built for Indian classrooms." },
  { href: "/about", icon: "book", title: "About", body: "Our vision, and how we approach AI responsibly in schools." },
  { href: "/demo", icon: "play", title: "Watch the demo", body: "See Paatam end to end, narrated by a teacher, in under two minutes." },
];

export function ExploreGrid() {
  return (
    <Section labelledBy="explore-title" className="bg-paper-deep">
      <SectionHeading id="explore-title" eyebrow="Explore Paatam" title="Everything a school needs, one page at a time." />
      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map((p, i) => (
          <li key={p.href} data-reveal style={revealDelay(i * 60)}>
            <Link
              href={p.href}
              className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 transition-shadow hover:shadow-[0_20px_50px_-30px_rgb(18_36_43/0.45)]"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon name={p.icon} size={22} />
              </span>
              <span className="mt-5 text-lg font-semibold text-ink">{p.title}</span>
              <span className="mt-1.5 flex-1 text-muted">{p.body}</span>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                Learn more <Icon name="arrowRight" size={16} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
