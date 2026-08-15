import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useStore } from "@/lib/store";

export function LegalPolicyModal() {
  const { legalModalType, closeLegalModal } = useStore();
  const triggerRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus trap, scroll lock, keyboard handling
  useEffect(() => {
    if (!legalModalType) return;

    // Track active element to return focus
    triggerRef.current = document.activeElement as HTMLElement;

    // Body scroll lock
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    // Focus on close button inside modal
    const closeBtn = containerRef.current?.querySelector("[aria-label='Close modal']") as HTMLElement;
    closeBtn?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLegalModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener("keydown", handleKeyDown);
      // Return focus
      triggerRef.current?.focus();
    };
  }, [legalModalType, closeLegalModal]);

  if (!legalModalType) return null;

  const contentMap = {
    terms: {
      title: "Terms & Conditions",
      updated: "Last Updated: August 2026",
      paragraphs: [
        {
          heading: "1. Use of Website",
          text: "MINORA provides an online platform for discovering and purchasing fashion products and accessories. Users agree to provide accurate information and use the website only for lawful purposes.",
        },
        {
          heading: "2. Accounts",
          text: "Certain features may require an account. You are responsible for maintaining the accuracy and security of your account information.",
        },
        {
          heading: "3. Products & Pricing",
          text: "MINORA attempts to ensure that product descriptions, images, availability and pricing are accurate. Prices, offers and availability may change without prior notice.",
        },
        {
          heading: "4. Orders",
          text: "An order is considered confirmed only after successful processing and confirmation by MINORA. MINORA reserves the right to cancel or reject an order in cases such as pricing errors, inventory issues, suspected fraud or other operational reasons.",
        },
        {
          heading: "5. Payments",
          text: "Payments are processed through supported payment methods and authorized payment providers. MINORA does not store sensitive payment credentials unless explicitly required and securely supported by the applicable payment infrastructure.",
        },
        {
          heading: "6. Intellectual Property",
          text: "All MINORA branding, logos, designs, content, graphics and website materials are protected by applicable intellectual-property laws. Users may not reproduce or distribute MINORA content without permission.",
        },
        {
          heading: "7. User Conduct",
          text: "Users must not misuse the website, attempt unauthorized access, upload malicious content, interfere with website functionality, or use the platform for fraudulent activities.",
        },
        {
          heading: "8. Changes to Terms",
          text: "MINORA may update these Terms & Conditions when necessary. Updated terms will be made available through the website.",
        },
        {
          heading: "9. Contact",
          text: "For questions regarding these terms, users can contact MINORA through the official support/contact channel.",
        },
      ],
    },
    privacy: {
      title: "Privacy Policy",
      updated: "Last Updated: August 2026",
      paragraphs: [
        {
          heading: "1. Information We Collect",
          text: "Depending on how you use MINORA, we may collect information such as name, mobile number, email address, delivery address, order details, wishlist, account logs, device/browser details, and website usage statistics.",
        },
        {
          heading: "2. How We Use Information",
          text: "Information may be used to process orders, provide customer support, manage accounts, deliver products, improve website functionality, personalize shopping experiences, communicate important updates, and prevent fraud.",
        },
        {
          heading: "3. Payment Information",
          text: "Payment transactions are handled securely by authorized third-party payment providers. Sensitive payment credentials are processed only through secure payment infrastructure.",
        },
        {
          heading: "4. Cookies",
          text: "MINORA may use cookies or similar technologies to maintain sessions, remember preferences, improve website functionality, understand website usage, and enhance the overall user experience.",
        },
        {
          heading: "5. Data Security",
          text: "MINORA takes reasonable technical and organizational measures to protect user information from unauthorized access, misuse or disclosure.",
        },
        {
          heading: "6. Third-Party Services",
          text: "Certain services such as payment processing, analytics, hosting or communications involve trusted third-party service providers whose handling of information is governed by their respective privacy policies.",
        },
        {
          heading: "7. User Rights",
          text: "Depending on applicable law, users may have rights regarding access, correction, deletion or other handling of their personal information.",
        },
        {
          heading: "8. Policy Updates",
          text: "This Privacy Policy may be updated periodically. The latest version will be made available through the MINORA website.",
        },
        {
          heading: "9. Contact",
          text: "For privacy-related questions or requests, contact MINORA through the official contact/support channel.",
        },
      ],
    },
    refund: {
      title: "Refund Policy",
      updated: "Last Updated: August 2026",
      paragraphs: [
        {
          heading: "1. Returns",
          text: "Eligible products may be returned according to MINORA's applicable return conditions. Products must generally be unused, undamaged and returned with applicable original packaging/tags.",
        },
        {
          heading: "2. Return Period",
          text: "Eligible products may be returned within the applicable return period displayed on the product/order information. The exact return eligibility may vary by product.",
        },
        {
          heading: "3. Refunds",
          text: "Once a returned product is received and inspected, the refund process will be initiated where applicable. Refund timing may depend on the payment method and payment provider.",
        },
        {
          heading: "4. Cash on Delivery",
          text: "For Cash on Delivery orders, applicable refunds may be processed through the available refund mechanism provided by MINORA.",
        },
        {
          heading: "5. Non-Returnable Products",
          text: "Certain products may not be eligible for return because of their nature, hygiene requirements, customization or other applicable restrictions. Any exclusions are displayed on the product/order page.",
        },
        {
          heading: "6. Damaged or Incorrect Products",
          text: "If a product arrives damaged, defective or different from the ordered item, customers should contact MINORA support immediately with order details and supporting proof.",
        },
        {
          heading: "7. Cancellation",
          text: "Order cancellation eligibility may depend on the current processing or shipping status of the order.",
        },
        {
          heading: "8. Refund Processing",
          text: "Approved refunds will be processed according to the applicable payment method and refund procedure.",
        },
        {
          heading: "9. Contact",
          text: "For return or refund assistance, customers should contact MINORA through the official support/contact channel.",
        },
      ],
    },
  };

  const current = contentMap[legalModalType];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={closeLegalModal}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
      />

      {/* Modal Box */}
      <div
        ref={containerRef}
        className="relative bg-background border border-border shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 zoom-in-95
                   max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:max-h-[90vh] max-md:rounded-t-2xl max-md:border-x-0 max-md:border-b-0
                   md:w-full md:max-w-2xl md:rounded-xl flex flex-col md:max-h-[80vh] overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-secondary/5">
          <div>
            <span className="text-[9px] font-bold tracking-[0.25em] text-primary uppercase block">
              MINORA
            </span>
            <h2 id="legal-title" className="font-display text-xl sm:text-2xl mt-0.5 tracking-wide text-foreground">
              {current.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeLegalModal}
            aria-label="Close modal"
            className="rounded-full p-2 hover:bg-secondary text-foreground/75 hover:text-foreground transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Policy Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 text-sm text-foreground/90 bg-background leading-relaxed">
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase pb-2 border-b border-border/60">
            {current.updated}
          </p>

          <p className="text-xs text-muted-foreground font-light leading-relaxed">
            Welcome to MINORA. By accessing or using the MINORA website and services, you agree to comply with our policies.
          </p>

          <div className="space-y-6 pt-2">
            {current.paragraphs.map((p) => (
              <div key={p.heading} className="space-y-2">
                <h3 className="font-display text-base font-semibold tracking-wide text-foreground">
                  {p.heading}
                </h3>
                <p className="text-xs text-muted-foreground font-light leading-relaxed pl-1">
                  {p.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer with Action Button */}
        <div className="border-t border-border px-6 py-4 flex justify-end bg-secondary/5">
          <button
            type="button"
            onClick={closeLegalModal}
            className="border border-foreground/20 bg-background hover:bg-secondary px-6 py-2.5 text-[10px] font-bold tracking-widest uppercase text-foreground transition-all"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
