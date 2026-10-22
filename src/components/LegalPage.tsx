import Link from "next/link";
import type { ReactNode } from "react";
import { addressLines, business, siteConfig } from "@/config/site";
import { Footer } from "./Footer";
import { Logo } from "./ui/Logo";

/**
 * Shell for legal pages. Policy text should be reviewed by a qualified legal
 * professional before it is published or changed.
 */
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <>
      <header className="border-b border-line">
        <div className="container-page flex h-16 items-center justify-between">
          <Link href="/" className="rounded-md" aria-label="Paatam.ai home">
            <Logo className="h-10" />
          </Link>
          <Link href="/" className="inline-block py-2.5 text-sm font-semibold text-primary hover:underline">
            ← Back to home
          </Link>
        </div>
      </header>
      <main id="main" className="container-page max-w-3xl py-16 md:py-24">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">{title}</h1>
        <p className="mt-4 text-sm text-muted">Last updated: {updated}</p>
        <div className="mt-10 space-y-5 text-lg leading-relaxed text-muted [&_a]:font-semibold [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline [&_h2]:pt-6 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-ink [&_li]:mt-2 [&_strong]:text-ink [&_ul]:list-disc [&_ul]:pl-6">
          {children}
        </div>
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
            <Link href="/contact" className="font-semibold text-primary underline-offset-4 hover:underline">
              contact form
            </Link>
            .
          </p>
        )}
        {addressLines().length > 0 && (
          <address className="mt-6 not-italic text-muted">
            <span className="block font-semibold text-ink">{business.legalName || siteConfig.name}</span>
            {addressLines().join(", ")}
          </address>
        )}
      </main>
      <Footer />
    </>
  );
}
