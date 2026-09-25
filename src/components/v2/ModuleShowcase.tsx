"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { LogoMark } from "../ui/Logo";
import { Icon, type IconName } from "../ui/Icon";
import {
  ClassesScreen,
  ExamGeneratorScreen,
  KnowledgeBaseScreen,
  OverviewScreen,
  ParentWhatsAppScreen,
  StudentPortalScreen,
} from "./ModuleScreens";

type Module = {
  id: string;
  label: string;
  icon: IconName;
  group: "desk" | "portals";
  title: string;
  subtitle: string;
  summary: string;
  points: string[];
  screen: ReactNode;
};

const modules: Module[] = [
  {
    id: "overview",
    label: "Overview",
    icon: "grid",
    group: "desk",
    title: "Grading command centre",
    subtitle: "Multi-agent marking for handwritten tests, homework and exams",
    summary: "Everything waiting for you, in one view: what’s been scanned, what needs your sign-off, and how each subject is going.",
    points: ["Scan one script or a bulk stack of 50–100", "Live six-agent pipeline status", "Review queue with suggested marks"],
    screen: <OverviewScreen />,
  },
  {
    id: "classes",
    label: "Classes",
    icon: "layers",
    group: "desk",
    title: "Classes",
    subtitle: "Every section, subject and student at a glance",
    summary: "See each class’s progress and the concepts a whole section is struggling with, so you can plan the next lesson around them.",
    points: ["Class and subject averages", "Concept-level mastery per class", "Patterns across the whole section"],
    screen: <ClassesScreen />,
  },
  {
    id: "knowledge-base",
    label: "Knowledge Base",
    icon: "book",
    group: "desk",
    title: "Knowledge Base",
    subtitle: "Your answer keys and rubrics, used for every evaluation",
    summary: "Upload answer keys and marking rubrics once. Paatam evaluates against your school’s scheme, not a generic one.",
    points: ["Answer keys per assessment", "Step-wise marking rubrics", "Consistent marking across sections"],
    screen: <KnowledgeBaseScreen />,
  },
  {
    id: "exam-generator",
    label: "Exam Generator",
    icon: "sparkles",
    group: "desk",
    title: "Exam Generator",
    subtitle: "Draft question papers from your syllabus",
    summary: "Pick the class, chapters, marks and difficulty mix to get a draft paper that you edit and approve.",
    points: ["Chapter and marks-aware drafts", "Balanced difficulty mix", "Teacher edits before use"],
    screen: <ExamGeneratorScreen />,
  },
  {
    id: "student-portal",
    label: "Student Portal",
    icon: "student",
    group: "portals",
    title: "Student Portal",
    subtitle: "Feedback students can understand and act on",
    summary: "Students see teacher-approved marks, question-by-question feedback and what to practise next — not just a score.",
    points: ["Question-level feedback", "Clear next steps", "Only teacher-approved results"],
    screen: <StudentPortalScreen />,
  },
  {
    id: "parent-whatsapp",
    label: "Parent WhatsApp",
    icon: "message",
    group: "portals",
    title: "Parent WhatsApp",
    subtitle: "Teacher-approved updates, where parents already are",
    summary: "Short, understandable progress updates are drafted for every parent and sent on WhatsApp only after the teacher approves.",
    points: ["Drafted automatically", "Sent only after approval", "Practical tips for home"],
    screen: <ParentWhatsAppScreen />,
  },
];

export function ModuleShowcase() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = modules[active];

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let next: number | null = null;
    if (event.key in keys) next = (active + keys[event.key] + modules.length) % modules.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = modules.length - 1;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const tab = (m: Module, i: number) => (
    <button
      key={m.id}
      ref={(el) => {
        tabRefs.current[i] = el;
      }}
      id={`module-tab-${m.id}`}
      role="tab"
      type="button"
      aria-selected={active === i}
      aria-controls={`module-panel-${m.id}`}
      tabIndex={active === i ? 0 : -1}
      onClick={() => setActive(i)}
      className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors lg:w-full ${
        active === i ? "bg-white/[0.08] text-white shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08)]" : "text-white/55 hover:bg-white/[0.04] hover:text-white/85"
      }`}
    >
      <Icon name={m.icon} size={18} className={active === i ? "text-mint" : ""} />
      {m.label}
    </button>
  );

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-night-2 shadow-[0_60px_140px_-60px_rgb(0_0_0/0.95)] lg:grid lg:grid-cols-[232px_1fr]">
        {/* Sidebar / tab list */}
        <div className="border-b border-white/[0.07] bg-black/30 lg:flex lg:flex-col lg:border-b-0 lg:border-r">
          <div className="hidden items-center gap-3 border-b border-white/[0.07] px-5 py-5 lg:flex">
            <LogoMark className="h-9 w-9" />
            <div className="leading-tight">
              <p className="text-sm font-bold tracking-wide text-white">PAATAM.AI</p>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white/45">AI grading desk</p>
            </div>
          </div>
          <div
            role="tablist"
            aria-label="Paatam product modules"
            aria-orientation="vertical"
            onKeyDown={onKeyDown}
            className="flex gap-1 overflow-x-auto p-2 [scrollbar-width:none] lg:flex-1 lg:flex-col lg:overflow-visible lg:p-3"
          >
            {modules.filter((m) => m.group === "desk").map((m) => tab(m, modules.indexOf(m)))}
            <p aria-hidden="true" className="hidden px-3 pb-1 pt-4 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-white/50 lg:block">
              Portals &amp; extras
            </p>
            {modules.filter((m) => m.group === "portals").map((m) => tab(m, modules.indexOf(m)))}
          </div>
          <p className="hidden items-center gap-2 border-t border-white/[0.07] px-5 py-4 text-xs text-white/50 lg:flex">
            <span className="h-2 w-2 rounded-full bg-[#4ade80] shadow-[0_0_10px_#4ade80]" aria-hidden="true" />
            6 agents online
          </p>
        </div>

        {/* Screen */}
        <div
          id={`module-panel-${current.id}`}
          role="tabpanel"
          aria-labelledby={`module-tab-${current.id}`}
          tabIndex={0}
          className="min-w-0 focus-visible:outline-offset-[-3px]"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-4 sm:px-6">
            <div className="min-w-0">
              <h3 className="font-display text-xl font-semibold text-white">{current.title}</h3>
              <p className="text-sm text-white/50">{current.subtitle}</p>
            </div>
            {current.id === "overview" && (
              <div className="flex gap-2" aria-hidden="true">
                <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/85">
                  <Icon name="stack" size={15} /> Bulk Stack (50–100)
                </span>
                <span className="inline-flex items-center gap-2 rounded-lg bg-[#2563eb] px-3 py-2 text-xs font-semibold text-white">
                  <Icon name="scan" size={15} /> Scan a script
                </span>
              </div>
            )}
          </div>
          <div key={current.id} className="p-3 motion-safe:animate-[fadeIn_.35s_ease] sm:p-5">
            {current.screen}
          </div>
        </div>
      </div>

      {/* Module summary */}
      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_1fr] md:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-mint">{current.label}</p>
          <p className="mt-2 text-lg leading-relaxed text-white/75">{current.summary}</p>
        </div>
        <ul className="grid gap-2 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
          {current.points.map((pt) => (
            <li key={pt} className="flex gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 text-sm text-white/80">
              <Icon name="check" size={16} strokeWidth={2.4} className="mt-0.5 shrink-0 text-mint" />
              {pt}
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-6 text-xs text-white/55">
        Product screens are enhanced, illustrative renderings with fictional students, teachers and marks.
      </p>
    </div>
  );
}
