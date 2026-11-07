"use client";

import { useState, useEffect, useRef } from "react";
import type { CSSProperties, MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ChevronRight, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import BrandLogo from "@/components/ui/BrandLogo";
import TempleStatusBar, { HEADER_SETTLED_EVENT } from "@/components/layout/TempleStatusBar";
import NoticeboardButton from "@/components/layout/NoticeboardButton";
import { templeInfo } from "@/data/site";
import "./Navigation.css";

const SETTLE_DELAY_MS = 120;

const primaryNavigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Visit", href: "/visit" },
  { label: "Learn", href: "/learn" },
  { label: "Projects", href: "/projects" },
  { label: "Serve", href: "/serve" },
  { label: "Festivals", href: "/festivals" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const forceSolidNav = pathname === "/privacy" || pathname === "/terms";
  const solidNav = scrolled || forceSolidNav;

  const [scrollSynced, setScrollSynced] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    // A refresh can restore the scroll position before this listener exists, and then
    // no scroll event arrives, so read the position once as well. Both updates land
    // in the same render.
    const initialCheck = window.setTimeout(() => {
      handleScroll();
      setScrollSynced(true);
    }, 0);
    return () => {
      window.clearTimeout(initialCheck);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Until this point the header's look comes from the data-nav-scrolled mark set
  // by the inline script in the root layout (see globals.css). Hand over only once
  // a render reflects the real scroll position, so the header never flickers.
  useEffect(() => {
    if (scrollSynced) document.documentElement.setAttribute("data-nav-ready", "");
  }, [scrollSynced]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const toggle = menuToggleRef.current;
    closeButtonRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      toggle?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    // `--site-header-height` mirrors the header's live height so the noticeboard
    // panel stays aligned with the header at any scroll position.
    //
    // `--site-solid-header-height` is the header's resting (solid) height. The
    // sticky sub-nav and temple status bar pin to this constant value so they
    // never chase the header while it animates smaller on scroll. It is committed
    // only once the height has stopped changing, so it never takes a mid-transition
    // value. ResizeObserver fires on every frame the header actually changes size
    // during a transition and stays idle otherwise, which saves battery on phones.
    // It must watch the border box: the header also shrinks through its padding, and
    // the default content box would stop reporting before that animation has finished.
    let settleTimer = 0;

    const syncHeaderHeight = () => {
      const height = header.getBoundingClientRect().height;
      document.documentElement.style.setProperty("--site-header-height", `${height}px`);

      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(commitRestingHeight, SETTLE_DELAY_MS);
    };

    // A busy phone can drop frames, so a quiet moment does not prove the shrink has
    // finished. Saving a height mid-animation would leave a gap under the header.
    const commitRestingHeight = () => {
      if (header.getAnimations({ subtree: true }).some((animation) => animation.playState === "running")) {
        settleTimer = window.setTimeout(commitRestingHeight, SETTLE_DELAY_MS);
        return;
      }
      if (!solidNav) return;
      const settled = Math.round(header.getBoundingClientRect().height * 10) / 10;
      document.documentElement.style.setProperty("--site-solid-header-height", `${settled}px`);
      window.dispatchEvent(new Event(HEADER_SETTLED_EVENT));
    };

    syncHeaderHeight();

    const observer = new ResizeObserver(syncHeaderHeight);
    observer.observe(header, { box: "border-box" });

    return () => {
      window.clearTimeout(settleTimer);
      observer.disconnect();
    };
  }, [solidNav, isOpen]);

  const handleBrandClick = (event: MouseEvent<HTMLAnchorElement>) => {
    setIsOpen(false);

    if (pathname === "/") {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        ref={headerRef}
        style={{ "--site-nav-py": solidNav ? "0.5rem" : undefined } as CSSProperties}
        className={cn(
          "site-nav fixed top-0 left-0 right-0 z-50 border-b px-5 shadow-none transition-all duration-300 max-[900px]:px-0",
          solidNav
            ? "bg-dusk/90 border-gold/25 py-2 backdrop-blur-[14px] shadow-lg"
            : "border-transparent !bg-transparent py-[18px] !shadow-none backdrop-blur-0 max-[900px]:py-3",
          isOpen && "bg-dusk/95 border-gold/25"
        )}
      >
        <div className="content-width section-padding">
          <nav className="flex items-center justify-between gap-6 max-[900px]:gap-3">
            <Link
              href="/"
              className="nav-brand flex shrink-0 items-center gap-2.5 text-sand no-underline transition-colors hover:text-white max-[900px]:gap-2"
              onClick={handleBrandClick}
            >
              <BrandLogo
                className={cn(
                  "nav-brand-logo -translate-y-[2px] min-[901px]:-translate-y-[3px] transition-[width,height,transform] duration-300 [filter:saturate(1.08)_contrast(1.12)]",
                  solidNav
                    ? "h-[46px] w-[50px] max-[900px]:h-[42px] max-[900px]:w-[45px]"
                    : "h-[68px] w-[73px] max-[900px]:h-[48px] max-[900px]:w-[52px]"
                )}
              />
              <span
                className={cn(
                  "nav-brand-text flex min-w-0 flex-col gap-[3px] transition-all duration-300",
                  solidNav ? "translate-y-0" : "translate-y-0"
                )}
              >
                <span className="nav-brand-name whitespace-nowrap font-body text-[0.95rem] font-extrabold leading-none tracking-[-0.01em] text-sand drop-shadow-sm max-[900px]:text-[0.9rem]">
                  ISKCON Nairobi
                </span>
                <span
                  className={cn(
                    "nav-brand-expansion whitespace-nowrap font-body text-xs font-medium leading-tight text-sand/85 drop-shadow-sm transition-opacity max-[900px]:hidden",
                    solidNav ? "opacity-80" : "opacity-95"
                  )}
                >
                  International Society for Krishna Consciousness
                </span>
              </span>
            </Link>

            <div className="hidden xl:flex items-center gap-6">
              {primaryNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="nav-link text-xs tracking-wider uppercase aria-[current=page]:text-gold-light"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3 max-[900px]:gap-2">
              <NoticeboardButton statusBarVisible={scrolled && !isOpen} />
              <Link
                href="/donate"
                className="inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap [overflow-wrap:normal] bg-primary px-5 py-2.5 font-body text-xs font-semibold uppercase tracking-widest text-white transition-all duration-300 hover:bg-primary-dark max-[900px]:px-2.5 max-[900px]:tracking-wider max-[420px]:hidden"
              >
                Donate
              </Link>
              <button
                ref={menuToggleRef}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[3px] border border-gold/60 bg-dusk/45 p-0 text-gold shadow-[0_8px_24px_rgba(0,0,0,0.22)] backdrop-blur-sm transition-colors hover:border-gold/80 hover:bg-dusk/65 xl:hidden",
                  isOpen && "bg-dusk/70"
                )}
                aria-expanded={isOpen}
                aria-label={isOpen ? "Close navigation" : "Open navigation"}
                type="button"
              >
                <span className="grid h-3.5 w-[18px] content-between" aria-hidden="true">
                  <span
                    className={cn(
                      "block h-px w-full origin-center bg-current transition-transform duration-200",
                      isOpen && "translate-y-[6.5px] rotate-45"
                    )}
                  />
                  <span
                    className={cn(
                      "block h-px w-full bg-current transition-opacity duration-150",
                      isOpen && "opacity-0"
                    )}
                  />
                  <span
                    className={cn(
                      "block h-px w-full origin-center bg-current transition-transform duration-200",
                      isOpen && "-translate-y-[6.5px] -rotate-45"
                    )}
                  />
                </span>
              </button>
            </div>
          </nav>
        </div>
      </header>
      <TempleStatusBar visible={scrolled && !isOpen} />

      <div
        inert={!isOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={cn(
          "xl:hidden fixed inset-0 z-[70] transition-all duration-500",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />

        <div
          className={cn(
            "absolute top-0 right-0 h-full w-[min(320px,100vw)] bg-dusk flex flex-col transition-transform duration-500",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <BrandLogo className="h-14 w-[150px] text-sand" />
            <button
              ref={closeButtonRef}
              onClick={() => setIsOpen(false)}
              className="-mr-3 flex h-11 w-11 items-center justify-center text-white/80 hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            {primaryNavigation.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-6 py-3.5 font-body text-sm text-white/80 hover:text-sunset hover:bg-white/5 transition-all border-b border-white/5"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {item.label}
                <ChevronRight size={14} className="text-sunset/60" />
              </Link>
            ))}
          </div>

          <div className="p-6 border-t border-white/10">
            <a
              href={`tel:${templeInfo.phoneHref}`}
              onClick={() => setIsOpen(false)}
              className="mb-3 flex min-h-11 w-full items-center justify-center gap-2 border border-gold/40 py-3 font-body text-xs font-semibold uppercase tracking-widest text-gold transition-colors hover:bg-white/5"
            >
              <Phone size={13} />
              Call the temple
            </a>
            <Link
              href="/donate"
              onClick={() => setIsOpen(false)}
              className="btn-primary w-full justify-center text-xs"
            >
              Support our mission
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
