import { type ReactNode } from "react";
import { Header } from "./Header";
import { BackToTop } from "./BackToTop";
import { BackButton } from "./BackButton";

/**
 * Layout for storefront browsing pages (category listings, product details, search results).
 * Renders the full header with category nav + full footer.
 * Does NOT render the landing page announcement bar or hero.
 */
export function StorefrontLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header isLanding={false} showCategoryNav={true} />
      <main className="flex-1 pb-0 relative overflow-x-hidden sm:overflow-x-visible w-full max-w-full">
        <div className="mx-auto max-w-[1400px] px-4 min-[390px]:px-5 sm:px-6 lg:px-5 pt-4 sm:pt-6 w-full box-border">
          <BackButton />
        </div>
        {children}
      </main>
      <BackToTop />
    </>
  );
}
