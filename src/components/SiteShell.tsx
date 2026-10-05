import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { RevealObserver } from "./ui/RevealObserver";

/** Header, main landmark and footer shared by every page of the light site. */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <RevealObserver />
    </>
  );
}
