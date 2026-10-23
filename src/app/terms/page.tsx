import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { business, siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that apply when you use the Paatam.ai website.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  const company = business.legalName || siteConfig.name;

  return (
    <LegalPage title="Terms of Service" updated="20 October 2026">
      <p>
        These terms apply to your use of this website, which is operated by {company} (“Paatam”, “we”, “us”). By using
        the website, you agree to them. If you don’t agree, please don’t use the website.
      </p>

      <h2>About this website</h2>
      <p>
        This website introduces Paatam and lets schools get in touch with us. It is for information only. Nothing on it
        is an offer to sell or a binding commitment. Use of the Paatam platform by a school is governed by a separate
        written agreement between that school and us.
      </p>

      <h2>Illustrative content</h2>
      <p>
        Product screens, videos and examples on this website, including student and teacher names, marks and feedback,
        are fictional and for illustration only. Features shown may change and may not all be available to every
        school. Paatam’s AI suggests marks and feedback for a teacher to review. It does not replace a teacher’s
        judgement.
      </p>

      <h2>Using the website</h2>
      <p>You agree not to:</p>
      <ul>
        <li>use the website for anything unlawful, or to send spam or false enquiries;</li>
        <li>submit student records or other people’s personal data without permission;</li>
        <li>try to interfere with, overload or gain unauthorised access to the website or its systems; or</li>
        <li>copy, scrape or reuse the website’s content except as allowed below.</li>
      </ul>

      <h2>Intellectual property</h2>
      <p>
        The Paatam name, logo, text, graphics, videos and software on this website belong to us or our licensors. You
        may view the website and share links to it. You may not otherwise copy, modify or distribute its content without
        our written permission.
      </p>

      <h2>Links to other websites</h2>
      <p>
        The website may link to other websites, such as Google Maps or WhatsApp. We are not responsible for their
        content or how they handle your data.
      </p>

      <h2>Disclaimer and limitation of liability</h2>
      <p>
        We work to keep this website accurate and available, but it is provided “as is”, without warranties of any kind.
        To the extent the law allows, we are not liable for any indirect or consequential loss arising from your use of
        the website. Nothing in these terms limits any liability that cannot be limited under Indian law.
      </p>

      <h2>Privacy</h2>
      <p>
        Our <Link href="/privacy">Privacy Policy</Link> explains how we handle personal data you share through this
        website.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of India. The courts at Visakhapatnam, Andhra Pradesh, have exclusive
        jurisdiction over any dispute arising from them.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        We may update these terms from time to time. The “last updated” date above shows when they last changed.
        Continuing to use the website after a change means you accept the updated terms.
      </p>
    </LegalPage>
  );
}
