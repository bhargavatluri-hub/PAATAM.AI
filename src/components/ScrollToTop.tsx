"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Opens every new page at the top.
 *
 * Next.js only scrolls on navigation when the new page's first element is off-screen. Our
 * first element is the sticky header, which is always on-screen, so links from low on a page
 * (the Explore cards, the footer) opened the next page at the same depth. Back/forward keeps
 * the browser's restored position, and links with a #hash keep scrolling to their section.
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const firstRender = useRef(true);
  const fromHistory = useRef(false);

  useEffect(() => {
    const onPopState = () => {
      fromHistory.current = true;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (fromHistory.current) {
      fromHistory.current = false;
      return;
    }
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
