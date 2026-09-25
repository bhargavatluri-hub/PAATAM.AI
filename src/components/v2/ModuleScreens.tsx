import type { ReactNode } from "react";
import { Icon, type IconName } from "../ui/Icon";

/*
 * Dark, enhanced renderings of the Paatam grading desk modules.
 * All names, marks and classes are fictional sample data.
 */

type Tone = "review" | "ok" | "ai" | "gap" | "mint";

const toneClass: Record<Tone, string> = {
  review: "border-accent/40 bg-accent/10 text-[#f7c46c]",
  ok: "border-[#7ee2a8]/40 bg-[#22c55e]/10 text-[#7ee2a8]",
  ai: "border-dashed border-periwinkle/50 bg-periwinkle/10 text-periwinkle",
  gap: "border-[#ff9f7a]/40 bg-[#ff7850]/10 text-[#ff9f7a]",
  mint: "border-mint/35 bg-mint/10 text-mint",
};

export function Pill({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[0.72rem] font-semibold ${toneClass[tone]}`}>
      {children}
    </span>
  );
}

function Panel({ title, action, children, className = "" }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={`min-w-0 rounded-xl border border-white/[0.08] bg-white/[0.025] p-4 ${className}`}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h4 className="text-sm font-semibold text-white">{title}</h4>
        {action}
      </div>
      {children}
    </div>
  );
}

function Bar({ value, tone = "mint" }: { value: number; tone?: "mint" | "gap" | "accent" }) {
  const color = { mint: "from-mint to-periwinkle", gap: "from-[#ff9f7a] to-[#f7c46c]", accent: "from-accent to-[#f7c46c]" }[tone];
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]" aria-hidden="true">
      <div className={`h-full rounded-full bg-gradient-to-r ${color}`} style={{ width: `${value}%` }} />
    </div>
  );
}

function Stat({ label, value, note, icon, accent }: { label: string; value: string; note: string; icon: IconName; accent: string }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-3.5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-white/50">{label}</p>
        <Icon name={icon} size={16} className={accent} />
      </div>
      <p className={`mt-2 font-display text-2xl font-semibold ${label === "Awaiting review" ? "text-[#f7c46c]" : "text-white"}`}>{value}</p>
      <p className="mt-0.5 text-[0.72rem] text-white/45">{note}</p>
    </div>
  );
}

/* ---------------------------------- Overview --------------------------------- */

const submissions = [
  { name: "Karthik Varma", meta: "Mid Term · Class 9A · Physics", score: "15/20", pct: "75%" },
  { name: "Sahithi Rao", meta: "Mid Term · Class 10A · English", score: "42/45", pct: "93%" },
  { name: "Imran Shaik", meta: "Mid Term · Class 10A · English", score: "37/45", pct: "82%" },
  { name: "Meghana Naidu", meta: "Unit Test · Class 7B · Maths", score: "6/10", pct: "60%" },
];

const agents = ["Vision", "OCR + Structure", "Answer Verification", "Subject Grading", "QA", "Teacher Review"];

export function OverviewScreen() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Stat label="Scripts scanned" value="64" note="Handwritten sheets ingested" icon="evaluate" accent="text-periwinkle" />
        <Stat label="Awaiting review" value="12" note="Pending teacher sign-off" icon="clock" accent="text-[#f7c46c]" />
        <Stat label="Class average" value="76%" note="Across verified tests" icon="sparkPath" accent="text-mint" />
        <Stat label="Time saved" value="~9 h" note="Estimated this week" icon="sparkles" accent="text-[#c4b5fd]" />
      </div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.35fr_1fr]">
        <div className="min-w-0 space-y-3">
          <Panel title="Subject performance" action={<Pill tone="mint">Knowledge base</Pill>}>
            <ul className="space-y-3 text-[0.8rem]">
              {[
                ["Mid Term · Physics", 75],
                ["Mid Term · English", 76],
                ["Unit Test · Fractions", 64],
              ].map(([label, v]) => (
                <li key={label as string}>
                  <div className="mb-1.5 flex justify-between text-white/80">
                    <span>{label}</span>
                    <span className="font-semibold text-mint">{v}% avg</span>
                  </div>
                  <Bar value={v as number} />
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Recent submissions" action={<span className="text-xs font-semibold text-white/60">View queue →</span>}>
            <ul className="divide-y divide-white/[0.06]">
              {submissions.map((s) => (
                <li key={s.name} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-[0.85rem] font-semibold text-white">{s.name}</p>
                    <p className="truncate text-[0.72rem] text-white/45">{s.meta}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2.5">
                    <span className="text-[0.85rem] font-semibold text-white">
                      {s.score} <span className="text-[0.7rem] font-normal text-white/45">({s.pct})</span>
                    </span>
                    <Pill tone="review">Needs review</Pill>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
        <Panel title="Agent pipeline" action={<Pill tone="ok">● 6 agents</Pill>}>
          <ol className="space-y-2">
            {agents.map((a, i) => {
              const teacher = i === agents.length - 1;
              return (
                <li
                  key={a}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 ${
                    teacher ? "border-accent/45 bg-accent/10" : "border-mint/20 bg-mint/[0.05]"
                  }`}
                >
                  <span
                    className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[0.7rem] font-bold ${
                      teacher ? "bg-accent text-night" : "bg-primary text-white"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="flex-1 text-[0.8rem] font-semibold text-white">{teacher ? a : `${a} Agent`}</span>
                  {teacher ? <Pill tone="review">Awaiting you</Pill> : <Icon name="check" size={15} strokeWidth={2.4} className="text-mint" />}
                </li>
              );
            })}
          </ol>
        </Panel>
      </div>
    </div>
  );
}

