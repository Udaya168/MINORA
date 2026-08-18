import { createFileRoute, Link } from "@tanstack/react-router";
import { PackageSearch, RotateCcw, CreditCard, Ruler, MessageCircle, Phone } from "lucide-react";
import { UserPortalLayout } from "@/components/site/UserPortalLayout";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help Centre — MINORA" },
      { name: "description", content: "Track orders, start a return or exchange, understand refunds and size charts, or reach the MINORA support team." },
      { property: "og:title", content: "Help Centre — MINORA" },
      { property: "og:description", content: "Orders, returns, refunds and sizing help for MINORA shoppers." },
    ],
  }),
  component: HelpPage,
});

const TOPICS = [
  { icon: PackageSearch, title: "Orders & Delivery", body: "Track your shipment, change your address before dispatch, or check delivery timelines." },
  { icon: RotateCcw, title: "Returns & Exchanges", body: "Free 14-day returns on most styles. Raise a request from My Orders." },
  { icon: CreditCard, title: "Payments & Refunds", body: "UPI, cards, net banking and COD. Refunds land in 3-5 business days." },
  { icon: Ruler, title: "Size & Fit", body: "Detailed size charts for kurtis, sarees, lehengas, jeans and footwear." },
];

const FAQS = [
  ["How long does delivery take?", "Standard delivery reaches most Indian pincodes in 3-5 business days. Express delivery arrives in 1-2 business days for ₹99."],
  ["Is return free?", "Yes. Returns and exchanges are free within 14 days of delivery on all eligible items, with doorstep pickup."],
  ["When will I get my refund?", "Once the pickup is complete, refunds are initiated within 24 hours and reflect in 3-5 business days depending on your bank."],
  ["Do you deliver cash on delivery?", "COD is available on orders up to ₹15,000 across 19,000+ pincodes."],
  ["Are the products authentic?", "Every MINORA seller is verified, and each order passes a quality check before it is packed."],
];

function HelpPage() {
  return (
    <UserPortalLayout>
    <div className="mx-auto max-w-[1000px] px-4 py-8">
      <h1 className="font-display text-3xl">Help Centre</h1>
      <p className="mt-1 text-sm text-muted-foreground">We're here 7 days a week, 9 AM to 9 PM IST.</p>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {TOPICS.map((t) => (
          <li key={t.title} className="card-elevated rounded-xl border border-border bg-card p-5">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary-soft text-primary"><t.icon size={20} /></span>
            <h2 className="mt-3 font-display text-lg">{t.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t.body}</p>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 font-display text-2xl">Frequently asked questions</h2>
      <div className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
        {FAQS.map(([q, a]) => (
          <details key={q} className="group p-4">
            <summary className="cursor-pointer list-none text-sm font-medium marker:hidden">{q}</summary>
            <p className="mt-2 text-sm text-muted-foreground">{a}</p>
          </details>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <MessageCircle size={20} className="text-primary" />
          <h2 className="mt-2 font-display text-lg">Chat with us</h2>
          <p className="mt-1 text-sm text-muted-foreground">Average response time under 2 minutes.</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <Phone size={20} className="text-primary" />
          <h2 className="mt-2 font-display text-lg">Call support</h2>
          <p className="mt-1 text-sm text-muted-foreground">1800 200 4567 (toll free)</p>
        </div>
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        Have questions about an ongoing order? Reach out to support via chat or phone anytime.
      </p>
    </div>
    </UserPortalLayout>
  );
}