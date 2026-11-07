import { Flame, GraduationCap, Heart, Music, Soup, Sprout, type LucideIcon } from "lucide-react";

// Line icons for each cause, in place of emoji, so they match the rest of the site.
const icons: Record<string, LucideIcon> = {
  "/donate/temple": Flame,
  "/donate/food": Soup,
  "/donate/cows": Sprout,
  "/donate/students": GraduationCap,
  "/donate/festivals": Music,
};

export default function DonationIcon({ href, size = 20, className }: { href: string; size?: number; className?: string }) {
  const Icon = icons[href] ?? Heart;
  return <Icon size={size} className={className} aria-hidden="true" />;
}
