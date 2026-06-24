import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, ShoppingBag, User, Heart, Menu, X, Shield } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useAuth, useIsAdmin } from "@/lib/use-auth";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/brands", label: "Brands" },
  { to: "/new-arrivals", label: "New Arrivals" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const { user } = useAuth();
  const { data: isAdmin } = useIsAdmin(user);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="bg-noir text-ivory text-center py-2 tracking-luxe">
        Complimentary Shipping Across India · COD Available
      </div>

      <header className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? "glass-nav-solid" : "glass-nav"}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-20">
            <button className="md:hidden text-noir" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu className="w-5 h-5" />
            </button>

            <nav className="hidden md:flex items-center gap-10">
              {LINKS.slice(0, 3).map((l) => (
                <Link key={l.to} to={l.to} className="text-[0.7rem] tracking-luxe text-noir hover:text-champagne-deep transition-colors">
                  {l.label}
                </Link>
              ))}
            </nav>

            <Link to="/" className="absolute left-1/2 -translate-x-1/2">
              <div className="text-display text-2xl md:text-3xl text-noir tracking-[0.25em]">NEEVA</div>
              <div className="text-[0.55rem] tracking-[0.45em] text-champagne-deep text-center mt-[-2px]">— BAGS —</div>
            </Link>

            <div className="flex items-center gap-5 md:gap-7">
              {isAdmin && (
                <Link to="/admin" className="hidden md:flex items-center gap-1.5 text-[0.65rem] tracking-luxe text-champagne-deep hover:text-noir transition-colors" aria-label="Admin">
                  <Shield className="w-4 h-4" /> Admin
                </Link>
              )}
              <button className="text-noir hover:text-champagne-deep transition-colors" aria-label="Search">
                <Search className="w-[18px] h-[18px]" />
              </button>
              <Link to="/account" className="hidden md:block text-noir hover:text-champagne-deep transition-colors" aria-label="Account">
                <User className="w-[18px] h-[18px]" />
              </Link>
              <Link to="/wishlist" className="hidden md:block text-noir hover:text-champagne-deep transition-colors" aria-label="Wishlist">
                <Heart className="w-[18px] h-[18px]" />
              </Link>
              <Link to="/cart" className="text-noir hover:text-champagne-deep transition-colors relative" aria-label="Cart">
                <ShoppingBag className="w-[18px] h-[18px]" />
                {count > 0 && (
                  <span className="absolute -top-2 -right-2 bg-champagne-deep text-ivory text-[0.6rem] font-medium w-4 h-4 rounded-full flex items-center justify-center">
                    {count}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[60] bg-ivory md:hidden">
          <div className="flex items-center justify-between h-20 px-6 border-b border-border">
            <span className="text-display text-2xl tracking-[0.2em]">NEEVA</span>
            <button onClick={() => setOpen(false)} aria-label="Close menu">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex flex-col px-6 py-8 gap-6">
            {LINKS.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-display text-2xl text-noir">
                {l.label}
              </Link>
            ))}
            <div className="h-px bg-champagne my-4" />
            <Link to="/account" onClick={() => setOpen(false)} className="tracking-luxe">Account</Link>
            <Link to="/wishlist" onClick={() => setOpen(false)} className="tracking-luxe">Wishlist</Link>
            {isAdmin && (
              <Link to="/admin" onClick={() => setOpen(false)} className="tracking-luxe text-champagne-deep">
                Admin Dashboard
              </Link>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
