import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, ArrowLeft, Loader2, CheckCircle2, ShieldCheck, RefreshCw } from "lucide-react";
import { BackButton } from "@/components/site/BackButton";
import { Logo } from "@/components/site/Logo";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot Password — MINORA" },
      {
        name: "description",
        content: "Reset your MINORA account password quickly and securely.",
      },
      { property: "og:title", content: "Forgot Password — MINORA" },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sentEmail, setSentEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Cooldown countdown timer effect
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const validateEmail = (val: string) => {
    const trimmed = val.trim();
    return trimmed.length > 3 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  };

  const handleSendResetLink = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !validateEmail(trimmedEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const redirectTo = `${window.location.origin}/update-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
        redirectTo,
      });

      if (error) {
        console.error("[Auth] Reset password request error:", error.message);
      }

      // Security requirement: Always show generic success state regardless of email existence
      setSentEmail(trimmedEmail);
      setSubmitted(true);
      setCooldown(60);
      toast.success("If an account exists for this email, a password reset link has been sent.");
    } catch (err: any) {
      console.error("[Auth] Reset password exception:", err);
      // Fallback generic success for security
      setSentEmail(trimmedEmail);
      setSubmitted(true);
      setCooldown(60);
      toast.success("If an account exists for this email, a password reset link has been sent.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendResetLink = async () => {
    if (cooldown > 0 || loading || !sentEmail) return;

    setLoading(true);
    try {
      const redirectTo = `${window.location.origin}/update-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(sentEmail, {
        redirectTo,
      });

      if (error) {
        console.error("[Auth] Resend reset link error:", error.message);
        toast.error("Unable to resend reset link right now. Please try again later.");
      } else {
        setCooldown(60);
        toast.success("A new password reset link has been sent to your email.");
      }
    } catch (err: any) {
      console.error("[Auth] Resend reset link exception:", err);
      toast.error("Unable to resend reset link right now. Please try again later.");
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
              Secure & effortless password recovery.
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-zinc-400">
              Enter your email address and we'll send you an instant link to update your password securely.
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

      {/* RIGHT PANEL - FORGOT PASSWORD CARD */}
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
            
            {!submitted ? (
              /* FORM VIEW: ENTER EMAIL */
              <>
                <div className="space-y-2">
                  <span className="inline-block rounded-full border border-border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
                    PASSWORD RECOVERY
                  </span>
                  <h1 className="font-display text-2xl sm:text-3xl tracking-wide text-foreground mt-2">
                    Forgot Password?
                  </h1>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Enter your registered email address and we'll send you a password reset link.
                  </p>
                </div>

                <form onSubmit={handleSendResetLink} className="space-y-5">
                  <div className="space-y-1.5">
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
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-3 text-xs outline-none focus:border-primary transition-all"
                      />
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
                      <span>SEND RESET LINK</span>
                    )}
                  </button>

                  <div className="pt-2 text-center">
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ArrowLeft size={14} />
                      <span>Back to Login</span>
                    </Link>
                  </div>
                </form>
              </>
            ) : (
              /* SUCCESS STATE: EMAIL SENT */
              <div className="space-y-5 text-center py-2 animate-in fade-in duration-200">
                <div className="h-14 w-14 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 mx-auto flex items-center justify-center">
                  <CheckCircle2 size={28} />
                </div>

                <div className="space-y-2">
                  <h2 className="font-display text-2xl font-semibold text-foreground">
                    Check your email
                  </h2>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    We've sent a password reset link to:
                  </p>
                  <p className="text-xs font-bold font-mono text-primary bg-primary-soft px-3 py-1.5 rounded-lg inline-block break-all">
                    {sentEmail}
                  </p>
                </div>

                <div className="pt-4 border-t border-border/60 space-y-3">
                  <p className="text-xs text-muted-foreground">Didn't receive the email?</p>
                  
                  <button
                    type="button"
                    disabled={cooldown > 0 || loading}
                    onClick={handleResendResetLink}
                    className="w-full rounded-xl border border-primary text-primary bg-primary-soft/50 py-3 text-xs font-bold uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : cooldown > 0 ? (
                      <span>Resend available in {cooldown}s</span>
                    ) : (
                      <>
                        <RefreshCw size={13} />
                        <span>Resend Reset Link</span>
                      </>
                    )}
                  </button>

                  <div>
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mt-2"
                    >
                      <ArrowLeft size={14} />
                      <span>Back to Login</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
