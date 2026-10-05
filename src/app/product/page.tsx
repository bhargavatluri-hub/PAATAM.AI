import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { DemoVideo } from "@/components/DemoVideo";
import { PageHero } from "@/components/PageHero";
import { SiteShell } from "@/components/SiteShell";
import { Product } from "@/components/sections/Product";

export const metadata: Metadata = {
  title: "Product",
  description:
    "Paatam's AI grading desk: scan handwritten answer sheets, review AI-drafted marks and feedback, and turn every assessment into learning insight. Watch the 1:37 demo.",
  alternates: { canonical: "/product" },
};

export default function ProductPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Platform overview"
        title={
          <>
            One grading desk, from answer sheet <span className="text-primary">to insight.</span>
          </>
        }
        intro="Paatam reads handwritten tests, homework and exams, drafts marks and feedback, and puts every result in front of the teacher for approval. Watch the platform in under two minutes."
      >
        <DemoVideo className="mt-12" />
      </PageHero>
      <Product />
      <CtaBand title="Want a walkthrough with your own answer sheets?" />
    </SiteShell>
  );
}
