import logo from "@/assets/minora-logo.asset.json";
import { Link } from "@tanstack/react-router";

export function Logo({ className = "h-8" }: { className?: string }) {
  return (
    <Link to="/" aria-label="MINORA home" className="inline-flex items-center">
      <img
        src={logo.url}
        alt="MINORA"
        className={`${className} w-auto object-contain mix-blend-multiply`}
        width={900}
        height={487}
      />
    </Link>
  );
}