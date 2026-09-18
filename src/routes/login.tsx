import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import {
  User,
  Mail,
  Lock,
  Phone,
  Loader2,
  ShieldCheck,
  RefreshCcw,
  Smartphone,
  ChevronDown,
  Eye,
  EyeOff,
} from "lucide-react";
import { BackButton } from "@/components/site/BackButton";
import { Logo } from "@/components/site/Logo";

const COUNTRY_CODES = [
  { code: "+91", label: "India (+91)", flag: "🇮🇳", short: "IN" },
  { code: "+1", label: "USA (+1)", flag: "🇺🇸", short: "US" },
  { code: "+44", label: "UK (+44)", flag: "🇬🇧", short: "GB" },
  { code: "+971", label: "UAE (+971)", flag: "🇦🇪", short: "AE" },
  { code: "+65", label: "Singapore (+65)", flag: "🇸🇬", short: "SG" },
  { code: "+61", label: "Australia (+61)", flag: "🇦🇺", short: "AU" },
  { code: "+966", label: "Saudi Arabia (+966)", flag: "🇸🇦", short: "SA" },
];

/**
 * Normalizes phone numbers into E.164 format (+919876543210)
 */
export function normalizePhoneNumber(rawInput: string, defaultCountryCode = "+91"): string {
  if (!rawInput) return "";
  const trimmed = rawInput.trim();
  const digits = trimmed.replace(/\D/g, "");

  if (!digits) return "";

  if (trimmed.startsWith("+")) {
    return `+${digits}`;
  }

  if (defaultCountryCode === "+91") {
    if (digits.length === 10) {
      return `+91${digits}`;
    }
    if (digits.length === 11 && digits.startsWith("0")) {
      return `+91${digits.slice(1)}`;
    }
    if (digits.length === 12 && digits.startsWith("91")) {
      return `+${digits}`;
    }
  }

  if (defaultCountryCode === "+1") {
    if (digits.length === 10) {
      return `+1${digits}`;
    }
    if (digits.length === 11 && digits.startsWith("1")) {
      return `+${digits}`;
    }
  }

  const ccDigits = defaultCountryCode.replace(/\D/g, "");
  if (digits.startsWith(ccDigits)) {
    return `+${digits}`;
  }

  return `${defaultCountryCode}${digits}`;
}

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
  const [loginTab, setLoginTab] = useState<"mobile" | "email">("mobile");

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const navigate = useNavigate();
  const { fetchProfile } = useStore();

  const handleMobileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const digitsOnly = rawVal.replace(/\D/g, "");
    const maxDigits = countryCode === "+91" ? 10 : 15;
    setMobileNumber(digitsOnly.slice(0, maxDigits));
  };

  const handleCountryCodeChange = (code: string) => {
    setCountryCode(code);
    const maxDigits = code === "+91" ? 10 : 15;
    if (mobileNumber.length > maxDigits) {
      setMobileNumber(mobileNumber.slice(0, maxDigits));
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        console.error("[Auth] Google Sign-In error:", error.message);
        toast.error(error.message || "Failed to sign in with Google. Please try again.");
      }
    } catch (err: any) {
      console.error("[Auth] Google Sign-In exception:", err);
      toast.error("An unexpected error occurred during Google Sign-In.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSignUp = async () => {
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const cleanDigits = mobileNumber.replace(/\D/g, "");
    const normalizedPhone = normalizePhoneNumber(cleanDigits, countryCode);

    if (!trimmedName || !trimmedEmail || !cleanDigits || !password || !confirmPassword) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (countryCode === "+91" && cleanDigits.length < 10) {
      toast.error("Enter a valid 10-digit mobile number.");
      return;
    } else if (cleanDigits.length < 7 || cleanDigits.length > 15) {
      toast.error("Please enter a valid mobile number.");
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

    const raw10Digits = cleanDigits.slice(-10);
    const filterCandidates = [
      normalizedPhone,
      cleanDigits,
      raw10Digits,
      `${countryCode} ${raw10Digits}`,
      `91${raw10Digits}`,
      `0${raw10Digits}`,
    ];

    setLoading(true);
    try {
      try {
        const orConditions = filterCandidates.map((fmt) => `phone.eq.${fmt}`);

        const { data: existingPhones } = await supabase
          .from("profiles")
          .select("id")
          .or(orConditions.join(","))
          .limit(1);

        if (existingPhones && existingPhones.length > 0) {
          toast.error("An account with this mobile number already exists. Please sign in instead.");
          setLoading(false);
          return;
        }
      } catch (phoneCheckErr) {
        console.warn("[Auth] Mobile duplication check notice:", phoneCheckErr);
      }

      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            full_name: trimmedName,
            phone: normalizedPhone,
            country_code: countryCode,
          },
        },
      });

      if (error) {
        if (error.message.includes("already registered") || error.message.includes("User already exists")) {
          toast.error("An account with this email address already exists. Please sign in instead.");
        } else {
          toast.error(error.message || "Unable to create your account. Please try again.");
        }
        return;
      }

      const user = data?.user;
      if (user?.id) {
        try {
          const { data: existingProfile } = await supabase
            .from("profiles")
            .select("id, role")
            .eq("id", user.id)
            .maybeSingle();

          const roleToSet = existingProfile?.role ? existingProfile.role : "user";

          const { error: upsertErr } = await supabase.from("profiles").upsert(
            {
              id: user.id,
              full_name: trimmedName,
              email: trimmedEmail,
              phone: normalizedPhone,
              role: roleToSet,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "id" }
          );

          if (upsertErr) {
            console.error("[Auth] Profile upsert error:", upsertErr.message);
          } else {
            console.log("[Auth] Profile successfully saved for:", user.id);
          }

          await fetchProfile(user.id);
        } catch (profileErr) {
          console.warn("[Auth] Profile upsert notice:", profileErr);
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
          setLoginTab("email");
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

  const handleMobileSignIn = async () => {
    const cleanDigits = mobileNumber.replace(/\D/g, "");
    const normalizedPhone = normalizePhoneNumber(cleanDigits, countryCode);

    if (!cleanDigits) {
      toast.error("Please enter a valid mobile number.");
      return;
    }

    if (countryCode === "+91" && cleanDigits.length < 10) {
      toast.error("Enter a valid 10-digit mobile number.");
      return;
    }

    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    console.log("[AUTH MOBILE] Normalized phone:", normalizedPhone);
    console.log("[AUTH MOBILE] Profile lookup started");

    setLoading(true);
    try {
      let associatedEmail: string | null = null;
      const raw10Digits = cleanDigits.slice(-10);

      // 1. Try lookup_email_by_phone RPC with normalizedPhone
      try {
        const { data: rpcEmail, error: rpcErr } = await supabase.rpc("lookup_email_by_phone", {
          phone_input: normalizedPhone,
        });
        if (!rpcErr && rpcEmail) {
          associatedEmail = rpcEmail;
        }
      } catch (e) {
        console.warn("[AUTH MOBILE] RPC lookup notice:", e);
      }

      // 2. Try lookup_email_by_phone RPC with raw 10 digits
      if (!associatedEmail && raw10Digits) {
        try {
          const { data: rpcEmail10, error: rpcErr10 } = await supabase.rpc("lookup_email_by_phone", {
            phone_input: raw10Digits,
          });
          if (!rpcErr10 && rpcEmail10) {
            associatedEmail = rpcEmail10;
          }
        } catch (e) {
          console.warn("[AUTH MOBILE] RPC lookup (10 digits) notice:", e);
        }
      }

      // 3. Fallback direct profile query
      if (!associatedEmail) {
        const filterCandidates = [
          normalizedPhone,
          cleanDigits,
          raw10Digits,
          `${countryCode} ${raw10Digits}`,
          `91${raw10Digits}`,
          `0${raw10Digits}`,
        ];

        const orConditions = filterCandidates.map((fmt) => `phone.eq.${fmt}`);

        try {
          const { data: matchedProfiles } = await supabase
            .from("profiles")
            .select("email, id")
            .or(orConditions.join(","))
            .limit(1);

          if (matchedProfiles && matchedProfiles.length > 0) {
            const firstMatch = matchedProfiles[0];
            if (firstMatch && firstMatch.email) {
              associatedEmail = firstMatch.email;
            }
          }
        } catch (e) {
          console.warn("[AUTH MOBILE] Profile lookup exception:", e);
        }
      }

      if (associatedEmail) {
        console.log("[AUTH MOBILE] Profile lookup result: found");
      } else {
        console.log("[AUTH MOBILE] Profile lookup result: not-found");
        console.log("[AUTH MOBILE] Authentication attempt");
        console.log("[AUTH MOBILE] Authentication successful/failed: failed");
        toast.error("Invalid mobile number or password. Please check your credentials and try again.");
        setLoading(false);
        return;
      }

      console.log("[AUTH MOBILE] Authentication attempt");

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: associatedEmail,
        password,
      });

      if (authError) {
        console.log("[AUTH MOBILE] Authentication successful/failed: failed");
        toast.error("Invalid mobile number or password. Please check your credentials and try again.");
        return;
      }

      console.log("[AUTH MOBILE] Authentication successful/failed: successful");

      const user = authData?.user;
      if (user?.id) {
        if (authData.session) {
          await supabase.auth.setSession(authData.session);
        }

        const userProfile = await fetchProfile(user.id);
        const role = userProfile?.role || null;
        const displayName =
          userProfile?.full_name ||
          (user.user_metadata ? (user.user_metadata["full_name"] as string) : null) ||
          "User";

        toast.success(`Welcome back, ${displayName}!`);

        if (role === "admin") {
          window.location.href = "/admin";
        } else {
          navigate({ to: "/" });
        }
      } else {
        toast.error("Unable to sign in right now. Please try again.");
      }
    } catch (err: any) {
      console.error("[AUTH MOBILE] Mobile signin exception:", err);
      toast.error("Invalid mobile number or password. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async () => {
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
          toast.error("Invalid email or password. Please check your credentials and try again.");
        } else {
          toast.error(error.message || "Unable to sign in right now. Please try again.");
        }
        return;
      }

      const user = data?.user;
      if (user?.id) {
        if (data.session) {
          await supabase.auth.setSession(data.session);
        }

        const userProfile = await fetchProfile(user.id);
        const role = userProfile?.role || null;
        const displayName =
          userProfile?.full_name ||
          (user.user_metadata ? (user.user_metadata["full_name"] as string) : null) ||
          user.email ||
          "User";

        toast.success(`Welcome back, ${displayName}!`);

        if (role === "admin") {
          window.location.href = "/admin";
        } else {
          navigate({ to: "/" });
        }
      } else {
        toast.error("Unable to sign in right now. Please try again.");
      }
    } catch (err: any) {
      console.error("Email signin error:", err);
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
      if (loginTab === "mobile") {
        handleMobileSignIn();
      } else {
        handleEmailSignIn();
      }
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/20 via-zinc-950 to-zinc-950 opacity-80" />

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
          <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#F3EFEA] blur-3xl opacity-60" />
          <div className="absolute top-[40%] -left-20 h-[300px] w-[300px] rounded-full bg-[#EFEBE4] blur-3xl opacity-50" />
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

        {/* Top Navigation - Mobile Header */}
        <div className="absolute top-0 left-0 right-0 z-10 lg:hidden border-b border-border/40 bg-[#FAF9F6]/80 backdrop-blur-md px-4 py-4 flex items-center justify-between">
          <BackButton />
          <Logo className="h-5 mr-4" />
          <div className="w-[50px]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-md pt-16 lg:pt-0 flex flex-col justify-center flex-1">
          
          {/* Mobile Brand Intro */}
          <div className="lg:hidden w-full text-center mb-6 px-4">
            <span className="block text-[9px] font-bold tracking-[0.3em] text-primary uppercase mb-2">
              The Modern Indian Edit
            </span>
            <p className="text-xs font-serif italic text-foreground/70 px-4">
              Contemporary Indian fashion, thoughtfully reimagined.
            </p>
            <div className="mt-4 mx-auto w-8 h-[1px] bg-border/80"></div>
          </div>

          {/* AUTH CARD */}
          <div className="space-y-6 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xl shadow-black/[0.03]">
            <div className="space-y-1">
              <span className="inline-block rounded-full border border-border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
                MINORA ACCOUNT
              </span>
              <h1 className="font-display text-2xl sm:text-3xl tracking-wide text-foreground mt-1">
                {mode === "login" ? "Sign in" : "Create Account"}
              </h1>
              <p className="text-xs text-muted-foreground">
                {mode === "login"
                  ? "Sign in to your MINORA account to continue."
                  : "Enter your details to create a new MINORA account."}
              </p>
            </div>

            {/* LOGIN METHOD TAB SELECTOR (Only shown in Login mode) */}
            {mode === "login" && (
              <div className="grid grid-cols-2 gap-1 rounded-2xl bg-secondary/60 p-1.5 border border-border/50">
                <button
                  type="button"
                  onClick={() => setLoginTab("mobile")}
                  className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
                    loginTab === "mobile"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Smartphone size={14} />
                  <span>Mobile Number</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLoginTab("email")}
                  className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
                    loginTab === "email"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Mail size={14} />
                  <span>Email & Password</span>
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* SIGNUP FORM FIELDS */}
              {mode === "signup" && (
                <>
                  {/* 1. Name */}
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

                  {/* 2. Email Address */}
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

                  {/* 3. Mobile Number with Country Code */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Mobile Number
                    </label>
                    <div className="flex gap-2">
                      <div className="relative shrink-0 w-28">
                        <select
                          value={countryCode}
                          onChange={(e) => handleCountryCodeChange(e.target.value)}
                          className="w-full appearance-none rounded-xl border border-border bg-background px-3 py-3 pr-7 text-xs font-semibold outline-none focus:border-primary transition-all cursor-pointer"
                        >
                          {COUNTRY_CODES.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.flag} {c.code}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                      </div>

                      <div className="relative flex-1">
                        <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="tel"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={countryCode === "+91" ? 10 : 15}
                          required
                          autoComplete="tel"
                          value={mobileNumber}
                          onChange={handleMobileInputChange}
                          placeholder={countryCode === "+91" ? "9876543210" : "Mobile number"}
                          className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-3 text-xs outline-none focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. Password */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Password
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                        className="w-full rounded-xl border border-border bg-background pl-10 pr-10 py-3 text-xs outline-none focus:border-primary transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* 5. Confirm Password */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter your password"
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
                </>
              )}

              {/* LOGIN FORM FIELDS */}
              {mode === "login" && (
                <>
                  {loginTab === "mobile" ? (
                    /* Mobile Number Login Tab */
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Mobile Number
                      </label>
                      <div className="flex gap-2">
                        <div className="relative shrink-0 w-28">
                          <select
                            value={countryCode}
                            onChange={(e) => handleCountryCodeChange(e.target.value)}
                            className="w-full appearance-none rounded-xl border border-border bg-background px-3 py-3 pr-7 text-xs font-semibold outline-none focus:border-primary transition-all cursor-pointer"
                          >
                            {COUNTRY_CODES.map((c) => (
                              <option key={c.code} value={c.code}>
                                {c.flag} {c.code}
                              </option>
                            ))}
                          </select>
                          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                        </div>

                        <div className="relative flex-1">
                          <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <input
                            type="tel"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={countryCode === "+91" ? 10 : 15}
                            required
                            autoComplete="tel"
                            value={mobileNumber}
                            onChange={handleMobileInputChange}
                            placeholder={countryCode === "+91" ? "9876543210" : "Mobile number"}
                            className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-3 text-xs outline-none focus:border-primary transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Email & Password Login Tab */
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
                  )}

                  {/* Password Field for Login */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Password
                      </label>
                    </div>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Your password"
                        className="w-full rounded-xl border border-border bg-background pl-10 pr-10 py-3 text-xs outline-none focus:border-primary transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password Row */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                      />
                      <span className="text-xs text-muted-foreground font-medium">Remember me</span>
                    </label>
                    <Link to="/forgot-password" className="text-xs font-semibold text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full mt-2 rounded-xl bg-primary py-3.5 text-xs font-bold tracking-widest text-primary-foreground uppercase hover:bg-primary/95 transition-all flex items-center justify-center gap-2 shadow-md shadow-primary/20 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : mode === "login" ? (
                  <>SIGN IN</>
                ) : (
                  <>CREATE ACCOUNT</>
                )}
              </button>

              {/* OR Divider */}
              <div className="relative my-3 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative bg-card px-2.5 text-[9px] uppercase font-bold tracking-wider text-muted-foreground">
                  OR
                </div>
              </div>

              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading || googleLoading}
                className="w-full rounded-xl border border-border bg-background py-3 text-xs font-bold text-foreground hover:bg-secondary transition-all flex items-center justify-center gap-2.5 shadow-xs disabled:opacity-50"
              >
                {googleLoading ? (
                  <Loader2 size={16} className="animate-spin text-primary" />
                ) : (
                  <>
                    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Mobile Trust Section */}
          <div className="lg:hidden mt-6 text-center px-6">
            <h3 className="text-[9px] font-bold tracking-[0.2em] text-foreground/80 uppercase mb-2">
              Your Style. Your Account.
            </h3>
            <p className="text-[11px] text-muted-foreground/80 leading-relaxed max-w-[250px] mx-auto">
              Save your wishlist, manage orders, and enjoy a seamless MINORA experience.
            </p>
          </div>

          {/* Mode Switch Toggle Action */}
          <div className="mt-6 text-center text-xs text-muted-foreground">
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