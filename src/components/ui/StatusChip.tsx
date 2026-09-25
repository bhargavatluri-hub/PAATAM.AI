import { Icon } from "./Icon";

export type Status = "suggested" | "approved" | "edited";

const styles: Record<Status, { label: string; className: string }> = {
  suggested: {
    label: "AI suggestion · needs review",
    className: "border border-dashed border-ai/50 bg-ai-soft text-ai",
  },
  edited: {
    label: "Edited by teacher",
    className: "border border-accent-strong/30 bg-accent-soft text-accent-strong",
  },
  approved: {
    label: "Teacher approved",
    className: "border border-approved/25 bg-approved-soft text-approved",
  },
};

export function StatusChip({ status, label }: { status: Status; label?: string }) {
  const s = styles[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${s.className}`}
    >
      {status === "approved" ? (
        <Icon name="check" size={13} strokeWidth={2.5} />
      ) : status === "edited" ? (
        <Icon name="pencil" size={12} strokeWidth={2.2} />
      ) : (
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      )}
      {label ?? s.label}
    </span>
  );
}

/** Small label used on every mock-up so illustrative data is never mistaken for real records. */
export function IllustrativeTag({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-ink/80 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-white ${className}`}
    >
      <Icon name="eye" size={12} strokeWidth={2} />
      Illustrative · fictional data
    </span>
  );
}
