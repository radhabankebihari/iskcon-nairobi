// The screen sizes every page must render correctly at. This list is the single
// source for the screen guard (screens.spec.ts) and docs/RENDERING_RULES.md.
//
// Sizes are the browser's visible area, not the device's resolution: a laptop
// loses about 110px of height to the address bar, tabs and taskbar, and Windows
// display scaling shrinks the CSS width (1920x1080 at 150% = 1280 wide).
//
// "ci" sizes run on every push with `npm run test:e2e`. "full" sizes run with
// `npm run test:screens`, before any release that changes layout.

export type Screen = {
  name: string;
  width: number;
  height: number;
  touch: boolean;
  tier: "ci" | "full";
  why: string;
};

export const screens: Screen[] = [
  { name: "reflow-320", width: 320, height: 568, touch: true, tier: "full", why: "Smallest phones; also 1280px at 400% zoom (WCAG reflow)" },
  { name: "phone-360", width: 360, height: 740, touch: true, tier: "ci", why: "Most common Android phone width" },
  { name: "phone-390", width: 390, height: 844, touch: true, tier: "full", why: "iPhone 13 to 16" },
  { name: "phone-430", width: 430, height: 932, touch: true, tier: "full", why: "Large phones (Pro Max, Plus)" },
  { name: "phone-landscape", width: 844, height: 390, touch: true, tier: "ci", why: "Phone turned sideways: the shortest screen we support" },
  { name: "tablet-768", width: 768, height: 1024, touch: true, tier: "full", why: "iPad portrait" },
  { name: "tablet-landscape", width: 1024, height: 768, touch: true, tier: "ci", why: "iPad landscape and small laptops" },
  { name: "tablet-pro", width: 1024, height: 1366, touch: true, tier: "full", why: "Large tablet portrait: very tall" },
  { name: "tablet-air-landscape", width: 1180, height: 820, touch: true, tier: "full", why: "iPad Air landscape" },
  { name: "laptop-150", width: 1280, height: 650, touch: false, tier: "ci", why: "1920x1080 laptop at Windows' recommended 150% scaling" },
  { name: "laptop-1280x800", width: 1280, height: 800, touch: false, tier: "full", why: "Older 13-inch laptops" },
  { name: "laptop-1366", width: 1366, height: 657, touch: false, tier: "ci", why: "Most common laptop screen (1366x768)" },
  { name: "macbook-air", width: 1440, height: 760, touch: false, tier: "full", why: "MacBook Air 13-inch" },
  { name: "laptop-125", width: 1536, height: 730, touch: false, tier: "ci", why: "1920x1080 laptop at 125% scaling" },
  { name: "desktop-fhd", width: 1920, height: 960, touch: false, tier: "ci", why: "Full HD monitor" },
  { name: "desktop-qhd", width: 2560, height: 1300, touch: false, tier: "full", why: "Large monitor" },
  { name: "ultrawide", width: 3440, height: 1340, touch: false, tier: "full", why: "Ultra-wide monitor" },
];
