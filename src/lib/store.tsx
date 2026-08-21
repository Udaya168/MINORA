import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { PRODUCTS, type Product } from "@/data/products";

import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type CartLine = { id: string; size: string; qty: number };

export type Profile = {
  id: string;
  full_name: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
  phone_number?: string | null;
  date_of_birth?: string | null;
  dob?: string | null;
  gender?: string | null;
  role: string | null;
  [key: string]: any;
};

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
  legalModalType: "terms" | "privacy" | "refund" | null;
  openLegalModal: (type: "terms" | "privacy" | "refund") => void;
  closeLegalModal: () => void;
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  fullName: string | null;
  role: string | null;
  isLoggedIn: boolean;
  loadingAuth: boolean;
  logout: () => Promise<void>;
  fetchProfile: (userId: string) => Promise<Profile | null>;
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

  const [legalModalType, setLegalModalType] = useState<"terms" | "privacy" | "refund" | null>(null);

  const openLegalModal = useCallback((type: "terms" | "privacy" | "refund") => {
    setLegalModalType(type);
  }, []);

  const closeLegalModal = useCallback(() => {
    setLegalModalType(null);
  }, []);

  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const fetchedUserIdRef = useRef<string | null>(null);

  const fetchProfile = useCallback(async (userId: string) => {
    if (!userId) return null;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("[Auth] Profiles query notice:", error.message);
        return null;
      }
      if (data) {
        console.log("[Auth] Profile loaded:", data.id, "Role:", data.role);
        setProfile(data);
        return data;
      }
    } catch (e) {
      console.error("[Auth] Profiles fetch exception:", e);
    }
    return null;
  }, []);

  useEffect(() => {
    let isMounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (!isMounted) return;

      setSession((prevSession) => {
        if (
          prevSession?.access_token === currentSession?.access_token &&
          prevSession?.user?.id === currentSession?.user?.id
        ) {
          return prevSession;
        }
        return currentSession;
      });

      setUser((prevUser) => {
        if (prevUser?.id === currentSession?.user?.id) {
          return prevUser;
        }
        return currentSession?.user ?? null;
      });

      if (currentSession?.user?.id) {
        if (fetchedUserIdRef.current !== currentSession.user.id) {
          fetchedUserIdRef.current = currentSession.user.id;
          fetchProfile(currentSession.user.id);
        }
      } else {
        if (fetchedUserIdRef.current !== null) {
          fetchedUserIdRef.current = null;
          setProfile(null);
        }
      }
      setLoadingAuth(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error("Logout error:", e);
    }
    fetchedUserIdRef.current = null;
    setSession(null);
    setUser(null);
    setProfile(null);
  }, []);

  const fullName = profile?.full_name || (user?.user_metadata ? (user.user_metadata["full_name"] as string) : null);
  const role = profile?.role || null;
  const isLoggedIn = !!session?.user;

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
    legalModalType,
    openLegalModal,
    closeLegalModal,
    session,
    user,
    profile,
    fullName,
    role,
    isLoggedIn,
    loadingAuth,
    logout,
    fetchProfile,
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