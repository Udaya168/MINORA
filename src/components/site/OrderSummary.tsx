import { Link, useNavigate } from "@tanstack/react-router";
import { inr } from "@/lib/format";
import { useStore } from "@/lib/store";

export function OrderSummary({
  cta,
  to,
  onCta,
}: {
  cta: string;
  to?: "/checkout" | undefined;
  onCta?: (() => void) | undefined;
}) {
  const { totals, isLoggedIn, openLoginModal } = useStore();
  const navigate = useNavigate();

  const rows = [
    { label: `Item Total (${totals.items} items)`, value: inr(totals.mrp) },
    { label: "Discount", value: `− ${inr(totals.discount)}`, good: true },
    {
      label: "Delivery",
      value: totals.delivery === 0 ? "FREE" : inr(totals.delivery),
      good: totals.delivery === 0,
    },
  ];

  return (
    <aside className="rounded-xl border border-border bg-card p-4 lg:sticky lg:top-36">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Price Details
      </h2>
      <dl className="mt-3 space-y-2 text-sm">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between gap-3">
            <dt className="text-muted-foreground">{r.label}</dt>
            <dd className={r.good ? "font-medium text-success" : ""}>{r.value}</dd>
          </div>
        ))}
        <div className="flex justify-between gap-3 border-t border-border pt-3 text-base font-semibold">
          <dt>Total Amount</dt>
          <dd>{inr(totals.total)}</dd>
        </div>
      </dl>
      {totals.delivery === 0 && totals.items > 0 && (
        <p className="mt-2 text-xs font-medium text-success">Free delivery available on this order</p>
      )}
      {to ? (
        <button
          type="button"
          onClick={() => {
            if (!isLoggedIn) {
              openLoginModal(() => {
                navigate({ to: "/checkout" });
              });
            } else {
              navigate({ to: "/checkout" });
            }
          }}
          className="mt-4 w-full rounded-md bg-primary py-3 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {cta}
        </button>
      ) : (
        <button type="button" onClick={onCta} className="mt-4 w-full rounded-md bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
          {cta}
        </button>
      )}
    </aside>
  );
}