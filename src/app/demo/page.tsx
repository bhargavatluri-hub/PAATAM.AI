import type { Metadata } from "next";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "Product demo",
  description:
    "Watch Paatam in under two minutes: handwritten answer sheets in, AI-drafted marks and feedback, teacher approval, and insight for coordinators, principals and parents.",
  alternates: { canonical: "/demo" },
  openGraph: {
    title: "Paatam.ai — product demo",
    description: "The AI grading desk for Indian schools, in under two minutes.",
    images: [{ url: "/videos/paatam-demo.jpg", width: 1280, height: 720 }],
    videos: [{ url: "/videos/paatam-demo.mp4", type: "video/mp4", width: 1920, height: 1080 }],
  },
};

const highlights: { title: string; body: string }[] = [
  { title: "Handwritten, as today", body: "Tests, homework and exams are scanned straight from the answer sheet." },
  { title: "Six specialised agents", body: "Vision, OCR, verification, grading and QA draft marks and feedback." },
  { title: "Teacher approves every result", body: "Nothing is final, or shared with parents, until a teacher signs off." },
];

export default function DemoPage() {
  return (
    <div className="theme-night min-h-dvh bg-night text-white">
      <header className="container-page flex h-16 items-center justify-between gap-6 md:h-[4.5rem]">
        <Link href="/v2" className="rounded-md" aria-label="Paatam.ai — home">
          <Logo inverted className="h-10 md:h-12" />
        </Link>
        <a href="/v2#contact" data-interest="demo" className={buttonClasses("inverted", "sm")}>
          Request a school demo
        </a>
      </header>

      <main id="main" className="container-page pb-20 pt-8 md:pt-14">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-mint">Product demo · 1:37</p>
        <h1 className="mt-3 max-w-4xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-balance md:text-6xl">
          The AI grading desk for Indian schools, <span className="text-accent">in under two minutes.</span>
        </h1>

        <figure className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_60px_140px_-50px_rgb(0_0_0/0.95)]">
          <video
            className="aspect-video w-full"
            controls
            playsInline
            preload="metadata"
            poster="/videos/paatam-demo.jpg"
            aria-label="Paatam.ai product demo with teacher voice-over"
          >
            <source src="/videos/paatam-demo.mp4" type="video/mp4" />
            <track kind="captions" src="/videos/paatam-demo.vtt" srcLang="en" label="English" />
            Your browser can’t play this video.{" "}
            <a href="/videos/paatam-demo.mp4" className="underline">
              Download the demo (MP4)
            </a>
            .
          </video>
        </figure>
        <p className="mt-3 text-xs text-white/55">
          Product screens are illustrative, with fictional students, teachers and marks. Voice-over is AI-generated.
        </p>

        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {highlights.map((h) => (
            <li key={h.title} className="night-card rounded-2xl p-6">
              <Icon name="check" size={20} strokeWidth={2.4} className="text-mint" />
              <p className="mt-3 font-semibold">{h.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-white/65">{h.body}</p>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Link href="/v2" className={buttonClasses("outlineInverted", "lg")}>
            Explore the website <Icon name="arrowRight" size={18} />
          </Link>
          <a href="/v2#contact" data-interest="demo" className={buttonClasses("inverted", "lg")}>
            Request a school demo
          </a>
        </div>
      </main>

      <footer className="border-t border-white/[0.07]">
        <p className="container-page py-6 text-xs text-white/55">© {new Date().getFullYear()} Paatam.ai. All rights reserved.</p>
      </footer>
    </div>
  );
}
