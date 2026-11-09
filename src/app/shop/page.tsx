import Image from "next/image";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import { ShoppingBag, Star } from "lucide-react";
import { withSeo } from "@/lib/seo";
import SectionHeading from "@/components/ui/SectionHeading";
import ButtonLink from "@/components/ui/ButtonLink";

export const metadata = withSeo({
  title: "Prasadam Sweet Shop",
  description: "Artisanal Vaishnava sweets and prasadam products from ISKCON Nairobi's kitchen. Festival specials, gift packs, and bulk orders.",
}, "/shop");

const products = [
  { name: "Laddhu (Box of 12)", price: "KES 950", desc: "Classic saffron-infused gram flour laddhu prepared with pure ghee. The original prasadam sweet.", tag: "Bestseller", image: "/images/food-for-life/khichdi-prasadam.webp" },
  { name: "Gulab Jamun (Box of 16)", price: "KES 800", desc: "Soft milk-solid dumplings soaked in rose-infused sugar syrup. Prepared fresh to order.", tag: "Popular", image: "/images/food-for-life/khichdi-prasadam.webp" },
  { name: "Halava Gift Pack", price: "KES 1,200", desc: "Semolina halava packed in artisan containers - ideal as a devotional gift or festival offering.", tag: "Gift", image: "/images/food-for-life/khichdi-prasadam.webp" },
  { name: "Barfi Assortment (500g)", price: "KES 1,400", desc: "Mixed milk-based barfi selection - pistachio, saffron, coconut, and rose. Beautifully boxed.", tag: "Assortment", image: "/images/food-for-life/khichdi-prasadam.webp" },
  { name: "Festival Sweet Hamper", price: "KES 3,500", desc: "A curated hamper of six varieties - the perfect corporate or family gift for festivals and celebrations.", tag: "Festival", image: "/images/food-for-life/khichdi-prasadam.webp" },
  { name: "Bulk Order (5kg+)", price: "From KES 4,500", desc: "Wholesale prasadam sweets for events, weddings, corporate functions, and temple programmes.", tag: "Bulk", image: "/images/food-for-life/khichdi-prasadam.webp" },
];

export default function ShopPage() {
  notFound(); // Keep the prepared page unpublished until the shop is approved.
  return (
    <>
      <PageHero
        title="Prasadam"
        titleAccent="Sweet Shop"
        subtitle="Artisanal Temple Sweets"
        description="Handcrafted Vaishnava sweets prepared with pure ingredients, devotion, and the highest culinary standards from our temple kitchen."
        image="/images/food-for-life/khichdi-prasadam.webp"
        className="sm:min-h-[500px]"
      />

      {/* Brand strip */}
      <div className="bg-gold py-5 section-padding">
        <div className="content-width flex flex-wrap items-center justify-center gap-8">
          {["Pure Ghee", "No Preservatives", "Temple Prepared", "Made Fresh to Order", "Nairobi Delivery"].map(tag => (
            <div key={tag} className="flex items-center gap-2">
              <Star size={10} className="text-white" />
              <span className="font-body text-ink text-xs font-medium tracking-wider">{tag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Products */}
      <section className="py-section bg-temple-bg">
        <div className="content-width section-padding">
          <div className="text-center mb-12">
            <SectionHeading eyebrow="Our Products" title="Temple Sweets" accent="& Prasadam" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.name} className="group card-surface hover:shadow-card-hover hover:border-gold/30 transition-all overflow-hidden">
                <div className="relative h-52 overflow-hidden">
                  <Image width={1600} height={1200} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-3 left-3">
                    <span className="font-body text-xs font-bold tracking-widest uppercase bg-gold text-ink px-3 py-1">{product.tag}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-display text-lg font-semibold text-ink">{product.name}</h3>
                    <span className="font-display text-gold-ink font-bold text-lg flex-shrink-0 ml-2">{product.price}</span>
                  </div>
                  <p className="font-body text-ink/75 text-sm leading-relaxed mb-5">{product.desc}</p>
                  <button className="min-h-11 w-full flex items-center justify-center gap-2 bg-temple-brown text-white font-body text-sm font-semibold py-3 hover:bg-gold hover:text-ink transition-colors">
                    <ShoppingBag size={12} />
                    Order Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Ordering info */}
          <div className="mt-14 bg-temple-cream border border-temple-sand p-8 lg:p-10 grid sm:grid-cols-3 gap-8">
            {[
              { title: "Order Process", desc: "Place your order via WhatsApp or email. We confirm availability and prepare fresh within 24 - 48 hours." },
              { title: "Delivery", desc: "Nairobi delivery available. Same-day pickup at the temple (South C). Outstation orders via courier." },
              { title: "Bulk & Events", desc: "Special pricing for orders over 2kg. Ideal for weddings, corporate events, and festival distribution." },
            ].map((item) => (
              <div key={item.title}>
                <h4 className="font-display text-lg font-semibold text-ink mb-2">{item.title}</h4>
                <div className="w-5 h-px bg-gold/40 mb-3" />
                <p className="font-body text-ink/75 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <ButtonLink variant="primary" href="/contact">Place a custom order</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
