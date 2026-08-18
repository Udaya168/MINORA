import { type ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
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
      <main className="flex-1 pb-0 relative">
        <div className="mx-auto max-w-[1400px] px-4 pt-4 sm:px-6 sm:pt-6 w-full">
          <BackButton />
        </div>
        {children}
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
