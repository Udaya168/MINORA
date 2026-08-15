import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Logo } from "@/components/site/Logo";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login or Sign Up — MINORA" },
      { name: "description", content: "Sign in to MINORA to track orders, save addresses and sync your wishlist across devices." },
      { property: "og:title", content: "Login or Sign Up — MINORA" },
      { property: "og:description", content: "Sign in to MINORA to track orders and save your favourites." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [mobile, setMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <div className="flex justify-center"><Logo className="h-8" /></div>
        <h1 className="mt-4 font-display text-xl">Login or Sign Up</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track orders, save addresses and sync your wishlist.
        </p>

        <form
          className="mt-6 space-y-3 text-left"
          onSubmit={(e) => {
            e.preventDefault();
            if (!otpSent) {
              if (mobile.length !== 10) {
                toast.error("Enter a valid 10-digit mobile number");
                return;
              }
              setOtpSent(true);
              toast.success("OTP sent to +91 " + mobile);
              return;
            }
            toast.success("Welcome to MINORA");
            navigate({ to: "/account" });
          }}
        >
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">Mobile number</span>
            <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2.5 focus-within:border-primary">
              <span className="text-sm text-muted-foreground">+91</span>
              <input
                value={mobile}
                inputMode="numeric"
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                placeholder="98765 43210"
              />
            </div>
          </label>

          {otpSent && (
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Enter OTP</span>
              <input
                inputMode="numeric"
                placeholder="6-digit code"
                className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </label>
          )}

          <button type="submit" className="w-full rounded-md bg-primary py-3 text-sm font-semibold text-primary-foreground">
            {otpSent ? "Verify & Continue" : "Send OTP"}
          </button>
        </form>

        <p className="mt-4 text-xs text-muted-foreground">
          By continuing you agree to MINORA's Terms of Use and Privacy Policy.
        </p>
      </div>
    </div>
  );
}