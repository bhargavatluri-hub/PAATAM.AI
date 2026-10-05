import Link from "next/link";
import { navItems, siteConfig } from "@/config/site";
import { Logo } from "./ui/Logo";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-white/70">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <Link href="/" className="inline-block rounded-md" aria-label="Paatam.ai home">
            <Logo inverted className="h-14" />
          </Link>
          <p className="mt-5 leading-relaxed">
            A teacher-first learning intelligence platform that turns handwritten assessments into actionable insights
            for teachers, students and parents. Built in India, starting in Andhra Pradesh.
          </p>
          <p className="mt-4 font-display text-lg text-white">{siteConfig.tagline}</p>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-white">Explore</h2>
          <ul className="mt-4 space-y-2.5">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={`/${item.href}`} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/#faq" className="hover:text-white">
                FAQ
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-white">Contact</h2>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link href="/#contact" className="hover:text-white">
                Request a school demo
              </Link>
            </li>
            <li>
              <Link href="/#contact" className="hover:text-white">
                Partner on a pilot
              </Link>
            </li>
            {siteConfig.contactEmail && (
              <li>
                <a href={`mailto:${siteConfig.contactEmail}`} className="hover:text-white">
                  {siteConfig.contactEmail}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-4 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Paatam.ai. All rights reserved.</p>
          <ul className="flex gap-6">
            <li>
              <Link href="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
