import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { SiteShell } from "@/components/SiteShell";
import { Founders } from "@/components/sections/Founders";
import { Journey } from "@/components/sections/Journey";
import { Responsible } from "@/components/sections/Responsible";
import { Vision } from "@/components/sections/Vision";
import { Icon, type IconName } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "About",
  description:
    "Paatam is an early-stage, DPIIT-recognised startup from Visakhapatnam, founded in 2026 by Bhargav Atluri and Nikitha Atluri to build teacher-first AI for Indian schools.",
  alternates: { canonical: "/about" },
};

const facts: { icon: IconName; label: string; value: string }[] = [
  { icon: "clock", label: "Founded", value: "September 2026" },
  { icon: "shield", label: "Recognition", value: "DPIIT-recognised startup" },
  { icon: "mapPin", label: "Based at", value: "Ratan Tata Innovation Hub, Visakhapatnam" },
  { icon: "student", label: "Next", value: "Pilots with 5 schools from Diwali 2026" },
];

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
        intro="Paatam.ai is an early-stage startup building teacher-first AI for Indian schools. We started in Andhra Pradesh in 2026, and we’re building Paatam together with our first schools."
      >
        <dl className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label} className="flex gap-3 rounded-xl border border-line bg-surface/80 p-4">
              <Icon name={f.icon} size={20} className="mt-0.5 shrink-0 text-primary" />
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.14em] text-muted">{f.label}</dt>
                <dd className="mt-1 font-semibold leading-snug text-ink">{f.value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </PageHero>
      <Vision />
      <Founders />
      <Journey />
      <Responsible />
      <CtaBand />
    </SiteShell>
  );
}
