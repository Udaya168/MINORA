import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";

export const ALLOWED_BACK_ROUTES = [
  /^\/product/,
  /^\/c\//,
  /^\/search/,
  /^\/cart/,
  /^\/wishlist/,
  /^\/account/,
  /^\/checkout/,
  /^\/login/,
  /^\/help/,
  /^\/sell/
];

export function useNavigationHistoryTracker() {
  const location = useLocation();

  // 1. Track scroll position continuously
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const fullPath = location.pathname + location.searchStr;
          const scrollPositionsStr = sessionStorage.getItem("minora_scroll_positions");
          const positions = scrollPositionsStr ? JSON.parse(scrollPositionsStr) : {};
          positions[fullPath] = window.scrollY;
          sessionStorage.setItem("minora_scroll_positions", JSON.stringify(positions));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname, location.searchStr]);

  // 2. Manage nav stack and restore scroll when popping back
  useEffect(() => {
    const currentPath = location.pathname;
    const searchStr = location.searchStr;
    const fullPath = currentPath + searchStr;

    const stackStr = sessionStorage.getItem("minora_nav_stack");
    let stack: string[] = stackStr ? JSON.parse(stackStr) : [];
    
    let isBackNavigation = false;

    if (currentPath === "/") {
      // Clear stack when user lands on home page
      sessionStorage.setItem("minora_nav_stack", JSON.stringify([fullPath]));
    } else {
      const isAllowed = ALLOWED_BACK_ROUTES.some((regex) => regex.test(currentPath));
      if (isAllowed) {
        if (stack.length > 1 && stack[stack.length - 2] === fullPath) {
          // If the current path matches the previous item in our stack, it's a POP (Back navigation)
          stack.pop();
          isBackNavigation = true;
        } else if (stack[stack.length - 1] !== fullPath) {
          // Normal PUSH
          stack.push(fullPath);
        }
        sessionStorage.setItem("minora_nav_stack", JSON.stringify(stack));
      }
    }

    if (isBackNavigation) {
      const scrollPositionsStr = sessionStorage.getItem("minora_scroll_positions");
      const positions = scrollPositionsStr ? JSON.parse(scrollPositionsStr) : {};
      const savedScroll = positions[fullPath];
      
      if (savedScroll !== undefined) {
        // Wait for paint to restore scroll properly
        window.requestAnimationFrame(() => {
          window.scrollTo(0, savedScroll);
          
          // Additional fallback in case elements (e.g. images) load dynamically and push content
          const timeoutId = setTimeout(() => {
            window.scrollTo(0, savedScroll);
          }, 100);
          
          // One final check slightly later for safety
          const timeoutId2 = setTimeout(() => {
            window.scrollTo(0, savedScroll);
          }, 300);
        });
      }
    } else {
      // Normal navigation (Push), always start at the top
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.searchStr]);
}

export function getNavigationStack(): string[] {
  if (typeof window === "undefined") return [];
  const stackStr = sessionStorage.getItem("minora_nav_stack");
  return stackStr ? JSON.parse(stackStr) : [];
}

export function isAllowedBackRoute(pathname: string): boolean {
  return ALLOWED_BACK_ROUTES.some((regex) => regex.test(pathname));
}
