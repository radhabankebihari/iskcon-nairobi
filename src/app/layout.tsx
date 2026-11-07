import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import SavannaDivider from "@/components/ui/SavannaDivider";
import PwaRegistrar from "@/components/system/PwaRegistrar";
import AnalyticsTracker from "@/components/system/AnalyticsTracker";
import CalendarNotificationManager from "@/components/system/CalendarNotificationManager";
import NoticeNotificationManager from "@/components/system/NoticeNotificationManager";
import WhatsAppWidget from "@/components/ui/WhatsAppWidget";
import InstallPromptBanner from "@/components/ui/InstallPromptBanner";
import { templeHours, templeInfo } from "@/data/site";
import { safeJsonLd } from "@/lib/security";
import { previewImage, SITE_NAME } from "@/lib/seo";

const siteUrl = "https://iskconnairobi.com";
const iconVersion = "v=pwa-resilient-2026-08-24";
const siteTitle = "ISKCON Nairobi | Sri Sri Radha Bankebihari Temple";
const siteDescription =
  "Visit ISKCON Nairobi, Sri Sri Radha Bankebihari Temple: daily darshan, kirtan, prasadam, spiritual education, festivals, cow protection, and service in East Africa.";

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-site-inter",
  display: "swap",
});

const sourceSerif4 = Source_Serif_4({
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  variable: "--font-source-serif-4",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#3a2a24",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "ISKCON Nairobi",
  title: {
    default: siteTitle,
    template: `%s | ${SITE_NAME}`,
  },
  description: siteDescription,
  keywords: ["ISKCON Nairobi", "Hare Krishna Kenya", "Krishna Consciousness", "HKTC", "Kirtan Safari", "Food For Life Kenya"],
  authors: [{ name: "ISKCON Nairobi" }],
  creator: "ISKCON Nairobi",
  publisher: "ISKCON Nairobi",
  category: "religion",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  appleWebApp: {
    capable: true,
    title: "ISKCON Nairobi",
    statusBarStyle: "black-translucent",
  },
  manifest: `/manifest.webmanifest?${iconVersion}`,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "ISKCON Nairobi",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: previewImage,
        width: 1200,
        height: 630,
        alt: "ISKCON Nairobi link preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [previewImage],
  },
  icons: {
    icon: [
      { url: `/favicon.ico?${iconVersion}`, sizes: "any" },
      { url: `/icon.png?${iconVersion}`, sizes: "32x32", type: "image/png" },
      { url: `/brand/icon-192.png?${iconVersion}`, sizes: "192x192", type: "image/png" },
      { url: `/brand/icon-512.png?${iconVersion}`, sizes: "512x512", type: "image/png" },
      { url: `/brand/iskcon-icon.svg?${iconVersion}`, type: "image/svg+xml" },
    ],
    apple: [
      { url: `/apple-icon.png?${iconVersion}`, sizes: "180x180", type: "image/png" },
      { url: `/brand/apple-touch-icon.png?${iconVersion}`, sizes: "180x180", type: "image/png" },
    ],
    shortcut: [`/favicon.ico?${iconVersion}`],
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "HinduTemple",
  name: templeInfo.name,
  alternateName: templeInfo.legalName,
  url: siteUrl,
  telephone: templeInfo.phoneHref,
  email: templeInfo.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Hare Krishna Close, Parklands / West Ngara",
    addressLocality: "Nairobi",
    addressCountry: "KE",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: templeHours.morning.opens,
      closes: templeHours.morning.closes,
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: templeHours.evening.opens,
      closes: templeHours.evening.closes,
    },
  ],
  image: `${siteUrl}${previewImage}`,
};

// Matches the 40px threshold in Navigation. It keeps listening, because the
// browser restores a refreshed page's scroll position after this runs.
const navScrollScript = `(function(){var d=document.documentElement;function s(){if(window.scrollY>40){d.setAttribute("data-nav-scrolled","")}else{d.removeAttribute("data-nav-scrolled")}}s();window.addEventListener("scroll",s,{passive:true})})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${sourceSerif4.variable}`}
      // The scroll script below adds data attributes to <html> before React loads.
      suppressHydrationWarning
    >
      <body className="bg-sand text-dusk antialiased">
        {/* Marks the page as scrolled from the first moment, including when a
            refresh restores a mid-page position, so the header can show its
            solid compact form before the page scripts load. See globals.css. */}
        <script dangerouslySetInnerHTML={{ __html: navScrollScript }} />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(structuredData) }}
        />
        {/* Global browser systems live above the visible chrome: PWA install,
            privacy-conscious analytics, calendar/notice notifications, then
            the navigation shell. Keep user-facing layout changes below
            Navigation unless they truly belong to every page. */}
        <PwaRegistrar />
        <AnalyticsTracker />
        <CalendarNotificationManager />
        <NoticeNotificationManager />
        <Navigation />
        <main id="main-content" tabIndex={-1}>{children}</main>
        <SavannaDivider tone="sand" className="h-[7vw] min-h-6 sm:h-24" />
        <Footer />
        <WhatsAppWidget />
        <InstallPromptBanner />
      </body>
    </html>
  );
}
