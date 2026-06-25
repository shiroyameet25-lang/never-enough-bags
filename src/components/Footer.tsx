import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-noir text-ivory pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="text-display text-3xl tracking-[0.25em] mb-1">NEEVA</div>
            <div className="text-[0.6rem] tracking-[0.45em] text-champagne mb-6">— BAGS —</div>
            <p className="text-sm text-ivory/60 leading-relaxed font-light">
              India's premier destination for authenticated luxury designer handbags.
              Where craftsmanship meets contemporary elegance.
            </p>
            <div className="flex gap-4 mt-8">
              <a
                href="https://www.instagram.com/neeva_bag?igsh=MW5zMnBjMW9uY3Flag=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-ivory/20 rounded-full flex items-center justify-center hover:bg-champagne hover:border-champagne hover:text-noir transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/share/18xyDnuS8g/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-ivory/20 rounded-full flex items-center justify-center hover:bg-champagne hover:border-champagne hover:text-noir transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="tracking-luxe text-champagne mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm font-light">
              <li><Link to="/" className="hover:text-champagne transition-colors">Home</Link></li>
              <li><Link to="/brands" className="hover:text-champagne transition-colors">Brands</Link></li>
              <li><Link to="/new-arrivals" className="hover:text-champagne transition-colors">New Arrivals</Link></li>
              <li><Link to="/contact" className="hover:text-champagne transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="tracking-luxe text-champagne mb-6">Customer Care</h4>
            <ul className="space-y-3 text-sm font-light">
              <li><a href="#" className="hover:text-champagne transition-colors">Shipping & Delivery</a></li>
              <li><a href="#" className="hover:text-champagne transition-colors">Returns & Exchange</a></li>
              <li><a href="#" className="hover:text-champagne transition-colors">Size Guide</a></li>
              <li><a href="#" className="hover:text-champagne transition-colors">Authenticity Promise</a></li>
              <li><a href="#" className="hover:text-champagne transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="tracking-luxe text-champagne mb-6">Contact</h4>
            <ul className="space-y-3 text-sm font-light text-ivory/70">
              <li className="flex items-start gap-3"><MapPin className="w-4 h-4 mt-0.5 text-champagne shrink-0" /> Bhakti Nandan Sector, Mota Varacha, Surat, Gujarat - 394101</li>
              <li className="flex items-start gap-3"><Phone className="w-4 h-4 mt-0.5 text-champagne shrink-0" /> +91 88669 65656</li>
              <li className="flex items-start gap-3"><Mail className="w-4 h-4 mt-0.5 text-champagne shrink-0" /> neevabag@gmail.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ivory/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-ivory/50 font-light">
          <div>© 2026 NEEVA BAGS · GSTIN: 24HIUPS5141B1Z1</div>
          <div className="flex items-center gap-3">
            <span className="tracking-luxe text-champagne/70">We Accept:</span>
            <span>VISA</span>
            <span>·</span>
            <span>MASTERCARD</span>
            <span>·</span>
            <span>UPI</span>
            <span>·</span>
            <span>RAZORPAY</span>
            <span>·</span>
            <span>COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
