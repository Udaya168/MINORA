export const inr = (value: number) =>
  "₹" + Math.round(value).toLocaleString("en-IN");

export const pct = (price: number, original: number) =>
  Math.round(((original - price) / original) * 100);