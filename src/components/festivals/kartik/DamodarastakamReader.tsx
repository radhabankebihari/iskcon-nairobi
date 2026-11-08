"use client";

import { useState } from "react";
import { damodarastakamVerses } from "@/data/damodarastakam";

type View = "both" | "sanskrit" | "meaning";

const views: { id: View; label: string }[] = [
  { id: "both", label: "Both" },
  { id: "sanskrit", label: "Sanskrit" },
  { id: "meaning", label: "Meaning" },
];

/** The eight verses, with a switch between singing text and meanings. */
export default function DamodarastakamReader() {
  const [view, setView] = useState<View>("both");

  return (
    <div>
      <div
        role="radiogroup"
        aria-label="How to show the verses"
        className="mx-auto flex w-full max-w-sm rounded-full border border-gold/30 bg-white/[0.04] p-1"
      >
        {views.map((item) => (
          <button
            key={item.id}
            type="button"
            role="radio"
            aria-checked={view === item.id}
            onClick={() => setView(item.id)}
            className={`min-h-10 flex-1 rounded-full px-2 font-body text-xs font-semibold transition-colors sm:text-sm ${
              view === item.id ? "bg-gold text-[#1a1108]" : "text-festival-cream/75 hover:text-festival-cream"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <ol className="mt-10 space-y-0">
        {damodarastakamVerses.map((verse, index) => (
          <li
            key={verse.lines[0]}
            className="kartik-verse grid gap-x-8 gap-y-3 border-t border-gold/15 py-8 first:border-t-0 sm:grid-cols-[4.5rem_1fr] sm:py-10"
          >
            <span aria-hidden="true" className="font-display text-4xl leading-none text-gold/70 sm:text-5xl">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="sr-only">Verse {index + 1}</span>
            <div className={view === "both" ? "grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10" : ""}>
              {view !== "meaning" && (
                <p lang="sa-Latn" className="font-editorial text-base leading-[1.75] text-festival-cream min-[400px]:text-lg sm:text-xl">
                  {verse.lines.map((line) => (
                    <span key={line} className="block pl-5 -indent-5">
                      {line}
                    </span>
                  ))}
                </p>
              )}
              {view !== "sanskrit" && (
                <p
                  className={`font-body leading-relaxed text-festival-cream/75 ${
                    view === "meaning" ? "max-w-3xl text-base sm:text-lg" : "text-sm sm:text-[0.95rem] lg:border-l lg:border-gold/20 lg:pl-8"
                  }`}
                >
                  {verse.meaning}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
