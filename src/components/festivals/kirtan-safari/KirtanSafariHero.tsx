import { BookOpen } from "lucide-react";
import { KirtanSafariRegistrationButton } from "@/components/sections/KirtanSafariRegistrationModal";
import SharePageButton from "@/components/ui/SharePageButton";

export default function KirtanSafariHero() {
  return (
    <section
      className="ks-hero"
      style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        overflow: "hidden",
      }}
    >
      {/* Background - savanna sunset */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url('/images/calendar-kirtan-safari-bg.png')",
          backgroundColor: "var(--color-festival-cream)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
        }}
      />

      {/* Layered overlays - amber burn + dark vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(246,226,177,0.08) 0%, rgba(7,28,16,0.32) 38%, rgba(7,28,16,0.94) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(7,28,16,0.72) 0%, rgba(7,28,16,0.34) 44%, rgba(7,28,16,0.16) 100%)",
        }}
      />

      {/* Anniversary badge - top right */}
      <div
        className="ks-badge"
        style={{
          position: "absolute",
          top: "7rem",
          right: "max(52px, calc((100vw - 1320px) / 2 + 52px))",
          background: "#D9A441",
          border: "1px solid rgba(183,134,38,0.55)",
          padding: "0.5rem 0.875rem",
          textAlign: "center",
          minWidth: "8.5rem",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-body, sans-serif)",
            color: "#3A2A24",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          ISKCON
        </p>
        <p
          style={{
            fontFamily: "var(--font-display, serif)",
            color: "#3A2A24",
            fontSize: "1.4rem",
            fontWeight: 700,
            margin: "0.1rem 0",
            lineHeight: 1,
          }}
        >
          60
        </p>
        <p
          style={{
            fontFamily: "var(--font-body, sans-serif)",
            color: "rgba(58,42,36,0.72)",
            fontSize: "0.75rem",
            letterSpacing: "0.15em",
            margin: 0,
          }}
        >
          1966 · 2026
        </p>
      </div>

      {/* Hero content */}
      <div
        className="content-width section-padding"
        style={{ position: "relative", zIndex: 10, paddingBottom: "4rem" }}
      >
        {/* Tagline */}
        <p
          style={{
            fontFamily: "var(--font-editorial, serif)",
            color: "rgba(246,226,177,0.85)",
            fontSize: "clamp(1rem, 3vw, 1.4rem)",
            fontStyle: "italic",
            marginBottom: "1.25rem",
            letterSpacing: "0.04em",
          }}
        >
          Every word a song &nbsp;·&nbsp; every step a dance
        </p>

        {/* You are invited */}
        <p
          style={{
            fontFamily: "var(--font-body, sans-serif)",
            color: "rgba(255,255,255,0.5)",
            fontSize: "0.75rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            marginBottom: "0.75rem",
          }}
        >
          You are invited to
        </p>

        {/* KIRTAN SAFARI wordmark */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h1
            style={{
              fontFamily: "var(--font-display, serif)",
              lineHeight: 0.9,
              margin: 0,
            }}
          >
            <span
              style={{
                display: "block",
                color: "#fff",
                fontSize: "clamp(4.5rem, 16vw, 10rem)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                textShadow: "0 4px 40px rgba(0,0,0,0.6)",
              }}
            >
              KIRTAN
            </span>
            <span
              style={{
                display: "block",
                color: "var(--color-festival-gold)",
                fontSize: "clamp(3.5rem, 13vw, 8rem)",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textShadow: "0 4px 40px rgba(214,156,43,0.4)",
                marginTop: "-0.1em",
              }}
            >
              SAFARI
            </span>
          </h1>
        </div>

        {/* Sub-tagline */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "2.5rem",
          }}
        >
          <div
            style={{ height: "1px", width: "2rem", background: "var(--color-festival-gold)", opacity: 0.6 }}
          />
          <p
            style={{
              fontFamily: "var(--font-body, sans-serif)",
              color: "rgba(246,226,177,0.9)",
              fontSize: "0.75rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            A Kirtan Journey Through Jarikhand Forest
          </p>
          <div
            style={{ height: "1px", flex: 1, background: "var(--color-festival-gold)", opacity: 0.3 }}
          />
        </div>

        {/* Date + Venue pill row */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
            marginBottom: "2rem",
          }}
        >
          {[
            { icon: "📅", text: "27 - 30 August 2026" },
            { icon: "📍", text: "Hare Krishna Temple, West Ngara Rd, Nairobi" },
          ].map((item) => (
            <div
              key={item.text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "rgba(7,28,16,0.58)",
                border: "1px solid rgba(214,156,43,0.3)",
                backdropFilter: "blur(6px)",
                padding: "0.5rem 1rem",
              }}
            >
              <span style={{ fontSize: "0.875rem" }}>{item.icon}</span>
              <span
                style={{
                  fontFamily: "var(--font-body, sans-serif)",
                  color: "rgba(255,255,255,0.85)",
                  fontSize: "0.8rem",
                }}
              >
                {item.text}
              </span>
            </div>
          ))}
        </div>

        <div className="mb-4"><SharePageButton title="Kirtan Safari 2026" label="Share this festival" /></div>

        {/* CTAs */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          <KirtanSafariRegistrationButton
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "var(--color-festival-gold)",
              color: "#fff",
              fontFamily: "var(--font-body, sans-serif)",
              fontWeight: 700,
              fontSize: "0.75rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              padding: "1rem 2rem",
              textDecoration: "none",
              transition: "background 0.3s",
              border: 0,
              cursor: "pointer",
            }}
          >
            Register Now
          </KirtanSafariRegistrationButton>
          <a
            href="#schedule"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              border: "1px solid rgba(255,255,255,0.35)",
              color: "#fff",
              fontFamily: "var(--font-body, sans-serif)",
              fontWeight: 600,
              fontSize: "0.75rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              padding: "1rem 2rem",
              textDecoration: "none",
            }}
          >
            View Schedule
          </a>
          <a
            href="/blog/jharikhanda-forest-kirtan-safari"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              border: "1px solid rgba(246,226,177,0.26)",
              background: "rgba(246,226,177,0.08)",
              color: "rgba(246,226,177,0.92)",
              fontFamily: "var(--font-body, sans-serif)",
              fontWeight: 600,
              fontSize: "0.75rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              padding: "1rem 2rem",
              textDecoration: "none",
            }}
          >
            <BookOpen size={14} strokeWidth={1.8} />
            Story Behind the Theme
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: "1.5rem",
          right: "1.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.4rem",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-body, sans-serif)",
            color: "rgba(255,255,255,0.3)",
            fontSize: "0.75rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Scroll
        </p>
        <div
          style={{
            width: "1px",
            height: "2rem",
            background:
              "linear-gradient(to bottom, rgba(214,156,43,0.7), transparent)",
          }}
        />
      </div>
    </section>
  );
}
