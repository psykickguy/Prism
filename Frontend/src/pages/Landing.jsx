import { useState, useEffect } from "react";
import BlurText from "../components/BlurText";
import { InteractiveHoverButton } from "../components/ui/interactive-hover-button";
import { GlowEffectButton } from "@/components/GlowEffectButton";
import FadeContent from "@/components/FadeContent";
import AiButton from "@/components/animata/button/ai-button.jsx";
import ChatBot from "react-chatbotify";
import { useNavigate } from "react-router-dom";

import { DraggableCardDemo } from "@/components/DraggableCard";

export default function Landing() {
  const [showSecondLine, setShowSecondLine] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const textTimer = setTimeout(() => setShowSecondLine(true), 1000);
    const buttonTimer = setTimeout(() => setShowButtons(true), 2500);
    return () => {
      clearTimeout(textTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  const toggleArgusChat = () => {
    setIsChatVisible((prev) => !prev);
  };

  return (
    <>
      {isChatVisible && (
        <DraggableCardDemo
          isVisible={isChatVisible}
          toggleVisibility={toggleArgusChat}
        />
      )}
      <div className="relative w-full min-h-screen flex items-center justify-center text-white">
        {/* Add a top margin to this inner container */}
        <div className="mt-24 flex flex-col items-center gap-8 px-4 text-center">
          {/* Main Heading */}
          <BlurText
            text="AI for Legal Clarity and Confidence"
            // ...props
            className="text-4xl font-inter font-semibold leading-relaxed md:text-5xl"
          />

          {/* Subheading Container with Placeholder */}
          <div className="h-8">
            {showSecondLine && (
              <BlurText
                text="Your personal AI legal assistant, anytime, anywhere"
                // ...props
                className="text-xl font-lexend font-light leading-snug md:text-2xl"
              />
            )}
          </div>

          {/* Buttons Container with Placeholder */}
          <div className="h-12">
            {showButtons && (
              <FadeContent
                blur={true}
                duration={1500}
                easing="ease-out"
                initialOpacity={0}
              >
                <div className="flex items-center justify-center gap-5">
                  <InteractiveHoverButton onClick={() => navigate(`/import`)}>
                    Get Started
                  </InteractiveHoverButton>
                  {/* <GlowEffectButton /> */}
                  <AiButton onClick={toggleArgusChat} />
                  {/* <ChatBot /> */}
                </div>
              </FadeContent>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