/* ---------------------------------- Classes ---------------------------------- */

const classes = [
  { name: "Class 7B", subject: "Mathematics", avg: 72, students: 38, waiting: 6 },
  { name: "Class 8A", subject: "Science", avg: 78, students: 41, waiting: 0 },
  { name: "Class 9A", subject: "Physics", avg: 75, students: 36, waiting: 4 },
  { name: "Class 10A", subject: "English", avg: 84, students: 40, waiting: 2 },
];

const concepts = [
  { name: "Equivalent fractions", secure: 86 },
  { name: "Simplifying fractions", secure: 74 },
  { name: "Adding unlike denominators", secure: 41 },
  { name: "Fractions on a number line", secure: 63 },
];

export function ClassesScreen() {
  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1.15fr]">
      <Panel title="Your classes">
        <ul className="space-y-2">
          {classes.map((c, i) => (
            <li
              key={c.name}
              className={`rounded-lg border p-3 ${i === 0 ? "border-mint/35 bg-mint/[0.06]" : "border-white/[0.07] bg-white/[0.02]"}`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[0.85rem] font-semibold text-white">
                  {c.name} <span className="font-normal text-white/50">· {c.subject}</span>
                </p>
                {c.waiting ? <Pill tone="review">{c.waiting} to review</Pill> : <Pill tone="ok">All reviewed</Pill>}
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex-1">
                  <Bar value={c.avg} />
                </div>
                <span className="text-[0.72rem] text-white/55">
                  {c.avg}% avg · {c.students} students
                </span>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title="Class 7B · Fractions · concept mastery" action={<Pill tone="ai">Draft insight</Pill>}>
        <ul className="space-y-3.5">
          {concepts.map((c) => (
            <li key={c.name}>
              <div className="mb-1.5 flex justify-between text-[0.8rem]">
                <span className="text-white/85">{c.name}</span>
                <span className={c.secure < 50 ? "font-semibold text-[#ff9f7a]" : "text-white/60"}>{c.secure}% secure</span>
              </div>
              <Bar value={c.secure} tone={c.secure < 50 ? "gap" : "mint"} />
            </li>
          ))}
        </ul>
        <div className="mt-4 rounded-lg border border-[#ff9f7a]/25 bg-[#ff7850]/[0.07] p-3 text-[0.8rem] leading-relaxed text-white/80">
          <span className="font-semibold text-[#ff9f7a]">Class pattern:</span> 22 of 38 students added numerators and
          denominators directly. Suggested: a 10-minute recap on common denominators.
        </div>
      </Panel>
    </div>
  );
}

/* ------------------------------- Knowledge base ------------------------------ */

const kb = [
  { exam: "Unit Test · Fractions", cls: "Class 7", key: true, rubric: true },
  { exam: "Mid Term · Physics", cls: "Class 9", key: true, rubric: true },
  { exam: "Mid Term · English", cls: "Class 10", key: true, rubric: false },
  { exam: "Homework · Friction", cls: "Class 8", key: false, rubric: true },
];

export function KnowledgeBaseScreen() {
  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.1fr_1fr]">
      <Panel title="Answer keys & rubrics" action={<span className="text-xs font-semibold text-white/60">+ Upload</span>}>
        <ul className="divide-y divide-white/[0.06]">
          {kb.map((k) => (
            <li key={k.exam} className="flex items-center justify-between gap-3 py-2.5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-periwinkle">
                  <Icon name="book" size={16} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[0.85rem] font-semibold text-white">{k.exam}</p>
                  <p className="text-[0.72rem] text-white/45">{k.cls}</p>
                </div>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <Pill tone={k.key ? "ok" : "gap"}>{k.key ? "✓" : "!"} Key</Pill>
                <Pill tone={k.rubric ? "ok" : "gap"}>{k.rubric ? "✓" : "!"} Rubric</Pill>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title="Rubric · Q2 · Add 2/3 + 1/4" action={<Pill tone="mint">4 marks</Pill>}>
        <ol className="space-y-2 text-[0.8rem]">
          {[
            ["1", "Finds a common denominator (12)"],
            ["2", "Converts both fractions: 8/12 and 3/12"],
            ["1", "Correct final answer: 11/12"],
          ].map(([m, text]) => (
            <li key={text} className="flex gap-3 rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
              <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-md bg-primary px-1.5 text-[0.7rem] font-bold text-white">
                {m}
              </span>
              <span className="text-white/80">{text}</span>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-[0.75rem] leading-relaxed text-white/50">
          The Subject Grading Agent marks against your key and rubric, so suggestions follow your school’s marking
          scheme.
        </p>
      </Panel>
    </div>
  );
}

/* ------------------------------- Exam generator ------------------------------ */

export function ExamGeneratorScreen() {
  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[0.8fr_1.2fr]">
      <Panel title="Paper settings">
        <dl className="space-y-3 text-[0.8rem]">
          {[
            ["Class & subject", "Class 8 · Science"],
            ["Chapters", "Force & Pressure, Friction"],
            ["Total marks", "40 marks · 90 minutes"],
            ["Question mix", "MCQ · Short answer · Long answer"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white/45">{k}</dt>
              <dd className="mt-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-white/85">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-3">
          <p className="mb-1.5 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white/45">Difficulty</p>
          <div className="flex h-2 overflow-hidden rounded-full" aria-hidden="true">
            <span className="w-[40%] bg-mint" />
            <span className="w-[40%] bg-periwinkle" />
            <span className="w-[20%] bg-accent" />
          </div>
          <p className="mt-1.5 text-[0.7rem] text-white/45">40% easy · 40% medium · 20% challenging</p>
        </div>
      </Panel>
      <Panel title="Generated paper · draft" action={<Pill tone="ai">Draft · teacher edits</Pill>}>
        <div className="rounded-lg bg-[#fffdf8] p-4 text-[0.78rem] leading-relaxed text-[#1f2a37]">
          <p className="text-center font-display text-[0.95rem] font-semibold">Mid Term Examination · Science · Class 8</p>
          <p className="mb-3 text-center text-[0.7rem] text-[#55656b]">Max. marks 40 · Time 90 minutes</p>
          <p className="font-semibold">Section A · Multiple choice (1 × 8)</p>
          <p className="mt-1">1. Friction always acts ______ to the direction of motion.</p>
          <p className="mt-2 font-semibold">Section B · Short answer (3 × 4)</p>
          <p className="mt-1">9. Why are the soles of sports shoes grooved? Explain with one example.</p>
          <p className="mt-2 font-semibold">Section C · Long answer (5 × 4)</p>
          <p className="mt-1">13. A brick exerts different pressures when placed on different faces. Explain why.</p>
        </div>
        <p className="mt-3 text-[0.75rem] text-white/50">A starting draft: teachers edit, reorder and approve every question before the paper is used.</p>
      </Panel>
    </div>
  );
}

/* ------------------------------- Student portal ------------------------------ */

export function StudentPortalScreen() {
  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1fr]">
      <Panel title="Hi Ananya 👋 · Unit Test · Fractions" action={<Pill tone="ok">✓ Teacher approved</Pill>}>
        <div className="flex items-end justify-between">
          <p className="font-display text-4xl font-semibold text-white">
            6<span className="text-lg text-white/45">/10</span>
          </p>
          <p className="text-right text-[0.72rem] text-white/45">Reviewed by Ms. K. Lakshmi</p>
        </div>
        <ul className="mt-4 space-y-2 text-[0.8rem]">
          {[
            ["Q1", "3/3", "Great reasoning — you simplified 2/4 correctly.", "ok"],
            ["Q2", "0/4", "Find a common denominator first: 8/12 + 3/12 = 11/12.", "gap"],
            ["Q3", "3/3", "Both fractions are equivalent to 3/5. Well done!", "ok"],
          ].map(([q, m, text, tone]) => (
            <li key={q} className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-semibold text-white">{q}</span>
                <Pill tone={tone as Tone}>{m}</Pill>
              </div>
              <p className="text-white/70">{text}</p>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title="Practise next">
        <ul className="space-y-2">
          {[
            ["Adding fractions with different denominators", "From your teacher’s feedback on Q2"],
            ["Finding the LCM of two numbers", "Helps you find common denominators"],
          ].map(([t, d]) => (
            <li key={t} className="flex items-center gap-3 rounded-lg border border-mint/25 bg-mint/[0.05] p-3">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-mint/15 text-mint">
                <Icon name="student" size={17} />
              </span>
              <div>
                <p className="text-[0.82rem] font-semibold text-white">{t}</p>
                <p className="text-[0.72rem] text-white/50">{d}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <p className="mb-2 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white/45">Your recent assessments</p>
          <div className="flex items-end gap-1.5" aria-hidden="true">
            {[40, 55, 48, 62, 60].map((h, i) => (
              <span key={i} className="w-full rounded-t bg-gradient-to-t from-primary to-mint" style={{ height: `${h}px` }} />
            ))}
          </div>
          <p className="mt-2 text-[0.72rem] text-white/45">Mathematics · last five assessments</p>
        </div>
      </Panel>
    </div>
  );
}

/* ------------------------------- Parent WhatsApp ----------------------------- */

export function ParentWhatsAppScreen() {
  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_0.9fr]">
      <Panel title="Parent updates">
        <ul className="divide-y divide-white/[0.06]">
          {[
            ["Ananya Reddy", "Class 7B · Fractions", "sent"],
            ["Karthik Varma", "Class 9A · Physics", "sent"],
            ["Meghana Naidu", "Class 7B · Fractions", "waiting"],
            ["Imran Shaik", "Class 10A · English", "waiting"],
          ].map(([n, m, s]) => (
            <li key={n} className="flex items-center justify-between gap-3 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-[0.85rem] font-semibold text-white">{n}</p>
                <p className="text-[0.72rem] text-white/45">{m}</p>
              </div>
              {s === "sent" ? <Pill tone="ok">✓ Approved · sent</Pill> : <Pill tone="review">Awaiting approval</Pill>}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[0.75rem] text-white/50">Messages are drafted automatically and only sent after the teacher approves.</p>
      </Panel>
      <div className="min-w-0 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0b141a]">
        <div className="flex items-center gap-3 bg-primary-strong px-4 py-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-[0.7rem] font-bold text-white">KL</span>
          <div className="leading-tight">
            <p className="text-[0.82rem] font-semibold text-white">Ms. K. Lakshmi · Class 7B</p>
            <p className="text-[0.68rem] text-white/60">WhatsApp · to Ananya’s parent</p>
          </div>
        </div>
        <div className="space-y-2 p-4">
          <div className="max-w-[92%] rounded-xl rounded-tl-sm bg-[#1f2c34] px-3.5 py-2.5 text-[0.8rem] leading-relaxed text-white/90">
            <p>Namaste! Ananya scored 6/10 in the fractions unit test.</p>
            <p className="mt-1.5">
              <span className="font-semibold text-mint">Doing well:</span> equivalent fractions.
            </p>
            <p className="mt-1.5">
              <span className="font-semibold text-[#f7c46c]">Practise at home:</span> adding fractions with different
              denominators — ask her to explain 1/2 + 1/3.
            </p>
            <p className="mt-1.5 text-right text-[0.65rem] text-white/45">✓ Approved by class teacher</p>
          </div>
        </div>
      </div>
    </div>
  );
}
