import React from 'react'
import { Button } from "@/components/ui/button"
import { AppleIcon, PlayIcon } from 'lucide-react'
import Link from 'next/link'
import SignalMark from '@/components/SignalMark'

export default function DownloadSection() {
  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      <div className="container relative mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 flex items-center justify-center gap-2">
            <SignalMark className="h-5 w-5 text-brand-500" />
            <span className="font-display text-sm uppercase tracking-wide text-brand-400">Coming soon</span>
          </div>

          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl text-paper mb-6">
              Transform Your Mental Health Journey
            </h2>
            <p className="text-lg text-paper/70 mb-8 max-w-2xl mx-auto">
              Get the Mindora app for your device and start your path to better mental well-being today. Join thousands of users already benefiting from our innovative solutions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button
              asChild
              className="w-full sm:w-auto bg-paper text-ink hover:bg-paper/90 rounded-md py-6 px-8 transition-colors duration-200"
            >
              <Link href="https://www.apple.com/app-store/" className="flex items-center justify-center">
                <AppleIcon className="w-8 h-8 mr-3" />
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-lg font-semibold">App Store</div>
                </div>
              </Link>
            </Button>

            <Button
              asChild
              className="w-full sm:w-auto bg-brand-600 hover:bg-brand-500 text-paper rounded-md py-6 px-8 transition-colors duration-200"
            >
              <Link href="https://play.google.com/store/apps" className="flex items-center justify-center">
                <PlayIcon className="w-8 h-8 mr-3" />
                <div className="text-left">
                  <div className="text-xs">Get it on</div>
                  <div className="text-lg font-semibold">Google Play</div>
                </div>
              </Link>
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-3 font-display text-xs uppercase tracking-wide">
            <div className="px-4 py-2 rounded-md border border-paper/25 text-paper/70">
              Free Download
            </div>
            <div className="px-4 py-2 rounded-md border border-paper/25 text-paper/70">
              24/7 Support
            </div>
            <div className="px-4 py-2 rounded-md border border-paper/25 text-paper/70">
              Secure & Private
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}