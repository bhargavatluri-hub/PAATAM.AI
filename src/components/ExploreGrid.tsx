import Link from "next/link";
import { revealDelay } from "@/lib/reveal";
import { Icon, type IconName } from "./ui/Icon";
import { Section, SectionHeading } from "./ui/Section";

const pages: { href: string; icon: IconName; title: string; body: string }[] = [
  { href: "/product", icon: "grid", title: "Product", body: "The AI grading desk and every module, from marking to parent updates." },
  { href: "/how-it-works", icon: "layers", title: "How it works", body: "How a handwritten answer sheet becomes teacher-approved marks and insight." },
  { href: "/for-teachers", icon: "teacher", title: "For teachers", body: "Paatam drafts the marks and feedback. You review and approve every one." },
  { href: "/for-schools", icon: "student", title: "For schools", body: "A clear view of learning across every class, for coordinators and principals." },
  { href: "/about", icon: "book", title: "About", body: "Why we built Paatam, and how we use AI responsibly in schools." },
  { href: "/demo", icon: "play", title: "Watch the demo", body: "See Paatam in action, from scanning an answer sheet to the parent update." },
];

export function ExploreGrid() {
  return (
    <Section labelledBy="explore-title" className="bg-paper-deep">
      <SectionHeading id="explore-title" eyebrow="Explore Paatam" title="See how Paatam works for your school." />
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
