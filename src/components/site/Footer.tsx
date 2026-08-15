import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube } from "lucide-react";
import { Logo } from "./Logo";

const columns = [
  {
    title: "MINORA",
    links: ["About Us", "Careers", "Contact Us"],
  },
  {
    title: "Customer Care",
    links: ["Help Center", "Returns", "Shipping", "FAQs"],
  },
  {
    title: "For Sellers",
    links: ["Sell on MINORA", "Seller Dashboard", "Seller Policies"],
  },
  {
    title: "Legal",
    links: ["Terms & Conditions", "Privacy Policy", "Refund Policy"],
  },
];

export function Footer() {
  return (
    <footer className="mt-14 border-t border-border bg-secondary/60">
      <div className="mx-auto grid max-w-[1400px] gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-5">
        <div className="space-y-3">
          <Logo className="h-8" />
          <p className="max-w-xs text-sm text-muted-foreground">
            Modern Indian fashion for every day — ethnic classics, western
            staples and accessories at prices that make sense.
          </p>
          <div className="flex gap-2 pt-1">
            {[Instagram, Facebook, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label={["Instagram", "Facebook", "YouTube"][i]}
                className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-foreground/70 transition-colors hover:border-primary hover:text-primary"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="font-display text-sm tracking-wide">{col.title}</h2>
            <ul className="mt-3 space-y-2">
              {col.links.map((l) => (
                <li key={l}>
                  <Link
                    to={l === "Sell on MINORA" || l === "Seller Dashboard" ? "/sell" : "/help"}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © 2026 MINORA. All rights reserved.
      </div>
    </footer>
  );
}