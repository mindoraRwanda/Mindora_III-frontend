import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import SignalMark from "@/components/SignalMark";

export default function Footer() {
  return (
    <footer className="w-full mt-auto bg-ink px-6 py-16 text-paper md:px-16 lg:px-24">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        {/* Logo and Description */}
        <div className="space-y-4">
          <h2 className="flex items-center gap-3 font-display text-xl font-bold tracking-wide">
            <SignalMark className="h-6 w-6 text-brand-500" />
            MINDORA Health
          </h2>
          <p className="text-sm leading-relaxed text-paper/60">
            At Mindora, we believe that mental health is a key part of living a fulfilled life. We are driven by the mission to provide accessible, AI-powered solutions that help individuals take control of their mental well-being before challenges arise.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-paper/50">Quick Links</h3>
          <ul className="space-y-2">
            {["Home", "About Us", "Services", "News", "Contact Us"].map(
              (link, index) => (
                <FooterLink key={index} href={`/${link.toLowerCase().replace(/ /g, "-")}`}>
                  {link}
                </FooterLink>
              )
            )}
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-paper/50">Subscribe</h3>
          <p className="text-sm text-paper/60">
            Stay updated with our latest news and updates. Subscribe to our newsletter!
          </p>
          <form className="flex items-center gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-sm border border-paper/20 bg-transparent px-4 py-2 text-sm text-paper placeholder-paper/40 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="submit"
              className="shrink-0 rounded-sm bg-brand-600 px-4 py-2 text-sm font-display font-bold uppercase tracking-wide text-paper transition hover:bg-brand-700"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Social Media and Copyright */}
      <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-paper/10 pt-8 md:flex-row">
        {/* Social Media Links */}
        <div className="flex space-x-4">
          <SocialIcon href="https://facebook.com" label="Facebook" icon={<Facebook className="h-4 w-4" />} />
          <SocialIcon href="https://twitter.com" label="Twitter" icon={<Twitter className="h-4 w-4" />} />
          <SocialIcon href="https://instagram.com" label="Instagram" icon={<Instagram className="h-4 w-4" />} />
          <SocialIcon href="https://linkedin.com" label="LinkedIn" icon={<Linkedin className="h-4 w-4" />} />
        </div>

        {/* Copyright Notice */}
        <p className="text-sm text-paper/50">
          &copy; {new Date().getFullYear()} MINDORA Africa. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

// Footer Link Component
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-paper/60 transition hover:text-brand-400"
      >
        {children}
      </Link>
    </li>
  );
}

// Social Media Icon Component
function SocialIcon({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-sm border border-paper/15 text-paper/70 transition hover:border-brand-500 hover:bg-brand-600 hover:text-paper"
    >
      {icon}
    </a>
  );
}
