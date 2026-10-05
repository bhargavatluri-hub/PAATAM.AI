import { siteConfig } from "@/config/site";
import { CtaBand } from "@/components/CtaBand";
import { ExploreGrid } from "@/components/ExploreGrid";
import { SiteShell } from "@/components/SiteShell";
import { FAQ, faqs } from "@/components/sections/FAQ";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/brand/paatam-logo.svg`,
      description: siteConfig.description,
      ...(siteConfig.contactEmail ? { email: siteConfig.contactEmail } : {}),
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function Home() {
  return (
    <SiteShell>
      <Hero />
      <Problem />
      <ExploreGrid />
      <FAQ />
      <CtaBand />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
    </SiteShell>
  );
}
