import type { ReactNode } from "react";

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
};

/** The opening band of every inner page: eyebrow, the page's only <h1>, and a short intro. */
export function PageHero({ eyebrow, title, intro, children }: PageHeroProps) {
  return (
    <section className="ruled-lines border-b border-line">
      <div className="container-page pb-14 pt-14 md:pb-20 md:pt-20">
        <p className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-primary">
          <span aria-hidden="true" className="h-px w-6 bg-current" />
          {eyebrow}
        </p>
        <h1 className="max-w-4xl font-display text-[2.4rem] font-semibold leading-[1.05] tracking-tight text-balance text-ink md:text-6xl">
          {title}
        </h1>
        {intro ? <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-muted md:text-xl">{intro}</p> : null}
        {children}
      </div>
    </section>
  );
}
