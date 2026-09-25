import { siteConfig } from "@/config/site";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ConnectedLearning } from "@/components/sections/ConnectedLearning";
import { FAQ, faqs } from "@/components/sections/FAQ";
import { FinalCta } from "@/components/sections/FinalCta";
import { ForSchools } from "@/components/sections/ForSchools";
import { Hero } from "@/components/sections/Hero";
import { IndianClassrooms } from "@/components/sections/IndianClassrooms";
import { Problem } from "@/components/sections/Problem";
import { Product } from "@/components/sections/Product";
import { Responsible } from "@/components/sections/Responsible";
import { TeacherControl } from "@/components/sections/TeacherControl";
import { Vision } from "@/components/sections/Vision";
import { Workflow } from "@/components/sections/Workflow";
import { RevealObserver } from "@/components/ui/RevealObserver";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/icon.svg`,
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
    <>
      <Header />
      <main id="main">
        <Hero />
        <Problem />
        <Workflow />
        <Product />
        <TeacherControl />
        <ConnectedLearning />
        <ForSchools />
        <IndianClassrooms />
        <Responsible />
        <Vision />
        <FAQ />
        <FinalCta />
      </main>
      <Footer />
      <RevealObserver />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
