"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";
import SignalMark from "@/components/SignalMark";

interface Slide {
  image: string;
  heading: string;
  subheading: string;
  buttonText: string;
  href: string;
}

export default function HeroCarousel() {
  const slides: Slide[] = [
    {
      image: "/images/slide1.jpg",
      heading: "Welcome to Mindora Health",
      subheading: "Discover how we're shaping the future of mental health with AI-powered solutions.",
      buttonText: "Learn More",
      href: "/about",
    },
    {
      image: "/images/slide2.jpg",
      heading: "Empowering Your Journey",
      subheading: "Join thousands who trust us to enhance their mental well-being with personalized tools and resources.",
      buttonText: "Explore Features",
      href: "/news",
    },
    {
      image: "/images/slide3.jpg",
      heading: "Take Control of Your Mental Health",
      subheading: "Our app provides tools and guidance for better mental health, anytime, anywhere.",
      buttonText: "Request Demo",
      href: "/demo",
    },
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-ink">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        navigation
        pagination={{ clickable: true }}
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full bg-ink">
              {/* Duotone photo: grayscale + brand color-blend, no soft gradient overlay */}
              <div
                className="absolute inset-0 bg-cover bg-center grayscale"
                style={{ backgroundImage: `url('${slide.image}')` }}
              />
              <div className="absolute inset-0 bg-brand-600 mix-blend-color" />
              <div className="absolute inset-0 bg-ink/40" />

              {/* Diagonal ink color-block panel carrying the copy */}
              <div
                className="absolute inset-y-0 left-0 w-full bg-ink md:w-[64%]"
                style={{ clipPath: "polygon(0 0, 100% 0, 78% 100%, 0% 100%)" }}
              />

              <div className="relative z-10 flex h-full flex-col justify-center px-6 md:w-[64%] md:px-16 lg:px-20">
                <SignalMark className="mb-6 h-8 w-8 text-brand-400" />
                <h1 className="max-w-2xl text-5xl text-paper lg:text-6xl">{slide.heading}</h1>
                <p className="mt-4 max-w-xl text-lg leading-relaxed text-paper/75 lg:mt-6 lg:text-xl">
                  {slide.subheading}
                </p>
                <Link
                  href={slide.href}
                  className="mt-8 inline-flex w-fit items-center gap-2 rounded-md bg-brand-600 px-8 py-3 font-display text-sm uppercase tracking-wide text-paper transition-colors duration-200 hover:bg-brand-500"
                >
                  {slide.buttonText}
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}