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
                { icon: MapPin, title: "Boutique", value: "Ring Road, Surat, Gujarat 395002" },
                { icon: Phone, title: "Call", value: "+91 98765 43210" },
                { icon: Mail, title: "Email", value: "care@neevabags.in" },
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
              href="https://wa.me/919876543210"
              className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white py-4 tracking-luxe hover:opacity-90"
            >
              <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
            </a>

            {/* Map embed */}
            <div className="aspect-[16/9] overflow-hidden border border-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29765.31!2d72.83!3d21.17!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04dded4727171%3A0x35dac8e91eb50d8d!2sSurat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000"
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
