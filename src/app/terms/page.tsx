import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for the Paatam.ai website.",
  alternates: { canonical: "/terms" },
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <p>
        This website introduces Paatam and invites schools to get in touch. Product examples on this site, including
        student names, marks and feedback, are fictional and illustrative only.
      </p>
    </LegalPage>
  );
}
