import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  labelledBy?: string;
  className?: string;
  children: ReactNode;
};

export function Section({ id, labelledBy, className = "", children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`py-20 md:py-28 ${className}`}>
      <div className="container-page">{children}</div>
    </section>
  );
}

type SectionHeadingProps = {
  id: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  tone?: "default" | "inverted";
};

export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  align = "left",
  tone = "default",
}: SectionHeadingProps) {
  const centered = align === "center";
  const inverted = tone === "inverted";
  return (
    <div className={`max-w-3xl ${centered ? "mx-auto text-center" : ""}`} data-reveal>
      <p
        className={`mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] ${
          inverted ? "text-accent" : "text-primary"
        }`}
      >
        <span aria-hidden="true" className="h-px w-6 bg-current" />
        {eyebrow}
      </p>
      <h2
        id={id}
        className={`font-display text-[2rem] font-semibold leading-[1.1] tracking-tight text-balance md:text-5xl ${
          inverted ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {intro ? (
        <p
          className={`mt-5 text-lg leading-relaxed text-pretty ${inverted ? "text-white/80" : "text-muted"}`}
        >
          {intro}
        </p>
      ) : null}
    </div>
  );
}
