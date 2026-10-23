"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Icon } from "./ui/Icon";

type Turn = { role: "user" | "assistant"; text: string };

const STORAGE_KEY = "paatam-chat";
const GREETING =
  "Hi! I'm Paatam's assistant. Ask me how Paatam helps your teachers evaluate answer sheets and understand each student's learning, or book a demo.";
const SUGGESTIONS = ["What does Paatam do?", "Will it replace teachers?", "How do pilots work?", "Book a demo"];

const ERRORS: Record<string, string> = {
  rate_limited: "You've sent a lot of messages. Please wait a few minutes and try again.",
  too_long: "That message is too long. Please keep it under 1,500 characters.",
  not_configured: "The assistant isn't available right now. Please use the Contact page.",
};

/** Escapes text, then renders **bold**, links and "- " bullets from the assistant's replies. */
function format(text: string) {
  const escaped = text.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
  return escaped
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|\s)(\/(?:demo|contact|product|how-it-works|for-schools|for-teachers|about))\b/g, '$1<a href="$2">$2</a>')
    .replace(/(https?:\/\/[^\s<]+[^\s<.,)])/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/^[-*] /gm, "• ");
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [leadSaved, setLeadSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [input, setInput] = useState("");
  const [nudge, setNudge] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const restored = useRef(false);

  useEffect(() => {
    let chatted = false;
    try {
      chatted = Boolean(sessionStorage.getItem(STORAGE_KEY));
    } catch {}
    if (chatted) return;
    const t = setTimeout(() => setNudge(true), 10_000);
    return () => clearTimeout(t);
  }, []);

  /** Opens or closes the chat, restoring this tab's conversation the first time it opens. */
  function toggle(next = !open) {
    if (next && !restored.current) {
      restored.current = true;
      try {
        const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "null");
        if (Array.isArray(saved?.turns)) {
          setTurns(saved.turns);
          setLeadSaved(Boolean(saved.leadSaved));
        }
      } catch {}
    }
    setNudge(false);
    setOpen(next);
  }

  useEffect(() => {
    if (!restored.current) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ turns: turns.slice(-40), leadSaved }));
    } catch {}
  }, [turns, leadSaved]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [turns, busy, error, open]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: globalThis.KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(text: string) {
    const message = text.trim();
    if (!message || busy) return;
    setError("");
    setInput("");
    const history = turns;
    setTurns([...history, { role: "user", text: message }]);
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history, leadSaved, page: window.location.pathname }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setTurns(history);
        setInput(message);
        setError(ERRORS[data.error] ?? "The assistant couldn't answer just now. Please try again.");
        return;
      }
      setTurns([...history, { role: "user", text: message }, { role: "assistant", text: data.reply }]);
      if (data.leadSaved && !leadSaved) setLeadSaved(true);
    } catch {
      setTurns(history);
      setInput(message);
      setError("Can't reach the assistant. Check your connection and try again.");
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    send(input);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  return (
    <>
      {nudge && !open && turns.length === 0 && (
        <div className="fixed bottom-24 right-4 z-[60] max-w-[16rem] rounded-lg border border-line bg-surface p-4 pr-9 text-sm text-ink shadow-lift sm:right-6">
          <button
            type="button"
            onClick={() => setNudge(false)}
            className="absolute right-2 top-2 rounded p-1 text-muted hover:text-ink"
            aria-label="Dismiss"
          >
            <Icon name="close" size={14} />
          </button>
          <button type="button" onClick={() => toggle(true)} className="text-left">
            <span className="block font-semibold">Questions about Paatam?</span>
            <span className="text-muted">Ask our assistant, or book a demo.</span>
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => toggle()}
        aria-expanded={open}
        aria-controls="paatam-chat"
        aria-label={open ? "Close chat" : "Chat with Paatam"}
        className="fixed bottom-4 right-4 z-[60] grid h-14 w-14 place-items-center rounded-full bg-primary text-white shadow-lift transition-transform hover:scale-105 hover:bg-primary-strong sm:bottom-6 sm:right-6"
      >
        <Icon name={open ? "close" : "message"} size={24} />
        {nudge && !open && turns.length === 0 && (
          <span aria-hidden="true" className="absolute right-0.5 top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-accent" />
        )}
      </button>

      {open && (
        <section
          id="paatam-chat"
          role="dialog"
          aria-label="Chat with Paatam"
          className="fixed inset-0 z-[60] flex flex-col overflow-hidden bg-paper sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[min(38rem,calc(100dvh-8rem))] sm:w-[23.5rem] sm:rounded-xl sm:border sm:border-line sm:shadow-lift"
        >
          <header className="flex items-center gap-3 bg-primary px-4 py-3 text-white">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15 font-display text-lg font-semibold">P</span>
            <div className="min-w-0">
              <p className="font-semibold leading-tight">Paatam assistant</p>
              <p className="text-xs text-white/75">AI answers · the team follows up personally</p>
            </div>
            <button
              type="button"
              onClick={() => toggle(false)}
              className="ml-auto grid h-8 w-8 place-items-center rounded-full bg-white/10 hover:bg-white/20"
              aria-label="Close chat"
            >
              <Icon name="close" size={16} />
            </button>
          </header>

          <div ref={logRef} className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-4 py-4" aria-live="polite">
            <Bubble role="assistant" text={GREETING} />
            {turns.map((t, i) => (
              <Bubble key={i} role={t.role} text={t.text} />
            ))}
            {leadSaved && (
              <p className="inline-flex items-center gap-1.5 self-center rounded-full bg-approved-soft px-3 py-1 text-xs font-medium text-approved">
                <Icon name="check" size={12} strokeWidth={2.5} /> Your details are with the Paatam team
              </p>
            )}
            {busy && (
              <div className="flex gap-1 self-start rounded-lg rounded-bl-sm border border-line bg-surface px-3.5 py-3" aria-label="Assistant is typing">
                {[0, 150, 300].map((d) => (
                  <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted motion-reduce:animate-none" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            )}
            {error && <p className="self-start rounded-lg bg-gap-soft px-3.5 py-2.5 text-sm text-gap">{error}</p>}
          </div>

          {turns.length === 0 && (
            <div className="flex flex-wrap gap-1.5 px-4 pb-3">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-primary/30 bg-surface px-3 py-1.5 text-sm text-primary hover:bg-primary-soft"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={onSubmit} className="flex items-end gap-2 border-t border-line bg-surface p-3">
            <label htmlFor="paatam-chat-input" className="sr-only">
              Your message
            </label>
            <textarea
              id="paatam-chat-input"
              ref={inputRef}
              rows={1}
              value={input}
              maxLength={1500}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask about Paatam…"
              className="max-h-28 min-h-10 flex-1 resize-none rounded-md border border-line bg-paper px-3 py-2 text-[0.95rem] text-ink placeholder:text-muted focus:border-primary focus:outline-none"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary text-white hover:bg-primary-strong disabled:opacity-40"
            >
              <Icon name="arrowRight" size={18} />
            </button>
          </form>
          <p className="bg-surface px-4 pb-3 text-[0.7rem] text-muted">
            AI assistant. Please don&rsquo;t share student information.
          </p>
        </section>
      )}
    </>
  );
}

function Bubble({ role, text }: Turn) {
  const mine = role === "user";
  return (
    <div
      className={`max-w-[85%] whitespace-pre-wrap break-words rounded-lg px-3.5 py-2.5 text-[0.95rem] leading-relaxed [&_a]:underline ${
        mine ? "self-end rounded-br-sm bg-primary text-white" : "self-start rounded-bl-sm border border-line bg-surface text-ink"
      }`}
      dangerouslySetInnerHTML={{ __html: format(text) }}
    />
  );
}
