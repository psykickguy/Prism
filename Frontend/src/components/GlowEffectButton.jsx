import { GlowEffect } from "@/components/core/glow-effect";
import { ArrowRight } from "lucide-react";
import robot from "../assets/robot.png";

export function GlowEffectButton() {
  return (
    <div className="relative p-1">
      <GlowEffect
        colors={["#FF5733", "#33FF57", "#3357FF", "#F1C40F"]}
        mode="colorShift"
        blur="medium"
        duration={3}
        scale={0.9}
      />
      <button className="relative inline-flex items-center gap-3 rounded-full bg-zinc-950 px-6 py-2.5 text-sm text-zinc-50 outline outline-2 outline-[#fff2f21f]">
        <img src={robot} alt="Argus Logo" className="h-5 w-5" />
        <span>Argus</span>
      </button>
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
