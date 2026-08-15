import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube } from "lucide-react";
import { Logo } from "./Logo";
import { useStore } from "@/lib/store";

const columns = [
  {
    title: "SHOP",
    links: ["Women", "Men", "Kids", "Ethnic Wear", "Western Wear", "Jewellery", "Beauty", "Footwear", "Bags"],
  },
  {
    title: "CUSTOMER CARE",
    links: ["Help Center", "Returns", "Shipping", "FAQs"],
  },
  {
    title: "FOR SELLERS",
    links: ["Sell on MINORA", "Seller Dashboard", "Seller Policies"],
  },
  {
    title: "LEGAL",
    links: ["Terms & Conditions", "Privacy Policy", "Refund Policy"],
  },
];

const SHOP_SLUGS: Record<string, string> = {
  "Women": "women",
  "Men": "men",
  "Kids": "kids",
  "Ethnic Wear": "ethnic-wear",
  "Western Wear": "western-wear",
  "Jewellery": "jewellery",
  "Beauty": "beauty",
  "Footwear": "footwear",
  "Bags": "bags"
};

export function Footer() {
  const { openLegalModal } = useStore();
  return (
    <footer className="mt-24 border-t border-border bg-background">
      {/* 2. Main Footer Grid */}
      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-16 md:grid-cols-2 lg:grid-cols-5 border-b border-border">
        {/* Brand Info & Association */}
        <div className="space-y-6">
          <Logo className="h-7" />
          <p className="max-w-xs text-xs text-muted-foreground/90 font-light leading-relaxed tracking-wide">
            Modern Indian fashion for every day — ethnic classics, western staples and accessories at prices that make sense.
          </p>
          
          <div className="space-y-4">
            <p className="text-[10px] font-bold tracking-widest text-foreground uppercase">
              Associated under Mavros Tech Pvt Ltd.
            </p>
            <div className="flex gap-2">
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={["Instagram", "Facebook", "YouTube"][i]}
                  className="grid h-9 w-9 place-items-center rounded-full border border-border bg-background text-foreground/60 transition-all duration-300 hover:bg-secondary hover:-translate-y-0.5"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Links Column */}
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title} className="space-y-4">
            <h3 className="text-[10px] font-bold tracking-[0.2em] text-foreground uppercase">{col.title}</h3>
            <ul className="space-y-2">
               {col.links.map((l) => {
                 const isTerms = l === "Terms & Conditions";
                 const isPrivacy = l === "Privacy Policy";
                 const isRefund = l === "Refund Policy";

                 if (isTerms || isPrivacy || isRefund) {
                   const type = isTerms ? "terms" : isPrivacy ? "privacy" : "refund";
                   return (
                     <li key={l}>
                       <button
                         type="button"
                         onClick={() => openLegalModal(type)}
                         className="text-xs text-muted-foreground hover:text-primary transition-colors tracking-wide font-light text-left"
                       >
                         {l}
                       </button>
                     </li>
                   );
                 }

                 const shopSlug = SHOP_SLUGS[l];
                 if (shopSlug) {
                   return (
                     <li key={l}>
                       <Link
                         to="/c/$slug"
                         params={{ slug: shopSlug }}
                         className="text-xs text-muted-foreground hover:text-primary transition-colors tracking-wide font-light"
                       >
                         {l}
                       </Link>
                     </li>
                   );
                 }

                 return (
                   <li key={l}>
                     <Link
                       to={l === "Sell on MINORA" || l === "Seller Dashboard" ? "/sell" : "/help"}
                       className="text-xs text-muted-foreground hover:text-primary transition-colors tracking-wide font-light"
                     >
                       {l}
                     </Link>
                   </li>
                 );
               })}
            </ul>
          </nav>
        ))}
      </div>

      <div className="py-8 text-center text-[10px] text-muted-foreground/60 tracking-widest uppercase">
        © {new Date().getFullYear()} MINORA. All rights reserved.
      </div>
    </footer>
  );
}