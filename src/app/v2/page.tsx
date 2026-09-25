import type { Metadata } from "next";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { V2Header } from "@/components/v2/V2Header";
import {
  V2Bulk,
  V2Contact,
  V2Facts,
  V2Footer,
  V2Hero,
  V2Pipeline,
  V2Platform,
  V2Schools,
  V2Teachers,
} from "@/components/v2/V2Sections";

// v2 is a design preview that lives alongside the original homepage (/).
export const metadata: Metadata = {
  title: "The AI grading desk for Indian schools",
  description:
    "Paatam reads handwritten tests, homework and exams, drafts marks and feedback with six specialised AI agents, and puts every result in front of the teacher for approval.",
  alternates: { canonical: "/v2" },
  robots: { index: false, follow: true },
};

export default function HomeV2() {
  return (
    <div className="theme-night min-h-dvh bg-night text-white">
      <V2Header />
      <main id="main">
        <V2Hero />
        <V2Facts />
        <V2Platform />
        <V2Pipeline />
        <V2Bulk />
        <V2Teachers />
        <V2Schools />
        <V2Contact />
      </main>
      <V2Footer />
      <RevealObserver />
    </div>
  );
}
