import type { Metadata } from "next";
import { Space_Grotesk, Work_Sans } from "next/font/google";
import "./globals.css";

import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme-provider"

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title:{
    template: "%s | Mindora Health",
    default: "Mindora Health",
  },
  description: "Mindora Health is a mental health platform",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"  suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${workSans.variable} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          {children}
          {/* Every (ds) admin CRUD page (and now ContactForm) calls
              toast.success/toast.error via react-hot-toast, but nothing in
              this app ever mounted the portal those calls render into - so
              every one of those notifications has been silently swallowed.
              One Toaster here covers the whole app. */}
          <Toaster position="top-right" />
          </ThemeProvider>
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
