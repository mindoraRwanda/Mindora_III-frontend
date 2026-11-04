'use client';

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import SignalMark from "@/components/SignalMark";

interface Partner {
  id: number;
  name: string;
  image: string;
}

const partners: Partner[] = [
  { id: 1, name: "kLab", image: "/images/klab.png" },
  { id: 2, name: "Imbuto Foundation", image: "/images/imbuto.png" },
  { id: 3, name: "Rwanda Biomedical Centre", image: "/images/rbc.png" },
  { id: 4, name: "Carnegie Mellon University Africa", image: "/images/cmu.png" },
  { id: 5, name: "Aegis Trust", image: "/images/aegis.png" },
  { id: 6, name: "Embassy of Israel in Rwanda", image: "/images/isr.png" },
];

export default function PartnersSection() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    const animation = marquee.animate(
      [
        { transform: 'translateX(0)' },
        { transform: 'translateX(-50%)' }
      ],
      {
        duration: 20000, // Faster scroll for modern feel
        iterations: Infinity,
        easing: 'linear',
      }
    );

    const handleMouseEnter = () => animation.pause();
    const handleMouseLeave = () => animation.play();

    marquee.addEventListener('mouseenter', handleMouseEnter);
    marquee.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      animation.cancel();
      marquee.removeEventListener('mouseenter', handleMouseEnter);
      marquee.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section className="relative py-20 overflow-hidden bg-ink">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <SignalMark className="mx-auto mb-4 h-8 w-8 text-brand-500" />
          <h2 className="text-4xl md:text-5xl text-paper mb-4">
            Our Partners
          </h2>
          <p className="text-paper/60 max-w-2xl mx-auto text-lg">
            Working with top organizations to drive mental health innovation
          </p>
        </motion.div>

        <div className="relative overflow-hidden py-8">
          {/* Fade masks */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-ink to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-ink to-transparent z-10" />

          <div ref={marqueeRef} className="flex whitespace-nowrap">
            {/* First set */}
            <div className="flex gap-6 min-w-full">
              {partners.map((partner) => (
                <Card
                  key={partner.id}
                  className="group flex-none w-64 h-36 flex items-center justify-center p-6
                    bg-ink-700 border border-paper/10 rounded-md
                    hover:bg-ink-800 hover:border-brand-500/60
                    transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/10"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={partner.image}
                      alt={`${partner.name} logo`}
                      fill
                      sizes="(max-width: 768px) 100vw, 256px"
                      className="object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                </Card>
              ))}
            </div>
            {/* Duplicate set for seamless loop */}
            <div className="flex gap-6 min-w-full">
              {partners.map((partner) => (
                <Card
                  key={`${partner.id}-duplicate`}
                  className="group flex-none w-64 h-36 flex items-center justify-center p-6
                    bg-ink-700 border border-paper/10 rounded-md
                    hover:bg-ink-800 hover:border-brand-500/60
                    transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/10"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={partner.image}
                      alt={`${partner.name} logo`}
                      fill
                      sizes="(max-width: 768px) 100vw, 256px"
                      className="object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
