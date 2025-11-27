import { cn } from "@/lib/utils";
import React, { useRef, useState, useCallback } from "react";
import { motion } from "motion/react";
import { IconUpload, IconSquareRoundedX } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import { GlowEffectButton } from "@/components/GlowEffectButton";
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader.jsx";
import { useNavigate } from "react-router-dom";
import { uploadDocumentFile } from "@/services/docService";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

// --- ADDED: Loader Data ---
const loadingStates = [
  {
    text: "Buying a condo",
  },
  {
    text: "Travelling in a flight",
  },
  {
    text: "Meeting Tyler Durden",
  },
  {
    text: "He makes soap",
  },
  {
    text: "We goto a bar",
  },
  {
    text: "Start a fight",
  },
  {
    text: "We like it",
  },
  {
    text: "Welcome to F**** C***",
  },
];

export const FileUpload = ({ onChange }) => {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false); // <--- ADDED STATE
  const [uploadProgress, setUploadProgress] = useState({}); // { index: percent }
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);

  const navigate = useNavigate();

  // NOTE: You need to define 'removeFile' here if you want to use it:
  const removeFile = useCallback((fileToRemove) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
  }, []);

  // --- ADDED: Sequence Handler (Modified from previous steps) ---
  // --- MODIFIED: Sequence Handler with navigation ---
  // new handleProcessFiles: uploads all files sequentially, navigates to first doc
  const handleProcessFiles = async (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (files.length === 0) return;

    setLoading(true);
    setError(null); // add state: const [error, setError] = useState(null);
    const controller = new AbortController(); // optional: cancellation
    controllerRef.current = controller;
    const progressMap = {}; // local progress store

    try {
      let firstDocId = null;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // set initial progress
        setUploadProgress((prev) => ({ ...(prev || {}), [i]: 0 })); // add state: uploadProgress

        const uploaded = await uploadDocumentFile(file, {
          onProgress: (p) => {
            progressMap[i] = p;
            setUploadProgress({ ...progressMap });
          },
          signal: controller.signal,
        });

        // save first returned doc id to navigate
        if (!firstDocId && uploaded && uploaded._id) firstDocId = uploaded._id;

        // optionally show per-file success UI here
      }

      setLoading(false);
      setFiles([]);
      controllerRef.current = null;
      if (firstDocId) navigate(`/clarity/${firstDocId}`);
    } catch (err) {
      console.error("Upload failed:", err);
      setError(err?.message || "Upload failed");
      setLoading(false);
    }
  };

  const handleFileChange = (newFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    onChange && onChange(newFiles);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: true, // Set to true to match screenshot
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: (error) => {
      console.log(error);
    },
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        // --- CHANGED: 1. Removed `overflow-hidden` to allow `position: sticky` to work ---
        className="p-10 group/file block cursor-pointer w-full min-h-screen relative flex flex-col items-center justify-center"
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
          multiple
        />
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>

        {/* This div centers the text and file list */}
        <div className="flex flex-col items-center justify-center">
          <p className="relative z-20 font-sans font-bold text-white dark:text-neutral-300 text-base">
            Upload file
          </p>
          <p className="relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-base mt-2">
            Drag or drop your files here or click to upload
          </p>
          <div className="relative w-full mt-10 max-w-xl mx-auto">
            {files.length > 0 && (
              <>
                {files.map((file, idx) => (
                  <motion.div
                    key={"file" + idx}
                    layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                    className={cn(
                      "relative overflow-hidden z-40 bg-neutral-900/80 backdrop-blur-sm flex flex-col items-start justify-start md:h-24 p-4 mt-4 w-full mx-auto rounded-md",
                      "shadow-sm border border-neutral-700"
                    )}
                  >
                    <div className="flex justify-between w-full items-center gap-4">
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        layout
                        className="text-base text-neutral-300 truncate max-w-xs"
                      >
                        {file.name}
                      </motion.p>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        layout
                        className="rounded-lg px-2 py-1 w-fit shrink-0 text-sm bg-neutral-800 text-neutral-300 shadow-input"
                      >
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </motion.p>
                    </div>

                    <div className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-neutral-600 dark:text-neutral-400">
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        layout
                        className="px-1 py-0.5 rounded-md bg-neutral-800 text-neutral-400"
                      >
                        {file.type}
                      </motion.p>

                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        layout
                        className="text-neutral-400"
                      >
                        modified{" "}
                        {new Date(file.lastModified).toLocaleDateString()}
                      </motion.p>
                    </div>
                    {uploadProgress[idx] !== undefined && (
                      <div className="w-full mt-2">
                        <div className="h-2 bg-neutral-800 rounded overflow-hidden">
                          <div
                            style={{ width: `${uploadProgress[idx] ?? 0}%` }}
                            className="h-full bg-indigo-600 transition-all"
                          />
                        </div>
                        <div className="text-xs text-neutral-400 mt-1">
                          {uploadProgress[idx] ?? 0}% uploaded
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
                {error && (
                  <div className="text-sm text-red-400 mt-4">{error}</div>
                )}
                <Loader // <--- LOADER RENDERED HERE
                  loadingStates={loadingStates}
                  loading={loading}
                  duration={2000}
                />
                <div className="flex justify-center mt-6 sticky bottom-6 z-50">
                  <GlowEffectButton
                    onClick={handleProcessFiles}
                    disabled={loading}
                  />
                </div>
                {loading && (
                  <button
                    className="fixed top-4 right-4 text-black dark:text-white z-[120]"
                    onClick={() => {
                      controllerRef.current?.abort?.();
                      setLoading(false);
                      setError("Upload cancelled");
                    }}
                  >
                    <IconSquareRoundedX className="h-10 w-10" />
                  </button>
                )}
              </>
            )}

            {!files.length && (
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className={cn(
                  "relative group-hover/file:shadow-2xl z-40 bg-neutral-950/80 dark:bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-xl",
                  "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                )}
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-neutral-600 flex flex-col items-center"
                  >
                    Drop it
                    <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                  </motion.p>
                ) : (
                  <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                )}
              </motion.div>
            )}

            {!files.length && (
              <motion.div
                variants={secondaryVariant}
                className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md"
              ></motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ... (GridPattern function remains the same) ...
export function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className="flex bg-transparent shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? "bg-transparent"
                  : "bg-gray-500/5 dark:bg-white/5"
              }`}
            />
          );
        })
      )}
    </div>
  );
}
