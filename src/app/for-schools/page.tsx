import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { SiteShell } from "@/components/SiteShell";
import { ForSchools } from "@/components/sections/ForSchools";
import { IndianClassrooms } from "@/components/sections/IndianClassrooms";

export const metadata: Metadata = {
  title: "For schools",
  description:
    "Paatam for school leaders: class and section insight, learning gaps across the school, and a pilot programme built for Indian classrooms, starting in Andhra Pradesh.",
  alternates: { canonical: "/for-schools" },
};

export default function ForSchoolsPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="School leaders"
        title={
          <>
            Clearer learning insight, <span className="text-primary">across every class.</span>
          </>
        }
        intro="Built for Indian classrooms serving Classes 5–10. Teachers stay in control, and leaders see where learning needs support."
      />
      <ForSchools />
      <IndianClassrooms />
      <CtaBand title="Shape Paatam with us as a pilot school." />
    </SiteShell>
  );
}
