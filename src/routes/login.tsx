import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { User, Mail, Lock, ArrowRight, Loader2, CheckCircle2, ShieldCheck, RefreshCcw } from "lucide-react";
import { BackButton } from "@/components/site/BackButton";
import { Logo } from "@/components/site/Logo";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login or Sign Up — MINORA" },
      { name: "description", content: "Sign in to MINORA to track orders, save addresses and manage your account." },
      { property: "og:title", content: "Login or Sign Up — MINORA" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { fetchProfile } = useStore();

  const handleSignUp = async () => {
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail || !password || !confirmPassword) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please check your password confirmation.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            full_name: trimmedName,
          },
        },
      });

      if (error) {
        toast.error(error.message || "Unable to create your account. Please try again.");
        return;
      }

      const user = data?.user;
      if (user?.id) {
        // Attempt creating profile in public.profiles table if table exists
        try {
          const { data: existingProfile } = await supabase
            .from("profiles")
            .select("id, role")
            .eq("id", user.id)
            .maybeSingle();

          const roleToSet = existingProfile?.role ? existingProfile.role : "user";

          await supabase.from("profiles").upsert(
            {
              id: user.id,
              full_name: trimmedName,
              email: trimmedEmail,
              role: roleToSet,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "id" }
          );

          await fetchProfile(user.id);
        } catch (profileErr) {
          // Table may not exist yet in Supabase schema — fallback gracefully
        }

        if (data.session) {
          toast.success(`Welcome to MINORA, ${trimmedName}!`);
          navigate({ to: "/" });
        } else {
          toast.success(
            "Account created successfully. Please check your email and confirm your account before signing in."
          );
          setPassword("");
          setConfirmPassword("");
          setMode("login");
        }
      } else {
        toast.error("Unable to create your account. Please try again.");
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      toast.error("Unable to create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      toast.error("Please enter both email address and password.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          toast.error("Please check your email and confirm your account before signing in.");
        } else if (error.message.includes("Invalid login credentials")) {
          toast.error("Invalid email or password. Please try again.");
        } else {
          toast.error(error.message || "Unable to sign in right now. Please try again.");
        }
        return;
      }

      const user = data?.user;
      if (user?.id) {
        console.log("[Auth] User ID:", user.id);

        if (data.session) {
          await supabase.auth.setSession(data.session);
        }

        const userProfile = await fetchProfile(user.id);
        const role = userProfile?.role || null;

        console.log("[Auth] Profile role:", role);

        const displayName =
          userProfile?.full_name ||
          (user.user_metadata ? (user.user_metadata["full_name"] as string) : null) ||
          user.email ||
          "User";

        toast.success(`Welcome back, ${displayName}!`);

        if (role === "admin") {
          console.log("[Auth] Redirect: /admin");
          window.location.href = "/admin";
        } else {
          console.log("[Auth] Redirect: /");
          navigate({ to: "/" });
        }
      } else {
        toast.error("Unable to sign in right now. Please try again.");
      }
    } catch (err: any) {
      console.error("Signin error:", err);
      toast.error("Unable to sign in right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup") {
      handleSignUp();
    } else {
      handleSignIn();
    }
  };

  const handleTabSwitch = (newMode: "login" | "signup") => {
    setMode(newMode);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-background">
      {/* LEFT PANEL - MARKETING (Hidden on Mobile) */}
      <div className="relative hidden w-full flex-col justify-between overflow-hidden bg-zinc-950 p-12 text-white lg:flex lg:w-1/2">
        {/* Subtle background texture/gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/20 via-zinc-950 to-zinc-950 opacity-80" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />

        <div className="relative z-10">
          <Logo className="h-8 text-white invert opacity-90" />
          <div className="mt-20 max-w-md">
            <span className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-white backdrop-blur-md">
              The Minora Edit
            </span>
            <h2 className="font-display text-4xl leading-tight tracking-wide text-white lg:text-5xl">
              Curated Indian fashion, tailored for your lifestyle.
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-zinc-400">
              Join thousands of shoppers who have discovered their perfect style with MINORA. From everyday kurtas to premium silks, we bring India's finest directly to you.
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-20">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 backdrop-blur-md">
                <ShieldCheck size={18} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Verified Sellers</p>
                <p className="text-xs text-zinc-400">100% authentic products</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 backdrop-blur-md">
                <RefreshCcw size={18} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Easy Returns</p>
                <p className="text-xs text-zinc-400">14-day hassle-free exchanges</p>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-[10px] uppercase tracking-widest text-zinc-500">
            © {new Date().getFullYear()} MINORA. All rights reserved.
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - AUTHENTICATION */}
      <div className="relative flex w-full flex-col justify-center px-4 py-8 sm:px-8 lg:w-1/2 lg:px-12 bg-[#FAF9F6] lg:bg-background overflow-hidden lg:overflow-visible min-h-screen lg:min-h-0">
        
        {/* Mobile Decorative Background */}
        <div className="absolute inset-0 z-0 lg:hidden pointer-events-none overflow-hidden">
          {/* Subtle beige gradients */}
          <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#F3EFEA] blur-3xl opacity-60" />
          <div className="absolute top-[40%] -left-20 h-[300px] w-[300px] rounded-full bg-[#EFEBE4] blur-3xl opacity-50" />
          
          {/* Faint oversized watermark */}
          <div className="absolute top-[20%] left-1/2 -translate-x-1/2 select-none opacity-[0.03]">
            <span className="text-[140px] font-display tracking-widest whitespace-nowrap">
              MINORA
            </span>
          </div>
        </div>

        {/* Top Navigation - Desktop */}
        <div className="absolute left-8 top-8 z-10 hidden lg:block">
          <BackButton />
        </div>

        {/* Top Navigation - Mobile Premium Header */}
        <div className="absolute top-0 left-0 right-0 z-10 lg:hidden border-b border-border/40 bg-[#FAF9F6]/80 backdrop-blur-md px-4 py-4 flex items-center justify-between">
          <BackButton />
          <Logo className="h-5 mr-4" />
          <div className="w-[50px]" /> {/* Spacer to help center logo visually against back button */}
        </div>

        <div className="relative z-10 mx-auto w-full max-w-md pt-20 lg:pt-0 flex flex-col justify-center flex-1">
          
          {/* Mobile Brand Intro */}
          <div className="lg:hidden w-full text-center mb-8 px-4">
            <span className="block text-[9px] font-bold tracking-[0.3em] text-primary uppercase mb-3">
              The Modern Indian Edit
            </span>
            <p className="text-sm font-serif italic text-foreground/70 px-6">
              Contemporary Indian fashion, thoughtfully reimagined.
            </p>
            <div className="mt-5 mx-auto w-8 h-[1px] bg-border/80"></div>
          </div>
          {/* LOGIN CARD */}
          <div className="space-y-6 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xl shadow-black/[0.03]">
            <div className="space-y-2">
              <span className="inline-block rounded-full border border-border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
                MINORA ACCOUNT
              </span>
              <h1 className="font-display text-2xl sm:text-3xl tracking-wide text-foreground mt-2">
                {mode === "login" ? "Sign in" : "Create Account"}
              </h1>
              <p className="text-xs text-muted-foreground">
                {mode === "login"
                  ? "Sign in to your MINORA account to continue."
                  : "Sign up to start your fashion shopping journey."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === "signup" && (
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      autoComplete="name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-3 text-xs outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-3 text-xs outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Password
                  </label>
                  {mode === "login" && (
                    <Link to="/help" className="text-[11px] font-semibold text-primary hover:underline">
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-3 text-xs outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              {mode === "signup" && (
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="password"
                      required
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-3 text-xs outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 rounded-xl bg-primary py-3.5 text-xs font-bold tracking-widest text-primary-foreground uppercase hover:bg-primary/95 transition-all flex items-center justify-center gap-2 shadow-md shadow-primary/20"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : mode === "login" ? (
                  <>SIGN IN</>
                ) : (
                  <>CREATE ACCOUNT</>
                )}
              </button>
            </form>
          </div>

          {/* Mobile Trust Section */}
          <div className="lg:hidden mt-8 text-center px-6">
            <h3 className="text-[9px] font-bold tracking-[0.2em] text-foreground/80 uppercase mb-2">
              Your Style. Your Account.
            </h3>
            <p className="text-[11px] text-muted-foreground/80 leading-relaxed max-w-[250px] mx-auto">
              Save your wishlist, manage orders, and enjoy a seamless MINORA experience.
            </p>
          </div>

          {/* Toggle Action */}
          <div className="mt-8 text-center text-xs text-muted-foreground">
            {mode === "login" ? (
              <>
                New here?{" "}
                <button
                  type="button"
                  onClick={() => handleTabSwitch("signup")}
                  className="font-bold text-primary hover:underline"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => handleTabSwitch("login")}
                  className="font-bold text-primary hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}