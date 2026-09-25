"use client";

import { useMemo, useState } from "react";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { IllustrativeTag, StatusChip, type Status } from "../ui/StatusChip";
import { AnswerSheet } from "../visuals/AnswerSheet";

type Question = {
  id: number;
  prompt: string;
  max: number;
  suggested: number;
  extracted: string;
  rationale: string;
  concept: string;
  correct: boolean;
};

/** Fictional sample data. No real student records are used anywhere on this site. */
const questions: Question[] = [
  {
    id: 1,
    prompt: "Is 2/4 equal to 1/2? Explain.",
    max: 3,
    suggested: 3,
    extracted: "Yes. (2÷2)/(4÷2) = 1/2 so they are equal.",
    rationale: "Correct conclusion, supported by a valid simplification of 2/4.",
    concept: "Equivalent fractions",
    correct: true,
  },
  {
    id: 2,
    prompt: "Add: 2/3 + 1/4",
    max: 4,
    suggested: 0,
    extracted: "2/3 + 1/4 = (2+1)/(3+4) = 3/7",
    rationale:
      "Numerators and denominators were added separately. With a common denominator of 12, the answer is 8/12 + 3/12 = 11/12.",
    concept: "Adding unlike denominators",
    correct: false,
  },
  {
    id: 3,
    prompt: "Write two fractions equivalent to 3/5.",
    max: 3,
    suggested: 3,
    extracted: "6/10 , 9/15",
    rationale: "Both fractions are equivalent to 3/5 (multiplied by 2/2 and 3/3).",
    concept: "Equivalent fractions",
    correct: true,
  },
];

const DEFAULT_INSIGHT =
  "Understands equivalent fractions but needs additional practice adding fractions with unlike denominators.";

type QState = { marks: number; status: Status };

const initialState = (): Record<number, QState> =>
  Object.fromEntries(questions.map((q) => [q.id, { marks: q.suggested, status: "suggested" as Status }]));

