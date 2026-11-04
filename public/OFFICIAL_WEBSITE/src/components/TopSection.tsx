"use client";

import SignalMark from "@/components/SignalMark";

interface TopSectionProps {
  backgroundImage: string;
  title: string;
  description: string;
}

export default function TopSection({
  backgroundImage,
  title,
  description,
}: TopSectionProps) {
  return (
    <div className="relative w-full overflow-hidden bg-ink">
      {/* Diagonal duotone photo block, visible from tablet up */}
      <div
        className="absolute inset-y-0 right-0 hidden w-[46%] overflow-hidden md:block"
        style={{ clipPath: "polygon(14% 0, 100% 0, 100% 100%, 0 100%)" }}
      >
        <div
          className="h-full w-full bg-cover bg-center grayscale contrast-125"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        <div className="absolute inset-0 bg-brand-600 mix-blend-color" />
        <div className="absolute inset-0 bg-ink/20 mix-blend-multiply" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[46vh] w-full max-w-7xl flex-col justify-center px-6 py-20 md:min-h-[52vh] md:px-12 lg:px-20">
        <SignalMark className="mb-8 h-8 w-8 text-brand-500" />
        <h1 className="max-w-2xl text-4xl font-bold leading-[1.05] text-paper md:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-xl text-lg text-paper/70 md:text-xl">
          {description}
        </p>
      </div>
    </div>
  );
}
