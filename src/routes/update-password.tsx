import { useState, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Lock, Loader2, CheckCircle2, AlertCircle, ShieldCheck, ArrowRight, RefreshCw, Eye, EyeOff } from "lucide-react";
import { BackButton } from "@/components/site/BackButton";
import { Logo } from "@/components/site/Logo";

export const Route = createFileRoute("/update-password")({
  head: () => ({
    meta: [
      { title: "Create New Password — MINORA" },
      {
        name: "description",
        content: "Set a new secure password for your MINORA account.",
      },
      { property: "og:title", content: "Create New Password — MINORA" },
    ],
  }),
  component: UpdatePasswordPage,
});

function UpdatePasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<"checking" | "valid" | "invalid_or_expired">("checking");
  
  const navigate = useNavigate();

  // Verify recovery session on load
  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (session) {
          setSessionStatus("valid");
        } else {
          // Check if hash contains recovery tokens in URL
          const hash = window.location.hash || "";
          const search = window.location.search || "";
          const isRecoveryHash = hash.includes("type=recovery") || hash.includes("access_token=") || search.includes("code=");

          if (isRecoveryHash) {
            // Give auth listener a moment to establish session
            setTimeout(async () => {
              const { data: { session: retrySession } } = await supabase.auth.getSession();
              if (isMounted) {
                if (retrySession) {
                  setSessionStatus("valid");
                } else {
                  setSessionStatus("invalid_or_expired");
                }
              }
            }, 1000);
          } else {
            setSessionStatus("invalid_or_expired");
          }
        }
      } catch (err) {
        console.error("[Auth] Session check exception:", err);
        if (isMounted) {
          setSessionStatus("invalid_or_expired");
        }
      }
    }

    checkSession();

    // Listen for PASSWORD_RECOVERY or SIGNED_IN events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        if (session) {
          setSessionStatus("valid");
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword) {
      toast.error("Please enter a new password.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match. Please check your password confirmation.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error("[Auth] Update password error:", error.message);
        if (
          error.message.includes("Auth session missing") ||
          error.message.includes("session expired") ||
          error.message.includes("invalid")
        ) {
          setSessionStatus("invalid_or_expired");
          toast.error("Your password reset link has expired or is invalid. Please request a new reset link.");
        } else {
          toast.error(error.message || "Failed to update password. Please try again.");
        }
        return;
      }

      setIsSuccess(true);
      toast.success("Password updated successfully!");
    } catch (err: any) {
      console.error("[Auth] Update password exception:", err);
      toast.error("An unexpected error occurred while updating your password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-background">
      {/* LEFT PANEL - MARKETING (Hidden on Mobile) */}
      <div className="relative hidden w-full flex-col justify-between overflow-hidden bg-zinc-950 p-12 text-white lg:flex lg:w-1/2">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/20 via-zinc-950 to-zinc-950 opacity-80" />

        <div className="relative z-10">
          <Logo className="h-8 text-white invert opacity-90" />
          <div className="mt-20 max-w-md">
            <span className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-white backdrop-blur-md">
              ACCOUNT SECURITY
            </span>
            <h2 className="font-display text-4xl leading-tight tracking-wide text-white lg:text-5xl">
              Create your new account password.
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-zinc-400">
              Set a strong password for your account to ensure your order history, saved addresses, and profile data remain completely safe.
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-20">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 backdrop-blur-md">
              <ShieldCheck size={18} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">256-bit Encryption</p>
              <p className="text-xs text-zinc-400">Your account credentials are fully protected</p>
            </div>
          </div>
          
          <div className="mt-16 text-[10px] uppercase tracking-widest text-zinc-500">
            © {new Date().getFullYear()} MINORA. All rights reserved.
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - UPDATE PASSWORD FORM */}
      <div className="relative flex w-full flex-col justify-center px-4 py-8 sm:px-8 lg:w-1/2 lg:px-12 bg-[#FAF9F6] lg:bg-background overflow-hidden lg:overflow-visible min-h-screen lg:min-h-0">
        
        {/* Mobile Decorative Background */}
        <div className="absolute inset-0 z-0 lg:hidden pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#F3EFEA] blur-3xl opacity-60" />
          <div className="absolute top-[40%] -left-20 h-[300px] w-[300px] rounded-full bg-[#EFEBE4] blur-3xl opacity-50" />
        </div>

        {/* Top Navigation - Desktop */}
        <div className="absolute left-8 top-8 z-10 hidden lg:block">
          <BackButton />
        </div>

        {/* Top Navigation - Mobile Header */}
        <div className="absolute top-0 left-0 right-0 z-10 lg:hidden border-b border-border/40 bg-[#FAF9F6]/80 backdrop-blur-md px-4 py-4 flex items-center justify-between">
          <BackButton />
          <Logo className="h-5 mr-4" />
          <div className="w-[50px]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-md pt-20 lg:pt-0 flex flex-col justify-center flex-1">
          <div className="space-y-6 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xl shadow-black/[0.03]">
            
            {sessionStatus === "checking" ? (
              /* CHECKING SESSION STATE */
              <div className="py-12 text-center text-muted-foreground space-y-3">
                <Loader2 size={24} className="animate-spin mx-auto text-primary" />
                <p className="text-xs font-semibold">Verifying password recovery session...</p>
              </div>
            ) : sessionStatus === "invalid_or_expired" ? (
              /* EXPIRED / INVALID LINK STATE */
              <div className="space-y-5 text-center py-2 animate-in fade-in duration-200">
                <div className="h-14 w-14 rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/20 mx-auto flex items-center justify-center">
                  <AlertCircle size={28} />
                </div>

                <div className="space-y-2">
                  <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground">
                    Link Expired or Invalid
                  </h2>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Your password reset link has expired or is invalid. Please request a new reset link.
                  </p>
                </div>

                <div className="pt-3 border-t border-border/60">
                  <Link
                    to="/forgot-password"
                    className="w-full rounded-xl bg-primary py-3.5 text-xs font-bold tracking-widest text-primary-foreground uppercase hover:bg-primary/95 transition-all flex items-center justify-center gap-2 shadow-md shadow-primary/20"
                  >
                    <RefreshCw size={14} />
                    <span>REQUEST NEW RESET LINK</span>
                  </Link>
                </div>
              </div>
            ) : isSuccess ? (
              /* SUCCESS STATE */
              <div className="space-y-5 text-center py-2 animate-in fade-in duration-200">
                <div className="h-14 w-14 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 mx-auto flex items-center justify-center">
                  <CheckCircle2 size={28} />
                </div>

                <div className="space-y-2">
                  <h2 className="font-display text-2xl font-semibold text-foreground">
                    Password updated successfully
                  </h2>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Your password has been changed. You can now sign in with your new credentials.
                  </p>
                </div>

                <div className="pt-3 border-t border-border/60">
                  <Link
                    to="/login"
                    className="w-full rounded-xl bg-primary py-3.5 text-xs font-bold tracking-widest text-primary-foreground uppercase hover:bg-primary/95 transition-all flex items-center justify-center gap-2 shadow-md shadow-primary/20"
                  >
                    <span>CONTINUE TO LOGIN</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ) : (
              /* FORM VIEW: CREATE NEW PASSWORD */
              <>
                <div className="space-y-2">
                  <span className="inline-block rounded-full border border-border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
                    NEW CREDENTIALS
                  </span>
                  <h1 className="font-display text-2xl sm:text-3xl tracking-wide text-foreground mt-2">
                    Create New Password
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Enter your new password below.
                  </p>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        required
                        autoComplete="new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full rounded-xl border border-border bg-background pl-10 pr-10 py-3 text-xs outline-none focus:border-primary transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        aria-label={showNewPassword ? "Hide password" : "Show password"}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat new password"
                        className="w-full rounded-xl border border-border bg-background pl-10 pr-10 py-3 text-xs outline-none focus:border-primary transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 rounded-xl bg-primary py-3.5 text-xs font-bold tracking-widest text-primary-foreground uppercase hover:bg-primary/95 transition-all flex items-center justify-center gap-2 shadow-md shadow-primary/20 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <span>UPDATE PASSWORD</span>
                    )}
                  </button>
                </form>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
