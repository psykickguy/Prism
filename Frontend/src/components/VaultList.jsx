"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
// import { GlowEffectButton } from "@/components/GlowEffectButton"; // --- MODIFIED --- (Added import)
import { useNavigate } from "react-router-dom";
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader.jsx";
import { IconSquareRoundedX } from "@tabler/icons-react";
// import { C } from "@clerk/clerk-react/dist/useAuth-BX_k9NPL";
import { ClarityButton } from "@/components/ClarityButton"; // --- MODIFIED --- (Added import)
import { fetchDocuments } from "@/services/docService";

const loadingStates = [
  {
    text: "Parsing Document structure",
  },
  {
    text: "Identifying key risks",
  },
  {
    text: "Generating actionable advice",
  },
  {
    text: "Finalizing clarity report",
  },
];

export function VaultList() {
  const [active, setActive] = useState(null);

  const id = useId();
  const ref = useRef(null);
  const navigate = useNavigate(); // <-- ADD THIS LINE

  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [docsError, setDocsError] = useState(null);

  // const [loading, setLoading] = useState(false);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  // Fetch documents once on mount
  useEffect(() => {
    let mounted = true;
    setLoadingDocs(true);
    setDocsError(null);

    fetchDocuments()
      .then((res) => {
        if (!mounted) return;
        // Expect res to be an array of Document objects from backend
        setDocuments(Array.isArray(res) ? res : []);
      })
      .catch((err) => {
        console.error("Failed to fetch documents:", err);
        if (!mounted) return;
        setDocsError(err?.message || "Failed to load documents");
        setDocuments([]);
      })
      .finally(() => {
        if (mounted) setLoadingDocs(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useOutsideClick(ref, () => setActive(null));

  // --- MODIFIED: Sequence Handler with Chained Animation ---
  // const handleProcessFiles = (e) => {
  //   if (e && e.stopPropagation) {
  //     e.stopPropagation();
  //   }
  //   const documentId = active.id; // 1. Trigger Modal Close first

  //   setActive(null); // 2. Delay the start of the full-screen loader slightly (e.g., 50ms) // to allow the modal's exit animation to begin/finish.

  //   setTimeout(() => {
  //     setLoading(true); // Start the full-screen loader // 3. Set a second timeout for the processing duration

  //     setTimeout(() => {
  //       setLoading(false); // Stop the loader // 4. Navigate after loader stops
  //       navigate(`/clarity/${documentId}`);
  //     }, loadingStates.length * 2000 + 500);
  //   }, 50); // <-- Delay here to chain the animations
  // }; // --- END MODIFIED ---

  const handleProcessFiles = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const documentId = active?.id;
    setActive(null);
    setTimeout(() => {
      if (documentId) navigate(`/clarity/${documentId}`);
    }, 50);
  };

  // Helper: Build a UI card object from a backend document (keeps original shape)
  const docToCard = (doc) => {
    // doc fields: _id, title, thumbnailUrl, extractedText, fileUrl, createdAt, metadata
    return {
      id: doc._id,
      title: doc.title || doc.fileUrl?.split("/").pop() || "Untitled Document",
      description:
        (doc.extractedText && doc.extractedText.slice(0, 160).trim()) ||
        "No summary available",
      src: doc.thumbnailUrl || "/placeholder.jpg",
      ctaText: "Open",
      content: () => (
        <div className="prose prose-invert max-w-full">
          {doc.extractedText ? (
            <pre className="whitespace-pre-wrap text-sm">
              {doc.extractedText}
            </pre>
          ) : (
            <p>No extracted text available.</p>
          )}
        </div>
      ),
    };
  };

  return (
    <>
      {/* --- ADDED: Full Screen Loader --- */}     {" "}
      {/* {loading && (
        <>
                   {" "}
          <Loader
            loadingStates={loadingStates}
            loading={loading}
            duration={2000}
          />
                   {" "}
          {/* Close button is usually handled inside the Loader component, 
            but adding it here for manual override consistency: 
                   {" "}
          <motion.button
            key="close-loader-btn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-4 right-4 text-black dark:text-white z-[120]"
            onClick={() => setLoading(false)}
          >
                        <IconSquareRoundedX className="h-10 w-10" />         {" "}
          </motion.button>
                 {" "}
        </>
      )} */}
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0  grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-neutral-900/80 backdrop-blur-md border border-neutral-700 sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <img
                  width={200}
                  height={200}
                  src={active.src}
                  alt={active.title}
                  className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-medium text-neutral-200 text-base"
                    >
                      {active.title}
                    </motion.h3>
                    {/* <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-neutral-400 text-base"
                    >
                      {active.description || "No summary available"}
                    </motion.p> */}
                  </div>

                  {/* --- MODIFIED --- (Replaced the green <motion.a> button) */}
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleProcessFiles}
                    className="cursor-pointer"
                  >
                    {/* We wrap the button in a link to keep the click action */}
                    {/* <a
                      href={active.ctaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    > */}
                    {/* <GlowEffectButton>{active.ctaText}</GlowEffectButton> */}
                    <ClarityButton>{active.ctaText}</ClarityButton>
                    {/* </a> */}
                  </motion.div>
                  {/* --- END MODIFICATION --- */}
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-400 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto [mask:linear-gradient(to_bottom,white,white,transparent)] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                  >
                    {typeof active.content === "function"
                      ? active.content()
                      : active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <div className="max-w-5xl mx-auto w-full pt-6">
        {loadingDocs && (
          <div className="mb-4">
            <Loader loadingStates={["Loading documents..."]} loading={true} />
          </div>
        )}
        {docsError && (
          <div className="text-red-400 text-sm mb-4">{docsError}</div>
        )}
      </div>
      <ul className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start gap-4 pt-20 mt-10">
        {/* First show fetched documents (if any) */}
        {documents.length > 0 &&
          documents.map((doc) => {
            const card = docToCard(doc);
            return (
              <motion.div
                layoutId={`card-${card.title}-${id}`}
                key={card.id}
                onClick={() => setActive(card)}
                className="p-4 flex flex-col hover:bg-neutral-800/60 rounded-xl cursor-pointer transition-colors"
              >
                <div className="flex gap-4 flex-col w-full">
                  <motion.div layoutId={`image-${card.title}-${id}`}>
                    <img
                      width={100}
                      height={100}
                      src={card.src}
                      alt={card.title}
                      onError={(e) => {
                        console.warn("Thumbnail failed:", card.src);
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/placeholder.jpg";
                      }}
                      className="h-60 w-full rounded-lg object-cover object-top"
                    />
                  </motion.div>
                  <div className="flex justify-center items-center flex-col">
                    <motion.h3
                      layoutId={`title-${card.title}-${id}`}
                      className="font-medium text-neutral-200 text-center md:text-left text-base"
                    >
                      {card.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${card.description}-${id}`}
                      className="text-neutral-400 text-center md:text-left text-base"
                    >
                      {card.description}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            );
          })}
      </ul>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-neutral-200"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};
