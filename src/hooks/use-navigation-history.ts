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

  useEffect(() => {
    const currentPath = location.pathname;
    const searchStr = location.searchStr;
    const fullPath = currentPath + searchStr;

    const stackStr = sessionStorage.getItem("minora_nav_stack");
    let stack: string[] = stackStr ? JSON.parse(stackStr) : [];

    if (currentPath === "/") {
      // Clear stack when user lands on home page
      sessionStorage.setItem("minora_nav_stack", JSON.stringify([]));
    } else {
      const isAllowed = ALLOWED_BACK_ROUTES.some((regex) => regex.test(currentPath));
      if (isAllowed) {
        if (stack.length > 1 && stack[stack.length - 2] === fullPath) {
          // If the current path matches the previous item in our stack, it's a POP (Back navigation)
          stack.pop();
        } else if (stack[stack.length - 1] !== fullPath) {
          // Normal PUSH
          stack.push(fullPath);
        }
        sessionStorage.setItem("minora_nav_stack", JSON.stringify(stack));
      }
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
