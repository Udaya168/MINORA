import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { X, Check, ArrowLeft } from "lucide-react";
import { useStore } from "@/lib/store";
import { useIsMobile } from "@/hooks/use-mobile";

export function LoginModal() {
  const { authModalOpen, closeLoginModal, login } = useStore();
  const isMobile = useIsMobile();

  const [mobile, setMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpArray, setOtpArray] = useState<string[]>(Array(6).fill(""));
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  const mobileInputRef = useRef<HTMLInputElement>(null);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Track the history pushes we made so we can clean up the stack
  const loginHistoryRef = useRef(false);

  // Manage browser history and pushState for modal steps
  useEffect(() => {
    if (!authModalOpen) {
      loginHistoryRef.current = false;
      return;
    }

    // Push initial history state to block back button
    if (!loginHistoryRef.current && (!window.history.state || !window.history.state.minoraLoginModal)) {
      window.history.pushState(
        {
          ...window.history.state,
          minoraLoginModal: true,
          step: "mobile"
        },
        "",
        window.location.href
      );
      loginHistoryRef.current = true;
    }

    const handlePopState = (e: PopStateEvent) => {
      const state = e.state;
      if (state && state.minoraLoginModal) {
        if (state.step === "mobile") {
          setOtpSent(false);
        } else if (state.step === "otp") {
          setOtpSent(true);
        }
      } else {
        // Closed/no modal state in popstate -> close modal
        closeLoginModal();
        resetState();
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [authModalOpen, closeLoginModal]);

  // Lock body scroll / Escape key handler
  useEffect(() => {
    if (!authModalOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus first input box
    if (!otpSent && !isSuccess) {
      setTimeout(() => {
        mobileInputRef.current?.focus();
      }, 150);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [authModalOpen, otpSent, isSuccess]);

  // OTP Countdown timer
  useEffect(() => {
    if (!otpSent || resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [otpSent, resendTimer]);

  if (!authModalOpen) return null;

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      setResendTimer(30);
      setOtpArray(Array(6).fill(""));

      // Push history state for OTP step
      window.history.pushState(
        {
          ...window.history.state,
          minoraLoginModal: true,
          step: "otp"
        },
        "",
        window.location.href
      );

      toast.success(`OTP sent to +91 ${mobile}`);
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    }, 1000);
  };

  const handleOtpVerify = () => {
    const fullOtp = otpArray.join("");
    if (fullOtp.length !== 6) {
      toast.error("Please enter the 6-digit verification code");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        login(mobile);
        // Clear history stack modal states
        cleanHistoryStack();
        resetState();
      }, 1600);
    }, 1200);
  };

  const resetState = () => {
    setMobile("");
    setOtpSent(false);
    setOtpArray(Array(6).fill(""));
    setIsSuccess(false);
    setIsLoading(false);
    setResendTimer(30);
    loginHistoryRef.current = false;
  };

  // Close the modal and pop the pushed history states
  const handleClose = () => {
    cleanHistoryStack();
    closeLoginModal();
    setTimeout(resetState, 300);
  };

  // Safe history cleanup to prevent stray stack states
  const cleanHistoryStack = () => {
    const currentState = window.history.state;
    if (currentState && currentState.minoraLoginModal) {
      if (currentState.step === "otp") {
        window.history.go(-2);
      } else if (currentState.step === "mobile") {
        window.history.back();
      }
      loginHistoryRef.current = false;
    }
  };

  // Inner back button action
  const handleInnerBack = () => {
    // Going back in history will automatically trigger handlePopState to update React state
    window.history.back();
  };

  const handleOtpChange = (value: string, index: number) => {
    const cleanValue = value.replace(/\D/g, "");
    if (!cleanValue) return;

    const newOtp = [...otpArray];
    if (cleanValue.length > 1) {
      const digits = cleanValue.slice(0, 6 - index).split("");
      digits.forEach((digit, i) => {
        newOtp[index + i] = digit;
      });
      setOtpArray(newOtp);
      const nextFocusIdx = Math.min(5, index + digits.length);
      otpInputRefs.current[nextFocusIdx]?.focus();
    } else {
      newOtp[index] = cleanValue;
      setOtpArray(newOtp);
      if (index < 5) {
        otpInputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otpArray];
      if (otpArray[index]) {
        newOtp[index] = "";
        setOtpArray(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = "";
        setOtpArray(newOtp);
        otpInputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    toast.success("OTP resent successfully");
    setResendTimer(30);
    setOtpArray(Array(6).fill(""));
    setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 150);
  };

  // Render Checkmark Success Screen
  const renderSuccess = () => (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="h-16 w-16 rounded-full bg-[#5A101C]/10 flex items-center justify-center mb-6 animate-bounce">
        <Check className="h-8 w-8 text-[#5A101C]" strokeWidth={2.5} />
      </div>
      <h2 className="font-display text-2xl tracking-wide text-foreground mb-2">Welcome to MINORA</h2>
      <p className="text-xs text-muted-foreground font-light">You're all set.</p>
    </div>
  );

  // Render Mobile Number Input Form
  const renderMobileForm = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-display text-2xl tracking-wide text-[#1C1818]">
          Welcome to MINORA
        </h2>
        <p className="text-[12px] text-[#766D69] tracking-wide leading-relaxed font-light">
          Sign in or create an account to continue your shopping journey.
        </p>
      </div>

      <form onSubmit={handleMobileSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="mobile-input" className="block text-[10px] font-bold tracking-widest text-[#766D69] uppercase">
            Mobile number
          </label>
          <div className="flex h-14 items-center gap-3 border border-[#D8D0CB] bg-transparent px-4 focus-within:border-[#5A101C] transition-all duration-200">
            <span className="text-sm font-semibold text-[#1C1818] border-r border-[#D8D0CB]/60 pr-3">+91</span>
            <input
              id="mobile-input"
              ref={mobileInputRef}
              value={mobile}
              inputMode="numeric"
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none font-medium tracking-[0.1em] text-[#1C1818] placeholder:tracking-normal placeholder:font-light"
              placeholder="Enter 10-digit number"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || mobile.length !== 10}
          className="w-full h-14 bg-[#5A101C] text-primary-foreground font-bold tracking-[0.2em] text-xs uppercase hover:bg-[#430c14] active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              <span>Sending...</span>
            </span>
          ) : (
            "CONTINUE"
          )}
        </button>
      </form>

      <p className="text-[10px] text-center text-[#766D69] leading-relaxed font-light mt-4">
        By continuing, you agree to MINORA's{" "}
        <a href="/help" className="underline hover:text-[#5A101C] transition-colors">
          Terms of Use
        </a>{" "}
        and{" "}
        <a href="/help" className="underline hover:text-[#5A101C] transition-colors">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );

  // Render OTP Form
  const renderOtpForm = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-display text-2xl tracking-wide text-[#1C1818]">
          Verify your number
        </h2>
        <p className="text-[12px] text-[#766D69] tracking-wide leading-relaxed font-light">
          We've sent a verification code to <span className="font-semibold text-[#1C1818]">+91 {mobile.slice(0, 5)} {mobile.slice(5)}</span>
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <span className="block text-[10px] font-bold tracking-widest text-[#766D69] text-center uppercase">
            6-digit OTP code
          </span>
          <div className="flex justify-between gap-2 max-w-[320px] mx-auto">
            {otpArray.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { otpInputRefs.current[idx] = el; }}
                value={digit}
                maxLength={6}
                inputMode="numeric"
                onChange={(e) => handleOtpChange(e.target.value, idx)}
                onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                className="w-10 h-12 text-center text-lg font-bold border border-[#D8D0CB] bg-transparent outline-none focus:border-[#5A101C] transition-colors focus:ring-1 focus:ring-[#5A101C]/15"
                disabled={isLoading}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleOtpVerify}
          disabled={isLoading || otpArray.join("").length !== 6}
          className="w-full h-14 bg-[#5A101C] text-primary-foreground font-bold tracking-[0.2em] text-xs uppercase hover:bg-[#430c14] active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              <span>Verifying...</span>
            </span>
          ) : (
            "VERIFY"
          )}
        </button>

        <div className="text-center pt-1 flex flex-col items-center justify-center gap-1.5">
          <p className="text-[10px] text-[#766D69] font-light">Didn't receive the code?</p>
          {resendTimer > 0 ? (
            <span className="text-[10px] font-semibold tracking-wider text-[#766D69] uppercase">
              Resend OTP in {resendTimer}s
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-[10px] font-bold tracking-wider text-[#5A101C] hover:underline uppercase"
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Render left brand/editorial panel
  const renderBrandPanel = () => (
    <div className="flex flex-col justify-between h-full bg-[#FAF6F0] p-10 border-r border-[#D8D0CB]/30">
      <div className="space-y-6">
        <span className="font-display text-sm tracking-[0.3em] font-semibold text-[#5A101C]">
          THE MINORA EDIT
        </span>
        
        <div className="space-y-3">
          <h1 className="font-display text-3xl xl:text-4xl text-[#1C1818] leading-[1.2]">
            Where tradition<br />meets tomorrow.
          </h1>
          <p className="text-xs text-[#766D69] leading-relaxed font-light max-w-sm">
            An intentional curation of contemporary Indian fashion that balances classic craftsmanship with modern expression.
          </p>
        </div>
      </div>

      <ul className="space-y-3 pt-6 border-t border-[#D8D0CB]/50">
        {[
          "Curated collections representing the finest design house lines",
          "Exclusive new arrivals uploaded every week",
          "Fully encrypted secure payment gateways",
          "Hassle-free 7-day home pick returns & exchanges"
        ].map((benefit, i) => (
          <li key={i} className="flex items-start gap-2.5 text-[11px] text-[#766D69] font-light leading-relaxed">
            <span className="text-[#5A101C] mt-0.5">•</span>
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  // Render responsive layout based on screen width
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Backdrop with translucent color and backdrop-blur */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-[#140A0C]/52 backdrop-blur-[5px] transition-opacity duration-300 animate-in fade-in"
      />

      {isMobile ? (
        /* Mobile Layout: Dedicated Bottom Sheet */
        <div
          className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-[#FCF9F5] border-t border-border shadow-[0_-15px_50px_rgba(0,0,0,0.15)] rounded-t-[22px] 
                     px-6 pt-3 pb-[calc(24px+env(safe-area-inset-bottom))] transition-transform duration-300 ease-out animate-in slide-in-from-bottom"
        >
          {/* Drag Handle Indicator */}
          <div className="flex justify-center mb-3">
            <div className="w-12 h-1 bg-[#D8D0CB] rounded-full" />
          </div>

          {/* Top navigation actions */}
          <div className="flex justify-between items-center mb-4 min-h-[30px]">
            {otpSent && !isSuccess ? (
              <button
                type="button"
                onClick={handleInnerBack}
                className="flex items-center gap-1 text-[11px] font-bold tracking-widest text-[#766D69] hover:text-[#1C1818] uppercase"
              >
                <ArrowLeft size={14} /> Back
              </button>
            ) : (
              <span className="font-display text-base tracking-[0.25em] font-bold text-[#1C1818]">
                MINORA
              </span>
            )}
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close sheet"
              className="rounded-full p-1.5 text-[#766D69] hover:text-[#1C1818] hover:bg-secondary/40 transition-all"
            >
              <X size={18} />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[60vh] py-2">
            {isSuccess ? renderSuccess() : otpSent ? renderOtpForm() : renderMobileForm()}
          </div>
        </div>
      ) : (
        /* Desktop/Tablet Layout: Centered Card Experience */
        <div
          className="relative bg-[#FCF9F5] border border-[#D8D0CB]/40 shadow-[0_20px_60px_rgba(0,0,0,0.15)] rounded-[18px] 
                     overflow-hidden w-[90%] max-w-[840px] h-[520px] transition-all duration-200 animate-in fade-in zoom-in-97 duration-200 ease-out
                     grid grid-cols-12"
        >
          {/* Left Side Brand Column: Hidden on small screens, smaller on tablet, full on desktop */}
          <div className="hidden md:block md:col-span-5 lg:col-span-5 h-full">
            {renderBrandPanel()}
          </div>

          {/* Right Side Auth Column */}
          <div className="col-span-12 md:col-span-7 lg:col-span-7 h-full flex flex-col justify-between p-10 relative">
            {/* Top Auth Section Actions */}
            <div className="flex justify-between items-center min-h-[30px]">
              {otpSent && !isSuccess ? (
                <button
                  type="button"
                  onClick={handleInnerBack}
                  className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-[#766D69] hover:text-[#1C1818] transition-colors uppercase"
                >
                  <ArrowLeft size={13} /> Back
                </button>
              ) : (
                <span className="font-display text-sm tracking-[0.3em] font-bold text-[#1C1818]">
                  MINORA
                </span>
              )}
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close modal"
                className="rounded-full p-1 text-[#766D69] hover:text-[#1C1818] hover:bg-secondary/40 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Main Auth Form Container */}
            <div className="my-auto">
              {isSuccess ? renderSuccess() : otpSent ? renderOtpForm() : renderMobileForm()}
            </div>
            
            {/* Empty spacer to align content */}
            <div className="h-4" />
          </div>
        </div>
      )}
    </div>
  );
}
