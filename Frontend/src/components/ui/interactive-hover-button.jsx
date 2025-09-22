import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const InteractiveHoverButton = React.forwardRef(
  ({ children, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Initial state: white background, black border, black text
          "group relative w-auto cursor-pointer overflow-hidden rounded-full border border-neutral-200 bg-white p-2 px-6 text-center font-semibold text-black",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2">
          {/* This div creates the black circle that expands on hover */}
          <div className="h-2 w-2 rounded-full bg-black transition-all duration-300 group-hover:scale-[100.8]"></div>

          {/* This is the initial text that fades out */}
          <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
            {children}
          </span>
        </div>

        {/* This is the text that appears on hover (white text on black background) */}
        <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-white opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100">
          <span>{children}</span>
          <ArrowRight />
        </div>
      </button>
    );
  }
);

InteractiveHoverButton.displayName = "InteractiveHoverButton";
