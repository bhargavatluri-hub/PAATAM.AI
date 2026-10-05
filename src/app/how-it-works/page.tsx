import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { SiteShell } from "@/components/SiteShell";
import { ConnectedLearning } from "@/components/sections/ConnectedLearning";
import { Workflow } from "@/components/sections/Workflow";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "How Paatam works: upload handwritten answer sheets, AI drafts evaluation and insights, the teacher reviews and approves, and students and parents receive the feedback.",
  alternates: { canonical: "/how-it-works" },
};

export default function HowItWorksPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="The Paatam workflow"
        title={
          <>
            From handwritten answers <span className="text-primary">to learning that moves forward.</span>
          </>
        }
        intro="Students keep writing on paper. Paatam does the preparation; the teacher reviews and approves; and insight flows to students and parents."
      />
      <Workflow />
      <ConnectedLearning />
      <CtaBand />
    </SiteShell>
  );
}
