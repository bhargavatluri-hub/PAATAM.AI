"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { buttonClasses } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { Logo } from "../ui/Logo";
import { v2Nav } from "./nav";


export function V2Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("a")?.focus();
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") return close();
      if (event.key === "Tab" && panel) {
        const items = [toggleRef.current, ...Array.from(panel.querySelectorAll<HTMLElement>("a"))].filter(Boolean) as HTMLElement[];
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    const onResize = () => window.matchMedia("(min-width: 1024px)").matches && close(false);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [open, close]);

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,box-shadow] duration-300 ${
        scrolled || open ? "bg-night/80 shadow-[0_1px_0_rgb(255_255_255/0.08)] backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-6 md:h-[4.5rem]">
        <a href="#top" className="rounded-md" aria-label="Paatam.ai — back to top">
          <Logo inverted />
        </a>
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {v2Nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="rounded-full px-3.5 py-2 text-[0.95rem] font-medium text-white/65 transition-colors hover:bg-white/[0.06] hover:text-white">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <a href="#contact" data-interest="demo" className={buttonClasses("inverted")}>
              Request a demo
            </a>
          </div>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white lg:hidden"
            aria-expanded={open}
            aria-controls="v2-mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => (open ? close() : setOpen(true))}
          >
            <Icon name={open ? "close" : "menu"} size={20} />
          </button>
        </div>
      </div>
      <div id="v2-mobile-menu" ref={panelRef} hidden={!open} className="border-t border-white/10 bg-night lg:hidden">
        <nav aria-label="Mobile" className="container-page flex max-h-[calc(100dvh-4rem)] flex-col overflow-y-auto py-4">
          <ul>
            {v2Nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => close(false)}
                  className="flex items-center justify-between border-b border-white/10 py-4 text-lg font-medium text-white"
                >
                  {item.label}
                  <Icon name="arrowRight" size={18} className="text-white/40" />
                </a>
              </li>
            ))}
          </ul>
          <a href="#contact" data-interest="pilot" onClick={() => close(false)} className={buttonClasses("inverted", "lg", "mt-6 w-full")}>
            Partner with Paatam
          </a>
        </nav>
      </div>
    </header>
  );
}
