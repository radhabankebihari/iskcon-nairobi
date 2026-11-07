import { Camera, History, Video } from "lucide-react";
import Image from "next/image";
import { kirtanSafariConfig } from "@/data/kirtanSafari";
import KirtanSafariFutureInterestForm from "./KirtanSafariFutureInterestForm";

export default function KirtanSafariArchive() {
  const { archive, links, days } = kirtanSafariConfig;
  const availableActions = [
    links.gallery ? { label: "View the festival gallery", href: links.gallery, Icon: Camera } : null,
    links.recordings ? { label: "Watch kirtan recordings", href: links.recordings, Icon: Video } : null,
    { label: "Follow Kirtan Safari", href: links.instagram, Icon: Camera },
  ].filter(Boolean) as Array<{ label: string; href: string; Icon: typeof Camera }>;

  return (
    <div className="ks-archive">
      <section className="ks-archive-hero">
        <div className="ks-archive-hero-image" aria-hidden="true" />
        <div className="ks-archive-overlay" aria-hidden="true" />
        <div className="content-width section-padding ks-archive-hero-copy">
          <p>{archive.eyebrow}</p>
          <h1>{archive.title}</h1>
          <strong>{archive.status}</strong>
          <span>{archive.gratitude}</span>
          <div className="ks-archive-actions">
            {availableActions.map(({ label, href, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"><Icon size={17} aria-hidden="true" />{label}</a>
            ))}
            <a href="#future-editions"><History size={17} aria-hidden="true" />Receive 2027 Updates</a>
          </div>
        </div>
      </section>

      <section className="ks-archive-story">
        <div className="content-width section-padding">
          <div className="ks-archive-intro">
            <p>2026 edition</p>
            <h2>A Festival Memory, Kept With Gratitude</h2>
            <span>Kirtan Safari remains a recurring gathering at ISKCON Nairobi, bringing devotees together through the holy name, association, prasadam, and service.</span>
          </div>
          <figure className="mt-[clamp(2rem,5vw,4rem)]">
            <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/9]">
              <Image
                src="/images/kirtan-safari/kirtan-safari-2026-temple-memory-lit.webp"
                alt="Devotees gathered in kirtan before the altar at ISKCON Nairobi"
                fill
                sizes="(max-width: 900px) 100vw, 1100px"
                className="object-cover"
              />
            </div>
            <figcaption className="flex flex-col items-start gap-1 border-b border-ink/15 py-3 font-body text-xs leading-relaxed text-[#67544a] sm:flex-row sm:items-baseline sm:gap-3">
              <span className="shrink-0 text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--color-festival-red)]">2026 memory</span>
              Devotees gather in kirtan before Sri Sri Radha Bankebihari during Kirtan Safari 2026.
            </figcaption>
          </figure>
          <div className="ks-archive-days">
            {days.map((day, index) => (
              <article key={day.id}><span>Day {index + 1}</span><h3>{day.theme}</h3><p>{day.dateLabel}</p><ul>{day.programme.map((item) => <li key={item.id}>{item.title}</li>)}</ul></article>
            ))}
          </div>
          <div className="ks-archive-links">
            <a href={links.adhivasStory}>
              <span>Before the festival</span>
              <strong>Join the Adhivas Bhajan</strong>
              <em>Sing along with the lyrics that welcome the festival mood.</em>
            </a>
            <a href={links.jharikhandaStory}>
              <span>Story behind the theme</span>
              <strong>The Forest That Learned to Chant</strong>
              <em>Return to Sri Chaitanya Mahaprabhu's journey through Jharikhanda.</em>
            </a>
          </div>
          <nav className="ks-edition-nav" aria-label="Kirtan Safari editions"><span>Festival editions</span><strong aria-current="page">2026</strong><em>Future editions will appear here when announced.</em></nav>
        </div>
      </section>

      <section id="future-editions" className="ks-future-editions">
        <div className="content-width section-padding ks-future-grid">
          <div><p>Continue the journey</p><h2>Hear About the Next Kirtan Safari</h2><span>Dates for the next edition have not yet been announced. Leave your details and the festival team will share confirmed news when it is ready.</span></div>
          <KirtanSafariFutureInterestForm />
        </div>
      </section>

      <style>{`
        .ks-archive{background:#f3ede3;color:#30231d}.ks-archive-hero{min-height:min(850px,88svh);position:relative;display:flex;align-items:flex-end;overflow:hidden}.ks-archive-hero-image{background-image:url('/images/kirtan-safari-2026-page-hero.png');background-position:center;background-size:cover;inset:0;position:absolute;filter:saturate(.72)}.ks-archive-overlay{background:linear-gradient(90deg,rgba(38,27,22,.94),rgba(38,27,22,.64) 52%,rgba(38,27,22,.15)),linear-gradient(0deg,rgba(38,27,22,.8),transparent 55%);inset:0;position:absolute}.ks-archive-hero-copy{color:white;padding-bottom:clamp(3rem,8vw,6rem);position:relative}.ks-archive-hero-copy>p,.ks-archive-intro>p,.ks-future-grid>div>p{color:#d4aa63;font:800 0.75rem/1 var(--font-body,sans-serif);letter-spacing:.2em;margin:0 0 .9rem;text-transform:uppercase}.ks-archive-hero h1{font:700 clamp(3rem,9vw,7rem)/.95 var(--font-display,serif);margin:0 0 1rem;max-width:850px}.ks-archive-hero-copy>strong{display:block;font:700 clamp(1rem,2vw,1.35rem)/1.4 var(--font-display,serif);margin-bottom:.7rem}.ks-archive-hero-copy>span{color:rgba(255,255,255,.72);display:block;font:400 .9rem/1.75 var(--font-body,sans-serif);max-width:720px}.ks-archive-actions{display:flex;flex-wrap:wrap;gap:.65rem;margin-top:1.5rem}.ks-archive-actions a{align-items:center;border:1px solid rgba(255,255,255,.3);color:white;display:inline-flex;font:800 0.75rem/1 var(--font-body,sans-serif);gap:.45rem;letter-spacing:.11em;min-height:44px;padding:.85rem 1rem;text-decoration:none;text-transform:uppercase}.ks-archive-actions a:first-child{background:var(--color-festival-red);border-color:var(--color-festival-red)}.ks-archive-story{padding:clamp(3.5rem,8vw,7rem) 0}.ks-archive-intro{max-width:760px}.ks-archive-intro h2,.ks-future-grid h2{font:700 clamp(2rem,5vw,3.7rem)/1.04 var(--font-display,serif);margin:0 0 1rem}.ks-archive-intro>span,.ks-future-grid>div>span{color:#67544a;font:400 .95rem/1.75 var(--font-body,sans-serif)}.ks-archive-days{display:grid;grid-template-columns:repeat(4,1fr);gap:.7rem;margin-top:2.5rem}.ks-archive-days article{background:#fffaf2;border-top:3px solid var(--color-festival-red);padding:1.2rem}.ks-archive-days article>span{color:var(--color-festival-red);font:800 0.75rem/1 var(--font-body,sans-serif);letter-spacing:.12em;text-transform:uppercase}.ks-archive-days h3{font:700 1.25rem/1.15 var(--font-display,serif);margin:.55rem 0}.ks-archive-days p,.ks-archive-days li{color:#75645b;font:500 0.75rem/1.5 var(--font-body,sans-serif)}.ks-archive-days ul{margin:.8rem 0 0;padding-left:1rem}.ks-archive-links{display:grid;grid-template-columns:repeat(2,1fr);gap:.8rem;margin-top:2.5rem}.ks-archive-links a{background:#30231d;color:white;display:grid;gap:.45rem;padding:1.4rem;text-decoration:none}.ks-archive-links span{color:#d4aa63;font:800 0.75rem/1 var(--font-body,sans-serif);letter-spacing:.14em;text-transform:uppercase}.ks-archive-links strong{font:700 1.25rem/1.2 var(--font-display,serif)}.ks-archive-links em{color:rgba(255,255,255,.62);font:400 0.75rem/1.5 var(--font-body,sans-serif)}.ks-edition-nav{align-items:center;border-bottom:1px solid rgba(48,35,29,.18);border-top:1px solid rgba(48,35,29,.18);display:flex;gap:1rem;margin-top:2.5rem;padding:1rem 0}.ks-edition-nav span{font:800 0.75rem/1 var(--font-body,sans-serif);letter-spacing:.13em;text-transform:uppercase}.ks-edition-nav strong{background:var(--color-festival-red);color:white;padding:.5rem .8rem}.ks-edition-nav em{color:#806f66;font:400 0.75rem/1.4 var(--font-body,sans-serif)}.ks-future-editions{background:#e8dfd1;padding:clamp(3.5rem,7vw,6rem) 0}.ks-future-grid{align-items:start;display:grid;gap:clamp(2rem,6vw,5rem);grid-template-columns:.8fr 1.2fr}.ks-future-grid>div>p{color:var(--color-festival-red)}@media(max-width:850px){.ks-archive-days{grid-template-columns:repeat(2,1fr)}.ks-future-grid{grid-template-columns:1fr}}@media(max-width:540px){.ks-archive-hero{min-height:82svh}.ks-archive-overlay{background:linear-gradient(0deg,rgba(38,27,22,.96),rgba(38,27,22,.45) 76%,rgba(38,27,22,.18))}.ks-archive-days,.ks-archive-links{grid-template-columns:1fr}.ks-edition-nav{align-items:flex-start;flex-wrap:wrap}.ks-edition-nav em{flex-basis:100%}}
      `}</style>
    </div>
  );
}