export function ReviewDemo() {
  const [active, setActive] = useState(2);
  const [qState, setQState] = useState<Record<number, QState>>(initialState);
  const [insight, setInsight] = useState(DEFAULT_INSIGHT);
  const [draftInsight, setDraftInsight] = useState(DEFAULT_INSIGHT);
  const [editingInsight, setEditingInsight] = useState(false);
  const [finalised, setFinalised] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const question = questions.find((q) => q.id === active)!;
  const current = qState[active];
  const total = useMemo(() => Object.values(qState).reduce((sum, s) => sum + s.marks, 0), [qState]);
  const maxTotal = questions.reduce((sum, q) => sum + q.max, 0);
  const pending = questions.filter((q) => qState[q.id].status !== "approved").length;
  const insightEdited = insight !== DEFAULT_INSIGHT;

  const announce = (msg: string) => setAnnouncement(msg);

  const setMarks = (delta: number) => {
    const next = Math.min(question.max, Math.max(0, current.marks + delta));
    if (next === current.marks) return;
    setQState((s) => ({
      ...s,
      [active]: { marks: next, status: next === question.suggested ? "suggested" : "edited" },
    }));
    announce(`Question ${active} marks changed to ${next} of ${question.max}.`);
  };

  const approveQuestion = () => {
    setQState((s) => ({ ...s, [active]: { ...s[active], status: "approved" } }));
    announce(`Question ${active} approved with ${current.marks} of ${question.max} marks.`);
    const nextPending = questions.find((q) => q.id !== active && qState[q.id].status !== "approved");
    if (nextPending) setActive(nextPending.id);
  };

  const reopenQuestion = () => {
    setQState((s) => ({
      ...s,
      [active]: { ...s[active], status: s[active].marks === question.suggested ? "suggested" : "edited" },
    }));
    announce(`Question ${active} reopened for review.`);
  };

  const finalise = () => {
    setFinalised(true);
    announce(`Assessment approved. Final marks ${total} of ${maxTotal}. Feedback is ready to share.`);
  };

  const reset = () => {
    setQState(initialState());
    setInsight(DEFAULT_INSIGHT);
    setDraftInsight(DEFAULT_INSIGHT);
    setEditingInsight(false);
    setFinalised(false);
    setActive(2);
    announce("Demo reset to the original AI suggestions.");
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-line-strong bg-surface shadow-lift">
      {/* Window chrome */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-paper px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span aria-hidden="true" className="hidden gap-1.5 sm:flex">
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          </span>
          <p className="truncate text-sm text-muted">
            <span className="font-semibold text-ink">Review</span> · Class 7B · Mathematics · Unit Test: Fractions
          </p>
        </div>
        <IllustrativeTag />
      </div>

      <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
        {/* Left: the uploaded sheet */}
        <div className="border-b border-line bg-paper-deep/60 p-4 sm:p-6 lg:border-b-0 lg:border-r">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-ink">Ananya Reddy</p>
              <p className="text-sm text-muted">Class 7 · Roll no. 14</p>
            </div>
            <span className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-muted">
              Uploaded answer sheet
            </span>
          </div>
          <AnswerSheet showReadRegions activeQuestion={active} />
          <p className="mt-3 text-xs text-muted">Dashed outlines show the regions the system has read.</p>
        </div>

        {/* Right: review panel */}
        <div className="flex flex-col p-4 sm:p-6">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Choose a question to review">
            {questions.map((q) => {
              const s = qState[q.id].status;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setActive(q.id)}
                  aria-pressed={active === q.id}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                    active === q.id
                      ? "border-ink bg-ink text-white"
                      : "border-line-strong bg-surface text-ink-soft hover:border-ink"
                  }`}
                >
                  Q{q.id}
                  <span className="text-xs font-medium opacity-75">
                    {qState[q.id].marks}/{q.max}
                  </span>
                  {s === "approved" ? (
                    <Icon name="check" size={14} strokeWidth={2.6} className={active === q.id ? "text-accent" : "text-approved"} />
                  ) : null}
                  <span className="sr-only">{s === "approved" ? "(approved)" : "(needs review)"}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex-1 space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Question {question.id}</p>
              <p className="mt-1 font-medium text-ink">{question.prompt}</p>
            </div>

            <div className="rounded-lg border border-line bg-paper px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Extracted answer</p>
              <p className="mt-1 font-mono text-[0.95rem] text-ink">{question.extracted}</p>
            </div>

            <div
              className={`rounded-lg p-4 ${
                current.status === "approved"
                  ? "border border-approved/30 bg-approved-soft/60"
                  : current.status === "edited"
                    ? "border border-accent-strong/25 bg-accent-soft/50"
                    : "ai-suggested"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <StatusChip status={current.status} />
                <span className="text-xs font-medium text-muted">
                  AI suggested {question.suggested}/{question.max}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-ink-soft" id={`marks-label-${question.id}`}>
                    Marks
                  </span>
                  <div className="inline-flex items-center rounded-full border border-line-strong bg-surface" role="group" aria-labelledby={`marks-label-${question.id}`}>
                    <button
                      type="button"
                      onClick={() => setMarks(-1)}
                      disabled={finalised || current.status === "approved" || current.marks === 0}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-paper-deep disabled:opacity-35"
                      aria-label="Decrease marks"
                    >
                      <Icon name="minus" size={16} />
                    </button>
                    <output className="min-w-[3.5rem] text-center font-display text-lg font-semibold text-ink" aria-live="off">
                      {current.marks}
                      <span className="text-sm text-muted">/{question.max}</span>
                    </output>
                    <button
                      type="button"
                      onClick={() => setMarks(1)}
                      disabled={finalised || current.status === "approved" || current.marks === question.max}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-paper-deep disabled:opacity-35"
                      aria-label="Increase marks"
                    >
                      <Icon name="plus" size={16} />
                    </button>
                  </div>
                </div>
                {current.status === "approved" ? (
                  <Button variant="ghost" onClick={reopenQuestion} disabled={finalised} size="sm">
                    <Icon name="undo" size={16} /> Reopen
                  </Button>
                ) : (
                  <Button onClick={approveQuestion} disabled={finalised} size="sm">
                    <Icon name="check" size={16} strokeWidth={2.4} /> Approve Q{question.id}
                  </Button>
                )}
              </div>

              <div className="mt-4 border-t border-black/5 pt-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">Evaluation rationale</p>
                <p className="mt-1 text-[0.95rem] leading-relaxed text-ink-soft">{question.rationale}</p>
                <p className="mt-3 inline-flex items-center gap-1.5 text-sm">
                  <span className="text-muted">Concept:</span>
                  <span className={`font-semibold ${question.correct ? "text-approved" : "text-gap"}`}>
                    {question.concept}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Student summary */}
      <div className="grid gap-6 border-t border-line p-4 sm:p-6 md:grid-cols-3">
        <SummaryList
          title="Strengths"
          tone="approved"
          items={["Recognises and generates equivalent fractions", "Simplifies using a common factor"]}
        />
        <SummaryList
          title="Learning gaps"
          tone="gap"
          items={["Adds numerators and denominators directly when denominators differ"]}
        />
        <SummaryList
          title="Suggested improvement areas"
          tone="primary"
          items={["Practise finding a common denominator (LCM)", "Use fraction strips to model 2/3 + 1/4"]}
        />
      </div>

      <div className="border-t border-line bg-paper px-4 py-5 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            Learning insight for student &amp; parent
          </p>
          <StatusChip status={finalised ? "approved" : insightEdited ? "edited" : "suggested"} label={finalised ? "Teacher approved" : insightEdited ? "Edited by teacher" : "AI draft · needs review"} />
        </div>
        {editingInsight ? (
          <div className="mt-3">
            <textarea
              aria-label="Learning insight for student and parent"
              value={draftInsight}
              onChange={(e) => setDraftInsight(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-line-strong bg-surface p-3 text-[0.95rem] text-ink focus:border-primary focus:outline-none"
            />
            <div className="mt-2 flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  const trimmed = draftInsight.trim() || DEFAULT_INSIGHT;
                  setInsight(trimmed);
                  setDraftInsight(trimmed);
                  setEditingInsight(false);
                  announce("Insight updated by teacher.");
                }}
              >
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDraftInsight(insight);
                  setEditingInsight(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
            <p className="max-w-2xl text-[1.05rem] leading-relaxed text-ink">
              &ldquo;{insight}&rdquo;
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setEditingInsight(true)}
              disabled={finalised}
            >
              <Icon name="pencil" size={15} /> Edit
            </Button>
          </div>
        )}
      </div>

      {/* Final approval bar */}
      <div
        className={`flex flex-col gap-4 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 ${
          finalised ? "border-approved/30 bg-approved-soft" : "border-line bg-surface"
        }`}
      >
        <div className="flex items-center gap-4">
          <p className="font-display text-2xl font-semibold text-ink">
            {total}
            <span className="text-base text-muted">/{maxTotal}</span>
          </p>
          <p className="text-sm text-ink-soft">
            {finalised ? (
              <>
                <span className="font-semibold text-approved">Approved by Ms. K. Lakshmi.</span> Ready to share with
                Ananya and her parents.
              </>
            ) : pending > 0 ? (
              <>
                Review {pending} more question{pending > 1 ? "s" : ""} to approve this assessment.
              </>
            ) : (
              <>All questions reviewed. Approve to make results final.</>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={reset} size="sm">
            <Icon name="undo" size={16} /> Reset demo
          </Button>
          {!finalised && (
            <Button onClick={finalise} disabled={pending > 0 || editingInsight}>
              <Icon name="checkCircle" size={18} /> Approve assessment
            </Button>
          )}
        </div>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}

function SummaryList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "approved" | "gap" | "primary";
}) {
  const dot = { approved: "bg-approved", gap: "bg-gap", primary: "bg-primary" }[tone];
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">{title}</h4>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-[0.95rem] leading-snug text-ink-soft">
            <span aria-hidden="true" className={`mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
