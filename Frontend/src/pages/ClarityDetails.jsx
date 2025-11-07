"use client";

import React from "react";
import { Card } from "@/components/ui/ExpandableCard";
import { useParams, useNavigate } from "react-router-dom";
import AnimatedContent from "@/components/AnimatedContent";
import { ArrowLeft } from "lucide-react";

export default function ClarityDetails() {
  const navigate = useNavigate();
  const { id, analysisType } = useParams();

  const cardToShow = data.find((card) => card.id === analysisType) || data[0];

  return (
    <div className="w-full h-full py-20">
      {/* Back Button + Title */}
      <div
        className="max-w-3xl mx-auto flex items-center justify-start gap-4 
    pt-12 pb-4 px-4 sm:px-6 md:px-0 transition-all duration-300"
      >
        <button
          onClick={() => navigate(`/clarity/${id}`)}
          className="flex items-center justify-center w-10 h-10 rounded-full 
      bg-white/10 backdrop-blur-md border border-white/20 text-neutral-200 
      hover:bg-white/20 transition duration-300 
      shadow-[0_0_10px_rgba(255,255,255,0.15)] hover:shadow-[0_0_15px_rgba(255,255,255,0.25)]"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h2
          className="text-xl md:text-5xl font-bold text-neutral-200 font-sans capitalize 
    tracking-wide drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]"
        >
          {analysisType}
        </h2>
      </div>

      {/* Card Display */}
      <AnimatedContent
        distance={150}
        direction="vertical"
        reverse={false}
        duration={1.2}
        ease="power3.out"
        initialOpacity={0.2}
        animateOpacity
        scale={1.1}
        threshold={0.2}
        delay={0.3}
      >
        <div className="w-full flex justify-center items-center px-2 sm:px-6 md:px-12">
          <Card key={cardToShow.src} card={cardToShow} layout={true} />
        </div>
      </AnimatedContent>
    </div>
  );
}

// --- Dummy Content ---
const DummyContent = () => {
  const { analysisType } = useParams();
  return (
    <>
      {[...new Array(1).fill(1)].map((_, index) => (
        <div
          key={"dummy-content" + index}
          className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4"
        >
          <p className="text-neutral-600 dark:text-neutral-200 text-base md:text-2xl font-sans max-w-3xl mx-auto">
            <span className="font-bold text-neutral-700 dark:text-neutral-100 capitalize">
              This is the {analysisType} content.
            </span>{" "}
            Keep a journal, quickly jot down a grocery list, and take amazing
            class notes. Want to convert those notes to text? No problem.
            Langotiya jeetu ka mara hua yaar is ready to capture every thought.
            blah blah.
          </p>
          <img
            src="https://assets.aceternity.com/macbook.png"
            alt="Macbook mockup"
            height="500"
            width="500"
            className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
          />
        </div>
      ))}
    </>
  );
};

// --- Data ---
const data = [
  {
    id: "summary",
    category: "Overview",
    title: "Document Summary",
    src: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=3556&auto=format&fit=crop",
    content: <DummyContent />,
  },
  {
    id: "explain-clauses",
    category: "Clarity",
    title: "Explain Clauses",
    src: "https://images.unsplash.com/photo-1531554694128-c4c6665f59c2?q=80&w=3387&auto=format&fit=crop",
    content: <DummyContent />,
  },
  {
    id: "highlight-risks",
    category: "Risk Analysis",
    title: "Highlight Risks",
    src: "https://images.unsplash.com/photo-1713869791518-a770879e60dc?q=80&w=2333&auto=format&fit=crop",
    content: <DummyContent />,
  },
  {
    id: "recommendations",
    category: "Advice",
    title: "Recommendations",
    src: "https://images.unsplash.com/photo-1599202860130-f600f4948364?q=80&w=2515&auto=format&fit=crop",
    recommendations: [
      "Carefully review the purchase agreement to understand all clauses related to maintenance, common charges, and special assessments.",
      "Request full financial disclosures for the building, including the reserve fund balance and any upcoming major capital expenditure plans.",
      "Seek written clarification from the seller or building management regarding the specific definition and scope of 'unforeseen expenses'.",
      "Consult with a qualified real estate attorney to assess the full extent of the buyer's financial obligations and potential liabilities.",
    ],
    content: <DummyContent />,
  },
  {
    id: "find-hidden-terms",
    category: "Deep Dive",
    title: "Find Hidden Terms",
    src: "https://images.unsplash.com/photo-1602081957921-9137a5d6eaee?q=80&w=2793&auto=format&fit=crop",
    content: <DummyContent />,
  },
  {
    id: "ask-a-question",
    category: "Query",
    title: "Ask a Question",
    src: "https://images.unsplash.com/photo-1511984804822-e16ba72f5848?q=80&w=2048&auto=format&fit=crop",
    content: <DummyContent />,
  },
];
