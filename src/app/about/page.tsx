import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { SiteShell } from "@/components/SiteShell";
import { Responsible } from "@/components/sections/Responsible";
import { Vision } from "@/components/sections/Vision";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why Paatam exists: making every student's learning visible and actionable, with responsible, teacher-first AI built for Indian schools.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="About Paatam"
        title={
          <>
            Every answer has a story. <span className="text-primary">We help schools understand it.</span>
          </>
        }
        intro="Paatam is a teacher-first learning intelligence platform, built in India and starting in Andhra Pradesh."
      />
      <Vision />
      <Responsible />
      <CtaBand />
    </SiteShell>
  );
}
