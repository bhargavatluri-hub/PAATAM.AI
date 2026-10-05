import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { SiteShell } from "@/components/SiteShell";
import { FinalCta } from "@/components/sections/FinalCta";

export const metadata: Metadata = {
  title: "Contact",
  description: "Request a school demo or partner with Paatam on a pilot.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Contact"
        title="Talk to the Paatam team."
        intro="Request a demo for your school, or tell us about partnering on a pilot. We’ll get back to you."
      />
      <FinalCta />
    </SiteShell>
  );
}
