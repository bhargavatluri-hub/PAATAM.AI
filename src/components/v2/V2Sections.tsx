import Link from "next/link";
import type { ReactNode } from "react";
import { revealDelay } from "@/lib/reveal";
import { siteConfig } from "@/config/site";
import { ContactForm } from "../ContactForm";
import { buttonClasses } from "../ui/Button";
import { Icon, type IconName } from "../ui/Icon";
import { Logo } from "../ui/Logo";
import { LifecycleCarousel } from "./LifecycleCarousel";
import { ModuleShowcase } from "./ModuleShowcase";
import { ProductVideo } from "./ProductVideo";
import { v2Nav } from "./nav";

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-mint">
      <span aria-hidden="true" className="h-px w-6 bg-current" />
      {children}
    </p>
  );
}

function Heading({ id, eyebrow, title, intro, center = false }: { id: string; eyebrow: string; title: ReactNode; intro?: ReactNode; center?: boolean }) {
  return (
    <div className={`max-w-3xl ${center ? "mx-auto text-center" : ""}`} data-reveal>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id} className="font-display text-[2.1rem] font-semibold leading-[1.08] tracking-tight text-balance text-white md:text-5xl">
        {title}
      </h2>
      {intro && <p className="mt-5 text-lg leading-relaxed text-pretty text-white/65">{intro}</p>}
    </div>
  );
}

/* ----------------------------------- Hero ----------------------------------- */

export function V2Hero() {
  return (
    <section id="top" aria-labelledby="v2-hero-title" className="relative overflow-hidden">
      <div aria-hidden="true" className="night-grid pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(45_212_191/0.16),transparent)]"
      />
      <div className="container-page relative pb-16 pt-12 text-center md:pb-24 md:pt-20">
        <p className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-1.5 text-sm text-white/75">
          <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
          The AI grading desk for Indian schools
        </p>
        <h1
          id="v2-hero-title"
          className="mx-auto max-w-4xl font-display text-[2.7rem] font-semibold leading-[1.02] tracking-tight text-balance text-white sm:text-6xl lg:text-7xl"
        >
          Every answer has a story.{" "}
          <span className="bg-gradient-to-r from-mint via-[#9be7dc] to-accent bg-clip-text text-transparent">Let’s understand it.</span>
        </h1>
        <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-white/65 md:text-xl">
          Paatam reads handwritten tests, homework and exams, drafts marks and feedback with six specialised AI agents,
          and puts every result in front of the teacher for approval — then keeps coordinators, the principal and
          parents in the loop.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <a href="#contact" data-interest="demo" className={buttonClasses("inverted", "lg")}>
            Request a school demo <Icon name="arrowRight" size={18} />
          </a>
          <a href="#platform" className={buttonClasses("outlineInverted", "lg")}>
            Explore the platform
          </a>
        </div>

        <div className="relative mx-auto mt-14 max-w-5xl" data-reveal>
          <div aria-hidden="true" className="absolute -inset-px rounded-[1.1rem] bg-gradient-to-b from-white/20 via-white/5 to-transparent" />
          <ProductVideo
            name="script-to-insight"
            label="Animation: a handwritten fractions test is scanned, read question by question, given suggested marks, approved by the teacher, and summarised for the parent on WhatsApp."
            className="relative"
          />
        </div>
        <p className="mt-4 text-xs text-white/55">Product animation with fictional student and teacher.</p>
      </div>
    </section>
  );
}

const facts: { icon: IconName; title: string; body: string }[] = [
  { icon: "evaluate", title: "Tests, homework & exams", body: "Handwritten answer sheets, as your school uses them today." },
  { icon: "layers", title: "Six specialised agents", body: "Vision, OCR, verification, grading, QA — then the teacher." },
  { icon: "teacher", title: "Teacher sign-off, always", body: "Nothing is final or shared until a teacher approves." },
  { icon: "parent", title: "Every role connected", body: "Coordinators, the principal and parents each see what they need." },
];

