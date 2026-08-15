import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { X, ArrowLeft } from "lucide-react";
import { useStore } from "@/lib/store";

export function LoginModal() {
  const { authModalOpen, closeLoginModal, login } = useStore();
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const otpInputRef = useRef<HTMLInputElement>(null);

  // Focus trap / scroll lock / ESC key listener
  useEffect(() => {
    if (!authModalOpen) return;

    // Body scroll lock
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    // Focus mobile input on open
    setTimeout(() => {
      mobileInputRef.current?.focus();
    }, 100);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLoginModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [authModalOpen, closeLoginModal]);

  if (!authModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      if (mobile.length !== 10) {
        toast.error("Please enter a valid 10-digit mobile number");
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setOtpSent(true);
        toast.success(`OTP sent to +91 ${mobile}`);
        setTimeout(() => {
          otpInputRef.current?.focus();
        }, 100);
      }, 800);
    } else {
      if (otp.length !== 6) {
        toast.error("Please enter the 6-digit verification code");
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        toast.success("Welcome to MINORA");
        login(mobile);
        setMobile("");
        setOtp("");
        setOtpSent(false);
      }, 1000);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Backdrop with fade-in and backdrop-blur */}
      <div
        onClick={closeLoginModal}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
      />

      {/* Modal Container */}
      <div
        ref={modalRef}
        className="relative bg-background border border-border shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 zoom-in-95
                   max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:max-h-[85vh] max-md:rounded-t-2xl max-md:border-x-0 max-md:border-b-0
                   md:w-full md:max-w-[440px] md:rounded-xl md:p-8 p-6"
      >
        {/* Header section with Close Button and Back Button */}
        <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
          {otpSent ? (
            <button
              type="button"
              onClick={() => setOtpSent(false)}
              className="flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground hover:text-foreground transition-colors uppercase"
            >
              <ArrowLeft size={14} /> Back
            </button>
          ) : (
            <span className="font-display text-lg tracking-[0.2em] font-bold text-foreground">
              MINORA
            </span>
          )}
          
          <button
            type="button"
            onClick={closeLoginModal}
            aria-label="Close modal"
            className="rounded-full p-1.5 hover:bg-secondary text-foreground/75 hover:text-foreground transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="text-center space-y-2">
          <h2 id="modal-title" className="font-display text-2xl tracking-wide text-foreground">
            {otpSent ? "Verify your number" : "Login or Sign Up"}
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
            {otpSent
              ? `We sent a verification code to +91 ${mobile.replace(/(\d{5})(\d{5})/, "$1 $2")}`
              : "Track orders, save addresses, and sync your wishlist in real time."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {!otpSent ? (
            <div className="space-y-1">
              <span className="block text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Mobile number
              </span>
              <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-3 focus-within:border-primary transition-colors">
                <span className="text-sm font-semibold text-muted-foreground">+91</span>
                <input
                  ref={mobileInputRef}
                  value={mobile}
                  inputMode="numeric"
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none font-medium tracking-wider text-foreground placeholder:tracking-normal placeholder:font-light"
                  placeholder="Enter 10-digit number"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <span className="block text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Enter Verification Code
              </span>
              <input
                ref={otpInputRef}
                value={otp}
                inputMode="numeric"
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="6-digit OTP code"
                className="w-full text-center tracking-[0.4em] font-bold rounded-md border border-border bg-background px-3 py-3 text-base outline-none focus:border-primary transition-colors"
                disabled={isLoading}
                required
              />
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => toast.success("OTP resent successfully")}
                  className="text-[10px] font-bold tracking-wider text-primary hover:underline uppercase"
                >
                  Resend OTP
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground font-bold tracking-widest py-3.5 text-xs uppercase hover:bg-primary/95 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            ) : otpSent ? (
              "VERIFY"
            ) : (
              "SEND OTP"
            )}
          </button>
        </form>

        <p className="mt-6 text-[10px] text-center text-muted-foreground/80 leading-relaxed max-w-[300px] mx-auto font-light">
          By continuing, you agree to MINORA's{" "}
          <a href="/help" className="underline hover:text-primary transition-colors">
            Terms of Use
          </a>{" "}
          and{" "}
          <a href="/help" className="underline hover:text-primary transition-colors">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
