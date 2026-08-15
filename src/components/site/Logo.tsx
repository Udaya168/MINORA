import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/minora-logo.asset.json";

export function Logo({ className = "h-8" }: { className?: string }) {
  const [imageValid, setImageValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (!logo?.url) {
      setImageValid(false);
      return;
    }
    const img = new Image();
    img.src = logo.url;
    img.onload = () => setImageValid(true);
    img.onerror = () => setImageValid(false);
  }, []);

  return (
    <Link to="/" aria-label="MINORA home" className="inline-flex items-center justify-center py-1">
      {imageValid === true ? (
        <img
          src={logo.url}
          alt="MINORA"
          className={`${className} w-auto object-contain mix-blend-multiply`}
          width={900}
          height={487}
        />
      ) : imageValid === false ? (
        <span className="font-display text-lg sm:text-xl font-bold tracking-[0.25em] text-foreground hover:text-primary transition-all select-none leading-none">
          MINORA
        </span>
      ) : (
        <span className="font-display text-lg sm:text-xl font-bold tracking-[0.25em] text-transparent select-none leading-none">
          MINORA
        </span>
      )}
    </Link>
  );
}