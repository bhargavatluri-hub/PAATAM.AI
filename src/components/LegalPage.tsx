import Link from "next/link";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { Footer } from "./Footer";
import { Logo } from "./ui/Logo";

/**
 * Shell for legal pages. The final policy text must come from the company and
 * should be reviewed by a qualified legal professional before launch. Until
 * then these pages say plainly that the policy is not yet published.
 */
export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <header className="border-b border-line">
        <div className="container-page flex h-16 items-center justify-between">
          <Link href="/" className="rounded-md" aria-label="Paatam.ai home">
            <Logo className="h-10" />
          </Link>
          <Link href="/" className="text-sm font-semibold text-primary hover:underline">
            ← Back to home
          </Link>
        </div>
      </header>
      <main id="main" className="container-page max-w-3xl py-16 md:py-24">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">{title}</h1>
        <p className="mt-6 rounded-lg border border-accent-strong/25 bg-accent-soft px-4 py-3 text-ink-soft">
          Our full {title.toLowerCase()} is being prepared and will be published on this page.
        </p>
        <div className="mt-10 space-y-5 text-lg leading-relaxed text-muted">{children}</div>
        {siteConfig.contactEmail ? (
          <p className="mt-10 text-muted">
            Questions? Email{" "}
            <a className="font-semibold text-primary underline-offset-4 hover:underline" href={`mailto:${siteConfig.contactEmail}`}>
              {siteConfig.contactEmail}
            </a>
            .
          </p>
        ) : (
          <p className="mt-10 text-muted">
            Questions? Use the{" "}
            <Link href="/#contact" className="font-semibold text-primary underline-offset-4 hover:underline">
              contact form
            </Link>
            .
          </p>
        )}
      </main>
      <Footer />
    </>
  );
}
