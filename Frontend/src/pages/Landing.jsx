import { useState, useEffect } from "react";
import BlurText from "../components/BlurText";

export default function Landing() {
  const [showSecondLine, setShowSecondLine] = useState(false);

  useEffect(() => {
    // Start second line animation after 2 seconds (2000ms)
    const timer = setTimeout(() => setShowSecondLine(true), 2000);
    return () => clearTimeout(timer); // cleanup
  }, []);

  const handleFirstLineComplete = () => {
    console.log("First line animation completed!");
  };

  const handleSecondLineComplete = () => {
    console.log("Second line animation completed!");
  };

  return (
    <>
      <div
        className="absolute left-1/2 top-1/2 flex flex-col items-center justify-center text-center px-4 sm:px-0"
        style={{ transform: "translate(-50%, -50%)", color: "white" }}
      >
        <BlurText
          text="AI for Legal Clarity and Confidence"
          delay={100}
          animateBy="words"
          direction="below"
          onAnimationComplete={handleFirstLineComplete}
          className="text-5xl mb-8 font-inter font-semibold text-center mt-4 leading-relaxed"
        />
        <BlurText
          text="Your personal AI legal assistant, anytime, anywhere"
          delay={100}
          animateBy="words"
          direction="below"
          onAnimationComplete={handleSecondLineComplete}
          className="text-2xl mb-8 font-lexend font-light text-center leading-snug"
        />
      </div>
    </>
  );
}
