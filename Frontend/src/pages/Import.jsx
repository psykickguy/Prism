import React from "react";
import Component from "@/components/comp-549";
import { FileUpload } from "@/components/ui/file-upload.jsx";
import { GlowEffectButton } from "@/components/GlowEffectButton";

export default function Import() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden ">
      {/* <Component /> */}
      <FileUpload />
    </div>
  );
}
