"use client";

import { useEffect, useState } from "react";

type NavItem = {
  id: string;
  label: string;
};

const navItems: NavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "student-life", label: "Student Life" },
  { id: "daily-rhythm", label: "Daily Rhythm" },
  { id: "book-programme", label: "Studies" },
  { id: "timeline", label: "History" },
  { id: "gallery", label: "Gallery" },
  { id: "student-care", label: "Care" },
  { id: "faq", label: "FAQ" },
  { id: "support", label: "Support" },
];

// The site has a fixed overlay header (~63px) plus this sticky sub-nav itself
// (~50px). Sections scroll to sit just below that combined stack.
const SCROLL_OFFSET = 120;

export default function StickySubNav() {
  const [activeId, setActiveId] = useState<string>(navItems[0].id);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top of the viewport that's intersecting
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        // Trigger a bit before a section reaches the very top, accounting
        // for the fixed site header above this sticky nav.
        rootMargin: "-120px 0px -70% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <nav
      aria-label="HKTC page sections"
      className="sticky top-[min(var(--site-header-height,63px),var(--site-solid-header-height,63px))] z-[49] border-b border-temple-sand bg-white/95 backdrop-blur"
    >
      <div className="content-width section-padding">
        <ul
          className="flex gap-1 overflow-x-auto py-3 sm:gap-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {navItems.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id} className="shrink-0">
                <a
                  href={`#${item.id}`}
                  onClick={handleClick(item.id)}
                  className={`inline-flex min-h-11 items-center whitespace-nowrap px-3 py-1.5 font-body text-sm font-semibold transition-colors ${ isActive ? "bg-gold text-ink" : "text-ink/75 hover:bg-temple-cream hover:text-ink" }`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
