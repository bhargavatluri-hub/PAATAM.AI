"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Icon, type IconName } from "../ui/Icon";
import { Pill } from "./ModuleScreens";

type Stage = {
  id: string;
  role: string;
  icon: IconName;
  headline: string;
  body: string;
  points: string[];
  visual: ReactNode;
};

const INTERVAL_MS = 7000;

/* Small illustrative visuals for each stage (fictional data). */

function Card({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-white/10 bg-night-2 p-5 shadow-[0_30px_80px_-40px_rgb(0_0_0/0.9)]">{children}</div>;
}

const stages: Stage[] = [
  {
    id: "student",
    role: "Student",
    icon: "student",
    headline: "Students write, just as they do today.",
    body: "Tests, homework and exams stay on paper. Completed answer sheets are scanned one by one or as a bulk stack.",
    points: ["Handwritten answers", "Scanned or photographed", "Bulk stacks of 50–100"],
    visual: (
      <Card>
        <div className="ruled-paper rounded-lg px-5 pb-3 pl-14 pt-3 font-hand text-[1.02rem] leading-8 text-[#1f3a6b]">
          <p>
            Name: <b>Ananya Reddy</b> · Class 7B
          </p>
          <p>Q2. 2/3 + 1/4 = 3/7</p>
          <p>Q3. 6/10 , 9/15</p>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="inline-flex items-center gap-2 text-white/70">
            <Icon name="scan" size={16} className="text-mint" /> Scanned
          </span>
          <Pill tone="mint">64 scripts · Class 7B</Pill>
        </div>
      </Card>
    ),
  },
  {
    id: "teacher",
    role: "Teacher",
    icon: "teacher",
    headline: "Teachers review, edit and approve.",
    body: "Six AI agents draft marks, feedback and learning gaps. The teacher checks each script and decides what is final.",
    points: ["AI-drafted marks with reasons", "Edit anything", "Nothing final without approval"],
    visual: (
      <Card>
        <ul className="space-y-2 text-sm">
          {[
            ["Q1 · Equivalent fractions", "3/3"],
            ["Q2 · Unlike denominators", "0/4"],
            ["Q3 · Equivalent fractions", "3/3"],
          ].map(([q, m]) => (
            <li key={q} className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2.5">
              <span className="text-white/85">{q}</span>
              <Pill tone="ai">AI {m}</Pill>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-display text-2xl font-semibold text-white">
            6<span className="text-base text-white/45">/10</span>
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-approved px-4 py-2 text-sm font-semibold text-white">
            <Icon name="check" size={15} strokeWidth={2.6} /> Approved by Ms. K. Lakshmi
          </span>
        </div>
      </Card>
    ),
  },
  {
    id: "coordinator",
    role: "Coordinator",
    icon: "layers",
    headline: "Coordinators compare classes and sections.",
    body: "Each coordinator is mapped to multiple classes and sections, per curriculum. They spot sections falling behind and gaps shared across sections.",
    points: ["Mapped by curriculum", "Section-by-section trends", "Common gaps across sections"],
    visual: (
      <Card>
        <p className="mb-3 text-xs font-semibold text-white/55">CBSE · Mathematics · Classes 6–8</p>
        <ul className="space-y-2.5 text-sm">
          {[
            ["7A", 71, false],
            ["7B", 72, false],
            ["7C", 58, true],
          ].map(([sec, v, low]) => (
            <li key={sec as string}>
              <div className="mb-1 flex justify-between">
                <span className="text-white/85">Class {sec}</span>
                <span className={low ? "font-semibold text-[#ff9f7a]" : "text-white/60"}>
                  {v}% {low && "· below target"}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]" aria-hidden="true">
                <div className={`h-full rounded-full ${low ? "bg-[#ff9f7a]" : "bg-mint"}`} style={{ width: `${v}%` }} />
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-white/60">Common gap: adding unlike denominators · 5 of 9 sections</p>
      </Card>
    ),
  },
  {
    id: "head-of-school",
    role: "Head of School",
    icon: "chart",
    headline: "Principals see the whole school at a glance.",
    body: "School and class performance, topics that aren’t being understood, sections scoring low and students who need assistance — in one dashboard.",
    points: ["School-wide performance", "Weak topics by class", "Students needing help"],
    visual: (
      <Card>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            ["74%", "School avg"],
            ["3", "Low sections"],
            ["41", "Need help"],
          ].map(([v, l]) => (
            <div key={l} className="rounded-lg border border-white/[0.07] bg-white/[0.02] py-2.5">
              <p className="font-display text-xl font-semibold text-white">{v}</p>
              <p className="text-[0.68rem] text-white/50">{l}</p>
            </div>
          ))}
        </div>
        <p className="mb-2 mt-4 text-xs font-semibold text-white/55">Topic mastery · % secure</p>
        <div className="grid grid-cols-4 gap-1 text-center text-xs font-semibold">
          {[81, 46, 78, 84, 72, 64, 58, 69].map((v, i) => (
            <span
              key={i}
              className={`rounded py-1.5 ${v < 60 ? "text-[#ffb89e] ring-1 ring-inset ring-[#ff9f7a]/60" : "text-white"}`}
              style={{ backgroundColor: `rgb(94 234 212 / ${Math.min(0.6, 0.08 + ((v - 40) / 50) * 0.5).toFixed(2)})` }}
            >
              {v}
              {v < 60 && "!"}
            </span>
          ))}
        </div>
      </Card>
    ),
  },
  {
    id: "parent",
    role: "Parent",
    icon: "parent",
    headline: "Parents stay informed on WhatsApp.",
    body: "Scores and feedback after every exam, plus weekly summaries and monthly reports — each sent only after the teacher approves it.",
    points: ["After every exam", "Weekly and monthly", "Teacher-approved only"],
    visual: (
      <Card>
        <div className="space-y-2 text-sm leading-relaxed text-white/90">
          {[
            ["Exam result", "Fractions test: 6/10. Practise adding fractions with different denominators."],
            ["Weekly", "Maths is improving this week — up 8 points."],
            ["Monthly", "September average 72% (↑ from 64%)."],
          ].map(([t, m]) => (
            <div key={t} className="rounded-xl rounded-tl-sm bg-[#1f2c34] px-3.5 py-2.5">
              <p className="text-[0.66rem] font-bold uppercase tracking-[0.12em] text-mint">{t}</p>
              <p>{m}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-right text-xs text-white/50">✓ Approved by class teacher</p>
      </Card>
    ),
  },
];

export function LifecycleCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [cycle, setCycle] = useState(0); // restarts the progress bar animation
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const running = !paused && !hovering && !reduced;

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => {
      setActive((a) => (a + 1) % stages.length);
      setCycle((c) => c + 1);
    }, INTERVAL_MS);
    return () => window.clearTimeout(id);
  }, [running, active, cycle]);

  const go = (i: number) => {
    setActive(i);
    setCycle((c) => c + 1);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = (active + step + stages.length) % stages.length;
    go(next);
    tabRefs.current[next]?.focus();
  };

  const stage = stages[active];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="The Paatam learning lifecycle"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocusCapture={() => setHovering(true)}
      onBlurCapture={() => setHovering(false)}
    >
      {/* Step rail */}
      <div className="flex items-center gap-3">
        <div role="tablist" aria-label="Lifecycle stages" onKeyDown={onKeyDown} className="relative grid flex-1 grid-cols-5 gap-1.5 sm:gap-3">
          {stages.map((s, i) => {
            const done = i < active;
            const current = i === active;
            return (
              <button
                key={s.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                type="button"
                id={`lifecycle-tab-${s.id}`}
                aria-selected={current}
                aria-controls="lifecycle-panel"
                tabIndex={current ? 0 : -1}
                onClick={() => go(i)}
                className="group text-left"
              >
                <span className="relative block h-1 overflow-hidden rounded-full bg-white/10">
                  <span
                    key={current ? `${cycle}-${running}` : "static"}
                    className={`absolute inset-y-0 left-0 rounded-full ${current ? "bg-accent" : "bg-mint"}`}
                    style={
                      current
                        ? running
                          ? { width: "100%", animation: `lifecycleProgress ${INTERVAL_MS}ms linear` }
                          : { width: "100%" }
                        : { width: done ? "100%" : "0%" }
                    }
                  />
                </span>
                <span className="mt-3 flex items-center gap-2">
                  <span
                    className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      current ? "border-accent bg-accent text-night" : done ? "border-mint/50 bg-mint/10 text-mint" : "border-white/15 text-white/55"
                    }`}
                  >
                    <Icon name={s.icon} size={16} />
                  </span>
                  <span className={`sr-only text-sm font-semibold md:not-sr-only ${current ? "text-white" : "text-white/55 group-hover:text-white/80"}`}>
                    {s.role}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "Play lifecycle slideshow" : "Pause lifecycle slideshow"}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center self-end rounded-full border border-white/15 text-white hover:bg-white/10"
          hidden={reduced}
        >
          <Icon name={paused ? "play" : "pause"} size={15} />
        </button>
      </div>

      {/* Slide */}
      <div
        id="lifecycle-panel"
        role="tabpanel"
        aria-roledescription="slide"
        aria-labelledby={`lifecycle-tab-${stage.id}`}
        aria-live={running ? "off" : "polite"}
        className="mt-10 grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16"
      >
        <div key={`text-${stage.id}`} className="motion-safe:animate-[fadeIn_.45s_ease]">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
            {active + 1} / {stages.length} · {stage.role}
          </p>
          <h3 className="mt-3 font-display text-3xl font-semibold leading-tight text-white md:text-4xl">{stage.headline}</h3>
          <p className="mt-4 text-lg leading-relaxed text-white/65">{stage.body}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {stage.points.map((pt) => (
              <li key={pt} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-sm text-white/80">
                <Icon name="check" size={14} strokeWidth={2.4} className="text-mint" />
                {pt}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex gap-2">
            <button
              type="button"
              onClick={() => go((active - 1 + stages.length) % stages.length)}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-white/15 px-4 text-sm font-semibold text-white hover:bg-white/10"
            >
              <Icon name="arrowRight" size={16} className="rotate-180" /> Previous
            </button>
            <button
              type="button"
              onClick={() => go((active + 1) % stages.length)}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-white/15 px-4 text-sm font-semibold text-white hover:bg-white/10"
            >
              Next <Icon name="arrowRight" size={16} />
            </button>
          </div>
        </div>
        <div key={`visual-${stage.id}`} className="motion-safe:animate-[fadeIn_.45s_ease]" aria-hidden="true">
          {stage.visual}
        </div>
      </div>
    </div>
  );
}
