import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { User, Mail, Lock, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

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
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md space-y-6 bg-card border border-border p-6 sm:p-8 rounded-2xl shadow-xl">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase block">
            MINORA AUTHENTICATION
          </span>
          <h1 className="font-display text-2xl sm:text-3xl tracking-wide text-foreground">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-xs text-muted-foreground">
            {mode === "login"
              ? "Sign in to access your orders, saved addresses and preferences."
              : "Sign up to start your fashion shopping journey."}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 p-1 bg-secondary/50 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => handleTabSwitch("login")}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              mode === "login"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            SIGN IN
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch("signup")}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              mode === "signup"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            SIGN UP
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-1">
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

          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-3 text-xs outline-none focus:border-primary transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                required
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-3 text-xs outline-none focus:border-primary transition-all"
              />
            </div>
          </div>

          {mode === "signup" && (
            <div className="space-y-1">
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
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-3 text-xs outline-none focus:border-primary transition-all"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 rounded-xl bg-primary py-3.5 text-xs font-bold tracking-widest text-primary-foreground uppercase hover:bg-primary/95 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : mode === "login" ? (
              <>
                SIGN IN <ArrowRight size={14} />
              </>
            ) : (
              <>
                CREATE ACCOUNT <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}