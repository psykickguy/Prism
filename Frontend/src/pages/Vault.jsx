import React from "react";
import { AuroraText } from "@/components/ui/aurora-text";
import { VaultList } from "@/components/VaultList";
import Masonry from "@/components/Masonry";
import { FocusCards } from "@/components/ui/focus-cards";

export default function Import() {
  return (
    <>
      {/* <AuroraText className="text-2xl font-bold">Vault</AuroraText> */}
      <VaultList />
      {/* <Masonry
        items={items}
        ease="power3.out"
        duration={0.6}
        stagger={0.05}
        animateFrom="bottom"
        scaleOnHover={true}
        hoverScale={0.95}
        blurToFocus={true}
        colorShiftOnHover={false}
      /> */}
    </>
  );
}
