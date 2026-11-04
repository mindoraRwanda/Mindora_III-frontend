"use client";

import { useState, useEffect } from "react";
import { Mail, Building2, MessageSquare, User } from "lucide-react";
import SignalMark from "@/components/SignalMark";
import { createContactMessage } from "@/app/(ds)/contact-msg/action";

export default function DemoRequestPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    message: ""
  });

  useEffect(() => {
    const darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(darkMode);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: { matches: boolean | ((prevState: boolean) => boolean); }) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createContactMessage({
        name: formData.name,
        email: formData.email,
        organization: formData.organization || undefined,
        message: formData.message || undefined,
        source: "demo",
      });
      alert("Demo request submitted successfully!");
      setFormData({ name: "", email: "", organization: "", message: "" });
    } catch {
      alert("Something went wrong submitting your request. Please try again or email us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div className={`relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden
      ${isDarkMode ? "bg-ink" : "bg-background"}`}>

      {/* Signal diagonal color blocks (flat, no blur) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -left-32 h-80 w-80 bg-brand-600"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 70%)" }}
        />
        <div
          className="absolute -bottom-32 -right-32 h-80 w-80 bg-brand-800"
          style={{ clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0 100%)" }}
        />
      </div>

      <div className={`relative z-10 w-full max-w-3xl p-8 rounded-md border
        ${isDarkMode
          ? "bg-ink text-paper border-paper/15"
          : "bg-card text-foreground border-border"}`}>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center space-x-3 mb-2">
            <SignalMark className={`h-8 w-8 ${isDarkMode ? "text-brand-400" : "text-brand-600"}`} />
            <h2 className="text-4xl">
              Request a Demo
            </h2>
          </div>
          <div className="relative">
            <h3 className={`text-xl mb-4 ${isDarkMode ? "text-brand-400" : "text-brand-600"}`}>
              Mindora Health
            </h3>
          </div>
          <p className={`text-sm ${isDarkMode ? "text-paper/60" : "text-muted-foreground"}`}>
            Experience the future of healthcare management
          </p>
        </div>

        {/* Enhanced Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Input */}
            <div className="relative">
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? "text-paper/40" : "text-muted-foreground"}`} />
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 rounded-md border transition-colors duration-200
                    ${isDarkMode
                      ? "bg-ink/60 border-paper/20 text-paper placeholder:text-paper/40"
                      : "bg-background border-input text-foreground"}
                    focus:ring-2 focus:ring-brand-400 focus:border-transparent`}
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="relative">
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? "text-paper/40" : "text-muted-foreground"}`} />
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 rounded-md border transition-colors duration-200
                    ${isDarkMode
                      ? "bg-ink/60 border-paper/20 text-paper placeholder:text-paper/40"
                      : "bg-background border-input text-foreground"}
                    focus:ring-2 focus:ring-brand-400 focus:border-transparent`}
                  placeholder="johndoe@example.com"
                  required
                />
              </div>
            </div>
          </div>

          {/* Organization Input */}
          <div className="relative">
            <label htmlFor="organization" className="block text-sm font-medium mb-1">
              Organization Name
            </label>
            <div className="relative">
              <Building2 className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? "text-paper/40" : "text-muted-foreground"}`} />
              <input
                type="text"
                id="organization"
                value={formData.organization}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3 rounded-md border transition-colors duration-200
                  ${isDarkMode
                    ? "bg-ink/60 border-paper/20 text-paper placeholder:text-paper/40"
                    : "bg-background border-input text-foreground"}
                  focus:ring-2 focus:ring-brand-400 focus:border-transparent`}
                placeholder="Mindora Inc."
                required
              />
            </div>
          </div>

          {/* Message Input */}
          <div className="relative">
            <label htmlFor="message" className="block text-sm font-medium mb-1">
              Additional Message (Optional)
            </label>
            <div className="relative">
              <MessageSquare className={`absolute left-3 top-3 w-5 h-5 ${isDarkMode ? "text-paper/40" : "text-muted-foreground"}`} />
              <textarea
                id="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className={`w-full pl-12 pr-4 py-3 rounded-md border transition-colors duration-200
                  ${isDarkMode
                    ? "bg-ink/60 border-paper/20 text-paper placeholder:text-paper/40"
                    : "bg-background border-input text-foreground"}
                  focus:ring-2 focus:ring-brand-400 focus:border-transparent`}
                placeholder="Tell us more about your needs..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`relative w-full px-6 py-3 text-lg font-display uppercase tracking-wide rounded-md
                transition-colors duration-200
                ${isDarkMode
                  ? "bg-brand-600 hover:bg-brand-700"
                  : "bg-brand-500 hover:bg-brand-600"}
                text-white
                disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? (
                <span className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Request Demo"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}