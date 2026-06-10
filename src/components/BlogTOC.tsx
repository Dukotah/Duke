"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { List, ChevronDown, Clock } from "lucide-react";

/** Slugify a heading's text content into a valid HTML id. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Compute estimated reading time from a plain-text string (230 wpm). */
function computeReadingTime(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 230));
  return `${minutes} min read`;
}

interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

interface TocState {
  items: TocItem[];
  readingTime: string;
}

type TocAction = { type: "SET"; payload: TocState } | { type: "RESET" };

function tocReducer(_prev: TocState, action: TocAction): TocState {
  if (action.type === "SET") return action.payload;
  return { items: [], readingTime: "" };
}

const tocInitial: TocState = { items: [], readingTime: "" };

export default function BlogTOC() {
  const pathname = usePathname();
  const [toc, dispatch] = useReducer(tocReducer, tocInitial);
  const [activeId, setActiveId] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Only show on article pages (not the blog index).
  const isArticlePage = pathname !== "/blog" && pathname.startsWith("/blog");

  useEffect(() => {
    if (!isArticlePage) {
      dispatch({ type: "RESET" });
      return;
    }

    // Find the article content root — posts use either <main> or <article>.
    const contentRoot =
      document.querySelector("article") ?? document.querySelector("main");
    if (!contentRoot) return;

    const bodyText = contentRoot.innerText ?? contentRoot.textContent ?? "";
    const readingTime = computeReadingTime(bodyText);

    const headings = Array.from(
      contentRoot.querySelectorAll<HTMLHeadingElement>("h2, h3")
    );

    const items: TocItem[] = headings
      .map((el) => {
        const text = el.textContent?.trim() ?? "";
        if (!text) return null;
        if (!el.id) {
          el.id = slugify(text);
        }
        const tag = el.tagName.toLowerCase() as "h2" | "h3";
        return { id: el.id, text, level: tag === "h2" ? 2 : 3 } as TocItem;
      })
      .filter((item): item is TocItem => item !== null);

    // Dispatch a single action — reducer handles state update outside the effect.
    dispatch({ type: "SET", payload: { items, readingTime } });

    // IntersectionObserver for active heading highlight (scroll-spy).
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "0px 0px -60% 0px", threshold: 0 }
    );

    headings.forEach((el) => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [isArticlePage, pathname]);

  if (!isArticlePage || toc.items.length < 3) return null;

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 80;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
    setMobileOpen(false);
  };

  const tocList = (
    <ul className="space-y-1">
      {toc.items.map((item) => (
        <li key={item.id} className={item.level === 3 ? "pl-3" : ""}>
          <button
            onClick={() => scrollTo(item.id)}
            className={[
              "text-left w-full text-sm leading-snug py-0.5 transition-colors",
              item.level === 2 ? "font-medium" : "font-normal",
              activeId === item.id
                ? "text-gold-on-light"
                : "text-[#3F3F46]/60 hover:text-[#18181B]",
            ].join(" ")}
            style={{ fontFamily: "var(--font-body)" }}
          >
            {item.text}
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Desktop sticky sidebar (xl+ only, floats beside the max-w-2xl column) */}
      <aside
        aria-label="Table of contents"
        className="hidden xl:block fixed top-28 right-[max(1rem,calc((100vw-42rem)/2-16rem))] w-56 z-30"
      >
        {toc.readingTime && (
          <p
            className="flex items-center gap-1.5 text-xs text-[#3F3F46]/50 mb-3"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <Clock size={12} />
            {toc.readingTime}
          </p>
        )}
        <p
          className="text-xs font-semibold uppercase tracking-widest text-[#3F3F46]/40 mb-2"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          On this page
        </p>
        <nav>{tocList}</nav>
      </aside>

      {/* Mobile collapsible TOC (above StickyCTA) */}
      <div
        className="xl:hidden fixed bottom-20 right-4 z-40"
        aria-label="Table of contents"
      >
        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-label={
            mobileOpen ? "Close table of contents" : "Open table of contents"
          }
          className="flex items-center gap-1.5 px-3 py-2 rounded-full shadow-lg bg-white border border-[#18181B]/10 text-[#18181B] text-xs font-semibold"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <List size={14} />
          Contents
          <ChevronDown
            size={12}
            className={"transition-transform " + (mobileOpen ? "rotate-180" : "")}
          />
        </button>

        {mobileOpen && (
          <div className="absolute bottom-10 right-0 w-64 bg-white border border-[#18181B]/10 rounded-xl shadow-xl p-4">
            {toc.readingTime && (
              <p
                className="flex items-center gap-1.5 text-xs text-[#3F3F46]/50 mb-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <Clock size={12} />
                {toc.readingTime}
              </p>
            )}
            <p
              className="text-xs font-semibold uppercase tracking-widest text-[#3F3F46]/40 mb-2"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              On this page
            </p>
            <nav>{tocList}</nav>
          </div>
        )}
      </div>
    </>
  );
}
