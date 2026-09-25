import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy information for the Paatam.ai website.",
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>In the meantime, here is what this website does with information you share.</p>
      <p>
        The enquiry form asks for your name, a work email or phone number, your school’s name, your role, your city,
        and an optional message. We use these details only to respond to your enquiry.
      </p>
      <p>
        The form is for school enquiries only. Please don’t submit student names, assessment documents or other
        student records through this website.
      </p>
    </LegalPage>
  );
}
