import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import SignalMark from "@/components/SignalMark";
import TopSection from "@/components/TopSection";
import FAQ from "@/components/FAQ";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact Us",
};

export default function Contact() {
  const contactInfo = [
    {
      title: "Phone",
      details: "+250 783 974-066",
      subtext: "Monday to Friday, 9am to 5pm",
      href: "tel:+250783974066",
      ariaLabel: "Call MINDORA at +250 783 974-066",
    },
    {
      title: "Email",
      details: "info@mindora.rw",
      subtext: "We'll respond within 24 hours",
      href: "mailto:info@mindora.rw",
      ariaLabel: "Email MINDORA at info@mindora.rw",
    },
    {
      title: "Office",
      details: "123 Innovation Hub, Nyarugenge",
      subtext: "Kigali, Rwanda",
      href: null,
      ariaLabel: null,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopSection
        backgroundImage="/images/contactbg.jpg"
        title="Let's Connect"
        description="Reach out to learn more about how we can support your mental health journey."
      />

      {/* Contact Information Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {contactInfo.map((info, index) => {
              const cardClassName =
                "block rounded-md border border-border border-l-4 border-l-brand-600 bg-card p-8 transition-colors duration-300 hover:border-brand-500";
              const cardContent = (
                <>
                  <SignalMark className="mb-6 h-6 w-6 text-brand-600" />
                  <h3 className="mb-3 font-display text-xs uppercase tracking-wide text-muted-foreground">
                    {info.title}
                  </h3>
                  <p className="mb-2 text-xl font-semibold text-foreground">
                    {info.details}
                  </p>
                  <p className="text-sm text-muted-foreground">{info.subtext}</p>
                </>
              );

              return info.href ? (
                <a
                  key={index}
                  href={info.href}
                  aria-label={info.ariaLabel ?? undefined}
                  className={`${cardClassName} cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600`}
                >
                  {cardContent}
                </a>
              ) : (
                <div key={index} className={cardClassName}>
                  {cardContent}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <SignalMark className="h-8 w-8 text-brand-600 mx-auto mb-4" />
              <h2 className="text-4xl mb-4">Send Us a Message</h2>
              <p className="text-lg text-muted-foreground">
                We&apos;re here to help and answer any questions you might have.
              </p>
            </div>

            <ContactForm />
            <p className="text-sm text-muted-foreground text-center mt-4">
              By submitting this form, you agree to our{" "}
              <a href="/privacy-policy" className="text-brand-600 underline">
                Privacy Policy
              </a>
              . Your information is secure with us.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <FAQ />
      </section>

      {/* Social Links */}
      <section className="py-20 bg-ink">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl mb-8 text-paper">Connect With Us</h2>
          <div className="flex justify-center space-x-4">
            {[
              { icon: <Facebook className="w-5 h-5" />, link: "https://facebook.com" },
              { icon: <Twitter className="w-5 h-5" />, link: "https://twitter.com" },
              { icon: <Instagram className="w-5 h-5" />, link: "https://www.instagram.com/mindorarwanda/" },
              { icon: <Linkedin className="w-5 h-5" />, link: "https://www.linkedin.com/company/mindora-rwanda/" },
            ].map((social, index) => (
              <a
                key={index}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-md border border-paper/20 flex items-center justify-center
                  text-paper/70 hover:bg-brand-600 hover:text-paper hover:border-brand-600 transition-colors duration-300"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
