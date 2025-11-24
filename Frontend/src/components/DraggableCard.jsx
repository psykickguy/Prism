import React from "react";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/ui/draggable-card";
import { FloatingChatWidget } from "@/components/FloatingChatWidget";

export function DraggableCardDemo({
  isVisible = false,
  toggleVisibility = () => {},
}) {
  return (
    // fixed full-screen wrapper but no pointer events (won't block landing)
    <DraggableCardContainer className="fixed inset-0 z-[60] pointer-events-none flex items-center justify-center">
      {/* make the inner body able to receive pointer events */}
      <DraggableCardBody className="pointer-events-auto">
        <FloatingChatWidget
          isVisible={isVisible}
          toggleVisibility={toggleVisibility}
        />
      </DraggableCardBody>
    </DraggableCardContainer>
  );
}
