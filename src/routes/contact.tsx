import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, MapPin, Clock, MessageCircle, Instagram } from "lucide-react";
import { Layout } from "@/components/Layout";
import { GoldDivider } from "@/components/Divider";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — NEEVA BAGS" }] }),
  component: ContactPage,
});

const SUBJECTS = ["General Enquiry", "Order Status", "Authentication", "Wholesale", "Press"];

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <Layout>
      <section className="py-20 bg-noir text-ivory text-center">
        <GoldDivider label="Get In Touch" />
        <h1 className="text-display text-5xl md:text-6xl mt-6 mb-4">We're Here for You</h1>
        <p className="text-ivory/60 max-w-xl mx-auto font-light px-6">
          Our concierge team is available to help with any question, any time.
        </p>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16">
          {/* Form */}
          <div>
            <h2 className="text-display text-3xl mb-8">Send a Message</h2>
            {sent ? (
              <div className="bg-secondary p-10 text-center">
                <div className="text-display text-3xl mb-2">Thank you</div>
                <p className="text-muted-foreground">Our team will reach out within 24 hours.</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); setSent(true); }}
                className="space-y-5"
              >
                <div className="grid grid-cols-2 gap-4">
                  <input required placeholder="Name" className="w-full bg-transparent border-b border-border py-3 focus:border-champagne outline-none placeholder:text-muted-foreground" />
                  <input required type="email" placeholder="Email" className="w-full bg-transparent border-b border-border py-3 focus:border-champagne outline-none placeholder:text-muted-foreground" />
                </div>
                <input required type="tel" placeholder="Phone" className="w-full bg-transparent border-b border-border py-3 focus:border-champagne outline-none placeholder:text-muted-foreground" />
                <select required defaultValue="" className="w-full bg-transparent border-b border-border py-3 focus:border-champagne outline-none">
                  <option value="" disabled>Select Subject</option>
                  {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                </select>
                <textarea required rows={5} placeholder="Your message" className="w-full bg-transparent border-b border-border py-3 focus:border-champagne outline-none placeholder:text-muted-foreground resize-none" />
                <button type="submit" className="btn-gold w-full mt-4">Send Message</button>
              </form>
            )}
          </div>

          {/* Info */}
          <div className="space-y-8">
            <h2 className="text-display text-3xl mb-2">Visit & Connect</h2>
            <div className="space-y-6">
              {[
                { icon: MapPin, title: "Boutique", value: "Bhakti Nandan Sector, Mota Varacha, Surat, Gujarat - 394101" },
                { icon: Phone, title: "Call", value: "+91 88669 65656" },
                { icon: Mail, title: "Email", value: "neevabag@gmail.com" },
                { icon: Clock, title: "Hours", value: "Mon–Sat · 10 AM to 8 PM" },
              ].map((c) => (
                <div key={c.title} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full border border-champagne flex items-center justify-center shrink-0">
                    <c.icon className="w-5 h-5 text-champagne-deep" />
                  </div>
                  <div>
                    <div className="tracking-luxe text-champagne-deep mb-1">{c.title}</div>
                    <div className="text-noir font-light">{c.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="https://wa.me/918866965656"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white py-4 tracking-luxe hover:opacity-90"
            >
              <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
            </a>

            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/neeva_bag?igsh=MW5zMnBjMW9uY3Flag=="
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] text-white py-3 tracking-luxe hover:opacity-90"
              >
                <Instagram className="w-5 h-5" /> Instagram
              </a>
              <a
                href="https://www.facebook.com/share/18xyDnuS8g/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-[#1877F2] text-white py-3 tracking-luxe hover:opacity-90"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </a>
            </div>

            {/* Map embed */}
            <div className="aspect-[16/9] overflow-hidden border border-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.0!2d72.88!3d21.24!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDE0JzI0LjAiTiA3MsKwNTInNDguMCJF!5e0!3m2!1sen!2sin!4v1700000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                title="NEEVA BAGS Surat location"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
