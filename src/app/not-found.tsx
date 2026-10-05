import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <main id="main" className="container-page flex min-h-dvh flex-col items-start justify-center py-20">
      <Logo className="h-14" />
      <p className="mt-12 font-hand text-2xl text-redpen">Page not found</p>
      <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
        This page isn’t on the answer sheet.
      </h1>
      <p className="mt-4 max-w-lg text-lg text-muted">The link may be broken, or the page may have moved.</p>
      <Link href="/" className={buttonClasses("primary", "lg", "mt-8")}>
        Back to home
      </Link>
    </main>
  );
}
