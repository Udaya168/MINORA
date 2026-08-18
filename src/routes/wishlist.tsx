import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { getProduct } from "@/data/products";
import { inr } from "@/lib/format";
import { useStore } from "@/lib/store";
import { Stars } from "@/components/site/Stars";
import { UserPortalLayout } from "@/components/site/UserPortalLayout";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "My Wishlist — MINORA" },
      { name: "description", content: "All the MINORA styles you saved for later. Move them to your bag whenever you're ready." },
      { property: "og:title", content: "My Wishlist — MINORA" },
      { property: "og:description", content: "Your saved styles on MINORA." },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart, hydrated } = useStore();
  const items = wishlist.map(getProduct).filter(Boolean);

  if (hydrated && items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <Heart size={40} className="mx-auto text-muted-foreground" />
        <h1 className="mt-4 font-display text-2xl">Your wishlist is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">Tap the heart on any product to save it here.</p>
        <Link to="/c/$slug" params={{ slug: "trending" }} className="mt-6 inline-block rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">
          Explore Trending
        </Link>
      </div>
    );
  }

  return (
    <UserPortalLayout>
    <div className="mx-auto max-w-[1200px] px-3 py-5 sm:px-5">
      <h1 className="font-display text-2xl">My Wishlist</h1>
      <p className="text-sm text-muted-foreground">{items.length} items saved</p>

      <ul className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {items.map((p) => (
          <li key={p!.id} className="overflow-hidden rounded-xl border border-border bg-card">
            <Link to="/product/$id" params={{ id: p!.id }}>
              <img src={p!.images[0]} alt={p!.name} loading="lazy" width={768} height={1024} className="aspect-3/4 w-full object-cover" />
            </Link>
            <div className="space-y-1 p-3">
              <h2 className="line-clamp-2 text-sm font-medium">{p!.name}</h2>
              <Stars rating={p!.rating} />
              <div className="flex flex-wrap items-baseline gap-1.5">
                <span className="text-sm font-semibold">{inr(p!.price)}</span>
                <span className="text-xs text-muted-foreground line-through">{inr(p!.originalPrice)}</span>
                <span className="text-xs font-semibold text-success">{p!.discount}% off</span>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    addToCart(p!.id, p!.sizes[0] ?? "Free Size");
                    removeFromWishlist(p!.id);
                    toast.success("Moved to bag");
                  }}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-primary py-2 text-xs font-semibold text-primary-foreground"
                >
                  <ShoppingBag size={13} /> Move to Cart
                </button>
                <button
                  type="button"
                  aria-label={`Remove ${p!.name} from wishlist`}
                  onClick={() => {
                    removeFromWishlist(p!.id);
                    toast.success("Removed from wishlist");
                  }}
                  className="grid h-8 w-8 place-items-center rounded-md border border-border text-muted-foreground hover:text-primary"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
    </UserPortalLayout>
  );
}