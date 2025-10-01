import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { LayoutGrid } from "lucide-react";
import { BoardCustomization } from "./BoardCustomization";
import { useSettings } from "@/contexts/SettingsContext";

export const BoardCustomizationButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { animationsEnabled } = useSettings();

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={`
          fixed right-4 top-1/2 translate-y-12 z-40 
          bg-gradient-glass border border-secondary/30 backdrop-blur-sm 
          hover:border-secondary/50 hover:shadow-glow transition-all duration-300
          ${animationsEnabled ? 'hover:scale-110' : ''}
        `}
      >
        <LayoutGrid className="w-4 h-4 mr-2" />
        Boards
      </Button>
      
      <BoardCustomization 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
};
