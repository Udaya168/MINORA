import { createFileRoute, Link } from "@tanstack/react-router";
import { IndianRupee, Truck, Users, BarChart3, ShieldCheck, Headphones } from "lucide-react";

export const Route = createFileRoute("/sell")({
  head: () => ({
    meta: [
      { title: "Sell on MINORA — Grow Your Fashion Business" },
      { name: "description", content: "Join thousands of Indian sellers on MINORA. Zero commission for the first 90 days, pan-India delivery, weekly payouts and dedicated seller support." },
      { property: "og:title", content: "Sell on MINORA — Grow Your Fashion Business" },
      { property: "og:description", content: "Zero commission for 90 days, pan-India logistics and weekly payouts for MINORA sellers." },
    ],
  }),
  component: SellPage,
});

const BENEFITS = [
  { icon: IndianRupee, title: "Zero commission for 90 days", body: "Launch your catalogue and keep every rupee of your first three months of sales." },
  { icon: Truck, title: "Pan-India logistics", body: "Pickup from 19,000+ pincodes with tracked delivery handled end to end." },
  { icon: Users, title: "40 lakh+ shoppers", body: "Put your styles in front of buyers across metros and tier-2 and tier-3 cities." },
  { icon: BarChart3, title: "Seller dashboard", body: "Live insights on views, conversions, returns and restock alerts." },
  { icon: ShieldCheck, title: "Weekly secure payouts", body: "Settlements every 7 days directly to your registered bank account." },
  { icon: Headphones, title: "Dedicated support", body: "Onboarding help and a support manager in Hindi and English." },
];

function SellPage() {
  return (
    <div>
      <section className="brand-gradient px-4 py-14 text-center text-primary-foreground sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">MINORA Seller Hub</p>
        <h1 className="mx-auto mt-3 max-w-3xl font-display text-3xl leading-tight sm:text-5xl">
          Take your fashion label to every corner of India
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm opacity-90 sm:text-base">
          From Surat weavers to Jaipur block-printers and homegrown streetwear labels — start selling on MINORA in under 10 minutes.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link to="/login" className="rounded-md bg-background px-7 py-3 text-sm font-semibold text-primary">Start Selling</Link>
          <a href="#benefits" className="rounded-md border border-current px-7 py-3 text-sm font-semibold">Learn More</a>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-10">
        <dl className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
          {[["40L+", "Active shoppers"], ["19,000+", "Serviceable pincodes"], ["7 days", "Payout cycle"], ["₹0", "Listing fee"]].map(([v, l]) => (
            <div key={l} className="rounded-xl border border-border bg-card p-4">
              <dt className="font-display text-2xl text-primary">{v}</dt>
              <dd className="mt-1 text-xs text-muted-foreground">{l}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="benefits" className="mx-auto max-w-[1200px] px-4 pb-12">
        <h2 className="font-display text-2xl">Why sellers choose MINORA</h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b) => (
            <li key={b.title} className="card-elevated rounded-xl border border-border bg-card p-5">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary-soft text-primary">
                <b.icon size={20} />
              </span>
              <h3 className="mt-3 font-display text-lg">{b.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-border bg-secondary/40 px-4 py-12">
        <div className="mx-auto max-w-[1000px]">
          <h2 className="font-display text-2xl">Start in four steps</h2>
          <ol className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Register", "Sign up with your mobile number and GSTIN."],
              ["List", "Upload photos, sizes and pricing for your styles."],
              ["Ship", "We pick up from your doorstep and deliver nationwide."],
              ["Get paid", "Receive settlements every week, on time."],
            ].map(([t, b], i) => (
              <li key={t} className="rounded-xl border border-border bg-card p-5">
                <span className="font-display text-3xl text-accent">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 font-medium">{t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{b}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 text-center">
            <Link to="/login" className="inline-block rounded-md bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground">
              Create Seller Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}