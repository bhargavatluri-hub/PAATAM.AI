"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  interests,
  MESSAGE_LIMIT,
  normalise,
  roles,
  validate,
  type ContactErrors,
  type ContactPayload,
  type Interest,
} from "@/lib/contact";
import { Button } from "./ui/Button";
import { Icon } from "./ui/Icon";

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

type ContactFormProps = {
  /** Whether a delivery destination (CONTACT_WEBHOOK_URL) is configured on the server. */
  configured: boolean;
  contactEmail?: string;
};

const FIELD_ORDER: (keyof ContactPayload)[] = ["name", "contact", "school", "role", "city", "message"];

export function ContactForm({ configured, contactEmail }: ContactFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [interest, setInterest] = useState<Interest>("demo");
  const [errors, setErrors] = useState<ContactErrors>({});
  const [state, setState] = useState<SubmitState>({ kind: "idle" });
  const [messageLength, setMessageLength] = useState(0);

  // CTA links anywhere on the page carry data-interest="demo|pilot" to preselect the enquiry type.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-interest]");
      const value = link?.dataset.interest;
      if (value && interests.some((i) => i.value === value)) setInterest(value as Interest);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (state.kind === "success") successRef.current?.focus();
  }, [state.kind]);

  const fallback = contactEmail ? (
    <>
      {" "}
      You can also email us at{" "}
      <a className="font-semibold underline underline-offset-2" href={`mailto:${contactEmail}`}>
        {contactEmail}
      </a>
      .
    </>
  ) : null;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.kind === "submitting") return;
    const form = event.currentTarget;
    const data = normalise(Object.fromEntries(new FormData(form).entries()));
    const found = validate(data);
    setErrors(found);

    const firstInvalid = FIELD_ORDER.find((key) => found[key]);
    if (firstInvalid) {
      setState({ kind: "idle" });
      form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setState({ kind: "submitting" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; errors?: ContactErrors };

      if (res.ok && body.ok) {
        setState({ kind: "success" });
        form.reset();
        setMessageLength(0);
        return;
      }
      if (body.error === "validation" && body.errors) {
        setErrors(body.errors);
        setState({ kind: "error", message: "Please correct the highlighted fields." });
        return;
      }
      const messages: Record<string, string> = {
        not_configured:
          "Your enquiry was not sent: online enquiries aren’t connected on this site yet. Please try again later.",
        rate_limited: "Too many attempts in a short time. Please wait a few minutes and try again.",
        delivery_failed: "Your enquiry could not be delivered just now. Please try again in a moment.",
      };
      setState({
        kind: "error",
        message: messages[body.error ?? ""] ?? "Something went wrong and your enquiry was not sent. Please try again.",
      });
    } catch {
      setState({
        kind: "error",
        message: "We couldn’t reach the server, so your enquiry was not sent. Check your connection and try again.",
      });
    }
  }

  if (state.kind === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="flex flex-col items-start rounded-2xl border border-approved/30 bg-surface p-8 shadow-card focus:outline-none"
      >
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-approved-soft text-approved">
          <Icon name="checkCircle" size={26} />
        </span>
        <h3 className="mt-5 font-display text-2xl font-semibold text-ink">Thank you — we’ve received your enquiry.</h3>
        <p className="mt-3 leading-relaxed text-muted">
          Someone from the Paatam team will get back to you using the contact details you shared.
        </p>
        <Button variant="secondary" className="mt-6" onClick={() => setState({ kind: "idle" })}>
          Send another enquiry
        </Button>
      </div>
    );
  }

  const submitting = state.kind === "submitting";

  return (
    <form
      ref={formRef}
      id="contact-form"
      noValidate
      onSubmit={onSubmit}
      aria-labelledby="contact-form-title"
      aria-busy={submitting}
      className="relative rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8"
    >
      <h3 id="contact-form-title" className="font-display text-2xl font-semibold text-ink">
        Tell us about your school
      </h3>
      <p className="mt-2 text-sm text-muted">
        All fields are required unless marked optional. We’ll only use these details to reply to your enquiry.
      </p>

      {!configured && (
        <p className="mt-5 flex gap-2.5 rounded-lg border border-accent-strong/25 bg-accent-soft px-4 py-3 text-sm text-ink-soft">
          <Icon name="alert" size={18} className="mt-0.5 shrink-0 text-accent-strong" />
          <span>
            Online enquiries aren’t connected on this site yet, so this form can’t send messages right now.
            {fallback}
          </span>
        </p>
      )}

      <fieldset className="mt-6">
        <legend className="text-sm font-semibold text-ink">I’m interested in</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {interests.map((option) => (
            <label
              key={option.value}
              className="cursor-pointer rounded-full border border-line-strong px-4 py-2 text-sm font-medium text-ink-soft transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary-soft has-[:checked]:text-primary has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent"
            >
              <input
                type="radio"
                name="interest"
                value={option.value}
                checked={interest === option.value}
                onChange={() => setInterest(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field id={fieldId("name")} label="Your name" error={errors.name}>
          <input id={fieldId("name")} name="name" type="text" autoComplete="name" maxLength={100} {...a11y("name", errors)} className={inputClass(errors.name)} />
        </Field>
        <Field id={fieldId("contact")} label="Work email or phone" error={errors.contact}>
          <input id={fieldId("contact")} name="contact" type="text" autoComplete="email" maxLength={120} {...a11y("contact", errors)} className={inputClass(errors.contact)} />
        </Field>
        <Field id={fieldId("school")} label="School name" error={errors.school}>
          <input id={fieldId("school")} name="school" type="text" autoComplete="organization" maxLength={150} {...a11y("school", errors)} className={inputClass(errors.school)} />
        </Field>
        <Field id={fieldId("role")} label="Your role" error={errors.role}>
          <select id={fieldId("role")} name="role" defaultValue="" {...a11y("role", errors)} className={inputClass(errors.role)}>
            <option value="" disabled>
              Select your role
            </option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </Field>
        <Field id={fieldId("city")} label="City or town" error={errors.city} className="sm:col-span-2">
          <input id={fieldId("city")} name="city" type="text" autoComplete="address-level2" maxLength={80} {...a11y("city", errors)} className={inputClass(errors.city)} />
        </Field>
        <Field
          id={fieldId("message")}
          label="Message"
          optional
          error={errors.message}
          className="sm:col-span-2"
          hint="Tell us about your classes and assessments. Please don’t include student names or records."
        >
          <textarea
            id={fieldId("message")}
            name="message"
            rows={4}
            maxLength={MESSAGE_LIMIT}
            onChange={(e) => setMessageLength(e.target.value.length)}
            {...a11y("message", errors, true)}
            className={`${inputClass(errors.message)} h-auto py-3`}
          />
          <p className="mt-1 text-right text-xs text-muted" aria-hidden="true">
            {messageLength}/{MESSAGE_LIMIT}
          </p>
        </Field>
      </div>

      {/* Honeypot: hidden from people and assistive tech, catches naive bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div aria-live="assertive" role="alert">
        {state.kind === "error" && (
          <p className="mt-6 flex gap-2.5 rounded-lg border border-redpen/25 bg-[#fdecea] px-4 py-3 text-sm text-redpen">
            <Icon name="alert" size={18} className="mt-0.5 shrink-0" />
            <span>
              {state.message}
              {fallback}
            </span>
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-muted">
          This form is for school enquiries only. Please don’t share student information here.
        </p>
        <Button type="submit" size="lg" disabled={submitting} className="shrink-0">
          {submitting ? (
            <>
              <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Sending…
            </>
          ) : (
            <>
              Send enquiry <Icon name="arrowRight" size={18} />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

/** Field ids are namespaced so they can't collide with section anchors such as #contact. */
function fieldId(name: keyof ContactPayload) {
  return `enquiry-${name}`;
}

function a11y(name: keyof ContactPayload, errors: ContactErrors, hasHint = false) {
  const id = fieldId(name);
  const describedBy = [hasHint ? `${id}-hint` : null, errors[name] ? `${id}-error` : null].filter(Boolean).join(" ");
  return {
    "aria-invalid": errors[name] ? (true as const) : undefined,
    "aria-describedby": describedBy || undefined,
  };
}

function inputClass(error?: string) {
  return `block h-11 w-full rounded-lg border bg-paper px-3.5 text-[0.95rem] text-ink transition-colors placeholder:text-muted/70 focus:bg-surface focus:outline-none focus:ring-2 ${
    error ? "border-redpen focus:ring-redpen/25" : "border-line-strong focus:border-primary focus:ring-primary/20"
  }`;
}

function Field({
  id,
  label,
  error,
  hint,
  optional,
  className = "",
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
        {optional && <span className="font-normal text-muted"> (optional)</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="-mt-0.5 mb-2 text-xs text-muted">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-redpen">
          <Icon name="alert" size={15} className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
