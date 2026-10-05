import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { DemoVideo } from "@/components/DemoVideo";
import { PageHero } from "@/components/PageHero";
import { SiteShell } from "@/components/SiteShell";
import { Icon } from "@/components/ui/Icon";

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
    <SiteShell>
      <PageHero
        eyebrow="Product demo · 1:37"
        title={
          <>
            The AI grading desk for Indian schools, <span className="text-primary">in under two minutes.</span>
          </>
        }
      >
        <DemoVideo className="mt-12" />
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {highlights.map((h) => (
            <li key={h.title} className="rounded-2xl border border-line bg-surface p-6">
              <Icon name="checkCircle" size={22} className="text-primary" />
              <p className="mt-3 font-semibold text-ink">{h.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{h.body}</p>
            </li>
          ))}
        </ul>
      </PageHero>
      <CtaBand />
    </SiteShell>
  );
}
