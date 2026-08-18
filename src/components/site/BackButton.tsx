import { useNavigate, useRouter, useLocation } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { getNavigationStack, isAllowedBackRoute } from "@/hooks/use-navigation-history";

export function BackButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === "/" || !isAllowedBackRoute(location.pathname)) {
    return null;
  }

  const handleBack = () => {
    const stack = getNavigationStack();
    
    // We expect the current page to be at the end of the stack.
    // The previous page is at stack.length - 2.
    if (stack.length > 1) {
      // It's safe to pop visually, we can also use router.history.back() to actually pop standard browser history too.
      router.history.back();
    } else {
      // No internal history exists (e.g. they opened the page directly in a new tab)
      // Fallback safely to home page, replacing current state
      navigate({ to: "/", replace: true });
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-foreground/80 transition-colors hover:text-primary ${className}`}
      aria-label="Go back"
    >
      <ArrowLeft size={14} />
      Back
    </button>
  );
}
