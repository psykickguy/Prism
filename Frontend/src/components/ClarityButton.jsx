import React, { useState } from "react";
import { GlowEffect } from "@/components/core/glow-effect";
import { ArrowRight } from "lucide-react";
import magnifyingGlass from "../assets/magnifying-glass-light.png";
// import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader.jsx";
// import { IconSquareRoundedX } from "@tabler/icons-react";

// const loadingStates = [
//   {
//     text: "Buying a condo",
//   },
//   {
//     text: "Travelling in a flight",
//   },
//   {
//     text: "Meeting Tyler Durden",
//   },
//   {
//     text: "He makes soap",
//   },
//   {
//     text: "We goto a bar",
//   },
//   {
//     text: "Start a fight",
//   },
//   {
//     text: "We like it",
//   },
//   {
//     text: "Welcome to F**** C***",
//   },
// ];

export function ClarityButton() {
  //   const [loading, setLoading] = useState(false);
  return (
    <div className="relative p-1">
      <GlowEffect
        colors={["#FF5733", "#33FF57", "#3357FF", "#F1C40F"]}
        mode="colorShift"
        blur="medium"
        duration={3}
        scale={0.9}
      />

      {/* <Loader loadingStates={loadingStates} loading={loading} duration={2000} /> */}
      <button
        // onClick={(e) => {
        //   // <--- CRITICAL FIX: Add event handler
        //   e.stopPropagation(); // <--- STOP THE EVENT from bubbling to FileUpload's handleClick
        //   if (onClick) {
        //     onClick(e); // Pass the event if needed by the parent (best practice)
        //   } else {
        //     setLoading(true); // Keep local logic if no prop is passed (optional fallback)
        //   }
        // }}
        className="relative inline-flex items-center gap-3 rounded-full bg-zinc-950 px-6 py-2.5 text-sm text-zinc-50 outline outline-2 outline-[#fff2f21f] hover:-translate-y-1 transition duration-400"
      >
        <img src={magnifyingGlass} alt="Clarify Logo" className="h-5 w-5" />
        <span>Clarify</span>
      </button>

      {/* {loading && (
        <button
          className="fixed top-4 right-4 text-black dark:text-white z-[120]"
          onClick={() => setLoading(false)}
        >
          <IconSquareRoundedX className="h-10 w-10" />
        </button>
      )} */}
    </div>
  );
}

{
  /* <button className="relative inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-base font-semibold text-black"> */
}

const AceternityLogo = () => {
  return (
    <svg
      width="66"
      height="65"
      viewBox="0 0 66 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-3 w-3 text-black dark:text-white"
    >
      <path
        d="M8 8.05571C8 8.05571 54.9009 18.1782 57.8687 30.062C60.8365 41.9458 9.05432 57.4696 9.05432 57.4696"
        stroke="currentColor"
        strokeWidth="15"
        strokeMiterlimit="3.86874"
        strokeLinecap="round"
      />
    </svg>
  );
};
