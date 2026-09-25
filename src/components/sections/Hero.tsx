import { ButtonLink } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { IllustrativeTag, StatusChip } from "../ui/StatusChip";
import { AnswerSheet } from "../visuals/AnswerSheet";

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden">
      {/* Soft paper texture band behind the visual — no glow, no gradients-for-their-own-sake. */}
      <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-[42%] bg-paper-deep lg:block" />

      <div className="container-page relative grid items-center gap-14 pb-20 pt-10 md:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pb-28 lg:pt-20">
        <div>
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-3.5 py-1.5 text-sm font-medium text-ink-soft">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />
            Turning Assessments into Learning Intelligence
          </p>
          <h1
            id="hero-title"
            className="font-display text-[2.6rem] font-semibold leading-[1.04] tracking-tight text-balance text-ink sm:text-6xl lg:text-[4.1rem]"
          >
            Every answer has a story.{" "}
            <span className="relative whitespace-nowrap text-primary">
              Let&rsquo;s understand it.
              <svg
                aria-hidden="true"
                viewBox="0 0 300 12"
                preserveAspectRatio="none"
                className="absolute -bottom-2 left-0 h-3 w-full text-accent"
              >
                <path d="M2 8c60-6 140-7 296-3" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted md:text-xl">
            Paatam transforms handwritten student assessments into meaningful learning insights — helping
            teachers identify learning gaps, guide every student, and keep parents connected.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#contact" data-interest="demo" size="lg">
              Request a School Demo
              <Icon name="arrowRight" size={18} />
            </ButtonLink>
            <ButtonLink href="#how-it-works" variant="secondary" size="lg">
              See How It Works
            </ButtonLink>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-ink-soft">
            {([
              { icon: "teacher", text: "Teachers approve every result" },
              { icon: "student", text: "Designed for Classes 5–10" },
              { icon: "mapPin", text: "Starting in Andhra Pradesh" },
            ] as const).map((item) => (
              <li key={item.text} className="inline-flex items-center gap-2">
                <Icon name={item.icon} size={18} className="text-primary" />
                {item.text}
              </li>
            ))}
          </ul>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
      <div className="relative sm:pr-16 lg:pr-20">
        <AnswerSheet showReadRegions activeQuestion={2} className="sm:-rotate-[1.5deg]" />
        <span className="absolute -top-3 left-4">
          <IllustrativeTag />
        </span>
      </div>

      {/* Transformation cue */}
      <div aria-hidden="true" className="relative z-10 -my-3 flex justify-center sm:justify-start sm:pl-[38%]">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-primary shadow-card">
          <Icon name="arrowDown" size={18} />
        </span>
      </div>

      <InsightCard />
    </div>
  );
}

function InsightCard() {
  return (
    <article
      aria-label="Illustrative teacher-reviewed assessment summary"
      className="relative rounded-xl border border-line bg-surface p-5 shadow-lift sm:ml-12 sm:p-6"
    >
      <ol className="mb-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-muted">
        {["Handwriting read", "Evaluated", "Teacher reviewed"].map((step, i) => (
          <li key={step} className="inline-flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true" className="h-px w-3 bg-line-strong" />}
            <Icon name="checkCircle" size={15} className="text-approved" />
            {step}
          </li>
        ))}
      </ol>

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-ink">Ananya Reddy</p>
          <p className="text-sm text-muted">Class 7 · Mathematics · Fractions</p>
        </div>
        <div className="text-right">
          <p className="font-display text-3xl font-semibold leading-none text-ink">
            6<span className="text-lg text-muted">/10</span>
          </p>
          <p className="mt-1 text-xs text-muted">Approved marks</p>
        </div>
      </div>

      <ul className="mt-5 space-y-2.5">
        <ConceptRow label="Equivalent fractions" status="Understood" tone="strength" value={100} />
        <ConceptRow label="Adding unlike denominators" status="Needs practice" tone="gap" value={25} />
      </ul>

      <p className="mt-5 rounded-lg bg-paper px-4 py-3 text-[0.95rem] leading-relaxed text-ink-soft">
        &ldquo;Understands equivalent fractions but needs additional practice adding fractions with unlike
        denominators.&rdquo;
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary"
          >
            KL
          </span>
          <p className="text-sm leading-tight">
            <span className="font-semibold text-ink">Ms. K. Lakshmi</span>
            <span className="block text-muted">Class teacher</span>
          </p>
        </div>
        <StatusChip status="approved" />
      </div>
    </article>
  );
}

export function ConceptRow({
  label,
  status,
  tone,
  value,
}: {
  label: string;
  status: string;
  tone: "strength" | "gap";
  value: number;
}) {
  const color = tone === "strength" ? "bg-approved" : "bg-gap";
  const text = tone === "strength" ? "text-approved" : "text-gap";
  return (
    <li>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-ink">{label}</span>
        <span className={`font-semibold ${text}`}>{status}</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-paper-deep" aria-hidden="true">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </li>
  );
}
