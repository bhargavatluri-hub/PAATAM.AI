import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { addressLines, business, siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Paatam.ai collects, uses and protects personal data shared through this website.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const company = business.legalName || siteConfig.name;
  const officer = business.grievanceOfficer;

  return (
    <LegalPage title="Privacy Policy" updated="22 October 2026">
      <p>
        This policy explains how {company} (“Paatam”, “we”, “us”) handles personal data shared through this website,
        in line with the Information Technology Act, 2000 and the Information Technology (Reasonable Security Practices
        and Procedures and Sensitive Personal Data or Information) Rules, 2011, and with India’s Digital Personal Data
        Protection Act, 2023 (the “DPDP Act”) and the rules made under it.
      </p>

      <h2>Who we are</h2>
      <p>
        {company} is the data fiduciary for personal data collected through this website. Our registered office is at{" "}
        {addressLines().join(", ")}.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Enquiry form:</strong> your name, work email, phone number (optional), school name, role, city or
          town, the kind of enquiry, and any message you write.
        </li>
        <li>
          <strong>Emails and calls:</strong> what you share when you write to us, call us or message us on WhatsApp.
        </li>
        <li>
          <strong>Technical data:</strong> our hosting provider records standard server logs, such as IP address,
          browser type and pages requested. We use these only to keep the website secure and working, for example to
          block spam.
        </li>
      </ul>
      <p>
        This website does not use advertising or analytics cookies, and it does not track you across other websites.
      </p>
      <p>
        <strong>Please don’t share student information through this website.</strong> The enquiry form is for schools
        and educators only. It is not meant for children, and we do not knowingly collect children’s personal data
        through it.
      </p>

      <h2>Why we use it</h2>
      <ul>
        <li>To reply to your enquiry, arrange a demo or discuss a pilot with your school.</li>
        <li>To send you an email confirming that we received your enquiry.</li>
        <li>To keep a record of our conversations with your school.</li>
        <li>To protect the website against misuse, and to meet our legal obligations.</li>
      </ul>
      <p>
        When you submit the form you consent to this use. We do not sell your personal data or use it for unrelated
        marketing. If we would like to send you product updates, we will ask for your consent separately.
      </p>

      <h2>Who we share it with</h2>
      <p>We share personal data only with service providers who process it on our behalf, under contract:</p>
      <ul>
        <li>
          <strong>Vercel Inc.</strong> hosts this website.
        </li>
        <li>
          <strong>Resend</strong> delivers enquiry and confirmation emails.
        </li>
        <li>Our business email provider stores the emails we exchange with you.</li>
      </ul>
      <p>
        Some of these providers may process data outside India. Where they do, we rely on transfers permitted under the
        DPDP Act. We may also disclose data where the law requires it.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep enquiry details for as long as we are in conversation with your school, and for up to 24 months after
        our last contact, unless the law requires us to keep them longer. After that we delete them.
      </p>

      <h2>How we protect it</h2>
      <p>
        Data is sent over encrypted connections (HTTPS), and access is limited to the people at Paatam who need it to
        respond to you. No method of transmission or storage is completely secure, but we take reasonable safeguards
        and will notify you and the Data Protection Board of India of a personal data breach as the law requires.
      </p>

      <h2>Your rights</h2>
      <p>Under the DPDP Act, you can:</p>
      <ul>
        <li>ask for a summary of the personal data we hold about you and how we use it;</li>
        <li>ask us to correct, complete, update or erase it;</li>
        <li>withdraw your consent at any time (this does not affect anything we did before you withdrew it);</li>
        <li>nominate another person to exercise these rights on your behalf; and</li>
        <li>raise a grievance with us, and, if you are not satisfied with our response, with the Data Protection Board of India.</li>
      </ul>
      <p>
        To use any of these rights, email our Grievance Officer at <a href={`mailto:${officer.email}`}>{officer.email}</a>.
        We may need to confirm your identity before acting on a request.
      </p>

      <h2>Grievance Officer</h2>
      <p>
        If you have a question or complaint about how we handle your personal data, please contact our Grievance
        Officer:
      </p>
      <p>
        <strong>{officer.name}</strong>
        <br />
        {officer.title}, {company}
        <br />
        {addressLines().join(", ")}
        <br />
        Email: <a href={`mailto:${officer.email}`}>{officer.email}</a>
      </p>
      <p>
        We will acknowledge your message within 7 days and aim to resolve it within 30 days. Please include
        “Privacy” in the subject line so it reaches the right person quickly.
      </p>

      <h2>The Paatam platform</h2>
      <p>
        This policy covers this website only. When a school uses the Paatam platform, student and staff data is
        processed under a separate agreement with that school, which explains how the data is handled.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The “last updated” date above shows when it last changed. For
        significant changes, we will post a clear notice on this website.
      </p>
    </LegalPage>
  );
}
