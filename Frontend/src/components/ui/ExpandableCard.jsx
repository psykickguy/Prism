"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const Card = ({ card, layout = false }) => {
  return (
    <motion.div
      layoutId={layout ? `card-${card.title}` : undefined}
      className="relative z-10 flex w-[90%] max-w-[34rem] flex-col items-start justify-start overflow-hidden rounded-3xl bg-transparent text-left md:w-[34rem] mx-auto my-2"
    >
      {/* Gradient Overlay */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-full bg-gradient-to-b from-black/50 via-transparent to-transparent" />

      {/* Card Content */}
      <div className="relative z-40 p-4 sm:p-6 md:p-10 text-left w-full">
        {card.recommendations && (
          <ul className="list-disc pl-5 space-y-2 text-neutral-300 text-sm md:text-base text-glow text-left">
            {card.recommendations.map((rec, idx) => (
              <li key={idx} className="leading-snug">
                {rec}
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
};

// ✅ Helper component for blurred images
export const BlurImage = ({ height, width, src, className, alt, ...rest }) => {
  const [isLoading, setLoading] = React.useState(true);
  return (
    <img
      className={cn(
        "h-full w-full object-cover transition duration-300",
        isLoading ? "blur-sm" : "blur-0",
        className
      )}
      onLoad={() => setLoading(false)}
      src={src}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      alt={alt || "Background of a beautiful view"}
      {...rest}
    />
  );
};