export function V2Facts() {
  return (
    <section aria-label="Paatam at a glance" className="border-y border-white/[0.07] bg-night-2">
      <ul className="container-page grid gap-px sm:grid-cols-2 lg:grid-cols-4">
        {facts.map((f, i) => (
          <li key={f.title} className="flex gap-4 py-7 lg:px-5" data-reveal style={revealDelay(i * 60)}>
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-mint">
              <Icon name={f.icon} size={20} />
            </span>
            <div>
              <p className="font-semibold text-white">{f.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-white/60">{f.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* --------------------------------- Lifecycle -------------------------------- */

export function V2Lifecycle() {
  return (
    <section id="lifecycle" aria-labelledby="v2-lifecycle-title" className="relative overflow-hidden py-20 md:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-40 h-[480px] w-[480px] rounded-full bg-[radial-gradient(closest-side,rgb(94_234_212/0.10),transparent)]"
      />
      <div className="container-page relative">
        <Heading
          id="v2-lifecycle-title"
          eyebrow="The learning lifecycle"
          title="From one answer sheet to a whole school’s insight."
          intro="Paatam connects everyone who shapes a student’s learning — the student, the teacher, the coordinator, the Head of School and the parent — in one continuous loop."
        />
        <div className="mx-auto mt-12 max-w-5xl" data-reveal>
          <ProductVideo
            name="learning-lifecycle"
            label="Animation: an assessment moves from the student to the teacher, who approves it, then to the coordinator, the Head of School dashboard and the parent on WhatsApp; insights loop back into the next lesson."
          />
        </div>
        <div className="mt-16 rounded-3xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-8 lg:p-10" data-reveal>
          <LifecycleCarousel />
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Platform --------------------------------- */

export function V2Platform() {
  return (
    <section id="platform" aria-labelledby="v2-platform-title" className="py-20 md:py-28">
      <div className="container-page">
        <Heading
          id="v2-platform-title"
          eyebrow="The platform"
          title="One grading desk. Every module your school needs."
          intro="From the command centre to the parent’s phone — explore each part of Paatam. Select a module to see it."
        />
        <div className="mt-12" data-reveal>
          <ModuleShowcase />
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Pipeline --------------------------------- */

const agents: { name: string; body: string; teacher?: boolean }[] = [
  { name: "Vision Agent", body: "Ingests the scanned or photographed script." },
  { name: "OCR + Structure Agent", body: "Transcribes handwriting into answer blocks, question by question." },
  { name: "Answer Verification Agent", body: "Checks each answer against your rubric and answer key." },
  { name: "Subject Grading Agent", body: "Suggests marks and feedback using your knowledge base." },
  { name: "QA Agent", body: "Runs consistency checks and flags answers that need a closer look." },
  { name: "Teacher Review", body: "You edit, approve or set aside. Only then is anything final.", teacher: true },
];

export function V2Pipeline() {
  return (
    <section id="how-it-works" aria-labelledby="v2-pipeline-title" className="border-t border-white/[0.07] bg-night-2 py-20 md:py-28">
      <div className="container-page">
        <Heading
          id="v2-pipeline-title"
          eyebrow="How it works"
          title="Six agents do the groundwork. One teacher decides."
          intro="Every script moves through a pipeline of specialised agents. Each one does a single job well — and the last step is always a person."
        />
        <div className="mx-auto mt-12 max-w-5xl" data-reveal>
          <ProductVideo
            name="agent-pipeline"
            label="Animation: six agents process a script in sequence; the teacher approves the final marks."
          />
        </div>
        <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((a, i) => (
            <li
              key={a.name}
              data-reveal
              style={revealDelay(i * 50)}
              className={`flex gap-4 rounded-xl border p-4 ${
                a.teacher ? "border-accent/40 bg-accent/[0.08]" : "border-white/[0.08] bg-white/[0.025]"
              }`}
            >
              <span
                className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                  a.teacher ? "bg-accent text-night" : "bg-primary text-white"
                }`}
              >
                {i + 1}
              </span>
              <div>
                <h3 className="font-semibold text-white">{a.name}</h3>
                <p className="mt-0.5 text-sm leading-relaxed text-white/60">{a.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ----------------------------------- Bulk ----------------------------------- */

export function V2Bulk() {
  return (
    <section id="bulk" aria-labelledby="v2-bulk-title" className="py-20 md:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:items-center lg:gap-16">
        <div>
          <Heading
            id="v2-bulk-title"
            eyebrow="Bulk grading"
            title="A whole section’s scripts. One upload."
            intro="Drop in a stack of 50–100 answer sheets. Each script is read and graded as a draft, then lined up in your review queue with suggested marks and the reasoning behind them."
          />
          <ul className="mt-8 space-y-3 text-white/75">
            {["Scan with a scanner or a phone camera", "Drafts are ready for review, script by script", "Nothing is final until you’ve reviewed it"].map((t) => (
              <li key={t} className="flex gap-3">
                <Icon name="checkCircle" size={20} className="mt-0.5 shrink-0 text-mint" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div data-reveal>
          <ProductVideo name="bulk-stack" label="Animation: a stack of answer sheets is scanned and each script appears in a review queue marked Needs review." />
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Teachers --------------------------------- */

const controls: { icon: IconName; title: string; body: string }[] = [
  { icon: "eye", title: "See the reasoning", body: "Every suggested mark comes with the extracted answer and rationale." },
  { icon: "pencil", title: "Change anything", body: "Edit marks, feedback and insights. Your judgement wins." },
  { icon: "checkCircle", title: "Approve what’s final", body: "Results become final only when you approve them." },
  { icon: "message", title: "Decide what parents see", body: "No message reaches a parent without your approval." },
];

export function V2Teachers() {
  return (
    <section id="teachers" aria-labelledby="v2-teachers-title" className="relative overflow-hidden border-y border-white/[0.07] bg-night-2 py-20 md:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-10 h-[460px] w-[460px] rounded-full bg-[radial-gradient(closest-side,rgb(240_165_58/0.12),transparent)]"
      />
      <div className="container-page relative">
        <Heading
          id="v2-teachers-title"
          eyebrow="Built for teachers"
          title={
            <>
              AI that supports teachers. <span className="text-accent">Not replaces them.</span>
            </>
          }
          intro="Paatam does the repetitive groundwork. The judgement — and the final say — stays with the teacher."
          center
        />
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {controls.map((c, i) => (
            <li key={c.title} className="night-card rounded-2xl p-6" data-reveal style={revealDelay(i * 70)}>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <Icon name={c.icon} size={22} />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-white">{c.title}</h3>
              <p className="mt-2 leading-relaxed text-white/60">{c.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* --------------------------------- Schools ---------------------------------- */

const roles: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "layers",
    title: "Coordinators",
    body: "Mapped to multiple classes and sections for each curriculum. Compare section performance, track trends and spot gaps shared across sections.",
  },
  {
    icon: "chart",
    title: "Head of School",
    body: "A clear dashboard of school and class performance, topics not being understood, sections scoring low and students who need assistance.",
  },
  {
    icon: "sparkPath",
    title: "Student analytics",
    body: "Every student’s performance across previous exams, subjects and concepts — easy for teachers and coordinators to follow.",
  },
  {
    icon: "message",
    title: "Parents on WhatsApp",
    body: "Scores and feedback after every exam, plus weekly and monthly updates — each sent only after teacher approval.",
  },
];

export function V2Schools() {
  return (
    <section id="schools" aria-labelledby="v2-schools-title" className="py-20 md:py-28">
      <div className="container-page">
        <Heading
          id="v2-schools-title"
          eyebrow="For schools"
          title="Built for the whole school — from the classroom to the principal’s office."
          intro="Built for Indian classrooms and starting in Andhra Pradesh, for schools serving Classes 5–10. Students keep writing by hand; everyone else gets the view they need."
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((r, i) => (
            <li key={r.title} className="night-card rounded-2xl p-6" data-reveal style={revealDelay(i * 70)}>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-mint/10 text-mint">
                <Icon name={r.icon} size={22} />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold text-white">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{r.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-white/60" data-reveal>
          <span className="font-semibold text-white">Pilot with us.</span> We’re inviting schools to shape Paatam with
          their teachers, coordinators and leadership.{" "}
          <a href="#contact" data-interest="pilot" className="font-semibold text-accent underline-offset-4 hover:underline">
            Partner with Paatam →
          </a>
        </p>
      </div>
    </section>
  );
}

/* --------------------------------- Contact ---------------------------------- */

export function V2Contact() {
  const configured = Boolean(process.env.CONTACT_WEBHOOK_URL?.trim());
  return (
    <section id="contact" aria-labelledby="v2-contact-title" className="relative overflow-hidden border-t border-white/[0.07] py-20 md:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-0 h-[500px] w-[700px] rounded-full bg-[radial-gradient(closest-side,rgb(45_212_191/0.12),transparent)]"
      />
      <div className="container-page relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <Eyebrow>Get in touch</Eyebrow>
          <h2 id="v2-contact-title" className="font-display text-4xl font-semibold leading-[1.06] tracking-tight text-white md:text-5xl">
            Let’s make every assessment count.
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/65">
            See the grading desk with sample scripts, or partner with us on a pilot at your school.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#contact-form" data-interest="pilot" className={buttonClasses("inverted", "lg")}>
              Partner with Paatam <Icon name="arrowRight" size={18} />
            </a>
            <a href="#contact-form" data-interest="demo" className={buttonClasses("outlineInverted", "lg")}>
              Request a demo
            </a>
          </div>
          {siteConfig.contactEmail && (
            <p className="mt-8 text-white/65">
              Or email{" "}
              <a className="font-semibold text-white underline-offset-4 hover:underline" href={`mailto:${siteConfig.contactEmail}`}>
                {siteConfig.contactEmail}
              </a>
            </p>
          )}
        </div>
        <ContactForm configured={configured} contactEmail={siteConfig.contactEmail} />
      </div>
    </section>
  );
}

export function V2Footer() {
  return (
    <footer className="border-t border-white/[0.07] bg-black text-white/55">
      <div className="container-page flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Logo inverted />
          <p className="mt-4 text-sm leading-relaxed">
            The AI grading desk for Indian schools — turning handwritten assessments into learning intelligence, with
            teachers always in control.
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-10 gap-y-2.5 text-sm">
            {v2Nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="hover:text-white">
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <Link href="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white">
                Terms of Service
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/[0.07]">
        <p className="container-page py-5 text-xs">© {new Date().getFullYear()} Paatam.ai. All rights reserved.</p>
      </div>
    </footer>
  );
}
