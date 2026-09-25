import type { ReactNode } from "react";

/** A handwritten stacked fraction. */
export function Frac({ n, d, className = "" }: { n: ReactNode; d: ReactNode; className?: string }) {
  return (
    <span className={`mx-0.5 inline-flex flex-col items-center align-middle leading-none ${className}`}>
      <span className="px-0.5">{n}</span>
      <span className="my-[2px] h-[1.5px] w-full rounded bg-current" aria-hidden="true" />
      <span className="px-0.5">{d}</span>
    </span>
  );
}

type AnswerSheetProps = {
  /** Highlights which answer regions the system has read. */
  showReadRegions?: boolean;
  /** Question number to emphasise (e.g. the one currently being reviewed). */
  activeQuestion?: number;
  className?: string;
};

/**
 * A fictional handwritten Class 7 fractions answer sheet, drawn in HTML so it
 * stays crisp, lightweight and clearly illustrative.
 */
export function AnswerSheet({ showReadRegions = false, activeQuestion, className = "" }: AnswerSheetProps) {
  const region = (q: number) =>
    showReadRegions
      ? `rounded-md outline-offset-4 transition-[outline-color,background-color] duration-300 ${
          activeQuestion === q
            ? "outline-2 outline-dashed outline-ai bg-ai-soft/60"
            : "outline-1 outline-dashed outline-ai/35"
        }`
      : "";

  return (
    <figure
      className={`ruled-paper relative overflow-hidden rounded-lg border border-line shadow-card ${className}`}
      aria-label="Illustrative handwritten answer sheet for a Class 7 fractions assessment"
    >
      <div className="relative pb-6 pl-14 pr-5 pt-4 font-hand text-[1.05rem] leading-8 text-[#1f3a6b]">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 text-[0.95rem]">
          <span>
            Name: <span className="font-bold">Ananya Reddy</span>
          </span>
          <span>Class: 7 &nbsp; Sec: B</span>
        </div>
        <p className="text-[0.95rem]">Unit Test — Fractions</p>

        <ol className="mt-2 space-y-2">
          <li>
            <p className="text-ink-soft/80">Q1. Is <Frac n="2" d="4" /> equal to <Frac n="1" d="2" />? Explain.</p>
            <p className={`inline-block ${region(1)}`}>
              Yes. <Frac n="2÷2" d="4÷2" /> = <Frac n="1" d="2" /> so they are equal.
            </p>
          </li>
          <li>
            <p className="text-ink-soft/80">Q2. Add: <Frac n="2" d="3" /> + <Frac n="1" d="4" /></p>
            <p className={`inline-block ${region(2)}`}>
              <Frac n="2" d="3" /> + <Frac n="1" d="4" /> = <Frac n="2+1" d="3+4" /> = <Frac n="3" d="7" />
            </p>
          </li>
          <li>
            <p className="text-ink-soft/80">Q3. Write two fractions equivalent to <Frac n="3" d="5" />.</p>
            <p className={`inline-block ${region(3)}`}>
              <Frac n="6" d="10" /> , <Frac n="9" d="15" />
            </p>
          </li>
        </ol>
      </div>
    </figure>
  );
}
