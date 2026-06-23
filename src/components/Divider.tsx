export function GoldDivider({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-5 py-2">
      <span className="gold-divider" />
      {label && <span className="tracking-luxe text-champagne-deep">{label}</span>}
      <span className="gold-divider" />
    </div>
  );
}
