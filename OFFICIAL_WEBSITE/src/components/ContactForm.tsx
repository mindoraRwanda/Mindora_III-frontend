"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, User, MessageSquare, Building2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { createContactMessage } from "@/app/(ds)/contact-msg/action";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createContactMessage({
        name: formData.name,
        email: formData.email,
        organization: formData.organization || undefined,
        message: formData.message,
        source: "contact",
      });
      setSubmitted(true);
      setFormData({ name: "", email: "", organization: "", message: "" });
    } catch {
      toast.error("Something went wrong. Please try again or email us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-card p-8 md:p-10 rounded-md border border-border border-t-4 border-t-brand-600 text-center">
        <h3 className="text-2xl font-semibold mb-2">Message sent</h3>
        <p className="text-muted-foreground">
          Thanks for reaching out - we&apos;ll respond within 24 hours.
        </p>
        <Button className="mt-6" variant="outline" onClick={() => setSubmitted(false)}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card p-8 md:p-10 rounded-md border border-border border-t-4 border-t-brand-600 space-y-6"
    >
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Your Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            id="name"
            type="text"
            className="w-full h-auto pl-10 p-3 rounded-md bg-background focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-0"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Your Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            id="email"
            type="email"
            className="w-full h-auto pl-10 p-3 rounded-md bg-background focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-0"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="organization" className="text-sm font-medium">
          Institution Affiliation (Optional)
        </label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            id="organization"
            type="text"
            className="w-full h-auto pl-10 p-3 rounded-md bg-background focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-0"
            placeholder="Your Institution"
            value={formData.organization}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium">
          Your Message
        </label>
        <div className="relative">
          <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Textarea
            id="message"
            className="w-full pl-10 p-3 rounded-md bg-background focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-0"
            rows={6}
            placeholder="Tell us more about your needs..."
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-brand-600 text-white hover:bg-brand-700 rounded-md p-4 h-auto font-display uppercase tracking-wide disabled:opacity-60"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
