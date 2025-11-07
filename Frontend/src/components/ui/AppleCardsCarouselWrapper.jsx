"use client";

import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconX,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion"; // <-- Use framer-motion
import { useOutsideClick } from "@/hooks/use-outside-click";

// Context
// export const CarouselContext = createContext({
//   onCardClose: () => {},
//   currentIndex: 0,
// });

// // Carousel Component
// export const Carousel = ({ items, initialScroll = 0 }) => {
//   const carouselRef = React.useRef(null);
//   const [canScrollLeft, setCanScrollLeft] = React.useState(false);
//   const [canScrollRight, setCanScrollRight] = React.useState(true);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     if (carouselRef.current) {
//       carouselRef.current.scrollLeft = initialScroll;
//       checkScrollability();
//     }
//   }, [initialScroll]);

//   const checkScrollability = () => {
//     if (carouselRef.current) {
//       const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
//       setCanScrollLeft(scrollLeft > 0);
//       setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
//     }
//   };

//   const scrollLeft = () => {
//     if (carouselRef.current) {
//       carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
//     }
//   };

//   const scrollRight = () => {
//     if (carouselRef.current) {
//       carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
//     }
//   };

//   const handleCardClose = (index) => {
//     if (carouselRef.current) {
//       const cardWidth = isMobile() ? 230 : 384; // (md:w-96)
//       const gap = isMobile() ? 4 : 8;
//       const scrollPosition = (cardWidth + gap) * (index + 1);
//       carouselRef.current.scrollTo({
//         left: scrollPosition,
//         behavior: "smooth",
//       });
//       setCurrentIndex(index);
//     }
//   };

//   const isMobile = () => {
//     return typeof window !== "undefined" && window.innerWidth < 768;
//   };

//   return (
//     <CarouselContext.Provider
//       value={{ onCardClose: handleCardClose, currentIndex }}
//     >
//       <div className="relative w-full">
//         <div
//           className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth py-10 [scrollbar-width:none] md:py-20"
//           ref={carouselRef}
//           onScroll={checkScrollability}
//         >
//           <div
//             className={cn(
//               "absolute right-0 z-[1000] h-auto w-[5%] overflow-hidden bg-gradient-to-l from-white dark:from-neutral-900" // Added dark mode fade
//             )}
//           ></div>

//           <div
//             className={cn(
//               "flex flex-row justify-start gap-4 pl-4",
//               "mx-auto max-w-7xl"
//             )}
//           >
//             {items.map((item, index) => (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{
//                   opacity: 1,
//                   y: 0,
//                   transition: {
//                     duration: 0.5,
//                     delay: 0.2 * index,
//                     ease: "easeOut",
//                     once: true,
//                   },
//                 }}
//                 key={"card" + index}
//                 className="rounded-3xl last:pr-[5%] md:last:pr-[33%]"
//               >
//                 {item}
//               </motion.div>
//             ))}
//           </div>
//         </div>
//         <div className="mr-10 flex justify-end gap-2">
//           <button
//             className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50"
//             onClick={scrollLeft}
//             disabled={!canScrollLeft}
//           >
//             <IconArrowNarrowLeft className="h-6 w-6 text-gray-500" />
//           </button>
//           <button
//             className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50"
//             onClick={scrollRight}
//             disabled={!canScrollRight}
//           >
//             <IconArrowNarrowRight className="h-6 w-6 text-gray-500" />
//           </button>
//         </div>
//       </div>
//     </CarouselContext.Provider>
//   );
// };

// Card Component
export const Card = ({ card, index, layout = false }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  //   const { onCardClose } = useContext(CarouselContext);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        handleClose();
      }
    }
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useOutsideClick(containerRef, () => handleClose());

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // onCardClose(index);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 h-screen overflow-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 h-full w-full bg-black/80 backdrop-blur-lg"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              ref={containerRef}
              layoutId={layout ? `card-${card.title}` : undefined}
              className="relative z-[60] mx-auto my-10 h-fit max-w-5xl rounded-3xl bg-white p-4 font-sans md:p-10 dark:bg-neutral-900"
            >
              <button
                className="sticky top-4 right-0 ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-black dark:bg-white"
                onClick={handleClose}
              >
                <IconX className="h-6 w-6 text-neutral-100 dark:text-neutral-900" />
              </button>
              <motion.p
                layoutId={layout ? `category-${card.title}` : undefined}
                className="text-base font-medium text-black dark:text-white"
              >
                {card.category}
              </motion.p>
              <motion.p
                layoutId={layout ? `title-${card.title}` : undefined}
                className="mt-4 text-2xl font-semibold text-neutral-700 md:text-5xl dark:text-white"
              >
                {card.title}
              </motion.p>
              <div className="py-10">{card.content}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <motion.button
        layoutId={layout ? `card-${card.title}` : undefined}
        onClick={handleOpen}
        className="relative z-10 flex h-80 w-56 flex-col items-start justify-start overflow-hidden rounded-3xl bg-gray-100 md:h-[40rem] md:w-96 dark:bg-neutral-900"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-full bg-gradient-to-b from-black/50 via-transparent to-transparent" />
        <div className="relative z-40 p-8">
          <motion.p
            layoutId={layout ? `category-${card.category}` : undefined}
            className="text-left font-sans text-sm font-medium text-white md:text-base"
          >
            {card.category}
          </motion.p>
          <motion.p
            layoutId={layout ? `title-${card.title}` : undefined}
            className="mt-2 max-w-xs text-left font-sans text-xl font-semibold [text-wrap:balance] text-white md:text-3xl"
          >
            {card.title}
          </motion.p>
        </div>
        <BlurImage
          src={card.src}
          alt={card.title}
          fill
          className="absolute inset-0 z-10 object-cover"
        />
      </motion.button>
    </>
  );
};

// BlurImage Component
export const BlurImage = ({ ...props }) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <img
      {...props}
      className={cn(
        "h-full w-full transition duration-300",
        isLoading ? "blur-sm" : "blur-0",
        props.className
      )}
      onLoad={() => setLoading(false)}
      loading="lazy"
      decoding="async"
    />
  );
};

// DummyContent Component
const DummyContent = () => {
  return (
    <>
      {[...new Array(3).fill(1)].map((_, index) => (
        <div
          key={"dummy-content" + index}
          className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4"
        >
          <p className="text-neutral-600 dark:text-neutral-200 text-base md:text-2xl font-sans max-w-3xl mx-auto">
            <span className="font-bold text-neutral-700 dark:text-neutral-100">
              The first rule of Apple club is that you boast about Apple club.
            </span>{" "}
            Keep a journal, quickly jot down a grocery list, and take amazing
            class notes. Want to convert those notes to text? No problem.
            Langotiya jeetu ka mara hua yaar is ready to capture every thought.
          </p>
          <img
            src="https://assets.aceternity.com/macbook.png"
            alt="Macbook mockup from Aceternity UI"
            height="500"
            width="500"
            className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
          />
        </div>
      ))}
    </>
  );
};

// Data for the carousel
const data = [
  {
    category: "Artificial Intelligence",
    title: "You can do more with AI.",
    src: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=3556&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  // ... (rest of the data)
];

// Main component to export
export function AppleCardsCarouselWrapper() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} layout={true} />
  ));

  return (
    <div className="w-full h-full">
      {" "}
      {/* Removed py-20 */}
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Recommendations
      </h2>
      {/* <Carousel items={cards} /> */}
    </div>
  );
}
