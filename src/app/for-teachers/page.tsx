import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { SiteShell } from "@/components/SiteShell";
import { TeacherControl } from "@/components/sections/TeacherControl";

export const metadata: Metadata = {
  title: "For teachers",
  description:
    "AI that supports teachers, not replaces them: review AI-drafted marks, correct results, validate insights and decide what parents see. Nothing is final without your approval.",
  alternates: { canonical: "/for-teachers" },
};

export default function ForTeachersPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="For teachers"
        title={
          <>
            Less time marking. <span className="text-primary">More time teaching.</span>
          </>
        }
        intro="Paatam prepares suggested marks, feedback and insights. You review, correct and approve — every result is yours."
      />
      <TeacherControl />
      <CtaBand title="Try Paatam with your own class." />
    </SiteShell>
  );
}
