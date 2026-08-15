import { Star } from "lucide-react";

export function Stars({
  rating,
  size = 12,
  showValue = true,
}: {
  rating: number;
  size?: number;
  showValue?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1" aria-label={`Rated ${rating} out of 5`}>
      <span className="inline-flex items-center gap-0.5 rounded bg-success/10 px-1.5 py-0.5 text-success">
        {showValue && <span className="text-[11px] font-semibold">{rating.toFixed(1)}</span>}
        <Star size={size} className="fill-current" aria-hidden />
      </span>
    </span>
  );
}