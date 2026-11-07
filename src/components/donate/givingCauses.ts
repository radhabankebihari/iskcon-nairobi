import { donationPaths, socialLinks, templeGiving } from "@/data/site";

// Plain data, shared by the server-rendered donate pages and the client-side
// payment card. It must not live in a "use client" file: a server component
// importing a value from one receives a client reference, not the data.

export type GivingCause = {
  slug: string;
  title: string;
  description: string;
  href: string;
  image: string;
};

export const generalCause: GivingCause = {
  slug: "general",
  title: "General Fund",
  description: "The temple committee directs your gift where the need is greatest: worship, upkeep, and urgent needs.",
  href: "/donate/general",
  image: "/images/iskcon-nairobi-main-altar-wide.jpg",
};

export const givingCauses: GivingCause[] = [
  generalCause,
  ...donationPaths.map((path) => ({
    slug: path.href.split("/").pop() || "",
    title: path.title,
    description: path.description,
    href: path.href,
    image: path.image,
  })),
];

/** How a cause reads inside a sentence, such as "Giving to the General Fund". */
export function causeName(cause: GivingCause) {
  return cause.slug === "general" ? "the General Fund" : cause.title;
}

const whatsapp = socialLinks.find((link) => link.name === "WhatsApp");

/** A WhatsApp link with a ready-made message naming the cause and asking for a receipt. */
export function receiptMessageLink(cause: GivingCause) {
  if (!whatsapp) return null;
  const message =
    `Hare Krishna. I have given to ${causeName(cause)} by M-Pesa ` +
    `(Paybill ${templeGiving.mpesaPaybill}, account ${templeGiving.mpesaAccount}). ` +
    "Please send me a receipt. My name is ";
  return `${whatsapp.href}?text=${encodeURIComponent(message)}`;
}
