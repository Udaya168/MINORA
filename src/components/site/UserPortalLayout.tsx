import { type ReactNode } from "react";
import { Header } from "./Header";
import { BackToTop } from "./BackToTop";
import { BackButton } from "./BackButton";

/**
 * Minimal layout for internal user portal pages (login, account, checkout, etc.).
 * Renders a clean header (no announcement bar, no category nav) + children.
 * Does NOT render the full storefront footer — only a minimal copyright line.
 */
export function UserPortalLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header isLanding={false} showCategoryNav={false} />
      <main className="flex-1 pb-0 relative">
        <div className="mx-auto max-w-[1400px] px-4 pt-4 sm:px-6 sm:pt-6 w-full">
          <BackButton />
        </div>
        {children}
      </main>
      <footer className="border-t border-border bg-background py-6 text-center text-[10px] text-muted-foreground/60 tracking-widest uppercase">
        © {new Date().getFullYear()} MINORA. All rights reserved.
      </footer>
      <BackToTop />
    </>
  );
}
