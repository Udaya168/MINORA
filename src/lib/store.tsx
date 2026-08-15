import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { PRODUCTS, type Product } from "@/data/products";

export type CartLine = { id: string; size: string; qty: number };

type StoreValue = {
  cart: CartLine[];
  wishlist: string[];
  recent: string[];
  hydrated: boolean;
  addToCart: (id: string, size: string, qty?: number) => void;
  removeFromCart: (id: string, size: string) => void;
  setQty: (id: string, size: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => boolean;
  removeFromWishlist: (id: string) => void;
  isWished: (id: string) => boolean;
  pushRecent: (term: string) => void;
  cartCount: number;
  totals: { items: number; mrp: number; discount: number; delivery: number; total: number };
  isLoggedIn: boolean;
  user: { mobile: string } | null;
  authModalOpen: boolean;
  openLoginModal: (onSuccess?: () => void) => void;
  closeLoginModal: () => void;
  login: (mobile: string) => void;
  logout: () => void;
  legalModalType: "terms" | "privacy" | "refund" | null;
  openLegalModal: (type: "terms" | "privacy" | "refund") => void;
  closeLegalModal: () => void;
};

const StoreContext = createContext<StoreValue | null>(null);

const read = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCart(read<CartLine[]>("minora.cart", []));
    setWishlist(read<string[]>("minora.wishlist", []));
    setRecent(read<string[]>("minora.recent", []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem("minora.cart", JSON.stringify(cart));
  }, [cart, hydrated]);
  useEffect(() => {
    if (hydrated)
      localStorage.setItem("minora.wishlist", JSON.stringify(wishlist));
  }, [wishlist, hydrated]);
  useEffect(() => {
    if (hydrated) localStorage.setItem("minora.recent", JSON.stringify(recent));
  }, [recent, hydrated]);

  const addToCart = useCallback((id: string, size: string, qty = 1) => {
    setCart((prev) => {
      const found = prev.find((l) => l.id === id && l.size === size);
      if (found)
        return prev.map((l) =>
          l === found ? { ...l, qty: Math.min(10, l.qty + qty) } : l,
        );
      return [...prev, { id, size, qty }];
    });
  }, []);

  const removeFromCart = useCallback((id: string, size: string) => {
    setCart((prev) => prev.filter((l) => !(l.id === id && l.size === size)));
  }, []);

  const setQty = useCallback((id: string, size: string, qty: number) => {
    setCart((prev) =>
      prev.map((l) =>
        l.id === id && l.size === size
          ? { ...l, qty: Math.max(1, Math.min(10, qty)) }
          : l,
      ),
    );
  }, []);

  const toggleWishlist = useCallback((id: string) => {
    let added = false;
    setWishlist((prev) => {
      if (prev.includes(id)) return prev.filter((w) => w !== id);
      added = true;
      return [id, ...prev];
    });
    return !added ? false : true;
  }, []);

  const removeFromWishlist = useCallback(
    (id: string) => setWishlist((prev) => prev.filter((w) => w !== id)),
    [],
  );

  const pushRecent = useCallback((term: string) => {
    const t = term.trim();
    if (!t) return;
    setRecent((prev) => [t, ...prev.filter((r) => r !== t)].slice(0, 6));
  }, []);

  const totals = useMemo(() => {
    let mrp = 0;
    let items = 0;
    let payable = 0;
    for (const line of cart) {
      const p: Product | undefined = PRODUCTS.find((x) => x.id === line.id);
      if (!p) continue;
      mrp += p.originalPrice * line.qty;
      payable += p.price * line.qty;
      items += line.qty;
    }
    const delivery = payable > 0 && payable < 499 ? 49 : 0;
    return {
      items,
      mrp,
      discount: mrp - payable,
      delivery,
      total: payable + delivery,
    };
  }, [cart]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ mobile: string } | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [onSuccessCallback, setOnSuccessCallback] = useState<(() => void) | null>(null);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("minora.isLoggedIn") === "true");
    setUser(read<{ mobile: string } | null>("minora.user", null));
  }, []);

  const openLoginModal = useCallback((onSuccess?: () => void) => {
    setOnSuccessCallback(() => onSuccess || null);
    setAuthModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setAuthModalOpen(false);
    setOnSuccessCallback(null);
  }, []);

  const login = useCallback((mobile: string) => {
    setIsLoggedIn(true);
    const userData = { mobile };
    setUser(userData);
    localStorage.setItem("minora.isLoggedIn", "true");
    localStorage.setItem("minora.user", JSON.stringify(userData));
    setAuthModalOpen(false);
    if (onSuccessCallback) {
      onSuccessCallback();
      setOnSuccessCallback(null);
    }
  }, [onSuccessCallback]);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("minora.isLoggedIn");
    localStorage.removeItem("minora.user");
  }, []);

  const [legalModalType, setLegalModalType] = useState<"terms" | "privacy" | "refund" | null>(null);

  const openLegalModal = useCallback((type: "terms" | "privacy" | "refund") => {
    setLegalModalType(type);
  }, []);

  const closeLegalModal = useCallback(() => {
    setLegalModalType(null);
  }, []);

  const value: StoreValue = {
    cart,
    wishlist,
    recent,
    hydrated,
    addToCart,
    removeFromCart,
    setQty,
    clearCart: () => setCart([]),
    toggleWishlist,
    removeFromWishlist,
    isWished: (id) => wishlist.includes(id),
    pushRecent,
    cartCount: cart.reduce((n, l) => n + l.qty, 0),
    totals,
    isLoggedIn,
    user,
    authModalOpen,
    openLoginModal,
    closeLoginModal,
    login,
    logout,
    legalModalType,
    openLegalModal,
    closeLegalModal,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}