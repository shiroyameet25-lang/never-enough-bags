import type { BrandStyle } from "@/lib/products";

const styleClass: Record<BrandStyle, string> = {
  serif: "text-display font-light tracking-[0.18em]",
  sans: "font-sans font-semibold tracking-[0.32em]",
  mono: "font-mono font-medium tracking-[0.22em]",
  italic: "text-display italic font-light tracking-[0.12em]",
};

export function BrandLogo({
  name,
  tagline,
  style,
  size = "md",
  tone = "dark",
}: {
  name: string;
  tagline?: string;
  style: BrandStyle;
  size?: "sm" | "md" | "lg";
  tone?: "dark" | "light";
}) {
  const sizeClass =
    size === "lg"
      ? "text-2xl md:text-3xl"
      : size === "sm"
        ? "text-base md:text-lg"
        : "text-xl md:text-2xl";

  const main = tone === "light" ? "text-ivory" : "text-noir";
  const sub = tone === "light" ? "text-champagne/70" : "text-champagne-deep/70";

  return (
    <div className="flex flex-col items-center justify-center gap-1.5 text-center select-none">
      <div className={`${styleClass[style]} ${sizeClass} ${main} leading-none whitespace-nowrap`}>
        {name}
      </div>
      {tagline ? (
        <div className={`text-[0.55rem] md:text-[0.6rem] tracking-[0.3em] uppercase ${sub}`}>
          {tagline}
        </div>
      ) : null}
    </div>
  );
}
